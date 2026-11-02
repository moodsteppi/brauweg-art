# Bro & die Stichbande: Serienvorlage für TikTok

**Logline:** Bei jedem Spielabend im Iglu geht etwas schief. Onkel Karo mischt
ein Portal, Bro springt hindurch, und in einer absurden Dimension lässt sich das
Problem nur mit **einem Kartenspiel nach Hausregel** lösen. Zurück im Iglu hat
Fiete längst gewonnen.

**Warum das für Brauweg funktioniert:** Jede Folge endet mit einer Regel, die
es in der App wirklich gibt (z. B. „Zweite Dulle sticht Erste“, siehe
`brauweg/docs/doppelkopf-spec.md`). Die Pointe *ist* das Produktversprechen:
**Spiel nach euren Regeln.**

Figuren: [FIGUREN.md](FIGUREN.md) · Pilot: [folge-01/DREHBUCH.md](folge-01/DREHBUCH.md)

---

## Format

| | |
| --- | --- |
| Länge | 40–55 s |
| Bild | 9:16, 1080 × 1920. Oben 150 px, unten 380 px und rechts 140 px frei lassen, dort liegt die TikTok-Oberfläche |
| Ton | Leise Musik, laute Geräusche. Immer Untertitel, viele schauen ohne Ton |
| Rhythmus | Eine KI-Einstellung = 4–8 s, **eine Handlung pro Einstellung** |
| Optik | Design exakt wie im Ladebild (Nachtblau & Gold), umgesetzt wie ein hochwertiger Animationsfilm: echtes Metall, echte Federn, ernster Bro. Bro ändert sich nie |

## Ablauf jeder Folge

| Zeit | Takt | Inhalt |
| --- | --- | --- |
| 0–5 s | **Haken** | Spielabend, ein Satz, der eine Frage aufwirft. Titel „Folge N“ eingeblendet |
| 5–12 s | **Störung** | Etwas Absurdes passiert |
| 12–20 s | **Portal** | Onkel Karo: „Abheben, Kleiner.“ Bro springt: „Re! Und ab dafür!“ |
| 20–26 s | **Neue Welt** | Eine der sechs Welten, verdreht. Karo erklärt sie in **einem** Satz |
| 26–36 s | **Kartenduell** | Ein Stich. Echte Karte groß im Bild |
| 36–42 s | **Wende** | Bro rettet's mit einer **Hausregel** aus der App |
| 42–50 s | **Heimkehr** | Bruno hat Schnittchen verbrannt, Fiete hat gewonnen: „Jo.“ |
| 50–54 s | **Endkarte** | Logo, nächste Folge, „Spiel nach euren Regeln · brauweg-spielen.de“ |

**Schleife:** Die letzte Einstellung vor der Endkarte zeigt denselben Tisch wie
die erste. Wer nochmal schaut, merkt den Schnitt nicht.

## Arbeitsablauf mit versien.ai und Seedance

1. **Einmalig:** Modellblatt für Herzog Schummel mit dem Bildmodell erzeugen
   (Prompt in FIGUREN.md) und unter `referenzen/` ablegen.
2. **Je Einstellung erst ein Standbild** (Startbild) mit dem Bildmodell
   erzeugen. Dazu die Referenzen der Figuren im Bild hochladen und den
   Bildprompt aus dem Drehbuch nehmen. **Bro mit dem Original vergleichen**
   (Helm, Federbusch, Pik-Wappen, Augen). Weicht etwas ab, neu erzeugen. Das
   Standbild ist die günstigste Stelle zum Korrigieren.
3. **Standbild → Video mit Seedance** (Bild-zu-Video, 9:16), dazu den
   Bewegungsprompt aus dem Drehbuch. Wieder `bro-modellblatt.png` als
   Referenz mitgeben, wenn die Oberfläche das erlaubt.
4. **Ton:** Wenn Seedance den deutschen Dialog lippensynchron hinbekommt, gut.
   Sonst die Einstellung ohne Sprache erzeugen und die Stimmen nachträglich
   vertonen (z. B. CapCut oder ElevenLabs). Geräusche und Musik ohne Lizenzsorgen
   liegen unter `klang/` (alles CC0).
5. **Schnitt in CapCut:** Einstellungen aneinander, Untertitel, Titel „Folge N“,
   Endkarte. Die **Endkarte nie per KI** erzeugen, weil KI Schrift verunstaltet.
   Sie entsteht aus `hub-nachtblau/logo.png` und echtem Text.
6. Fertige Folge als `folge-NN/folge-NN.mp4` hier ablegen, die Rohclips unter
   `folge-NN/clips/`.

**Regeln für Prompts, die sich bewährt haben:**

- Den Figuren-Anker immer **wortgleich** übernehmen, nie umformulieren.
- Kamera ausdrücklich benennen (*slow push-in*, *whip pan*, *low angle*).
- Pro Einstellung höchstens zwei sprechende Figuren.
- Immer anhängen: `no text, no subtitles, no logos, no watermark`, denn Text
  kommt erst im Schnitt dazu.
- Gegenprompt: `human, extra limbs, different helmet, missing plume, goofy grin, plastic toy look, green
  portal, alcohol, beer, blurry face, deformed eyes`

## Begleittext-Vorlage

```
Folge {N}: {TITEL} 🐧🃏 {EINE ZEILE NEUGIER}
Welche Hausregel spielt ihr? 👇
#doppelkopf #kartenspiel #spieleabend #pinguin #animation #brauweg
```

Die Frage nach der Hausregel lockt Kommentare. Gute Antworten werden zur
nächsten Folge.

---

## Staffel 1: Folgenideen

| # | Titel | Welt | Spiel | Pointe |
| --- | --- | --- | --- | --- |
| 1 | **Die geklaute Kreuz-Dame** | Feuerberg | Doppelkopf | Zweite Dulle sticht Erste |
| 2 | Die Hausregel-Dimension | Wiesen | Doppelkopf | Hilde landet in einer Welt, in der *ihre* Regeln Gesetz sind, und hält es nicht aus |
| 3 | Die Sandbank | Strand | Poker | Krabben setzen nur Muscheln. Bro gewinnt mit einem Bluff, weil ihm der Helm über die Augen rutscht |
| 4 | Bro gegen Bro | Schneefeld | Skat | Ein Bro aus einer anderen Dimension gewinnt alles, weil er offen spielt (Ouvert) |
| 5 | Onkel Karos Vergangenheit | Sternenhafen | Wizard | Ein Raumpirat schuldet Karo seit 30 Jahren einen Stich |
| 6 | Das Iglu ist voll Karten | Heimat | Doppelkopf | Das Portal klemmt, im Iglu regnet es Karten |
| 7 | Fietes Folge | Alle | Cambio | Keine Worte, nur „Jo.“ |
| 8 | Herzog Schummels Rache | Sternenhafen | Clan-Krieg | Die ganze Bande gegen die Möwen. Staffelfinale, Hinweis auf Clans in der App |
