/**
 * Links all 24 prophecies to their fulfillment scenes.
 * Run: npx tsx prisma/seed-fulfillments.ts
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const LINKS: [string, string, string][] = [
  // [prophecy_slug, scene_slug, note]
  ["gen-3-15", "the-crucifixion", "The Seed of the Woman crushes the serpent — the entire ministry and crucifixion fulfill this first Messianic promise"],
  ["gen-12-3", "the-genealogies", "All families blessed through Abraham's line — traced through Matthew and Luke's genealogies to Mary"],
  ["gen-49-10", "the-genealogies", "The scepter of Judah — Jesus born of the tribe of Judah as recorded in both genealogies"],
  ["num-24-17", "the-magi", "A star shall come out of Jacob — the Star of Bethlehem guides the Magi"],
  ["deut-18-15", "sermon-on-the-mount", "A Prophet like Moses — Jesus as the new Lawgiver delivering the Sermon on the Mount"],
  ["2sam-7-12", "the-genealogies", "His throne established forever — Jesus as Son of David through both genealogies"],
  ["ps-2-7", "baptism-of-jesus", "You are my Son — the Voice from heaven at baptism and transfiguration"],
  ["ps-2-7", "transfiguration", "You are my Son — the Voice speaks again at the Transfiguration"],
  ["ps-22-1", "the-crucifixion", "My God, why have you forsaken me? — Jesus quotes this psalm verbatim from the cross"],
  ["ps-34-20", "the-death", "Not one bone broken — the soldiers did not break Jesus's legs (John 19:33)"],
  ["ps-22-18", "the-crucifixion", "They divided my garments — soldiers cast lots for Jesus's clothing at the cross"],
  ["ps-118-22", "temple-debates", "The stone the builders rejected — Jesus quotes this of Himself during Temple debates"],
  ["isa-7-14", "annunciation-to-mary", "Born of a virgin — Immanuel — the virgin birth announced by Gabriel"],
  ["isa-9-1-2", "calling-galilean-disciples", "Galilee of the Gentiles sees a great light — Jesus begins His ministry in Galilee"],
  ["isa-9-6", "birth-in-bethlehem", "Unto us a child is born, Wonderful Counselor — the Incarnation at Bethlehem"],
  ["isa-61-1", "nazareth-synagogue", "The Spirit of the Lord is upon me — Jesus reads this in the Nazareth synagogue and declares it fulfilled"],
  ["isa-53-5", "the-crucifixion", "Wounded for our transgressions — the entire Passion narrative fulfills Isaiah 53"],
  ["isa-53-7", "the-trials", "Led as a lamb to the slaughter — Jesus's silence before Pilate"],
  ["isa-53-9", "the-burial", "His grave with the wicked and the rich — buried in Joseph of Arimathea's new tomb"],
  ["mic-5-2", "birth-in-bethlehem", "Born in Bethlehem Ephrathah — the Nativity location"],
  ["zech-9-9", "triumphal-entry", "Your king comes riding on a donkey — the Triumphal Entry into Jerusalem"],
  ["zech-11-12", "judas-betrayal-agreement", "Betrayed for 30 pieces of silver — Judas's exact betrayal price"],
  ["zech-12-10", "the-crucifixion", "They will look on me whom they pierced — the spear thrust at the crucifixion"],
  ["mal-3-1", "john-baptist-ministry", "A messenger will prepare the way — John the Baptist as forerunner"],
  ["mal-4-5", "john-baptist-ministry", "Elijah will come — Jesus identifies John as the Elijah figure"],
];

async function main() {
  console.log("Linking prophecies to fulfillment scenes...\n");

  let linked = 0;
  let skipped = 0;

  for (const [pSlug, sSlug, note] of LINKS) {
    const prophecy = await prisma.prophecy.findUnique({ where: { slug: pSlug } });
    const scene = await prisma.scene.findUnique({ where: { slug: sSlug } });

    if (!prophecy) { console.warn(`  Prophecy not found: ${pSlug}`); skipped++; continue; }
    if (!scene) { console.warn(`  Scene not found: ${sSlug}`); skipped++; continue; }

    await prisma.fulfillment.upsert({
      where: { prophecyId_sceneId: { prophecyId: prophecy.id, sceneId: scene.id } },
      update: { note },
      create: { prophecyId: prophecy.id, sceneId: scene.id, note },
    });
    linked++;
  }

  console.log(`Done! Linked: ${linked}, Skipped: ${skipped}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
