// Ruft je Auftrag einmal `codex exec` mit der Bildvorlage auf und holt das Ergebnis aus ~/.codex/generated_images.
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, copyFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import auftraege, { STIL, STIL_SZENE } from './auftraege.mjs';

const HOME = process.env.USERPROFILE;
const ROH = join(HOME, 'flyingbro-erzeugung/roh');
const PING = join(HOME, 'flyingbro-erzeugung/probe/ref-pinguin.png');
const nur = process.argv.slice(2);

export function promptFuer(a) {
  return `Use your image generation tool to create exactly ONE image. Do not run shell commands and do not read files, just generate. The FIRST attached image is the style reference${a.ref ? '; the SECOND attached image is the character/object to stay consistent with' : ''}.\n\n${a.bild}\n\n${a.art === 'szene' ? STIL_SZENE : STIL}`;
}

if (process.argv[1]?.endsWith('erzeugen.mjs')) {
  for (const a of auftraege) {
    if (nur.length && !nur.includes(a.name)) continue;
    const ziel = join(ROH, a.name + '.png');
    if (existsSync(ziel)) { console.log('da', a.name); continue; }
    const bilder = [PING];
    if (a.ref) bilder.push(a.ref === 'logo' ? join(HOME, 'flyingbro-erzeugung/probe/ref-logo.png') : join(ROH, a.ref + '.png'));
    const args = ['exec', '--skip-git-repo-check', '--sandbox', 'read-only'];
    for (const b of bilder) args.push('--image', `"${b}"`);
    args.push('-');
    const t0 = Date.now();
    const r = spawnSync('codex', args, { input: promptFuer(a), encoding: 'utf8', shell: true, timeout: 900000, maxBuffer: 50e6 });
    const out = (r.stdout || '') + (r.stderr || '');
    writeFileSync(join(ROH, a.name + '.log'), out);
    const sid = out.match(/session id: ([0-9a-f-]+)/)?.[1];
    const dir = sid && join(HOME, '.codex/generated_images', sid);
    if (!dir || !existsSync(dir)) { console.log('FEHLER', a.name, out.slice(-800)); continue; }
    const f = readdirSync(dir).filter((n) => n.endsWith('.png')).map((n) => join(dir, n))
      .sort((x, y) => statSync(y).mtimeMs - statSync(x).mtimeMs)[0];
    if (!f) { console.log('FEHLER kein Bild', a.name, out.slice(-800)); continue; }
    copyFileSync(f, ziel);
    console.log('ok', a.name, Math.round((Date.now() - t0) / 1000) + 's', sid);
  }
}
