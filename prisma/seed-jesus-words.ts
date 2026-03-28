/**
 * Seeds Jesus's direct words for major scenes.
 * Run: npx tsx prisma/seed-jesus-words.ts
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface WordData {
  text: string;
  reference: string;
  note?: string;
}

async function seedWords(sceneSlug: string, words: WordData[]) {
  const scene = await prisma.scene.findUnique({ where: { slug: sceneSlug } });
  if (!scene) { console.warn(`  Scene not found: ${sceneSlug}`); return; }

  // Delete existing to avoid dupes
  await prisma.jesusWord.deleteMany({ where: { sceneId: scene.id } });

  for (let i = 0; i < words.length; i++) {
    await prisma.jesusWord.create({
      data: { sceneId: scene.id, text: words[i].text, reference: words[i].reference, note: words[i].note, sortOrder: i },
    });
  }
  console.log(`  ${sceneSlug}: ${words.length} words`);
}

async function main() {
  console.log("Seeding Jesus words...\n");

  await seedWords("baptism-of-jesus", [
    { text: "Suffer it to be so now: for thus it becometh us to fulfil all righteousness.", reference: "Matthew 3:15", note: "Jesus's first recorded words in Matthew — unique to Matthew" },
  ]);

  await seedWords("temptation-in-wilderness", [
    { text: "It is written, Man shall not live by bread alone, but by every word that proceedeth out of the mouth of God.", reference: "Matthew 4:4", note: "Quoting Deuteronomy 8:3 — first temptation" },
    { text: "It is written again, Thou shalt not tempt the Lord thy God.", reference: "Matthew 4:7", note: "Quoting Deuteronomy 6:16 — second temptation" },
    { text: "Get thee hence, Satan: for it is written, Thou shalt worship the Lord thy God, and him only shalt thou serve.", reference: "Matthew 4:10", note: "Quoting Deuteronomy 6:13 — third temptation" },
  ]);

  await seedWords("wedding-at-cana", [
    { text: "Woman, what have I to do with thee? mine hour is not yet come.", reference: "John 2:4", note: "First recorded words in John's Gospel" },
  ]);

  await seedWords("nicodemus-born-again", [
    { text: "Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God.", reference: "John 3:3" },
    { text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.", reference: "John 3:16", note: "The most quoted verse in the Bible" },
  ]);

  await seedWords("woman-at-the-well", [
    { text: "Whosoever drinketh of this water shall thirst again: But whosoever drinketh of the water that I shall give him shall never thirst.", reference: "John 4:13-14" },
    { text: "God is a Spirit: and they that worship him must worship him in spirit and in truth.", reference: "John 4:24" },
  ]);

  await seedWords("sermon-on-the-mount", [
    { text: "Blessed are the poor in spirit: for theirs is the kingdom of heaven.", reference: "Matthew 5:3", note: "First Beatitude" },
    { text: "Blessed are they that mourn: for they shall be comforted.", reference: "Matthew 5:4" },
    { text: "Blessed are the meek: for they shall inherit the earth.", reference: "Matthew 5:5" },
    { text: "Blessed are they which do hunger and thirst after righteousness: for they shall be filled.", reference: "Matthew 5:6" },
    { text: "Blessed are the merciful: for they shall obtain mercy.", reference: "Matthew 5:7" },
    { text: "Blessed are the pure in heart: for they shall see God.", reference: "Matthew 5:8" },
    { text: "Blessed are the peacemakers: for they shall be called the children of God.", reference: "Matthew 5:9" },
    { text: "Ye are the light of the world. A city that is set on an hill cannot be hid.", reference: "Matthew 5:14" },
    { text: "Love your enemies, bless them that curse you, do good to them that hate you, and pray for them which despitefully use you.", reference: "Matthew 5:44", note: "The most revolutionary ethical teaching in history" },
  ]);

  await seedWords("lords-prayer", [
    { text: "Our Father which art in heaven, Hallowed be thy name. Thy kingdom come, Thy will be done in earth, as it is in heaven. Give us this day our daily bread. And forgive us our debts, as we forgive our debtors. And lead us not into temptation, but deliver us from evil: For thine is the kingdom, and the power, and the glory, for ever. Amen.", reference: "Matthew 6:9-13", note: "The Lord's Prayer — the most prayed words in history" },
  ]);

  await seedWords("feeding-5000", [
    { text: "They need not depart; give ye them to eat.", reference: "Matthew 14:16" },
  ]);

  await seedWords("walking-on-water", [
    { text: "Be of good cheer; it is I; be not afraid.", reference: "Matthew 14:27" },
    { text: "O thou of little faith, wherefore didst thou doubt?", reference: "Matthew 14:31", note: "Spoken to Peter after he began to sink" },
  ]);

  await seedWords("transfiguration", [
    { text: "Tell the vision to no man, until the Son of man be risen again from the dead.", reference: "Matthew 17:9" },
  ]);

  await seedWords("raising-of-lazarus", [
    { text: "I am the resurrection, and the life: he that believeth in me, though he were dead, yet shall he live.", reference: "John 11:25", note: "One of the 7 'I AM' statements in John" },
    { text: "Lazarus, come forth.", reference: "John 11:43" },
  ]);

  await seedWords("good-samaritan", [
    { text: "Go, and do thou likewise.", reference: "Luke 10:37", note: "The conclusion of the Good Samaritan parable" },
  ]);

  await seedWords("prodigal-son", [
    { text: "This my son was dead, and is alive again; he was lost, and is found.", reference: "Luke 15:24", note: "The father's words — representing God's joy at repentance" },
  ]);

  await seedWords("triumphal-entry", [
    { text: "If these should hold their peace, the stones would immediately cry out.", reference: "Luke 19:40", note: "Unique to Luke — when Pharisees asked Him to rebuke the crowd" },
  ]);

  await seedWords("last-supper", [
    { text: "This is my body which is given for you: this do in remembrance of me.", reference: "Luke 22:19", note: "Institution of communion" },
    { text: "This cup is the new testament in my blood, which is shed for you.", reference: "Luke 22:20" },
    { text: "A new commandment I give unto you, That ye love one another; as I have loved you.", reference: "John 13:34", note: "From the Upper Room Discourse" },
    { text: "I am the way, the truth, and the life: no man cometh unto the Father, but by me.", reference: "John 14:6", note: "One of the most defining statements of Jesus" },
    { text: "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you.", reference: "John 14:27" },
  ]);

  await seedWords("gethsemane", [
    { text: "O my Father, if it be possible, let this cup pass from me: nevertheless not as I will, but as thou wilt.", reference: "Matthew 26:39", note: "The prayer of agony in the garden" },
  ]);

  await seedWords("the-crucifixion", [
    { text: "Father, forgive them; for they know not what they do.", reference: "Luke 23:34", note: "1st Word — UNIQUE TO LUKE" },
    { text: "Verily I say unto thee, Today shalt thou be with me in paradise.", reference: "Luke 23:43", note: "2nd Word — UNIQUE TO LUKE — to the repentant thief" },
    { text: "Woman, behold thy son... Behold thy mother.", reference: "John 19:26-27", note: "3rd Word — UNIQUE TO JOHN" },
    { text: "My God, my God, why hast thou forsaken me?", reference: "Matthew 27:46", note: "4th Word — Psalm 22:1 quoted verbatim — in Matthew AND Mark" },
    { text: "I thirst.", reference: "John 19:28", note: "5th Word — UNIQUE TO JOHN — fulfills Psalm 69:21" },
    { text: "It is finished.", reference: "John 19:30", note: "6th Word — UNIQUE TO JOHN — 'tetelestai' = paid in full" },
    { text: "Father, into thy hands I commend my spirit.", reference: "Luke 23:46", note: "7th Word — UNIQUE TO LUKE — Psalm 31:5" },
  ]);

  await seedWords("the-empty-tomb", [
    { text: "Why seek ye the living among the dead? He is not here, but is risen.", reference: "Luke 24:5-6", note: "The angel's words at the empty tomb" },
  ]);

  await seedWords("mary-magdalene-risen", [
    { text: "Woman, why weepest thou? whom seekest thou?", reference: "John 20:15" },
    { text: "Touch me not; for I am not yet ascended to my Father.", reference: "John 20:17", note: "First words of the risen Christ" },
  ]);

  await seedWords("road-to-emmaus", [
    { text: "O fools, and slow of heart to believe all that the prophets have spoken: Ought not Christ to have suffered these things, and to enter into his glory?", reference: "Luke 24:25-26", note: "On the road to Emmaus — Jesus expounds all the Scriptures about Himself" },
  ]);

  await seedWords("appearance-to-thomas", [
    { text: "Reach hither thy finger, and behold my hands; and reach hither thy hand, and thrust it into my side: and be not faithless, but believing.", reference: "John 20:27" },
    { text: "Thomas, because thou hast seen me, thou hast believed: blessed are they that have not seen, and yet have believed.", reference: "John 20:29", note: "A word for all future believers" },
  ]);

  await seedWords("great-commission", [
    { text: "All power is given unto me in heaven and in earth. Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost: Teaching them to observe all things whatsoever I have commanded you: and, lo, I am with you always, even unto the end of the world. Amen.", reference: "Matthew 28:18-20", note: "The Great Commission — Jesus's final command" },
  ]);

  // Count total
  const total = await prisma.jesusWord.count();
  console.log(`\nDone! Total Jesus words in database: ${total}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
