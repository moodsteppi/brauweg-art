// Kontaktbogen: alle Bilder eines Ordners als Raster auf knallrotem Grund (zeigt Saum/Schachbrett sofort).
import { createRequire } from 'node:module';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
const require = createRequire(import.meta.url);
const sharp = require(join(process.env.USERPROFILE, 'bildwerkzeug/node_modules/sharp'));
const [ordner, ziel, filter = '', zelle = '200'] = process.argv.slice(2);
const Z = Number(zelle);
const dateien = readdirSync(ordner).filter((n) => /\.(png|webp)$/.test(n) && n.includes(filter)).sort();
const spalten = Math.min(6, dateien.length);
const zeilen = Math.ceil(dateien.length / spalten);
const teile = [];
for (const [i, n] of dateien.entries()) {
  const b = await sharp(join(ordner, n)).resize(Z - 10, Z - 10, { fit: 'inside' }).png().toBuffer();
  const m = await sharp(b).metadata();
  teile.push({ input: b, left: (i % spalten) * Z + Math.round((Z - m.width) / 2), top: Math.floor(i / spalten) * Z + Math.round((Z - m.height) / 2) });
}
await sharp({ create: { width: spalten * Z, height: zeilen * Z, channels: 4, background: { r: 220, g: 0, b: 0, alpha: 1 } } })
  .composite(teile).png().toFile(ziel);
console.log(dateien.join(' | '));
