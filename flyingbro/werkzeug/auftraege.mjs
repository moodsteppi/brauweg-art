// Prompts fuer die Flying-Bro-Bilder. Jede Zeile hier steht wortgleich in docs/ASSETS-FLYINGBRO.md.
export const STIL = `Style: match the attached Brauweg knight penguin reference in rendering — stylized 3D-rendered mobile game art, rounded modelled shapes with real volume, soft gradients over the curvature, glossy highlights on eyes and metal, one light source from the top left, soft contact shadows only where parts overlap, friendly big eyes, no black outline, not flat vector, not photorealistic. Original design for our own game "Brauweg"; do not imitate characters, objects or art of any existing game (in particular no round red/yellow/blue birds with angry eyebrows, no green pigs). Real transparent background with alpha channel — no checkerboard, no ground, no cast floor shadow, no text, no logo, no frame, no UI. One single object, centered, fully visible with a small margin.`;

export const STIL_SZENE = `Style: match the attached Brauweg knight penguin reference in rendering — stylized 3D-rendered mobile game art, soft gradients, one warm light source from the top left, not flat vector, not photorealistic. Original design for our own game "Brauweg"; do not imitate any existing game's art. No text, no logo, no frame, no UI.`;

// Die drei Bros sind die Pinguine aus dem Logo (icon-512.png, zweite Vorlage der Ruhebilder);
// Aussehen nach docs/werbung/tiktok-serien/figuren.md und docs/SPEZIFIKATION-FLYINGBRO.md.
// Pelle ist rot-orange und rundlich — genau dort droht die Naehe zum Vorbild, daher das ausdrueckliche
// "penguin silhouette, no eyebrows, no head tuft" in PINGUIN_FORM.
const PINGUIN_FORM = 'clearly a penguin silhouette (upright oval body, two flippers, orange feet, cream-white face mask and belly), NOT a round ball-shaped bird, no eyebrows, no feather tuft on the head, no clothing or hat';

export const bro = {
  pelle: `PELLE, the red-orange penguin from the attached logo (second image): a short chubby penguin with a red-orange back, head and flippers, cream-white belly and face, bright orange beak and feet, a small white plus-shaped gamepad cross printed on his left flipper, huge eager friendly eyes, wide grin — ${PINGUIN_FORM}`,
  malve: `MALVE, the purple penguin from the attached logo (second image): a tall slim penguin with a deep violet-purple back, head and flippers, cream-white belly and face, orange beak and feet, wearing round thin glasses, half-lidded clever eyes, a confident slight smile — ${PINGUIN_FORM.replace(', no clothing or hat', ', no hat; the glasses are her only accessory')}`,
  tjark: `TJARK, the turquoise penguin from the attached logo (second image): a stocky penguin with a bright teal-turquoise back, head and flippers, cream-white belly and face, orange beak and feet, four round white game-controller buttons printed on one flipper, wild excited eyes, cocky wide grin — ${PINGUIN_FORM}`,
};
const ruheZusatz = {
  pelle: 'standing upright, waving cheerfully with one flipper, the gamepad cross on the flipper clearly visible',
  malve: 'standing upright, flippers crossed calmly over her belly, glasses glinting',
  tjark: 'standing upright, one flipper raised in a thumbs-up-like gesture, the four controller buttons on the flipper clearly visible',
};
export const faehigkeit = {
  pelle: { name: 'rutsch', pose: 'BELLY SLIDE: lying completely flat on his belly, sliding fast to the right like a toboggan, head forward and slightly raised, both flippers pressed back along the body, feet trailing behind, a few small snow/dust puffs under the belly, gleeful face. The body is long and flat (about 2.3 times as wide as tall). Landscape 1536x1024 canvas.' },
  malve: { name: 'gleit', pose: 'GLIDE: gliding through the air to the right with both flippers spread wide like wings, body horizontal and calm, feet tucked back, glasses on, focused serene expression. Seen from the side, slightly from below. Landscape 1536x1024 canvas.' },
  tjark: { name: 'eisblock', pose: 'ICE BLOCK: frozen inside a solid cube of clear light-blue ice, seen straight from the front (the cube is an exact square, edges beveled and frosty, a few frost cracks at the corners). Tjark is curled up inside, his face clearly visible through the ice, cheeky surprised grin, eyes looking right. Square 1024x1024.' },
};
export const giraffe = {
  klein: 'a small cartoon baby giraffe, very short neck, oversized round head, stubby legs, cheeky grin — the SMALL opponent',
  mittel: 'an adult cartoon giraffe of medium height, smug teasing grin, slightly plump body — the MEDIUM opponent',
  gross: 'the LONG-NECK giraffe: same species, colors and fur as the medium giraffe in the second attached image, but with an EXTREMELY long neck — the neck alone is about twice as long as the body is tall, so the head sits far above the body (total height about 2.1 times the body length); a sturdy body, a small golden crown, a proud slightly snooty smile (cheeky, not evil) — the BIG opponent',
};
export const block = {
  holz: 'warm light-brown wooden building block made of planks with visible wood grain and slightly beveled edges, small iron nails at the corners',
  stein: 'grey chiselled stone building block with beveled edges, subtle mineral speckles, solid and heavy',
  glas: 'pale icy-blue glass building block, semi-transparent with bright reflections along the beveled edges',
};

