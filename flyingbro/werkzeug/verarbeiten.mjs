// Rohbilder (1254er PNG von Codex) auf Spielgroesse bringen: leeren Rand abschneiden, einpassen.
// Das WebP macht danach ~/bildwerkzeug/wandeln.mjs mit den Normprofilen (wappen fuer Alpha, szene fuer den Hintergrund).
import { createRequire } from 'node:module';
import { mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const require = createRequire(import.meta.url);
const HOME = process.env.USERPROFILE;
const sharp = require(join(HOME, 'bildwerkzeug/node_modules/sharp'));
const ROH = join(HOME, 'flyingbro-erzeugung/roh');
const ALPHA = join(HOME, 'flyingbro-erzeugung/fertig/alpha');
const SZENE = join(HOME, 'flyingbro-erzeugung/fertig/szene');
mkdirSync(ALPHA, { recursive: true });
mkdirSync(SZENE, { recursive: true });

// Rand: 4 % der laengeren Seite, damit Glanzlicht/Schweif nicht an der Kante klebt.
async function zuschneiden(datei) {
  const { data, info } = await sharp(datei).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let x0 = info.width, y0 = info.height, x1 = -1, y1 = -1;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}

for (const n of readdirSync(ROH).filter((d) => d.endsWith('.png'))) {
  const name = n.replace('.png', '');
  const quelle = join(ROH, n);
  if (name === 'hintergrund') {
    await sharp(quelle).removeAlpha().resize({ width: 1536, withoutEnlargement: true }).png().toFile(join(SZENE, n));
    continue;
  }
  const box = await zuschneiden(quelle);
  let bild = sharp(quelle).ensureAlpha().extract(box);
  const leer = { r: 0, g: 0, b: 0, alpha: 0 };
  if (name.includes('-quadrat-')) {
    // Bauteile fuellen ihre Physikform randlos — deshalb exakt quadratisch, ohne Rand.
    bild = bild.resize(256, 256, { fit: 'fill' });
  } else if (name.includes('-balken-')) {
    bild = bild.resize(512, 128, { fit: 'fill' });
  } else {
    const max = name === 'schleuder' ? 512 : 384;
    const rand = Math.round(Math.max(box.width, box.height) * 0.04);
    bild = sharp(await bild.extend({ top: rand, bottom: rand, left: rand, right: rand, background: leer }).png().toBuffer())
      .resize(max, max, { fit: 'inside' });
  }
  await bild.png().toFile(join(ALPHA, n));
  console.log(name, box.width + 'x' + box.height);
}
