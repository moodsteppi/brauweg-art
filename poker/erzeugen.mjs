#!/usr/bin/env node
/**
 * Pokertisch-Bilder erzeugen (Bestellung: docs/ASSETS-POKER-TISCH.md im
 * Code-Repo). Gemalt wird als SVG und ueber sharp gerastert — kein
 * Zeichenprogramm noetig, und jede Platte ist exakt reproduzierbar.
 *
 *   node erzeugen.mjs
 *
 * schreibt die PNGs neben dieses Skript:
 *   mit Alpha:  knopf-fold, knopf-check, knopf-call, knopf-bet, jeton
 *   ohne Alpha: kartenruecken, filz
 *
 * Danach wie immer: node ~/bildwerkzeug/wandeln.mjs <hier>/alpha <ziel> wappen
 * und ...<hier>/deckend <ziel> szene.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require(join(process.env.HOME, 'bildwerkzeug/node_modules/sharp'));

const HIER = dirname(fileURLToPath(import.meta.url));
const ALPHA = join(HIER, 'alpha');
const DECKEND = join(HIER, 'deckend');
mkdirSync(ALPHA, { recursive: true });
mkdirSync(DECKEND, { recursive: true });

/** Feines Rauschen als wiederverwendbarer Filter — Filz und Emaille leben davon. */
const RAUSCHEN = (id, freq, alpha) => `
  <filter id="${id}" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="3" seed="7"/>
    <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.6 0.6 0.6 0 -0.75"/>
    <feComponentTransfer><feFuncA type="linear" slope="${alpha}"/></feComponentTransfer>
  </filter>`;

// ---------------------------------------------------------------------------
// Aktionsplatten 512x160 — alle vier mit identischem Rahmen (ASSETS-KNOEPFE:
// gleicher Bildaufbau, sonst wird die Knopfreihe eine Treppe).
// ---------------------------------------------------------------------------

/** Fuellfarben je Platte: [hell oben, Grundton, dunkel unten]. */
const PLATTEN = {
  fold: ['#b25548', '#8f3c31', '#6e2b23'],
  check: ['#f4faf5', '#dfe9e2', '#c3d2c9'],
  call: ['#5a8cc2', '#3e6fa8', '#2d5484'],
  bet: ['#57a578', '#3d8a60', '#2c6a48'],
};