const auftraege = [];
for (const [k, b] of Object.entries(bro)) {
  auftraege.push({ name: `bro-${k}-ruhe`, art: 'figur', ref: 'logo', bild: `Subject: ${b}. Translate the flat logo character into the 3D-rendered style of the first image. Pose: ${ruheZusatz[k]}, full body, three-quarter view facing RIGHT. Square 1024x1024.` });
  // Flugpose: Auftrag (Ruhe + Flug je Bro) und Spezifikation (Ruhe, Flug, Faehigkeit, Sieg) verlangen sie getrennt von der Faehigkeit.
  auftraege.push({ name: `bro-${k}-flug`, art: 'figur', ref: `bro-${k}-ruhe`, bild: `Subject: the SAME character as in the second attached image (identical colors, markings, proportions${k === 'malve' ? ', glasses' : ''}): ${b}. Pose: FLIGHT right after being launched: flying through the air to the right, body stretched out horizontally and slightly tilted upward like a little torpedo, head forward, both flippers pressed back along the body (NOT spread like wings), feet trailing behind, an excited determined face. No motion lines, no dust, no background. Facing RIGHT. Landscape 1536x1024 canvas.` });
  const f = faehigkeit[k];
  auftraege.push({ name: `bro-${k}-${f.name}`, art: 'figur', ref: `bro-${k}-ruhe`, bild: `Subject: the SAME character as in the second attached image (identical colors, markings, proportions${k === 'malve' ? ', glasses' : ''}): ${b}. Pose: ${f.pose} Facing RIGHT.` });
}
for (const [k, g] of Object.entries(giraffe)) {
  const format = k === 'klein' ? 'Square 1024x1024.' : 'Portrait 1024x1536.';
  auftraege.push({ name: `giraffe-${k}-steht`, art: 'figur', ...(k === 'gross' ? { ref: 'giraffe-mittel-steht' } : {}), bild: `Subject: ${g}, same stylized 3D look as the penguin reference (soft fur texture, orange-brown patches, small ossicone horns). Pose: standing on all four legs, full body, three-quarter view facing LEFT, looking left and teasing. ${format}` });
  auftraege.push({ name: `giraffe-${k}-getroffen`, art: 'figur', ref: `giraffe-${k}-steht`, bild: `Subject: the SAME giraffe as in the second attached image (identical colors, patches, ${k === 'gross' ? 'crown, ' : ''}size and proportions), now just hit: dizzy swirly eyes, a red bump on the head, three small yellow stars circling the head, body tilted and wobbling, tongue sticking out, still standing, facing LEFT. ${format}` });
}
for (const [k, b] of Object.entries(block)) {
  auftraege.push({ name: `${k}-quadrat-heil`, art: 'block', bild: `Subject: a single square ${b}. Straight-on FRONT orthographic view, no perspective, no visible top or side faces, exactly square, intact. Square 1024x1024.` });
  auftraege.push({ name: `${k}-quadrat-angeknackst`, art: 'block', ref: `${k}-quadrat-heil`, bild: `Subject: the SAME block as in the second attached image (identical shape, size, color, orientation and front view), now damaged: several clear cracks across the face, chipped corners${k === 'holz' ? ', a splintered plank' : ''}, still in one piece. Square 1024x1024.` });
  auftraege.push({ name: `${k}-balken-heil`, art: 'block', ref: `${k}-quadrat-heil`, bild: `Subject: a long horizontal beam of the SAME material as the block in the second attached image: ${b}. Straight-on FRONT orthographic view, no perspective, proportions exactly 4 : 1 (four times as wide as tall), intact. Landscape 1536x1024 canvas, beam centered.` });
  auftraege.push({ name: `${k}-balken-angeknackst`, art: 'block', ref: `${k}-balken-heil`, bild: `Subject: the SAME beam as in the second attached image (identical shape, 4 : 1 proportions, color and front view), now damaged: clear cracks, chipped edges${k === 'holz' ? ', splintered wood' : ''}, still in one piece. Landscape 1536x1024 canvas, beam centered.` });
}
// Spezifikation (Abgrenzung): KEINE Astgabel-Schleuder, sondern ein Gummiband zwischen zwei gestapelten Kartenkisten.
// Das Band zeichnet das Spiel, deshalb nur die Ringe oben innen als Ankerpunkte.
auftraege.push({ name: 'schleuder', art: 'figur', bild: 'Subject: the launcher of our game — NOT a Y-shaped forked-branch slingshot, NO forked stick, NO wooden fork. Instead: TWO separate columns standing side by side on the same baseline with a gap between them about as wide as one crate; each column is two small sturdy wooden playing-card crates stacked on top of each other (the lower crate slightly larger). The crates are made of light wooden planks with metal corner brackets; on their fronts are big embossed playing-card suit symbols (a red heart, a black spade, a red diamond, a black club — one symbol per crate, no letters, no numbers), and the top crate of each column has its lid slightly ajar with the white edges of a few playing cards peeking out. At the top INNER corner of each top crate sits one small iron ring facing the gap, where a rubber band would be tied — WITHOUT any rubber band, rope or pouch (the game draws the band). Straight front view, very slightly from above, both columns fully visible. Portrait 1024x1536.' });
auftraege.push({ name: 'hintergrund', art: 'szene', bild: 'Subject: a wide side-view landscape backdrop for a 2D physics slingshot game, painted in the same warm stylized 3D look: gently rolling green hills, distant soft snowy mountains, a few fluffy clouds, warm late-afternoon light. The bottom 15 % is a flat, empty grassy ground strip (game objects stand on it); the upper half is calm open sky for flying objects. No characters, no animals, no buildings or structures, no slingshot. FULL-BLEED opaque image, NO transparency. Landscape 1536x1024.' });

export default auftraege;
