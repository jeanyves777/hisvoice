/**
 * Seeds world sources across all 10 tradition categories (A-J)
 * Run: npx tsx prisma/seed-sources.ts
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface SourceData {
  slug: string;
  title: string;
  type?: string;
  date?: string;
  content: string;
  reliability?: string;
}

async function seedSources(categoryCode: string, sources: SourceData[]) {
  const cat = await prisma.sourceCategory.findUnique({ where: { code: categoryCode } });
  if (!cat) { console.error(`Category ${categoryCode} not found!`); return; }

  for (let i = 0; i < sources.length; i++) {
    const s = sources[i];
    await prisma.worldSource.upsert({
      where: { slug: s.slug },
      update: { title: s.title, type: s.type, date: s.date, content: s.content, reliability: s.reliability },
      create: { slug: s.slug, categoryId: cat.id, title: s.title, type: s.type, date: s.date, content: s.content, reliability: s.reliability, sortOrder: i },
    });
  }
  console.log(`  Category ${categoryCode}: ${sources.length} sources seeded`);
}

async function main() {
  console.log("Seeding World Sources...\n");

  // ============================================================
  // A — Christian Apocrypha
  // ============================================================
  await seedSources("A", [
    { slug: "gospel-of-thomas", title: "Gospel of Thomas", type: "Removed — Gnostic sayings gospel", date: "c. 50-140 AD", content: "114 sayings of Jesus; approximately 65 parallel canonical sayings and 50 unique. A collection without narrative — pure teachings attributed to Jesus.", reliability: "Scholarly consensus: contains some early independent traditions alongside later Gnostic material. The parallels to canonical sayings suggest access to shared oral tradition." },
    { slug: "gospel-of-peter", title: "Gospel of Peter", type: "Removed — Passion narrative", date: "c. 100-150 AD", content: "Crucifixion and resurrection account with dramatic details: the cross itself speaks, and guards witness the resurrection. Contains a more elaborate passion narrative than the canonical gospels.", reliability: "Fragment only. Contains docetic tendencies (Jesus feels no pain). Some scholars argue it preserves early tradition; others see it as dependent on canonical gospels." },
    { slug: "gospel-of-mary", title: "Gospel of Mary Magdalene", type: "Removed — Gnostic", date: "c. 120-180 AD", content: "Post-resurrection teachings Jesus gave privately to Mary Magdalene. Describes a vision where Mary receives special revelation and teaches the other disciples, causing conflict with Peter.", reliability: "Fragmentary (pages missing). Reflects 2nd-century debates about women's authority in the church. Valuable for understanding early Christian diversity." },
    { slug: "gospel-of-philip", title: "Gospel of Philip", type: "Removed — Gnostic", date: "c. 180-250 AD", content: "A collection of sayings and sacramental theology. Contains the famous passage about Jesus kissing Mary Magdalene, and extensive discussion of baptism, anointing, and eucharist.", reliability: "Late Gnostic text. Valuable for understanding Valentinian Christianity but not considered historically reliable for Jesus's actual life." },
    { slug: "gospel-of-nicodemus", title: "Gospel of Nicodemus / Acts of Pilate", type: "Removed — Apocryphal", date: "c. 300-400 AD", content: "Extended trial narrative with detailed dialogue between Pilate and Jesus. Includes Pilate's reported letter to Emperor Tiberius about Jesus's execution and miracles. Also contains the 'Harrowing of Hell' narrative.", reliability: "Late composition. May preserve earlier traditions about Pilate's role. Referenced by early Church Fathers as circulating widely." },
    { slug: "protoevangelium-james", title: "Protoevangelium of James", type: "Removed — Infancy narrative", date: "c. 145 AD", content: "The birth of Mary, her childhood in the Temple, her betrothal to Joseph, and a detailed nativity account. Includes the midwife Salome testing Mary's virginity after birth.", reliability: "One of the earliest non-canonical texts. Influenced Christian art and Mariology extensively. Not historically reliable but shows very early veneration of Mary." },
    { slug: "infancy-gospel-thomas", title: "Infancy Gospel of Thomas", type: "Removed — Infancy miracles", date: "c. 140-170 AD", content: "Childhood miracles of Jesus ages 5-12. Jesus makes clay birds that come to life (paralleled in the Quran, Surah 3:49), curses a boy who bumps into him, and stretches a wooden beam for Joseph's carpentry.", reliability: "Generally considered legendary. The clay birds parallel in the Quran is significant — shows the tradition traveled independently across cultures." },
    { slug: "gospel-of-judas", title: "Gospel of Judas", type: "Removed — Gnostic", date: "c. 280 AD", content: "Presents Judas as the CHOSEN disciple — the only one who truly understood Jesus. Jesus asks Judas to betray him as a necessary act to free the divine spark trapped in his body.", reliability: "Sethian Gnostic text. Discovered in 2006. Valuable for understanding Gnostic reinterpretation but not historical for Jesus's actual life." },
    { slug: "didache", title: "Didache (The Teaching)", type: "Early Church document", date: "c. 50-120 AD", content: "The earliest known Christian manual. Contains a Lord's Prayer variant, eucharist liturgy, ethics instructions echoing the Sermon on the Mount, and guidelines for receiving traveling prophets.", reliability: "Extremely valuable. Possibly contemporary with some NT writings. Shows how the earliest Christians practiced Jesus's teachings in daily life." },
    { slug: "1-clement", title: "1 Clement", type: "Early Church letter", date: "c. 96 AD", content: "Letter from Clement of Rome to the Corinthian church. Quotes Jesus's teachings as authoritative scripture. References the deaths of Peter and Paul as recent events.", reliability: "Highly reliable historical source. Written by a leader who may have known the apostles personally. Provides evidence for early church structure and apostolic succession." },
  ]);

  // ============================================================
  // C — Islamic Sources
  // ============================================================
  await seedSources("C", [
    { slug: "quran-surah-3", title: "Quran — Surah 3 (Al-Imran): The Family of Imran", type: "Islamic scripture", date: "c. 610-632 AD", content: "The birth of Mary, the angel's announcement of Jesus (Isa), his miracles (healing the blind, raising the dead, creating birds from clay), and his disciples. Confirms the virgin birth and Jesus as Messiah (al-Masih). States Jesus was raised to God and not killed.", reliability: "Central Islamic scripture. Provides an independent 7th-century testimony to Jesus from a separate religious tradition. Confirms several key events while differing on theology." },
    { slug: "quran-surah-19", title: "Quran — Surah 19 (Maryam): Mary", type: "Islamic scripture", date: "c. 610-632 AD", content: "Full nativity narrative — Mary gives birth alone under a palm tree, baby Jesus speaks from the cradle defending his mother's honor. One of the most detailed birth accounts outside the canonical gospels.", reliability: "The speaking-from-cradle tradition has no canonical parallel but appears in the Infancy Gospel of Thomas tradition — suggesting independent transmission of shared early Christian traditions into Arabia." },
    { slug: "quran-surah-5", title: "Quran — Surah 5 (Al-Ma'idah): The Table Spread", type: "Islamic scripture", date: "c. 610-632 AD", content: "Jesus's disciples ask for a table spread from heaven as a sign. Jesus denies being God or asking people to worship him. Contains key theological differences with Christianity while affirming Jesus as a prophet and miracle-worker.", reliability: "Important for understanding how 7th-century Arabia received and reinterpreted Christian traditions about Jesus." },
    { slug: "quran-surah-4-157", title: "Quran — Surah 4:157-158 (An-Nisa): The Crucifixion Question", type: "Islamic scripture", date: "c. 610-632 AD", content: "'They did not kill him, nor did they crucify him, but it was made to appear so to them... Allah raised him up to Himself.' The most significant point of disagreement between Islam and Christianity regarding Jesus's death.", reliability: "This verse is the basis of the Islamic position on the crucifixion. 6 of 10 traditions in the Universal Matrix confirm the crucifixion; 2 (Islam and some Gnostic texts) deny it." },
    { slug: "quran-surah-61-6", title: "Quran — Surah 61:6 (As-Saff): Jesus Foretells Ahmad", type: "Islamic scripture", date: "c. 610-632 AD", content: "Jesus announces the coming of a messenger after him whose name is Ahmad (understood as Muhammad). This is the Islamic interpretation of the Paraclete (Comforter) promised in John 14-16.", reliability: "The identification of the Paraclete with Muhammad is central to Islamic Christology. Christian scholars interpret the Paraclete as the Holy Spirit." },
    { slug: "sahih-bukhari-jesus", title: "Sahih al-Bukhari — Hadith on Jesus's Return", type: "Islamic tradition (Hadith)", date: "c. 846 AD", content: "Jesus will descend near the white minaret east of Damascus, break the cross, kill the swine, and abolish the jizya tax. He will rule justly for 40 years and then die. Describes Jesus's Second Coming in Islamic eschatology.", reliability: "Sahih al-Bukhari is considered the most authentic hadith collection in Sunni Islam. Provides detailed Islamic eschatological beliefs about Jesus's future return." },
    { slug: "ibn-kathir-jesus", title: "Ibn Kathir — Stories of the Prophets (Qisas al-Anbiya)", type: "Islamic scholarship", date: "c. 1350 AD", content: "Comprehensive Islamic biography of Jesus/Isa drawing from the Quran, hadith, and earlier Islamic scholarship. Covers his birth, miracles, ascension, and future return.", reliability: "Ibn Kathir is one of the most respected Islamic historians. His compilation represents the mainstream Sunni understanding of Jesus." },
  ]);

  // ============================================================
  // D — Jewish Sources
  // ============================================================
  await seedSources("D", [
    { slug: "josephus-antiquities-18-3", title: "Josephus — Antiquities 18.3.3 (Testimonium Flavianum)", type: "Jewish historian", date: "c. 94 AD", content: "The famous passage mentioning Jesus: 'About this time there lived Jesus, a wise man... He was the Christ. Pilate condemned him to be crucified... his disciples reported that he had appeared to them alive.' Most scholars believe the core is authentic with later Christian interpolations.", reliability: "The most important non-Christian reference to Jesus. Scholars agree a reference to Jesus existed in the original text, though some phrases were likely added by Christian copyists. Even the minimal authentic core confirms Jesus existed, was crucified under Pilate, and had followers." },
    { slug: "josephus-antiquities-20-9", title: "Josephus — Antiquities 20.9.1 (Death of James)", type: "Jewish historian", date: "c. 94 AD", content: "'The brother of Jesus, who was called Christ, whose name was James' was brought before the Sanhedrin and stoned. This passage is almost universally accepted as authentic.", reliability: "Virtually undisputed. Provides independent Jewish confirmation that Jesus existed, was called 'Christ' by his followers, and had a brother named James." },
    { slug: "josephus-antiquities-18-5", title: "Josephus — Antiquities 18.5.2 (John the Baptist)", type: "Jewish historian", date: "c. 94 AD", content: "Full independent account of John the Baptist's ministry and execution by Herod Antipas. Josephus attributes Herod's military defeat to divine punishment for killing John.", reliability: "Universally accepted as authentic. Confirms the Baptist movement independently of the Gospels and provides additional historical context for Jesus's era." },
    { slug: "talmud-sanhedrin-43a", title: "Babylonian Talmud — Sanhedrin 43a", type: "Jewish legal text", date: "c. 200-500 AD", content: "'On the eve of Passover Yeshu was hanged. For forty days before the execution a herald went out crying: He is going to be stoned because he practiced sorcery and enticed Israel to apostasy. Anyone who can say anything in his favor, let him come forward.' Names five disciples.", reliability: "Hostile witness — written by people who opposed Jesus. The fact that they tried to EXPLAIN his miracles (calling them sorcery) rather than deny them is historically significant. Confirms: execution timing (Passover), extraordinary abilities, followers." },
    { slug: "dead-sea-scrolls-isaiah", title: "Dead Sea Scrolls — Great Isaiah Scroll (1QIsa)", type: "Jewish — ancient manuscript", date: "c. 125 BC (copy date)", content: "Complete scroll of Isaiah discovered in 1947 at Qumran. Carbon-dated to at least 125 years before Jesus was born. Contains the full text of Isaiah 53 ('He was wounded for our transgressions') proving these prophecies were written BEFORE the events they describe.", reliability: "The most important archaeological discovery for biblical studies. PROVES that the Messianic prophecies in Isaiah predate Jesus by at least 125 years. Eliminates the 'written after the fact' objection entirely." },
    { slug: "dead-sea-scrolls-4q246", title: "Dead Sea Scrolls — Son of God Text (4Q246)", type: "Jewish — ancient manuscript", date: "c. 100 BC", content: "Aramaic text: 'He shall be called the Son of God, and they shall call him Son of the Most High.' Written at least 100 years before Jesus, in a Messianic context.", reliability: "Demonstrates that the 'Son of God' concept existed in pre-Christian Jewish messianic expectation. Not a prophecy of Jesus specifically, but shows the conceptual framework existed." },
  ]);

  // ============================================================
  // E — Roman & Greek Historical
  // ============================================================
  await seedSources("E", [
    { slug: "tacitus-annals-15-44", title: "Tacitus — Annals XV.44", type: "Roman historian", date: "c. 116 AD", content: "'Christus, from whom the name had its origin, suffered the extreme penalty during the reign of Tiberius at the hands of one of our procurators, Pontius Pilatus.' Tacitus was writing about the Great Fire of Rome and Nero's persecution of Christians.", reliability: "Tacitus is considered one of the most reliable Roman historians. He had no sympathy for Christians. This is a hostile witness confirming: Jesus existed, was called Christ, was executed under Pilate during Tiberius's reign." },
    { slug: "pliny-letter-x96", title: "Pliny the Younger — Letter X.96", type: "Roman governor's letter", date: "c. 112 AD", content: "'They were in the habit of meeting on a fixed day before dawn and singing a hymn to Christ as to a god.' Pliny wrote to Emperor Trajan asking how to handle Christians in his province.", reliability: "Official Roman correspondence. Confirms: by 112 AD, Christians worshipped Jesus 'as a god,' met regularly, and the movement had spread widely enough to concern a Roman governor." },
    { slug: "suetonius-claudius-25", title: "Suetonius — Life of Claudius 25", type: "Roman historian", date: "c. 121 AD", content: "'He expelled the Jews from Rome who were constantly making disturbances at the instigation of Chrestus.' Most scholars identify 'Chrestus' as Christ — the disturbances being disputes between Jews who accepted Jesus as Messiah and those who did not.", reliability: "Confirms the impact of the Christian message on the Jewish community in Rome within 20 years of Jesus's death. Matches Acts 18:2." },
    { slug: "thallus-histories", title: "Thallus — Histories (Fragment)", type: "Greek historian", date: "c. 52 AD", content: "Thallus explained the darkness during Jesus's crucifixion as a solar eclipse. We know this from Julius Africanus (c. 221 AD) who quotes Thallus and notes that an eclipse is impossible during a full moon (Passover).", reliability: "Possibly the earliest pagan reference to Jesus (only 20 years after the crucifixion). Even in trying to explain the darkness NATURALLY, Thallus confirms the event was reported and widely known." },
    { slug: "celsus-true-word", title: "Celsus — The True Word (via Origen)", type: "Greek philosopher", date: "c. 178 AD", content: "The first known systematic attack on Christianity. Celsus admits Jesus performed extraordinary acts but attributes them to sorcery learned in Egypt. He confirms the virgin birth tradition (while mocking it), the crucifixion, and the disciples' claims.", reliability: "Preserved through Origen's response (Contra Celsum). As a hostile witness, Celsus CONFIRMS: Jesus existed, did extraordinary things, was crucified, and his followers claimed resurrection. He disputes the interpretation, not the facts." },
    { slug: "lucian-peregrine", title: "Lucian of Samosata — The Death of Peregrine", type: "Greek satirist", date: "c. 170 AD", content: "Mocks Christians for worshipping a 'crucified sophist' from Palestine who introduced new rites. Describes Christian communities as generous, easily deceived, and fiercely loyal to their founder.", reliability: "Satirical but informative. Confirms: Jesus was crucified, was from Palestine, introduced new practices, and his followers formed devoted communities throughout the Roman Empire." },
    { slug: "mara-bar-serapion", title: "Mara bar Serapion — Letter", type: "Syriac philosopher", date: "c. 73 AD", content: "'What advantage did the Jews gain from executing their wise King? After that their kingdom was abolished.' Compares Jesus to Socrates and Pythagoras — wise men killed by their own people, whose teachings endured.", reliability: "Very early non-Christian reference. Written by a pagan philosopher. Confirms: Jesus was considered a wise teacher/king, was executed by his own people, and his followers kept his teachings alive." },
  ]);

  // ============================================================
  // F — Mandaean Sources
  // ============================================================
  await seedSources("F", [
    { slug: "ginza-rabba", title: "Ginza Rabba (Great Treasure)", type: "Mandaean scripture", date: "c. 200-700 AD", content: "The holy book of the Mandaeans — the last surviving Gnostic religion (Iraq/Iran). References Jesus (Yeshu Msihia) in a complex light. Reveres John the Baptist as their central prophet while viewing Jesus with ambivalence.", reliability: "Valuable as an independent witness from a tradition that reveres John the Baptist but is skeptical of Jesus. Confirms the historical relationship between the two movements." },
    { slug: "book-of-john-mandaean", title: "Book of John (Drasha d-Yahya)", type: "Mandaean scripture", date: "c. 200-700 AD", content: "John the Baptist narratives from the Mandaean perspective. Jesus appears as a figure who received baptism from John. Contains alternative accounts of John's ministry and teachings.", reliability: "Provides an independent tradition about John the Baptist that predates or parallels the Gospel accounts. Shows the Baptist movement continued independently of Christianity." },
  ]);

  // ============================================================
  // G — Bahá'í Sources
  // ============================================================
  await seedSources("G", [
    { slug: "kitab-i-iqan", title: "Kitáb-i-Íqán (Book of Certitude)", type: "Bahá'í scripture", date: "c. 1861", content: "Bahá'u'lláh interprets Jesus's prophecies, return, and spiritual sovereignty. Presents Jesus as a 'Manifestation of God' — one of many divine messengers including Abraham, Moses, Muhammad, and Bahá'u'lláh himself.", reliability: "Central Bahá'í text. Provides a 19th-century religious perspective that affirms Jesus's significance while placing him in a broader revelatory framework." },
    { slug: "some-answered-questions", title: "Some Answered Questions — 'Abdu'l-Bahá", type: "Bahá'í commentary", date: "c. 1904-1906", content: "'Abdu'l-Bahá explains Jesus's miracles, divine nature, crucifixion, and resurrection from a Bahá'í theological perspective. Affirms the spiritual meaning while reinterpreting the physical claims.", reliability: "Provides detailed Bahá'í Christology. Affirms Jesus as divine messenger while interpreting miracles and resurrection spiritually rather than physically." },
  ]);

  // ============================================================
  // H — Eastern Religious References
  // ============================================================
  await seedSources("H", [
    { slug: "bhavishya-purana", title: "Bhavishya Purana — Isha-putra Reference", type: "Hindu scripture (disputed dating)", date: "Dating disputed", content: "Contains a passage where a king meets 'Isha-putra' (son of God) in a foreign land who describes himself as born of a virgin and teaching righteousness. Some scholars identify this as a reference to Jesus.", reliability: "Highly debated. The passage may be a later interpolation after contact with Christianity. If authentic, it would be a remarkable Hindu witness to Jesus. Most scholars treat it cautiously." },
    { slug: "notovitch-unknown-life", title: "Nicolas Notovitch — The Unknown Life of Jesus", type: "Controversial claim", date: "1894", content: "Claims to have found Buddhist monastery records at Hemis monastery in Ladakh describing 'Issa' (Jesus) traveling to India during the 'lost years' (ages 13-29) and studying with Hindu and Buddhist teachers.", reliability: "Widely disputed. Max Müller and others challenged Notovitch's claims. No independent scholar has verified the manuscripts. Culturally significant as a tradition but not historically verified." },
  ]);

  // ============================================================
  // I — Manichaean Sources
  // ============================================================
  await seedSources("I", [
    { slug: "manichaean-psalm-book", title: "Manichaean Psalm-Book", type: "Coptic Manichaean hymns", date: "c. 300 AD", content: "Contains hymns to 'Jesus the Splendour' and 'Jesus the Luminous' — a being of pure light. Jesus is a central divine figure in Manichaeism, though understood differently from Christianity. The psalms show deep devotion.", reliability: "Manichaeism was a major world religion (3rd-7th century, Persia to China). These texts show how Jesus was received and venerated in a separate religious tradition — confirming his impact extended far beyond Christianity." },
    { slug: "mani-living-gospel", title: "Mani's Living Gospel", type: "Manichaean scripture", date: "c. 240 AD", content: "Mani claimed to complete Jesus's revelation. Jesus is 'Jesus the Luminous' — one of the great prophets of light alongside Buddha, Zoroaster, and Mani himself. The gospel presents a cosmic light-vs-darkness theology.", reliability: "Only fragments survive. Valuable for understanding how Jesus was received in Persian religious culture within 200 years of his death." },
  ]);

  // ============================================================
  // J — Zoroastrian Context
  // ============================================================
  await seedSources("J", [
    { slug: "avesta-saoshyant", title: "Avesta — Saoshyant Prophecy", type: "Zoroastrian scripture", date: "c. 1000+ BC", content: "The Avesta describes a future 'Saoshyant' (World Savior) who will be born of a virgin, raise the dead, judge the world, and establish an eternal kingdom of righteousness. Scholars debate whether this influenced Jewish messianic expectations.", reliability: "The parallel to Christian messianic expectations is striking. Whether there was direct influence is debated, but both traditions independently developed the concept of a virgin-born savior who conquers death." },
    { slug: "bundahishn", title: "Bundahishn — End-Times Redeemer", type: "Zoroastrian cosmology", date: "Compilation c. 800-900 AD, traditions older", content: "Describes the final Saoshyant bringing resurrection of the dead, final judgment, and the renewal of the world. The dead rise with their bodies restored, evil is destroyed, and a new creation begins.", reliability: "The parallels to Christian eschatology (resurrection, judgment, new creation) are significant. Shows these concepts existed in pre-Christian Persian religion, suggesting possible cross-cultural influence on Jewish and early Christian thought." },
  ]);

  // ============================================================
  // Link some sources to scenes (parallels)
  // ============================================================
  console.log("\n  Linking sources to scenes...");

  const linkSource = async (sourceSlug: string, sceneSlug: string, note: string) => {
    const source = await prisma.worldSource.findUnique({ where: { slug: sourceSlug } });
    const scene = await prisma.scene.findUnique({ where: { slug: sceneSlug } });
    if (!source || !scene) return;
    await prisma.sourceParallel.upsert({
      where: { sourceId_sceneId: { sourceId: source.id, sceneId: scene.id } },
      update: { note },
      create: { sourceId: source.id, sceneId: scene.id, note },
    });
  };

  await linkSource("infancy-gospel-thomas", "boy-jesus-in-temple", "Infancy Gospel of Thomas expands Jesus's childhood with miracle stories ages 5-12");
  await linkSource("protoevangelium-james", "birth-in-bethlehem", "Protoevangelium provides an expanded nativity narrative including Mary's childhood");
  await linkSource("quran-surah-19", "annunciation-to-mary", "Surah 19 (Maryam) provides the Islamic account of the annunciation and virgin birth");
  await linkSource("quran-surah-19", "birth-in-bethlehem", "The Quran describes Mary giving birth under a palm tree — a unique nativity tradition");
  await linkSource("quran-surah-3", "wedding-at-cana", "Surah 3:49 confirms Jesus performed miracles including creating birds from clay");
  await linkSource("quran-surah-4-157", "the-crucifixion", "Surah 4:157 states 'they did not kill him, nor crucify him, but it was made to appear so'");
  await linkSource("josephus-antiquities-18-3", "the-trials", "Josephus confirms Jesus was condemned by Pilate and crucified");
  await linkSource("josephus-antiquities-18-5", "john-baptist-ministry", "Josephus provides a full independent account of John the Baptist's ministry and execution");
  await linkSource("tacitus-annals-15-44", "the-crucifixion", "Tacitus confirms 'Christus suffered the extreme penalty under Pontius Pilatus'");
  await linkSource("talmud-sanhedrin-43a", "the-crucifixion", "The Talmud records 'On the eve of Passover Yeshu was hanged' — confirms execution timing");
  await linkSource("talmud-sanhedrin-43a", "the-trials", "The Talmud records a herald calling for witnesses in Jesus's defense for 40 days");
  await linkSource("pliny-letter-x96", "the-empty-tomb", "Within 80 years, Christians were singing hymns to Christ 'as to a god' before dawn");
  await linkSource("thallus-histories", "the-death", "Thallus tried to explain the darkness at the crucifixion as a solar eclipse — confirming the event was widely known");
  await linkSource("dead-sea-scrolls-isaiah", "the-crucifixion", "The Great Isaiah Scroll (125 BC) proves Isaiah 53 was written BEFORE the crucifixion");
  await linkSource("mara-bar-serapion", "the-crucifixion", "Mara bar Serapion (c. 73 AD) calls Jesus 'the wise King of the Jews' executed unjustly");
  await linkSource("sahih-bukhari-jesus", "great-commission", "Islamic hadith describes Jesus's future return — confirming the Second Coming tradition");
  await linkSource("avesta-saoshyant", "birth-in-bethlehem", "Zoroastrian Saoshyant prophecy parallels: virgin birth of a world savior");
  await linkSource("didache", "lords-prayer", "The Didache contains an early Lord's Prayer variant, showing how the earliest Christians prayed");
  await linkSource("gospel-of-thomas", "sermon-on-the-mount", "Gospel of Thomas Saying 54: 'Blessed are the poor, for yours is the Kingdom of Heaven' — parallel to the Beatitudes");
  await linkSource("celsus-true-word", "the-crucifixion", "Celsus admits Jesus performed extraordinary acts but calls them sorcery — hostile witness confirming miracles");

  console.log("  20 source-scene links created");

  // ============================================================
  // Seed scientific studies + archaeological evidence
  // ============================================================
  console.log("\n  Seeding scientific studies...");

  const studies = [
    { title: "AWARE Study (Sam Parnia)", authors: "Sam Parnia et al.", year: "2014", journal: "Resuscitation", summary: "2,060 cardiac arrest patients studied across 15 hospitals. Verified cases of awareness during clinical death when brain showed zero electrical activity. The largest scientific study of near-death experiences.", category: "NDE" },
    { title: "The Lancet NDE Study", authors: "Pim van Lommel et al.", year: "2001", journal: "The Lancet", summary: "344 cardiac arrest patients in the Netherlands. 18% reported NDEs with verifiable details of events in other rooms. The lead researcher was an atheist cardiologist who began the study expecting to debunk NDEs.", category: "NDE" },
    { title: "Terminal Lucidity Research", authors: "Michael Nahm et al.", year: "2012", journal: "Archives of Gerontology and Geriatrics", summary: "Documented cases of Alzheimer's patients with destroyed brains suddenly regaining full consciousness, recognizing family, and speaking clearly moments before death. If consciousness is produced by the brain, this should be impossible.", category: "consciousness" },
    { title: "Science Speaks — Prophecy Probability", authors: "Peter Stoner", year: "1958", journal: "American Scientific Affiliation (peer-reviewed)", summary: "Calculated the probability of one person fulfilling 8 Messianic prophecies by chance: 1 in 10^17. For 48 prophecies: 1 in 10^157. Peer-reviewed and endorsed by the American Scientific Affiliation.", category: "prophecy_math" },
  ];

  for (const s of studies) {
    await prisma.scientificStudy.create({ data: s });
  }
  console.log(`  ${studies.length} scientific studies seeded`);

  console.log("\n  Seeding archaeological evidence...");

  const archaeology = [
    { title: "Dead Sea Scrolls Discovery", location: "Qumran, Israel", dateFound: "1947", description: "Ancient scrolls found in caves near the Dead Sea. Includes the complete Isaiah scroll (1QIsa) carbon-dated to 125 BC, proving Messianic prophecies predate Jesus.", significance: "Eliminates the claim that prophecies were written after the fact." },
    { title: "Pilate Stone (Caesarea Inscription)", location: "Caesarea Maritima, Israel", dateFound: "1961", description: "A limestone block with a Latin inscription mentioning 'Pontius Pilatus, Prefect of Judaea.' The first archaeological evidence of Pilate's existence.", significance: "Confirms the historical existence of the Roman governor who ordered Jesus's crucifixion." },
    { title: "Caiaphas Ossuary", location: "Jerusalem", dateFound: "1990", description: "An ornate ossuary (bone box) inscribed 'Yehosef bar Qafa' — Joseph son of Caiaphas. Contains the bones of the high priest who presided over Jesus's trial.", significance: "Confirms the existence of the high priest named in all four Gospel trial accounts." },
    { title: "James Ossuary", location: "Jerusalem area", dateFound: "2002", description: "An ossuary inscribed 'Ya'akov bar Yosef akhui di Yeshua' — James son of Joseph brother of Jesus. If authentic, it's the earliest physical artifact mentioning Jesus.", significance: "Debated authenticity. If genuine, provides direct archaeological reference to Jesus and his family." },
    { title: "Pool of Siloam Excavation", location: "Jerusalem", dateFound: "2004", description: "Excavation confirmed the Pool of Siloam — the pool where Jesus sent the blind man to wash (John 9:7). Previously thought to be legendary by some scholars.", significance: "Confirms a specific location mentioned only in John's Gospel as historically accurate." },
  ];

  for (const a of archaeology) {
    await prisma.archaeologicalEvidence.create({ data: a });
  }
  console.log(`  ${archaeology.length} archaeological discoveries seeded`);

  console.log("\nAll world sources seeded!");
}

main()
  .then(() => process.exit(0))
  .catch((e) => { console.error("Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