function plattenSvg(name) {
  const [hell, grund, dunkel] = PLATTEN[name];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="160">
  <defs>
    <linearGradient id="holz" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#553a1c"/>
      <stop offset="0.5" stop-color="#3a2712"/>
      <stop offset="1" stop-color="#241505"/>
    </linearGradient>
    <linearGradient id="fuellung" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${hell}"/>
      <stop offset="0.45" stop-color="${grund}"/>
      <stop offset="1" stop-color="${dunkel}"/>
    </linearGradient>
    <linearGradient id="glanz" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.28"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="bodenschatten" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.5"/>
    </linearGradient>
    ${RAUSCHEN('korn', '0.55', '0.05')}
  </defs>
  <!-- Schlagschatten: unten, hoechstens 10 px (Bestellung). -->
  <rect x="14" y="146" width="484" height="10" rx="5" fill="#000000" opacity="0.35"/>
  <!-- Holzrahmen: 6 px Luft je Seite, Rahmen 10 px dick, Ecken bleiben unter 30 px. -->
  <rect x="6" y="4" width="500" height="144" rx="26" fill="url(#holz)"/>
  <rect x="6.5" y="4.5" width="499" height="143" rx="26" fill="none" stroke="#16100a" stroke-width="1.5"/>
  <rect x="8" y="6" width="496" height="140" rx="24" fill="none" stroke="#7a5526" stroke-width="1" opacity="0.55"/>
  <!-- Emaille-Fuellung. -->
  <rect x="16" y="14" width="480" height="122" rx="18" fill="url(#fuellung)"/>
  <rect x="16" y="14" width="480" height="122" rx="18" fill="none" stroke="#16100a" stroke-width="1" opacity="0.4"/>
  <rect x="16" y="14" width="480" height="122" rx="18" filter="url(#korn)"/>
  <!-- Glanz oben, dunkle Kante unten. -->
  <rect x="20" y="17" width="472" height="52" rx="15" fill="url(#glanz)"/>
  <rect x="16" y="96" width="480" height="40" rx="18" fill="url(#bodenschatten)" opacity="0.5"/>
  <!-- Vier Goldnieten in den Rahmenecken. -->
  ${[
    [26, 24],
    [486, 24],
    [26, 128],
    [486, 128],
  ]
    .map(
      ([x, y]) =>
        `<circle cx="${x}" cy="${y}" r="4" fill="#e2b64f"/><circle cx="${x - 1}" cy="${y - 1}" r="1.6" fill="#ffe8a8"/>`,
    )
    .join('\n  ')}
</svg>`;
}

// ---------------------------------------------------------------------------
// Kartenruecken 320x465 — grobe Formen, muss bei 22 px Breite noch lesbar sein.
// ---------------------------------------------------------------------------

function rueckenSvg() {
  // Rautengitter von Hand statt <pattern>: librsvg kachelt Patterns mit
  // sichtbaren Fugen, gezeichnete Linien nicht.
  const linien = [];
  for (let i = -6; i <= 12; i++) {
    linien.push(`<line x1="${i * 52}" y1="0" x2="${i * 52 + 240}" y2="465" stroke="#2a8a63" stroke-width="3"/>`);
    linien.push(`<line x1="${i * 52}" y1="465" x2="${i * 52 + 240}" y2="0" stroke="#2a8a63" stroke-width="3"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="465">
  <defs>
    <radialGradient id="grund" cx="0.5" cy="0.42" r="0.9">
      <stop offset="0" stop-color="#257a56"/>
      <stop offset="0.65" stop-color="#1f6b4d"/>
      <stop offset="1" stop-color="#154a34"/>
    </radialGradient>
    <linearGradient id="goldlinie" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffe8a8"/>
      <stop offset="0.5" stop-color="#e2b64f"/>
      <stop offset="1" stop-color="#a97d24"/>
    </linearGradient>
    ${RAUSCHEN('leinen', '0.7', '0.04')}
    <clipPath id="innen"><rect x="26" y="26" width="268" height="413"/></clipPath>
  </defs>
  <rect width="320" height="465" fill="url(#grund)"/>
  <g clip-path="url(#innen)" opacity="0.5">${linien.join('\n  ')}</g>
  <rect width="320" height="465" filter="url(#leinen)"/>
  <!-- Doppelte Goldlinie als Rahmen. -->
  <rect x="12" y="12" width="296" height="441" rx="14" fill="none" stroke="url(#goldlinie)" stroke-width="4"/>
  <rect x="24" y="24" width="272" height="417" rx="8" fill="none" stroke="url(#goldlinie)" stroke-width="2" opacity="0.8"/>
  <!-- Rautenmedaillon in der Mitte. -->
  <g transform="translate(160,232.5)">
    <path d="M0,-92 L64,0 L0,92 L-64,0 Z" fill="#154a34" stroke="url(#goldlinie)" stroke-width="4"/>
    <path d="M0,-58 L40,0 L0,58 L-40,0 Z" fill="#1f6b4d" stroke="url(#goldlinie)" stroke-width="3"/>
    <path d="M0,-26 L18,0 L0,26 L-18,0 Z" fill="url(#goldlinie)"/>
  </g>
</svg>`;
}

// ---------------------------------------------------------------------------
// Jeton 256x256 — rund freigestellt, Ecken alpha 0.
// ---------------------------------------------------------------------------

function jetonSvg() {
  const marken = [];
  for (let i = 0; i < 8; i++) {
    marken.push(
      `<rect x="-13" y="-122" width="26" height="30" rx="9" fill="#fff6d0" opacity="0.92" transform="rotate(${i * 45})"/>`,
    );
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
  <defs>
    <radialGradient id="teller" cx="0.38" cy="0.32" r="0.85">
      <stop offset="0" stop-color="#ffe8a8"/>
      <stop offset="0.55" stop-color="#d8a63c"/>
      <stop offset="1" stop-color="#a97d24"/>
    </radialGradient>
    <radialGradient id="mitte" cx="0.4" cy="0.35" r="0.8">
      <stop offset="0" stop-color="#f4cf74"/>
      <stop offset="1" stop-color="#c29030"/>
    </radialGradient>
  </defs>
  <g transform="translate(128,128)">
    <circle r="122" fill="url(#teller)"/>
    <circle r="122" fill="none" stroke="#8a6218" stroke-width="4"/>
    ${marken.join('\n    ')}
    <circle r="86" fill="url(#mitte)" stroke="#8a6218" stroke-width="3"/>
    <circle r="70" fill="none" stroke="#fff6d0" stroke-width="3" opacity="0.7"/>
    <ellipse cx="-38" cy="-46" rx="46" ry="26" fill="#ffffff" opacity="0.28" transform="rotate(-32)"/>
  </g>
</svg>`;
}

// ---------------------------------------------------------------------------
// Filz 768x1152 — ein Bild, kein Kachelmuster: cover unter dem Oval, keine Naht.
// ---------------------------------------------------------------------------

function filzSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="768" height="1152">
  <defs>
    <radialGradient id="kegel" cx="0.5" cy="0.24" r="0.75">
      <stop offset="0" stop-color="#1a4a36"/>
      <stop offset="0.6" stop-color="#14392a"/>
      <stop offset="1" stop-color="#0f2c20"/>
    </radialGradient>
    <radialGradient id="vignette" cx="0.5" cy="0.55" r="0.85">
      <stop offset="0.55" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.4"/>
    </radialGradient>
    ${RAUSCHEN('filzkorn', '0.8', '0.06')}
  </defs>
  <rect width="768" height="1152" fill="url(#kegel)"/>
  <rect width="768" height="1152" filter="url(#filzkorn)"/>
  <rect width="768" height="1152" fill="url(#vignette)"/>
</svg>`;
}

// ---------------------------------------------------------------------------

const AUFTRAEGE = [
  ...Object.keys(PLATTEN).map((name) => ({
    datei: join(ALPHA, `knopf-${name}.png`),
    svg: plattenSvg(name),
  })),
  { datei: join(ALPHA, 'jeton.png'), svg: jetonSvg() },
  { datei: join(DECKEND, 'kartenruecken.png'), svg: rueckenSvg(), deckend: true },
  { datei: join(DECKEND, 'filz.png'), svg: filzSvg(), deckend: true },
];

for (const auftrag of AUFTRAEGE) {
  let bild = sharp(Buffer.from(auftrag.svg));
  if (auftrag.deckend) bild = bild.flatten({ background: '#14392a' });
  const png = await bild.png().toBuffer();
  writeFileSync(auftrag.datei, png);
  console.log(`${auftrag.datei}  ${(png.length / 1024).toFixed(0)} kB`);
}
console.log('fertig.');
