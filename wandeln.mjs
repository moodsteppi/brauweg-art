#!/usr/bin/env node
/**
 * Bilder für Brauweg von PNG nach WebP wandeln.
 *
 *   node ~/bildwerkzeug/wandeln.mjs <quellordner> <zielordner> [art]
 *
 * `art` bestimmt die Einstellungen und ist eines von:
 *   karten     Spielkarten          Qualität 82
 *   szene      Tischszenerien       Qualität 82
 *   wappen     Wappen, Emotes       Qualität 90, volles Alpha
 *   (weglassen) wie `karten`
 *
 * **Die Auflösung bleibt, nur das Format ändert sich.** Auf einem
 * Retina-Handy ist eine Handkarte schnell 150 Pixel breit; eine zu klein
 * gerechnete Karte sieht dort matschig aus. Das Format allein bringt den
 * Faktor 20 — verkleinern muss man dafür nichts.
 *
 * Das Original wird **nicht** angefasst. Es bleibt liegen, wo es liegt; ins
 * Archivrepo gehört es per Hand, damit niemand versehentlich etwas
 * verschiebt, das noch gebraucht wird.
 */

import { readdirSync, statSync, mkdirSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require(join(process.env.HOME, 'bildwerkzeug/node_modules/sharp'));

/** Einstellungen je Sorte. Die Zahlen stammen aus gemessenen Läufen. */
const ARTEN = {
  // Karten gibt es 250 Stueck — dort zaehlt jedes Kilobyte, und 82 war in
  // der Messung nicht von 85 zu unterscheiden.
  karten: { quality: 82 },
  // Szenerien: 85, so steht es in docs/DESIGN.md. Sie sind ganzseitig und
  // liegen hinter den Karten — Bandenbildung faellt dort eher auf.
  szene: { quality: 85 },
  // Freigestelltes braucht volles Alpha, sonst bekommt der Rand einen Saum.
  wappen: { quality: 90, alphaQuality: 100 },
};

const [quelle, ziel, art = 'karten'] = process.argv.slice(2);

if (!quelle || !ziel) {
  console.error('Aufruf: node ~/bildwerkzeug/wandeln.mjs <quelle> <ziel> [karten|szene|wappen]');
  process.exit(1);
}
if (!existsSync(quelle)) {
  console.error(`Quellordner gibt es nicht: ${quelle}`);
  process.exit(1);
}
const einstellung = ARTEN[art];
if (!einstellung) {
  console.error(`Unbekannte Art "${art}". Möglich: ${Object.keys(ARTEN).join(', ')}`);
  process.exit(1);
}

mkdirSync(ziel, { recursive: true });

const dateien = readdirSync(quelle).filter((n) => n.toLowerCase().endsWith('.png'));
if (dateien.length === 0) {
  console.error(`Keine PNG-Dateien in ${quelle}`);
  process.exit(1);
}

let vorher = 0;
let nachher = 0;
let warnungen = 0;

for (const datei of dateien) {
  const von = join(quelle, datei);
  const nach = join(ziel, datei.replace(/\.png$/i, '.webp'));

  vorher += statSync(von).size;
  const info = await sharp(von).webp(einstellung).toFile(nach);
  nachher += info.size;

  // Die Probe, die hier schon dreimal gefehlt hat: Hat das Original einen
  // Alphakanal, muss ihn das Ergebnis auch haben.
  const quellInfo = await sharp(von).metadata();
  if (quellInfo.hasAlpha) {
    const zielInfo = await sharp(nach).metadata();
    if (!zielInfo.hasAlpha) {
      console.warn(`  ! ${datei}: Alphakanal ist verloren gegangen`);
      warnungen++;
    }
  }
}

const mb = (n) => (n / 1048576).toFixed(1);
console.log(`${dateien.length} Bilder gewandelt (${art})`);
console.log(`  vorher  ${mb(vorher)} MB`);
console.log(`  nachher ${mb(nachher)} MB   (${Math.round((1 - nachher / vorher) * 100)} % kleiner)`);
console.log(`  je Datei im Schnitt ${Math.round(nachher / dateien.length / 1024)} kB`);

if (warnungen > 0) {
  console.error(`\n${warnungen} Bilder haben ihren Alphakanal verloren — bitte nachsehen.`);
  process.exit(1);
}

// Ein stiller Riegel gegen den Fehler, der zweimal live ging.
const schnitt = nachher / dateien.length;
if (art === 'karten' && schnitt > 300 * 1024) {
  console.error(
    `\nWarnung: ${Math.round(schnitt / 1024)} kB je Karte ist viel. ` +
      'Erwartet werden rund 80 kB. Stimmt die Auflösung des Originals?',
  );
}
