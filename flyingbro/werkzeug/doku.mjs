// Setzt docs/ASSETS-FLYINGBRO.md aus Kopf, Tabelle, Mittelteil und den Prompts aus auftraege.mjs zusammen.
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import auftraege, { STIL, STIL_SZENE } from './auftraege.mjs';
const E = join(process.env.USERPROFILE, 'flyingbro-erzeugung');
const repo = process.argv[2];
const kopf = join(repo, 'docs/ASSETS-FLYINGBRO-KOPF.md');
let o = readFileSync(kopf, 'utf8') + readFileSync(join(E, 'tabelle.md'), 'utf8') + readFileSync(join(E, 'doku-mitte.md'), 'utf8');
o += STIL + '\n```\n\n**Stilblock für den Hintergrund** (ohne Alpha):\n\n```text\n' + STIL_SZENE + '\n```\n\n### Bildzeile je Datei\n\n';
for (const a of auftraege) {
  o += '#### `' + a.name + '`' + (a.ref ? ' — zweite Vorlage: `' + a.ref + '`' : '') + '\n\n```text\n' + a.bild + '\n```\n\n';
}
writeFileSync(join(repo, 'docs/ASSETS-FLYINGBRO.md'), o.replace(/\r\n/g, '\n').trimEnd() + '\n');
rmSync(kopf);
