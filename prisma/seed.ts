import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ============================================================
  // ADMIN USER
  // ============================================================
  const adminHash = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@hisvoice.app" },
    update: {},
    create: {
      email: "admin@hisvoice.app",
      name: "Admin",
      passwordHash: adminHash,
      role: "ADMIN",
      emailVerified: true,
    },
  });
  console.log("  Admin user created:", admin.email);

  // ============================================================
  // 7 ACTS
  // ============================================================
  const acts = [
    { number: 1, slug: "the-promise", title: "The Promise", subtitle: "Before the Birth", timeRange: "c. 1446 BC – 430 BC", description: "1,500+ years of Messianic prophecy — from Genesis to Malachi" },
    { number: 2, slug: "the-arrival", title: "The Arrival", subtitle: "Nativity & Childhood", timeRange: "c. 5 BC – AD 12", description: "The birth, childhood, and early life of Jesus" },
    { number: 3, slug: "the-preparation", title: "The Preparation", subtitle: "Forerunner & Baptism", timeRange: "c. AD 26–27", description: "John the Baptist, the baptism, and the temptation" },
    { number: 4, slug: "the-ministry", title: "The Ministry", subtitle: "Galilean Phase", timeRange: "c. AD 27–29", description: "The heart of Jesus's public ministry — teachings, miracles, parables" },
    { number: 5, slug: "the-confrontation", title: "The Confrontation", subtitle: "Judean & Perean Ministry", timeRange: "c. AD 29–30", description: "The journey toward Jerusalem and growing opposition" },
    { number: 6, slug: "the-passion", title: "The Passion", subtitle: "Holy Week", timeRange: "c. AD 30, Passover Week", description: "The final week — from Triumphal Entry to the Cross" },
    { number: 7, slug: "the-victory", title: "The Victory", subtitle: "Resurrection & Commission", timeRange: "c. AD 30", description: "The empty tomb, resurrection appearances, and the Great Commission" },
  ];

  for (const act of acts) {
    await prisma.act.upsert({
      where: { number: act.number },
      update: act,
      create: { ...act, sortOrder: act.number },
    });
  }
  console.log("  7 Acts created");

  // ============================================================
  // 10 SOURCE CATEGORIES
  // ============================================================
  const categories = [
    { code: "A", slug: "christian-apocryphal", name: "Removed / Apocryphal Christian Texts", description: "18 non-canonical gospels, acts, and apocalypses" },
    { code: "B", slug: "early-church-fathers", name: "Early Church Fathers", description: "Didache, Ignatius, Justin Martyr, Origen and more" },
    { code: "C", slug: "islamic", name: "Islamic Sources (Quran & Hadith)", description: "25 Quranic chapters, 93+ verses on Jesus (Isa)" },
    { code: "D", slug: "jewish", name: "Jewish Sources", description: "Josephus, Talmud, Dead Sea Scrolls, Toledot Yeshu" },
    { code: "E", slug: "roman-greek", name: "Roman & Greek Historical", description: "Tacitus, Pliny, Thallus, Celsus, Lucian" },
    { code: "F", slug: "mandaean", name: "Mandaean Sources", description: "Ginza Rabba, Book of John — independent Baptist tradition" },
    { code: "G", slug: "bahai", name: "Baha'i Sources", description: "Kitab-i-Iqan, Some Answered Questions" },
    { code: "H", slug: "eastern", name: "Eastern Religious References", description: "Hindu, Buddhist, Ahmadiyya parallels" },
    { code: "I", slug: "manichaean", name: "Manichaean Sources", description: "Living Gospel, Psalm-Book — Jesus the Luminous" },
    { code: "J", slug: "zoroastrian", name: "Zoroastrian Context", description: "Avesta, Bundahishn — Saoshyant prophecy parallels" },
  ];

  for (let i = 0; i < categories.length; i++) {
    await prisma.sourceCategory.upsert({
      where: { code: categories[i].code },
      update: categories[i],
      create: { ...categories[i], sortOrder: i },
    });
  }
  console.log("  10 Source Categories created");

  // ============================================================
  // 24 PROPHECIES
  // ============================================================
  const prophecies = [
    { slug: "gen-3-15", label: "The Seed of the Woman will crush the serpent", reference: "Genesis 3:15", dateWritten: "c. 1446 BC", textKjv: "And I will put enmity between thee and the woman, and between thy seed and her seed; it shall bruise thy head, and thou shalt bruise his heel.", fulfillmentType: "direct" },
    { slug: "gen-12-3", label: "All families blessed through Abraham's line", reference: "Genesis 12:3", dateWritten: "c. 2000 BC", textKjv: "And I will bless them that bless thee, and curse him that curseth thee: and in thee shall all families of the earth be blessed.", fulfillmentType: "direct" },
    { slug: "gen-49-10", label: "The scepter shall not depart from Judah", reference: "Genesis 49:10", dateWritten: "c. 1689 BC", textKjv: "The sceptre shall not depart from Judah, nor a lawgiver from between his feet, until Shiloh come; and unto him shall the gathering of the people be.", fulfillmentType: "direct" },
    { slug: "num-24-17", label: "A star shall come out of Jacob", reference: "Numbers 24:17", dateWritten: "c. 1406 BC", textKjv: "I shall see him, but not now: I shall behold him, but not nigh: there shall come a Star out of Jacob, and a Sceptre shall rise out of Israel.", fulfillmentType: "typological" },
    { slug: "deut-18-15", label: "A Prophet like Moses", reference: "Deuteronomy 18:15", dateWritten: "c. 1406 BC", textKjv: "The LORD thy God will raise up unto thee a Prophet from the midst of thee, of thy brethren, like unto me; unto him ye shall hearken.", fulfillmentType: "direct" },
    { slug: "2sam-7-12", label: "His throne established forever", reference: "2 Samuel 7:12-13", dateWritten: "c. 1000 BC", textKjv: "I will set up thy seed after thee, which shall proceed out of thy bowels, and I will establish his kingdom. He shall build an house for my name, and I will stablish the throne of his kingdom for ever.", fulfillmentType: "direct" },
    { slug: "ps-2-7", label: "You are my Son; today I have begotten You", reference: "Psalm 2:7", dateWritten: "c. 1000 BC", textKjv: "I will declare the decree: the LORD hath said unto me, Thou art my Son; this day have I begotten thee.", fulfillmentType: "direct" },
    { slug: "ps-22-1", label: "My God, why have you forsaken me?", reference: "Psalm 22:1", dateWritten: "c. 1000 BC", textKjv: "My God, my God, why hast thou forsaken me? why art thou so far from helping me, and from the words of my roaring?", fulfillmentType: "direct" },
    { slug: "ps-34-20", label: "Not one of his bones shall be broken", reference: "Psalm 34:20", dateWritten: "c. 1000 BC", textKjv: "He keepeth all his bones: not one of them is broken.", fulfillmentType: "direct" },
    { slug: "ps-22-18", label: "They divided my garments among them", reference: "Psalm 22:18", dateWritten: "c. 1000 BC", textKjv: "They part my garments among them, and cast lots upon my vesture.", fulfillmentType: "direct" },
    { slug: "ps-118-22", label: "The stone the builders rejected", reference: "Psalm 118:22", dateWritten: "c. 1000 BC", textKjv: "The stone which the builders refused is become the head stone of the corner.", fulfillmentType: "typological" },
    { slug: "isa-7-14", label: "Born of a virgin — Immanuel", reference: "Isaiah 7:14", dateWritten: "c. 740 BC", textKjv: "Therefore the Lord himself shall give you a sign; Behold, a virgin shall conceive, and bear a son, and shall call his name Immanuel.", fulfillmentType: "direct" },
    { slug: "isa-9-1-2", label: "Galilee of the Gentiles — great light", reference: "Isaiah 9:1-2", dateWritten: "c. 740 BC", textKjv: "The people that walked in darkness have seen a great light: they that dwell in the land of the shadow of death, upon them hath the light shined.", fulfillmentType: "direct" },
    { slug: "isa-9-6", label: "Unto us a child is born; Wonderful Counselor", reference: "Isaiah 9:6", dateWritten: "c. 740 BC", textKjv: "For unto us a child is born, unto us a son is given: and the government shall be upon his shoulder: and his name shall be called Wonderful, Counsellor, The mighty God, The everlasting Father, The Prince of Peace.", fulfillmentType: "direct" },
    { slug: "isa-61-1", label: "The Spirit of the Lord is upon me", reference: "Isaiah 61:1-2", dateWritten: "c. 700 BC", textKjv: "The Spirit of the Lord GOD is upon me; because the LORD hath anointed me to preach good tidings unto the meek; he hath sent me to bind up the brokenhearted, to proclaim liberty to the captives.", fulfillmentType: "direct" },
    { slug: "isa-53-5", label: "He was wounded for our transgressions", reference: "Isaiah 53:5", dateWritten: "c. 700 BC", textKjv: "But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed.", fulfillmentType: "direct" },
    { slug: "isa-53-7", label: "Led as a lamb to the slaughter", reference: "Isaiah 53:7", dateWritten: "c. 700 BC", textKjv: "He was oppressed, and he was afflicted, yet he opened not his mouth: he is brought as a lamb to the slaughter, and as a sheep before her shearers is dumb, so he openeth not his mouth.", fulfillmentType: "direct" },
    { slug: "isa-53-9", label: "His grave with the wicked and the rich", reference: "Isaiah 53:9", dateWritten: "c. 700 BC", textKjv: "And he made his grave with the wicked, and with the rich in his death; because he had done no violence, neither was any deceit in his mouth.", fulfillmentType: "direct" },
    { slug: "mic-5-2", label: "Born in Bethlehem Ephrathah", reference: "Micah 5:2", dateWritten: "c. 735 BC", textKjv: "But thou, Bethlehem Ephratah, though thou be little among the thousands of Judah, yet out of thee shall he come forth unto me that is to be ruler in Israel; whose goings forth have been from of old, from everlasting.", fulfillmentType: "direct" },
    { slug: "zech-9-9", label: "Your king comes riding on a donkey", reference: "Zechariah 9:9", dateWritten: "c. 520 BC", textKjv: "Rejoice greatly, O daughter of Zion; shout, O daughter of Jerusalem: behold, thy King cometh unto thee: he is just, and having salvation; lowly, and riding upon an ass, and upon a colt the foal of an ass.", fulfillmentType: "direct" },
    { slug: "zech-11-12", label: "Betrayed for 30 pieces of silver", reference: "Zechariah 11:12-13", dateWritten: "c. 520 BC", textKjv: "And I said unto them, If ye think good, give me my price; and if not, forbear. So they weighed for my price thirty pieces of silver.", fulfillmentType: "direct" },
    { slug: "zech-12-10", label: "They will look on me whom they pierced", reference: "Zechariah 12:10", dateWritten: "c. 520 BC", textKjv: "And I will pour upon the house of David, and upon the inhabitants of Jerusalem, the spirit of grace and of supplications: and they shall look upon me whom they have pierced.", fulfillmentType: "direct" },
    { slug: "mal-3-1", label: "A messenger will prepare the way", reference: "Malachi 3:1", dateWritten: "c. 430 BC", textKjv: "Behold, I will send my messenger, and he shall prepare the way before me: and the Lord, whom ye seek, shall suddenly come to his temple.", fulfillmentType: "direct" },
    { slug: "mal-4-5", label: "Elijah will come before the great day", reference: "Malachi 4:5", dateWritten: "c. 430 BC", textKjv: "Behold, I will send you Elijah the prophet before the coming of the great and dreadful day of the LORD.", fulfillmentType: "typological" },
  ];

  for (let i = 0; i < prophecies.length; i++) {
    await prisma.prophecy.upsert({
      where: { slug: prophecies[i].slug },
      update: prophecies[i],
      create: { ...prophecies[i], sortOrder: i },
    });
  }
  console.log("  24 Prophecies created");

  // ============================================================
  // ACT II SCENES (9 scenes)
  // ============================================================
  const act2 = await prisma.act.findUnique({ where: { number: 2 } });
  if (!act2) throw new Error("Act 2 not found");

  const act2Scenes = [
    { slug: "annunciation-to-mary", title: "Annunciation to Mary", subtitle: "Gabriel's announcement", dateApprox: "c. 5 BC", convergenceScore: 1, era: "nativity" },
    { slug: "marys-magnificat", title: "Mary's Magnificat", subtitle: "Mary's song of praise", dateApprox: "c. 5 BC", convergenceScore: 1, era: "nativity" },
    { slug: "birth-in-bethlehem", title: "Birth in Bethlehem", subtitle: "The Nativity", dateApprox: "c. 5 BC", convergenceScore: 2, era: "nativity" },
    { slug: "angels-to-shepherds", title: "Angels to the Shepherds", subtitle: "Gloria in Excelsis Deo", dateApprox: "c. 5 BC", convergenceScore: 1, era: "nativity" },
    { slug: "the-magi", title: "The Magi from the East", subtitle: "The Star of Bethlehem", dateApprox: "c. 4 BC", convergenceScore: 1, era: "nativity" },
    { slug: "flight-to-egypt", title: "Flight to Egypt", subtitle: "Out of Egypt I called my son", dateApprox: "c. 4 BC", convergenceScore: 1, era: "nativity" },
    { slug: "massacre-of-innocents", title: "Massacre of the Innocents", subtitle: "Herod's decree", dateApprox: "c. 4 BC", convergenceScore: 1, era: "nativity" },
    { slug: "boy-jesus-in-temple", title: "The Boy Jesus in the Temple", subtitle: "Only recorded childhood word of Jesus", dateApprox: "c. AD 8", convergenceScore: 1, era: "nativity" },
    { slug: "400-years-of-silence", title: "400 Years of Silence Broken", subtitle: "From Malachi to Matthew", dateApprox: "430 BC – 5 BC", convergenceScore: 0, era: "nativity" },
  ];

  for (let i = 0; i < act2Scenes.length; i++) {
    await prisma.scene.upsert({
      where: { slug: act2Scenes[i].slug },
      update: { ...act2Scenes[i], actId: act2.id },
      create: { ...act2Scenes[i], actId: act2.id, sortOrder: i },
    });
  }
  console.log("  9 Act II scenes created");

  // ============================================================
  // GOSPEL ACCOUNTS for select scenes
  // ============================================================
  const annunciation = await prisma.scene.findUnique({ where: { slug: "annunciation-to-mary" } });
  if (annunciation) {
    await prisma.account.upsert({
      where: { sceneId_gospel: { sceneId: annunciation.id, gospel: "luke" } },
      update: {},
      create: { sceneId: annunciation.id, gospel: "luke", reference: "Luke 1:26-38" },
    });
  }

  const birth = await prisma.scene.findUnique({ where: { slug: "birth-in-bethlehem" } });
  if (birth) {
    await prisma.account.upsert({
      where: { sceneId_gospel: { sceneId: birth.id, gospel: "matthew" } },
      update: {},
      create: { sceneId: birth.id, gospel: "matthew", reference: "Matthew 1:18-25" },
    });
    await prisma.account.upsert({
      where: { sceneId_gospel: { sceneId: birth.id, gospel: "luke" } },
      update: {},
      create: { sceneId: birth.id, gospel: "luke", reference: "Luke 2:1-7", sortOrder: 1 },
    });
  }

  const boyTemple = await prisma.scene.findUnique({ where: { slug: "boy-jesus-in-temple" } });
  if (boyTemple) {
    await prisma.account.upsert({
      where: { sceneId_gospel: { sceneId: boyTemple.id, gospel: "luke" } },
      update: {},
      create: { sceneId: boyTemple.id, gospel: "luke", reference: "Luke 2:41-52" },
    });

    // Jesus's words — only recorded childhood word
    await prisma.jesusWord.create({
      data: {
        sceneId: boyTemple.id,
        text: "How is it that ye sought me? wist ye not that I must be about my Father's business?",
        reference: "Luke 2:49",
        note: "The only recorded word of Jesus before age 30 — unique to Luke",
      },
    });
  }
  console.log("  Gospel accounts + Jesus words created");

  // ============================================================
  // FULFILLMENT LINKS
  // ============================================================
  const bethlehem = await prisma.prophecy.findUnique({ where: { slug: "mic-5-2" } });
  const virgin = await prisma.prophecy.findUnique({ where: { slug: "isa-7-14" } });

  if (bethlehem && birth) {
    await prisma.fulfillment.upsert({
      where: { prophecyId_sceneId: { prophecyId: bethlehem.id, sceneId: birth.id } },
      update: {},
      create: { prophecyId: bethlehem.id, sceneId: birth.id, note: "Jesus born in Bethlehem as prophesied by Micah" },
    });
  }
  if (virgin && annunciation) {
    await prisma.fulfillment.upsert({
      where: { prophecyId_sceneId: { prophecyId: virgin.id, sceneId: annunciation.id } },
      update: {},
      create: { prophecyId: virgin.id, sceneId: annunciation.id, note: "Virgin birth announced by Gabriel to Mary" },
    });
  }
  console.log("  Prophecy fulfillment links created");

  // ============================================================
  // GAP NOTES
  // ============================================================
  if (birth) {
    await prisma.gapNote.create({ data: { sceneId: birth.id, note: "Matthew focuses on Joseph's perspective and his dream; Luke focuses on Mary's journey and the manger", sortOrder: 0 } });
    await prisma.gapNote.create({ data: { sceneId: birth.id, note: "Only Luke mentions 'no room in the inn' — Matthew does not describe the birth scene itself", sortOrder: 1 } });
  }
  console.log("  Gap notes created");

  // ============================================================
  // LOCATIONS
  // ============================================================
  if (birth) {
    await prisma.location.upsert({
      where: { sceneId: birth.id },
      update: {},
      create: { sceneId: birth.id, label: "Bethlehem", lat: 31.7054, lng: 35.2024 },
    });
  }
  if (boyTemple) {
    await prisma.location.upsert({
      where: { sceneId: boyTemple.id },
      update: {},
      create: { sceneId: boyTemple.id, label: "Temple, Jerusalem", lat: 31.7781, lng: 35.2354 },
    });
  }
  console.log("  Locations created");

  // ============================================================
  // WELCOME NOTIFICATION FOR ADMIN
  // ============================================================
  await prisma.notification.create({
    data: {
      userId: admin.id,
      type: "WELCOME",
      title: "Welcome to His Voice",
      content: "The system is ready. Begin building the most comprehensive Jesus app in history.",
      link: "/timeline",
    },
  });
  console.log("  Welcome notification created");

  console.log("\nSeed complete!");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
