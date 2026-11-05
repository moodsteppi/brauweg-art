// Prompts fuer die Flying-Bro-Bilder. Jede Zeile hier steht wortgleich in docs/ASSETS-FLYINGBRO.md.
export const STIL = `Style: match the attached Brauweg knight penguin reference in rendering — stylized 3D-rendered mobile game art, rounded modelled shapes with real volume, soft gradients over the curvature, glossy highlights on eyes and metal, one light source from the top left, soft contact shadows only where parts overlap, friendly big eyes, no black outline, not flat vector, not photorealistic. Original design for our own game "Brauweg"; do not imitate characters, objects or art of any existing game (in particular no round red/yellow/blue birds with angry eyebrows, no green pigs). Real transparent background with alpha channel — no checkerboard, no ground, no cast floor shadow, no text, no logo, no frame, no UI. One single object, centered, fully visible with a small margin.`;

export const STIL_SZENE = `Style: match the attached Brauweg knight penguin reference in rendering — stylized 3D-rendered mobile game art, soft gradients, one warm light source from the top left, not flat vector, not photorealistic. Original design for our own game "Brauweg"; do not imitate any existing game's art. No text, no logo, no frame, no UI.`;

const PINGUIN = 'a Brauweg penguin (black back and head, white belly and face, orange beak and orange feet, big friendly eyes)';

export const bro = {
  schnell: `${PINGUIN}, slim and streamlined, wearing a turquoise leather aviator cap with brass goggles and a short turquoise scarf — the FAST one, light and agile build`,
  schwer: `${PINGUIN}, big, heavy and very round, wearing thick dark steel plate armor with rivets and a rounded steel helmet with the visor up, small bronze trims — the HEAVY one, chunky and solid`,
  teilt: `${PINGUIN}, small and chubby, wearing a violet knitted bobble hat with three pom-poms and a violet-and-white striped scarf — the SPLITTING one, playful and mischievous`,
};
const flugZusatz = {
  schnell: ', goggles pulled down over the eyes, scarf streaming behind',
  schwer: ', tucked into a compact armored cannonball shape, visor down',
  teilt: ', with two faint translucent violet copies of itself fanning out above and below as if about to split into three',
};
export const giraffe = {
  klein: 'a small cartoon baby giraffe, very short neck, oversized round head, stubby legs, cheeky grin — the SMALL opponent',
  mittel: 'an adult cartoon giraffe of medium height, smug teasing grin, slightly plump body — the MEDIUM opponent',
  gross: 'a big tall burly cartoon giraffe wearing a small golden crown, arrogant boss grin — the BIG opponent',
};
export const block = {
  holz: 'warm light-brown wooden building block made of planks with visible wood grain and slightly beveled edges, small iron nails at the corners',
  stein: 'grey chiselled stone building block with beveled edges, subtle mineral speckles, solid and heavy',
  glas: 'pale icy-blue glass building block, semi-transparent with bright reflections along the beveled edges',
};

const auftraege = [];
for (const [k, b] of Object.entries(bro)) {
  auftraege.push({ name: `bro-${k}-ruhe`, art: 'figur', bild: `Subject: ${b}. Pose: standing upright and relaxed, wings at the sides, confident friendly smile, full body, three-quarter view facing right. Square 1024x1024.` });
  auftraege.push({ name: `bro-${k}-flug`, art: 'figur', ref: `bro-${k}-ruhe`, bild: `Subject: the SAME character as in the second attached image (identical colors, gear and proportions): ${b}. Pose: in mid-flight, launched through the air to the right, body stretched forward, wings swept back, determined focused face${flugZusatz[k]}. Side view. Square 1024x1024.` });
}
for (const [k, g] of Object.entries(giraffe)) {
  const format = k === 'klein' ? 'Square 1024x1024.' : 'Portrait 1024x1536.';
  auftraege.push({ name: `giraffe-${k}-steht`, art: 'figur', bild: `Subject: ${g}, same stylized 3D look as the penguin reference (soft fur texture, orange-brown patches, small ossicone horns). Pose: standing on all four legs, full body, three-quarter view facing LEFT, looking left and teasing. ${format}` });
  auftraege.push({ name: `giraffe-${k}-getroffen`, art: 'figur', ref: `giraffe-${k}-steht`, bild: `Subject: the SAME giraffe as in the second attached image (identical colors, patches, ${k === 'gross' ? 'crown, ' : ''}size and proportions), now just hit: dizzy swirly eyes, a red bump on the head, three small yellow stars circling the head, body tilted and wobbling, tongue sticking out, still standing, facing LEFT. ${format}` });
}
for (const [k, b] of Object.entries(block)) {
  auftraege.push({ name: `${k}-quadrat-heil`, art: 'block', bild: `Subject: a single square ${b}. Straight-on FRONT orthographic view, no perspective, no visible top or side faces, exactly square, intact. Square 1024x1024.` });
  auftraege.push({ name: `${k}-quadrat-angeknackst`, art: 'block', ref: `${k}-quadrat-heil`, bild: `Subject: the SAME block as in the second attached image (identical shape, size, color, orientation and front view), now damaged: several clear cracks across the face, chipped corners${k === 'holz' ? ', a splintered plank' : ''}, still in one piece. Square 1024x1024.` });
  auftraege.push({ name: `${k}-balken-heil`, art: 'block', ref: `${k}-quadrat-heil`, bild: `Subject: a long horizontal beam of the SAME material as the block in the second attached image: ${b}. Straight-on FRONT orthographic view, no perspective, proportions exactly 4 : 1 (four times as wide as tall), intact. Landscape 1536x1024 canvas, beam centered.` });
  auftraege.push({ name: `${k}-balken-angeknackst`, art: 'block', ref: `${k}-balken-heil`, bild: `Subject: the SAME beam as in the second attached image (identical shape, 4 : 1 proportions, color and front view), now damaged: clear cracks, chipped edges${k === 'holz' ? ', splintered wood' : ''}, still in one piece. Landscape 1536x1024 canvas, beam centered.` });
}
auftraege.push({ name: 'schleuder', art: 'figur', bild: 'Subject: a sturdy wooden Y-shaped slingshot standing upright, carved from a forked branch, leather wrapping at both fork tips and on the handle, small iron rings at the tips where a band would attach — WITHOUT any rubber band or pouch (the game draws the band). Front view, slightly turned. Portrait 1024x1536.' });
auftraege.push({ name: 'hintergrund', art: 'szene', bild: 'Subject: a wide side-view landscape backdrop for a 2D physics slingshot game, painted in the same warm stylized 3D look: gently rolling green hills, distant soft snowy mountains, a few fluffy clouds, warm late-afternoon light. The bottom 15 % is a flat, empty grassy ground strip (game objects stand on it); the upper half is calm open sky for flying objects. No characters, no animals, no buildings or structures, no slingshot. FULL-BLEED opaque image, NO transparency. Landscape 1536x1024.' });

export default auftraege;
