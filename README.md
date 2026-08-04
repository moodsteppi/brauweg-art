# brauweg-art — Bildquellen in voller Auflösung

Hier liegen die **Originale** aller gemalten Bilder von Brauweg. Die App
liefert nichts davon aus; sie holt sich ausschließlich, was im Hauptrepo
unter `packages/client/public/` liegt — und das ist immer eine in WebP
gewandelte Fassung.

**Warum ein eigenes Repository:** Die Originale sind zusammen über 800 MB.
Lagen sie im Hauptrepo, lud Railway sie bei **jedem Deploy** mit herunter,
obwohl weder ein Build noch ein Nutzer sie je anfasst. Ein Archiv gehört
nicht in den Weg der Auslieferung.

---

## Die Regel

1. **Original hierher.** Volle Auflösung, so wie geliefert. Nichts vorher
   herunterrechnen — was einmal weich ist, wird nicht wieder scharf.
2. **Auslieferungsfassung ins Hauptrepo**, unter
   `packages/client/public/`, als **WebP**.
3. **Nie umgekehrt.** Ein Original unter `public/` ist ein Fehler, auch wenn
   es funktioniert: Es geht dann an jedes Handy.

Das ist zweimal schiefgegangen. Beim ersten Mal lagen die Szenerien in voller
Auflösung unter `public/` (13,9 statt 1,2 MB), beim zweiten Mal die
Spielkarten — 1,7 MB **je Karte**, 408 MB zusammen, die jedes Handy beim
Blattwechsel gezogen hätte.

---

## Was hier liegt

| Ordner | Inhalt |
| --- | --- |
| `karten/` | Kartenblätter, je 24 Vorderseiten und eine Rückseite (744 × 1080) |
| `szenerien/` | Tischszenerien in voller Auflösung (1024 × 1536) |
| `wappen/` | Clanwappen (512 × 512, mit Alpha) |
| `zauberwald/` | Das Zauberer-Blatt |
| `ablauf-entwuerfe/` | Entwürfe zum Rundenabschluss |
| `_blattbau/` | Werkstattordner der Kartenerzeugung |
| Einzeldateien | App-Symbol, Biome des Trophäenpfads, Hintergründe |

`appicon.png` (1024 × 1024) ist die Vorlage für die App-Symbole. Daraus
entstehen `public/icon-180.png`, `icon-192`, `icon-512` und `icon-1024`;
wird das Symbol geändert, hier ändern und die vier Größen neu erzeugen.

---

## Umwandeln

Auf dem Mac ist **kein WebP-Werkzeug installiert** — weder `cwebp` noch
`magick`; `sips` liest WebP, kann es aber nicht schreiben. Der Weg, der
funktioniert, ist `sharp` in einem Verzeichnis **außerhalb** beider
Repositories:

```bash
mkdir -p ~/bildwerkzeug && cd ~/bildwerkzeug && npm init -y && npm i sharp
```

**Das Skript liegt hier bei: `wandeln.mjs`.** Auf einem eingerichteten
Rechner steht es unter `~/bildwerkzeug/wandeln.mjs`; geht es dort verloren,
ist diese Datei die Vorlage.

```bash
node ~/bildwerkzeug/wandeln.mjs <quelle> <ziel> [karten|szene|wappen]
```

Es prueft von selbst, ob ein Alphakanal verlorengegangen ist, und warnt, wenn
die Ergebnisse verdaechtig gross geblieben sind — beides Fehler, die hier
schon passiert sind.

Von Hand ginge es auch, hier am Beispiel eines Kartenblatts:

```bash
node -e '
const sharp = require(process.env.HOME + "/bildwerkzeug/node_modules/sharp");
const fs = require("fs");
const [quelle, ziel] = process.argv.slice(1);
fs.mkdirSync(ziel, { recursive: true });
for (const f of fs.readdirSync(quelle).filter((n) => n.endsWith(".png"))) {
  sharp(quelle + "/" + f)
    .webp({ quality: 82 })
    .toFile(ziel + "/" + f.replace(/\.png$/, ".webp"));
}
' karten/eiche ../Brauweg-spielen/brauweg/packages/client/public/karten/eiche
```

**Richtwerte, die sich bewährt haben:**

| Sorte | Auflösung | Qualität | Ergebnis je Datei |
| --- | --- | --- | --- |
| Spielkarten | 744 × 1080 behalten | 82 | ~78 KB statt 1,7 MB |
| Szenerien | 1024 × 1536 behalten | 82 | ~120 KB |
| Wappen (mit Alpha) | 512 × 512 behalten | 90, `alphaQuality: 100` | ~90 KB |

**Die Auflösung bleibt, nur das Format ändert sich.** Auf einem Retina-Handy
ist eine Handkarte schnell 150 Pixel breit; eine zu klein gerechnete Karte
sieht dort matschig aus. Das Format allein bringt den Faktor 20.

**Nach dem Umwandeln prüfen:** Alles mit Transparenz auf knallroten Grund
legen. Sichtbar wird nur, was sichtbar sein soll — ohne hellen Saum. Auch
das ist hier schon dreimal schiefgegangen.
