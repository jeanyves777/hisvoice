/**
 * Seeds Act I — The Promise: Prophecy context scenes
 * These bridge scenes provide narrative context for the 24 prophecies
 * Run: npx tsx prisma/seed-act1.ts
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Act I scenes...\n");

  const act1 = await prisma.act.findUnique({ where: { number: 1 } });
  if (!act1) throw new Error("Act 1 not found");

  const scenes = [
    { slug: "genesis-promise", title: "The First Promise", subtitle: "Genesis 3:15 — The Seed of the Woman", dateApprox: "c. 1446 BC (written)", convergenceScore: 0, era: "prophecy" },
    { slug: "abrahamic-covenant", title: "The Abrahamic Covenant", subtitle: "All families of the earth blessed through one line", dateApprox: "c. 2000 BC", convergenceScore: 0, era: "prophecy" },
    { slug: "judah-scepter", title: "The Scepter of Judah", subtitle: "A ruler from Judah until Shiloh comes", dateApprox: "c. 1689 BC", convergenceScore: 0, era: "prophecy" },
    { slug: "star-of-jacob", title: "The Star of Jacob", subtitle: "A star and scepter rising from Israel", dateApprox: "c. 1406 BC", convergenceScore: 0, era: "prophecy" },
    { slug: "prophet-like-moses", title: "A Prophet Like Moses", subtitle: "God will raise up a prophet from among your brethren", dateApprox: "c. 1406 BC", convergenceScore: 0, era: "prophecy" },
    { slug: "davids-throne", title: "David's Eternal Throne", subtitle: "A kingdom that will never end", dateApprox: "c. 1000 BC", convergenceScore: 0, era: "prophecy" },
    { slug: "isaiah-suffering-servant", title: "Isaiah's Suffering Servant", subtitle: "Wounded for our transgressions — Isaiah 53", dateApprox: "c. 700 BC", convergenceScore: 0, era: "prophecy" },
    { slug: "bethlehem-prophecy", title: "The Bethlehem Prophecy", subtitle: "Out of Bethlehem shall come a ruler in Israel", dateApprox: "c. 735 BC", convergenceScore: 0, era: "prophecy" },
    { slug: "zechariah-visions", title: "Zechariah's Visions", subtitle: "The king on a donkey, 30 pieces of silver, the pierced one", dateApprox: "c. 520 BC", convergenceScore: 0, era: "prophecy" },
    { slug: "malachi-messenger", title: "Malachi's Messenger", subtitle: "I will send my messenger before me — the last OT prophet", dateApprox: "c. 430 BC", convergenceScore: 0, era: "prophecy" },
  ];

  for (let i = 0; i < scenes.length; i++) {
    await prisma.scene.upsert({
      where: { slug: scenes[i].slug },
      update: { ...scenes[i], actId: act1.id },
      create: { ...scenes[i], actId: act1.id, sortOrder: i },
    });
  }
  console.log(`  ${scenes.length} Act I scenes seeded`);

  // Link prophecies to Act I scenes
  const links: [string, string, string][] = [
    ["gen-3-15", "genesis-promise", "The first Messianic prophecy — the Seed of the Woman"],
    ["gen-12-3", "abrahamic-covenant", "God promises all nations blessed through Abraham"],
    ["gen-49-10", "judah-scepter", "The scepter prophecy of Judah"],
    ["num-24-17", "star-of-jacob", "Balaam's prophecy of the Star"],
    ["deut-18-15", "prophet-like-moses", "Moses foretells the coming Prophet"],
    ["2sam-7-12", "davids-throne", "God's covenant with David"],
    ["isa-53-5", "isaiah-suffering-servant", "Isaiah 53 — the complete Passion prophecy"],
    ["isa-53-7", "isaiah-suffering-servant", "Silent before His accusers"],
    ["isa-53-9", "isaiah-suffering-servant", "Buried with the rich"],
    ["mic-5-2", "bethlehem-prophecy", "Born in Bethlehem Ephrathah"],
    ["zech-9-9", "zechariah-visions", "The king arrives on a donkey"],
    ["zech-11-12", "zechariah-visions", "Betrayed for 30 pieces of silver"],
    ["zech-12-10", "zechariah-visions", "They will look on the one they pierced"],
    ["mal-3-1", "malachi-messenger", "A messenger prepares the way"],
    ["mal-4-5", "malachi-messenger", "Elijah returns before the great day"],
  ];

  for (const [pSlug, sSlug, note] of links) {
    const prophecy = await prisma.prophecy.findUnique({ where: { slug: pSlug } });
    const scene = await prisma.scene.findUnique({ where: { slug: sSlug } });
    if (prophecy && scene) {
      await prisma.fulfillment.upsert({
        where: { prophecyId_sceneId: { prophecyId: prophecy.id, sceneId: scene.id } },
        update: { note },
        create: { prophecyId: prophecy.id, sceneId: scene.id, note },
      });
    }
  }
  console.log("  15 prophecy-scene links created for Act I");

  const total = await prisma.scene.count();
  console.log(`\nTotal scenes: ${total}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
