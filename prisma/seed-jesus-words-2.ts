/**
 * Seeds more Jesus words — parables, dialogues, key teachings
 * Run: npx tsx prisma/seed-jesus-words-2.ts
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface W { text: string; reference: string; note?: string; }

async function seed(slug: string, words: W[]) {
  const scene = await prisma.scene.findUnique({ where: { slug } });
  if (!scene) { console.warn(`  SKIP: ${slug}`); return; }
  for (let i = 0; i < words.length; i++) {
    const existing = await prisma.jesusWord.findFirst({
      where: { sceneId: scene.id, reference: words[i].reference },
    });
    if (!existing) {
      await prisma.jesusWord.create({
        data: { sceneId: scene.id, text: words[i].text, reference: words[i].reference, note: words[i].note, sortOrder: i + 100 },
      });
    }
  }
  console.log(`  ${slug}: ${words.length} words`);
}

async function main() {
  console.log("Seeding more Jesus words...\n");

  await seed("nazareth-synagogue", [
    { text: "The Spirit of the Lord is upon me, because he hath anointed me to preach the gospel to the poor; he hath sent me to heal the brokenhearted, to preach deliverance to the captives, and recovering of sight to the blind, to set at liberty them that are bruised.", reference: "Luke 4:18", note: "Jesus reads Isaiah 61:1-2 — then declares it fulfilled" },
    { text: "This day is this scripture fulfilled in your ears.", reference: "Luke 4:21", note: "The moment Jesus publicly declares His mission" },
    { text: "No prophet is accepted in his own country.", reference: "Luke 4:24" },
  ]);

  await seed("calling-galilean-disciples", [
    { text: "Follow me, and I will make you fishers of men.", reference: "Matthew 4:19" },
  ]);

  await seed("calming-the-storm", [
    { text: "Why are ye fearful, O ye of little faith?", reference: "Matthew 8:26" },
    { text: "Peace, be still.", reference: "Mark 4:39", note: "And the wind ceased, and there was a great calm" },
  ]);

  await seed("centurions-servant", [
    { text: "Verily I say unto you, I have not found so great faith, no, not in Israel.", reference: "Matthew 8:10" },
  ]);

  await seed("woman-at-the-well", [
    { text: "If thou knewest the gift of God, and who it is that saith to thee, Give me to drink; thou wouldest have asked of him, and he would have given thee living water.", reference: "John 4:10" },
    { text: "I that speak unto thee am he.", reference: "John 4:26", note: "Jesus reveals He is the Messiah — to a Samaritan woman" },
  ]);

  await seed("rich-young-ruler", [
    { text: "If thou wilt be perfect, go and sell that thou hast, and give to the poor, and thou shalt have treasure in heaven: and come and follow me.", reference: "Matthew 19:21" },
    { text: "It is easier for a camel to go through the eye of a needle, than for a rich man to enter into the kingdom of God.", reference: "Matthew 19:24" },
  ]);

  await seed("zacchaeus", [
    { text: "Zacchaeus, make haste, and come down; for to day I must abide at thy house.", reference: "Luke 19:5" },
    { text: "For the Son of man is come to seek and to save that which was lost.", reference: "Luke 19:10", note: "One of Jesus's most defining mission statements" },
  ]);

  await seed("blind-bartimaeus", [
    { text: "What wilt thou that I should do unto thee?", reference: "Mark 10:51" },
    { text: "Go thy way; thy faith hath made thee whole.", reference: "Mark 10:52" },
  ]);

  await seed("temple-debates", [
    { text: "Render therefore unto Caesar the things which are Caesar's; and unto God the things that are God's.", reference: "Matthew 22:21" },
    { text: "Thou shalt love the Lord thy God with all thy heart, and with all thy soul, and with all thy mind. This is the first and great commandment. And the second is like unto it, Thou shalt love thy neighbour as thyself.", reference: "Matthew 22:37-39", note: "The Greatest Commandment" },
  ]);

  await seed("olivet-discourse", [
    { text: "Take heed that no man deceive you. For many shall come in my name, saying, I am Christ; and shall deceive many.", reference: "Matthew 24:4-5" },
    { text: "And this gospel of the kingdom shall be preached in all the world for a witness unto all nations; and then shall the end come.", reference: "Matthew 24:14" },
    { text: "Heaven and earth shall pass away, but my words shall not pass away.", reference: "Matthew 24:35", note: "The enduring claim — His words outlast creation" },
  ]);

  await seed("the-arrest", [
    { text: "Put up again thy sword into his place: for all they that take the sword shall perish with the sword.", reference: "Matthew 26:52" },
  ]);

  await seed("the-trials", [
    { text: "Thou sayest.", reference: "Matthew 26:64", note: "Jesus's response to the high priest asking if He is the Christ" },
    { text: "My kingdom is not of this world: if my kingdom were of this world, then would my servants fight.", reference: "John 18:36", note: "Jesus's answer to Pilate about kingship" },
    { text: "To this end was I born, and for this cause came I into the world, that I should bear witness unto the truth. Every one that is of the truth heareth my voice.", reference: "John 18:37" },
  ]);

  await seed("breakfast-on-beach", [
    { text: "Simon, son of Jonas, lovest thou me more than these? Feed my lambs.", reference: "John 21:15", note: "First of Peter's triple restoration — mirrors his triple denial" },
    { text: "Simon, son of Jonas, lovest thou me? Feed my sheep.", reference: "John 21:16" },
    { text: "Simon, son of Jonas, lovest thou me? Feed my sheep.", reference: "John 21:17" },
    { text: "Follow me.", reference: "John 21:19", note: "Jesus's final recorded words to Peter" },
  ]);

  await seed("the-ascension", [
    { text: "Ye shall receive power, after that the Holy Ghost is come upon you: and ye shall be witnesses unto me both in Jerusalem, and in all Judaea, and in Samaria, and unto the uttermost part of the earth.", reference: "Acts 1:8", note: "Jesus's last recorded words before ascending — the mission to the entire world" },
  ]);

  const total = await prisma.jesusWord.count();
  console.log(`\nDone! Total Jesus words: ${total}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
