/**
 * Seeds Acts III-VII with all scenes, accounts, gap notes, and locations.
 * Run after the main seed: npx tsx prisma/seed-acts.ts
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface SceneData {
  slug: string;
  title: string;
  subtitle?: string;
  dateApprox?: string;
  convergenceScore: number;
  era: string;
  accounts?: { gospel: string; reference: string }[];
  gapNotes?: string[];
  location?: { label: string; lat: number; lng: number };
}

async function seedScenes(actNumber: number, scenes: SceneData[]) {
  const act = await prisma.act.findUnique({ where: { number: actNumber } });
  if (!act) { console.error(`Act ${actNumber} not found!`); return; }

  for (let i = 0; i < scenes.length; i++) {
    const s = scenes[i];
    const scene = await prisma.scene.upsert({
      where: { slug: s.slug },
      update: { title: s.title, subtitle: s.subtitle, dateApprox: s.dateApprox, convergenceScore: s.convergenceScore, era: s.era },
      create: { slug: s.slug, actId: act.id, title: s.title, subtitle: s.subtitle, dateApprox: s.dateApprox, convergenceScore: s.convergenceScore, era: s.era, sortOrder: i },
    });

    if (s.accounts) {
      for (let j = 0; j < s.accounts.length; j++) {
        const a = s.accounts[j];
        await prisma.account.upsert({
          where: { sceneId_gospel: { sceneId: scene.id, gospel: a.gospel } },
          update: { reference: a.reference },
          create: { sceneId: scene.id, gospel: a.gospel, reference: a.reference, sortOrder: j },
        });
      }
    }

    if (s.gapNotes) {
      // Delete existing gap notes for this scene to avoid duplicates
      await prisma.gapNote.deleteMany({ where: { sceneId: scene.id } });
      for (let k = 0; k < s.gapNotes.length; k++) {
        await prisma.gapNote.create({ data: { sceneId: scene.id, note: s.gapNotes[k], sortOrder: k } });
      }
    }

    if (s.location) {
      await prisma.location.upsert({
        where: { sceneId: scene.id },
        update: s.location,
        create: { sceneId: scene.id, ...s.location },
      });
    }
  }
  console.log(`  Act ${actNumber}: ${scenes.length} scenes seeded`);
}

async function main() {
  console.log("Seeding Acts III-VII...\n");

  // ============================================================
  // ACT III — THE PREPARATION (5 scenes)
  // ============================================================
  await seedScenes(3, [
    { slug: "john-baptist-ministry", title: "Ministry of John the Baptist", subtitle: "Voice crying in the wilderness", dateApprox: "c. AD 26", convergenceScore: 4, era: "preparation",
      accounts: [
        { gospel: "matthew", reference: "Matthew 3:1-12" },
        { gospel: "mark", reference: "Mark 1:1-8" },
        { gospel: "luke", reference: "Luke 3:1-18" },
        { gospel: "john", reference: "John 1:19-28" },
      ],
      gapNotes: ["Luke adds soldiers and tax collectors asking specific questions", "John's gospel has the Baptist directly denying he is the Christ, Elijah, or the Prophet"],
      location: { label: "Jordan River, Judean Wilderness", lat: 31.837, lng: 35.547 },
    },
    { slug: "baptism-of-jesus", title: "Baptism of Jesus", subtitle: "The heavens opened — Spirit as a dove — Voice from heaven", dateApprox: "c. AD 26", convergenceScore: 4, era: "preparation",
      accounts: [
        { gospel: "matthew", reference: "Matthew 3:13-17" },
        { gospel: "mark", reference: "Mark 1:9-11" },
        { gospel: "luke", reference: "Luke 3:21-22" },
        { gospel: "john", reference: "John 1:29-34" },
      ],
      gapNotes: ["Convergence 4/4 — all four gospels record the dove and the Voice", "Matthew uniquely records Jesus saying 'Suffer it to be so now'", "John records the Baptist's testimony but not the baptism event itself"],
      location: { label: "Bethany Beyond the Jordan", lat: 31.837, lng: 35.547 },
    },
    { slug: "the-genealogies", title: "The Genealogies", subtitle: "Matthew traces to Abraham; Luke traces to Adam", dateApprox: "c. AD 26", convergenceScore: 2, era: "preparation",
      accounts: [
        { gospel: "matthew", reference: "Matthew 1:1-17" },
        { gospel: "luke", reference: "Luke 3:23-38" },
      ],
      gapNotes: ["Matthew traces lineage to Abraham (Covenant line); Luke traces to Adam (universal humanity)", "Matthew follows the legal line through Solomon; Luke follows the biological line through Nathan"],
    },
    { slug: "temptation-in-wilderness", title: "Temptation in the Wilderness", subtitle: "40 days — Jesus quotes Deuteronomy three times", dateApprox: "c. AD 26-27", convergenceScore: 3, era: "preparation",
      accounts: [
        { gospel: "matthew", reference: "Matthew 4:1-11" },
        { gospel: "mark", reference: "Mark 1:12-13" },
        { gospel: "luke", reference: "Luke 4:1-13" },
      ],
      gapNotes: ["Mark gives only 2 verses; Matthew and Luke give full dialogue", "Matthew and Luke record the 3 temptations in different order", "Luke ends with 'the devil departed for a season' — unique detail"],
      location: { label: "Judean Wilderness", lat: 31.75, lng: 35.40 },
    },
    { slug: "first-disciples-john", title: "The First Disciples (John's Account)", subtitle: "Andrew, Peter, Philip, Nathanael", dateApprox: "c. AD 27", convergenceScore: 1, era: "preparation",
      accounts: [{ gospel: "john", reference: "John 1:35-51" }],
      gapNotes: ["Unique to John — this calling predates the Galilean call in the Synoptics"],
      location: { label: "Bethany Beyond the Jordan", lat: 31.837, lng: 35.547 },
    },
  ]);

  // ============================================================
  // ACT IV — THE MINISTRY: Galilean Phase (28 scenes)
  // ============================================================
  await seedScenes(4, [
    { slug: "wedding-at-cana", title: "Wedding at Cana", subtitle: "First miracle — water to wine", dateApprox: "c. AD 27", convergenceScore: 1, era: "galilean",
      accounts: [{ gospel: "john", reference: "John 2:1-11" }],
      location: { label: "Cana, Galilee", lat: 32.748, lng: 35.339 },
    },
    { slug: "temple-clearing-early", title: "Clearing the Temple (Early)", subtitle: "John places this at the start of ministry", dateApprox: "c. AD 27", convergenceScore: 1, era: "galilean",
      accounts: [{ gospel: "john", reference: "John 2:13-22" }],
      gapNotes: ["John places this at the START of Jesus's ministry; Synoptics place a similar event in Passion Week", "Possibly two separate events, or John arranged thematically rather than chronologically"],
      location: { label: "Temple, Jerusalem", lat: 31.778, lng: 35.235 },
    },
    { slug: "nicodemus-born-again", title: "Nicodemus — Born Again", subtitle: "You must be born again", dateApprox: "c. AD 27", convergenceScore: 1, era: "galilean",
      accounts: [{ gospel: "john", reference: "John 3:1-21" }],
      location: { label: "Jerusalem", lat: 31.778, lng: 35.235 },
    },
    { slug: "woman-at-the-well", title: "Woman at the Well", subtitle: "Ministry in Samaria", dateApprox: "c. AD 27", convergenceScore: 1, era: "galilean",
      accounts: [{ gospel: "john", reference: "John 4:1-42" }],
      location: { label: "Sychar, Samaria", lat: 32.213, lng: 35.285 },
    },
    { slug: "sermon-on-the-mount", title: "Sermon on the Mount / Plain", subtitle: "The Beatitudes and Kingdom Ethics", dateApprox: "c. AD 28", convergenceScore: 2, era: "galilean",
      accounts: [
        { gospel: "matthew", reference: "Matthew 5:1-7:29" },
        { gospel: "luke", reference: "Luke 6:17-49" },
      ],
      gapNotes: ["Matthew: mountain, 8 beatitudes; Luke: plain, 4 beatitudes + 4 woes", "Matthew's version is much longer (3 chapters vs 1)", "Luke's beatitudes are 2nd person 'you'; Matthew's are 3rd person 'they'"],
      location: { label: "Mount of Beatitudes, Galilee", lat: 32.879, lng: 35.551 },
    },
    { slug: "centurions-servant", title: "Healing the Centurion's Servant", subtitle: "I have not found so great faith in all Israel", dateApprox: "c. AD 28", convergenceScore: 3, era: "galilean",
      accounts: [
        { gospel: "matthew", reference: "Matthew 8:5-13" },
        { gospel: "luke", reference: "Luke 7:1-10" },
        { gospel: "john", reference: "John 4:46-54" },
      ],
      gapNotes: ["Matthew and Luke: centurion speaks directly; John: a 'royal official'", "Possibly the same event or different — scholars debate"],
      location: { label: "Capernaum", lat: 32.881, lng: 35.575 },
    },
    { slug: "calming-the-storm", title: "Calming the Storm", subtitle: "Peace, be still", dateApprox: "c. AD 28", convergenceScore: 3, era: "galilean",
      accounts: [
        { gospel: "matthew", reference: "Matthew 8:23-27" },
        { gospel: "mark", reference: "Mark 4:35-41" },
        { gospel: "luke", reference: "Luke 8:22-25" },
      ],
      gapNotes: ["Mark uniquely adds that Jesus was asleep 'on a cushion' — eyewitness detail (likely Peter's memory)"],
      location: { label: "Sea of Galilee", lat: 32.830, lng: 35.585 },
    },
    { slug: "feeding-5000", title: "Feeding the 5,000", subtitle: "The only miracle recorded in all four Gospels", dateApprox: "c. AD 29", convergenceScore: 4, era: "galilean",
      accounts: [
        { gospel: "matthew", reference: "Matthew 14:13-21" },
        { gospel: "mark", reference: "Mark 6:30-44" },
        { gospel: "luke", reference: "Luke 9:10-17" },
        { gospel: "john", reference: "John 6:1-14" },
      ],
      gapNotes: ["The only miracle besides the Resurrection recorded in all 4 Gospels", "John uniquely adds the boy with 5 loaves and 2 fish", "Mark's account is the most detailed — likely Peter's eyewitness"],
      location: { label: "Near Bethsaida, Galilee", lat: 32.907, lng: 35.632 },
    },
    { slug: "walking-on-water", title: "Walking on Water", subtitle: "Peter walks — then sinks", dateApprox: "c. AD 29", convergenceScore: 3, era: "galilean",
      accounts: [
        { gospel: "matthew", reference: "Matthew 14:22-33" },
        { gospel: "mark", reference: "Mark 6:45-52" },
        { gospel: "john", reference: "John 6:16-21" },
      ],
      gapNotes: ["Matthew uniquely includes Peter walking on water — then sinking", "Luke does not record this event at all"],
      location: { label: "Sea of Galilee", lat: 32.830, lng: 35.585 },
    },
    { slug: "transfiguration", title: "The Transfiguration", subtitle: "Moses and Elijah appear — the Voice speaks", dateApprox: "c. AD 29", convergenceScore: 3, era: "galilean",
      accounts: [
        { gospel: "matthew", reference: "Matthew 17:1-13" },
        { gospel: "mark", reference: "Mark 9:2-13" },
        { gospel: "luke", reference: "Luke 9:28-36" },
      ],
      gapNotes: ["Luke uniquely records that Moses and Elijah discussed the 'exodus' Jesus would accomplish in Jerusalem", "Peter, James, and John are the only witnesses"],
      location: { label: "Mount Hermon (traditional)", lat: 33.416, lng: 35.857 },
    },
    { slug: "raising-of-lazarus", title: "Raising of Lazarus", subtitle: "The 7th and greatest sign — unique to John", dateApprox: "c. AD 30", convergenceScore: 1, era: "galilean",
      accounts: [{ gospel: "john", reference: "John 11:1-44" }],
      gapNotes: ["Unique to John — the culminating sign that triggers the plot to kill Jesus", "Contains the shortest verse in the Bible: 'Jesus wept' (John 11:35)"],
      location: { label: "Bethany, near Jerusalem", lat: 31.770, lng: 35.257 },
    },
    { slug: "lords-prayer", title: "The Lord's Prayer", subtitle: "Our Father, who art in heaven", dateApprox: "c. AD 28", convergenceScore: 2, era: "galilean",
      accounts: [
        { gospel: "matthew", reference: "Matthew 6:9-13" },
        { gospel: "luke", reference: "Luke 11:1-4" },
      ],
      gapNotes: ["Matthew: part of the Sermon on the Mount; Luke: disciples ask 'teach us to pray'", "Matthew's version is longer and more liturgical; Luke's is shorter and more personal"],
    },
    { slug: "parables-of-kingdom", title: "Parables of the Kingdom", subtitle: "Sower, Mustard Seed, Wheat and Tares", dateApprox: "c. AD 28", convergenceScore: 3, era: "galilean",
      accounts: [
        { gospel: "matthew", reference: "Matthew 13:1-52" },
        { gospel: "mark", reference: "Mark 4:1-34" },
        { gospel: "luke", reference: "Luke 8:4-18" },
      ],
      gapNotes: ["Matthew records 7 parables; Mark 3; Luke 4", "The Parable of the Sower is in all three with variations"],
      location: { label: "Sea of Galilee shore", lat: 32.830, lng: 35.585 },
    },
    { slug: "calling-galilean-disciples", title: "Calling the First Disciples (Galilee)", subtitle: "Follow me and I will make you fishers of men", dateApprox: "c. AD 27", convergenceScore: 3, era: "galilean",
      accounts: [
        { gospel: "matthew", reference: "Matthew 4:18-22" },
        { gospel: "mark", reference: "Mark 1:16-20" },
        { gospel: "luke", reference: "Luke 5:1-11" },
      ],
      gapNotes: ["Luke adds the miraculous catch of fish before the calling", "John places an earlier encounter at the Jordan (John 1:35-51)"],
      location: { label: "Sea of Galilee, Capernaum", lat: 32.881, lng: 35.575 },
    },
    { slug: "nazareth-synagogue", title: "Rejected at Nazareth", subtitle: "The Spirit of the Lord is upon me", dateApprox: "c. AD 27", convergenceScore: 3, era: "galilean",
      accounts: [
        { gospel: "matthew", reference: "Matthew 13:54-58" },
        { gospel: "mark", reference: "Mark 6:1-6" },
        { gospel: "luke", reference: "Luke 4:16-30" },
      ],
      gapNotes: ["Luke places this early (programmatic opening); Matthew and Mark place it later", "Luke uniquely records Jesus reading Isaiah 61:1-2 and declaring 'Today this scripture is fulfilled'"],
      location: { label: "Nazareth Synagogue", lat: 32.699, lng: 35.304 },
    },
  ]);

  // ============================================================
  // ACT V — THE CONFRONTATION (14 scenes)
  // ============================================================
  await seedScenes(5, [
    { slug: "good-samaritan", title: "The Good Samaritan", subtitle: "Who is my neighbor?", dateApprox: "c. AD 29", convergenceScore: 1, era: "confrontation",
      accounts: [{ gospel: "luke", reference: "Luke 10:25-37" }],
    },
    { slug: "prodigal-son", title: "The Prodigal Son", subtitle: "The greatest parable — unique to Luke", dateApprox: "c. AD 29", convergenceScore: 1, era: "confrontation",
      accounts: [{ gospel: "luke", reference: "Luke 15:11-32" }],
    },
    { slug: "rich-young-ruler", title: "The Rich Young Ruler", subtitle: "Go, sell what you have", dateApprox: "c. AD 30", convergenceScore: 3, era: "confrontation",
      accounts: [
        { gospel: "matthew", reference: "Matthew 19:16-30" },
        { gospel: "mark", reference: "Mark 10:17-31" },
        { gospel: "luke", reference: "Luke 18:18-30" },
      ],
      gapNotes: ["Luke identifies him as a 'ruler'; Mark says Jesus 'loved him'"],
    },
    { slug: "zacchaeus", title: "Zacchaeus", subtitle: "The Son of Man came to seek and save the lost", dateApprox: "c. AD 30", convergenceScore: 1, era: "confrontation",
      accounts: [{ gospel: "luke", reference: "Luke 19:1-10" }],
      location: { label: "Jericho", lat: 31.871, lng: 35.444 },
    },
    { slug: "blind-bartimaeus", title: "Blind Bartimaeus", subtitle: "Jesus, Son of David, have mercy on me", dateApprox: "c. AD 30", convergenceScore: 3, era: "confrontation",
      accounts: [
        { gospel: "matthew", reference: "Matthew 20:29-34" },
        { gospel: "mark", reference: "Mark 10:46-52" },
        { gospel: "luke", reference: "Luke 18:35-43" },
      ],
      gapNotes: ["Mark names him — Bartimaeus son of Timaeus — eyewitness detail"],
      location: { label: "Jericho", lat: 31.871, lng: 35.444 },
    },
    { slug: "olivet-discourse", title: "The Olivet Discourse", subtitle: "Jesus's longest prophetic speech — end times, Temple destruction", dateApprox: "c. AD 30", convergenceScore: 3, era: "confrontation",
      accounts: [
        { gospel: "matthew", reference: "Matthew 24:1-25:46" },
        { gospel: "mark", reference: "Mark 13:1-37" },
        { gospel: "luke", reference: "Luke 21:5-36" },
      ],
      gapNotes: ["Matthew's version is the longest — includes parables of the 10 Virgins and Talents", "Luke adds 'Jerusalem surrounded by armies' — specific to the AD 70 destruction"],
      location: { label: "Mount of Olives, Jerusalem", lat: 31.778, lng: 35.245 },
    },
  ]);

  // ============================================================
  // ACT VI — THE PASSION: Holy Week (16 scenes)
  // ============================================================
  await seedScenes(6, [
    { slug: "triumphal-entry", title: "Triumphal Entry", subtitle: "Hosanna! Blessed is He who comes — Zechariah 9:9 fulfilled", dateApprox: "Sunday, Passion Week", convergenceScore: 4, era: "passion",
      accounts: [
        { gospel: "matthew", reference: "Matthew 21:1-11" },
        { gospel: "mark", reference: "Mark 11:1-11" },
        { gospel: "luke", reference: "Luke 19:28-44" },
        { gospel: "john", reference: "John 12:12-19" },
      ],
      location: { label: "Mount of Olives to Jerusalem", lat: 31.778, lng: 35.245 },
    },
    { slug: "temple-cleansing-late", title: "Cleansing the Temple (Passion Week)", subtitle: "My house shall be called a house of prayer", dateApprox: "Monday, Passion Week", convergenceScore: 3, era: "passion",
      accounts: [
        { gospel: "matthew", reference: "Matthew 21:12-17" },
        { gospel: "mark", reference: "Mark 11:15-19" },
        { gospel: "luke", reference: "Luke 19:45-48" },
      ],
      location: { label: "Temple, Jerusalem", lat: 31.778, lng: 35.235 },
    },
    { slug: "temple-debates", title: "Temple Debates", subtitle: "Pharisees, Sadducees, and Scribes challenge Jesus", dateApprox: "Tuesday, Passion Week", convergenceScore: 3, era: "passion",
      accounts: [
        { gospel: "matthew", reference: "Matthew 21:23-23:39" },
        { gospel: "mark", reference: "Mark 11:27-12:44" },
        { gospel: "luke", reference: "Luke 20:1-21:4" },
      ],
    },
    { slug: "widows-mite", title: "The Widow's Mite", subtitle: "She gave all she had", dateApprox: "Tuesday, Passion Week", convergenceScore: 2, era: "passion",
      accounts: [
        { gospel: "mark", reference: "Mark 12:41-44" },
        { gospel: "luke", reference: "Luke 21:1-4" },
      ],
    },
    { slug: "anointing-at-bethany", title: "Anointing at Bethany", subtitle: "She has done a beautiful thing", dateApprox: "Wednesday, Passion Week", convergenceScore: 3, era: "passion",
      accounts: [
        { gospel: "matthew", reference: "Matthew 26:6-13" },
        { gospel: "mark", reference: "Mark 14:3-9" },
        { gospel: "john", reference: "John 12:1-8" },
      ],
      gapNotes: ["John names Mary of Bethany; Matthew and Mark say 'a woman'", "John says Judas objected to the expense"],
      location: { label: "Bethany", lat: 31.770, lng: 35.257 },
    },
    { slug: "judas-betrayal-agreement", title: "Judas Agrees to Betray", subtitle: "30 pieces of silver — Zechariah 11:12 fulfilled", dateApprox: "Wednesday, Passion Week", convergenceScore: 3, era: "passion",
      accounts: [
        { gospel: "matthew", reference: "Matthew 26:14-16" },
        { gospel: "mark", reference: "Mark 14:10-11" },
        { gospel: "luke", reference: "Luke 22:3-6" },
      ],
    },
    { slug: "last-supper", title: "The Last Supper", subtitle: "Passover Seder — This is my body, this is my blood", dateApprox: "Thursday, Passion Week", convergenceScore: 4, era: "passion",
      accounts: [
        { gospel: "matthew", reference: "Matthew 26:17-30" },
        { gospel: "mark", reference: "Mark 14:12-26" },
        { gospel: "luke", reference: "Luke 22:7-38" },
        { gospel: "john", reference: "John 13:1-17:26" },
      ],
      gapNotes: ["John records the Foot Washing instead of the institution of communion", "John 13-17 is the Upper Room Discourse — Jesus's longest recorded teaching"],
      location: { label: "Upper Room, Jerusalem", lat: 31.772, lng: 35.229 },
    },
    { slug: "gethsemane", title: "Gethsemane", subtitle: "Not my will, but Yours be done", dateApprox: "Thursday night, Passion Week", convergenceScore: 3, era: "passion",
      accounts: [
        { gospel: "matthew", reference: "Matthew 26:36-46" },
        { gospel: "mark", reference: "Mark 14:32-42" },
        { gospel: "luke", reference: "Luke 22:39-46" },
      ],
      gapNotes: ["Luke uniquely records an angel strengthening Jesus and His sweat as drops of blood"],
      location: { label: "Garden of Gethsemane", lat: 31.779, lng: 35.240 },
    },
    { slug: "the-arrest", title: "The Arrest", subtitle: "Judas's kiss — the mob comes", dateApprox: "Thursday night, Passion Week", convergenceScore: 4, era: "passion",
      accounts: [
        { gospel: "matthew", reference: "Matthew 26:47-56" },
        { gospel: "mark", reference: "Mark 14:43-52" },
        { gospel: "luke", reference: "Luke 22:47-53" },
        { gospel: "john", reference: "John 18:1-12" },
      ],
      gapNotes: ["John names Malchus as the servant whose ear was cut off", "Mark mentions a young man who fled naked — possibly Mark himself"],
      location: { label: "Garden of Gethsemane", lat: 31.779, lng: 35.240 },
    },
    { slug: "the-trials", title: "The Trials", subtitle: "Annas, Caiaphas, Pilate, Herod, Pilate again", dateApprox: "Friday, Passion Week", convergenceScore: 4, era: "passion",
      accounts: [
        { gospel: "matthew", reference: "Matthew 26:57-27:26" },
        { gospel: "mark", reference: "Mark 14:53-15:15" },
        { gospel: "luke", reference: "Luke 22:54-23:25" },
        { gospel: "john", reference: "John 18:13-19:16" },
      ],
      gapNotes: ["Only Luke records the trial before Herod Antipas", "Only John records the extended dialogue between Jesus and Pilate about truth and kingship"],
      location: { label: "Jerusalem — multiple locations", lat: 31.778, lng: 35.235 },
    },
    { slug: "the-crucifixion", title: "The Crucifixion", subtitle: "The 7 Last Words from the Cross", dateApprox: "Friday, Passion Week", convergenceScore: 4, era: "passion",
      accounts: [
        { gospel: "matthew", reference: "Matthew 27:27-56" },
        { gospel: "mark", reference: "Mark 15:16-41" },
        { gospel: "luke", reference: "Luke 23:26-49" },
        { gospel: "john", reference: "John 19:16-37" },
      ],
      gapNotes: [
        "Each gospel records different Last Words — together they give us all 7",
        "Luke uniquely records: 'Father, forgive them' and the repentant thief",
        "John uniquely records: 'Woman, behold thy son', 'I thirst', and 'It is finished'",
        "Matthew/Mark record: 'My God, my God, why hast thou forsaken me?'",
      ],
      location: { label: "Golgotha (Calvary), Jerusalem", lat: 31.778, lng: 35.229 },
    },
    { slug: "the-death", title: "The Death — Supernatural Events", subtitle: "The veil torn, earthquake, saints raised", dateApprox: "Friday, Passion Week", convergenceScore: 4, era: "passion",
      accounts: [
        { gospel: "matthew", reference: "Matthew 27:50-54" },
        { gospel: "mark", reference: "Mark 15:37-39" },
        { gospel: "luke", reference: "Luke 23:44-49" },
        { gospel: "john", reference: "John 19:30-37" },
      ],
      gapNotes: ["Matthew uniquely records the earthquake, torn veil, AND raised saints", "The centurion's confession appears in Matthew, Mark, and Luke"],
    },
    { slug: "the-burial", title: "The Burial", subtitle: "Joseph of Arimathea's new tomb", dateApprox: "Friday evening, Passion Week", convergenceScore: 4, era: "passion",
      accounts: [
        { gospel: "matthew", reference: "Matthew 27:57-66" },
        { gospel: "mark", reference: "Mark 15:42-47" },
        { gospel: "luke", reference: "Luke 23:50-56" },
        { gospel: "john", reference: "John 19:38-42" },
      ],
      gapNotes: ["John uniquely adds Nicodemus bringing 75 pounds of myrrh and aloes", "Matthew uniquely records the guard being posted at the tomb"],
      location: { label: "Garden Tomb, Jerusalem", lat: 31.784, lng: 35.230 },
    },
  ]);

  // ============================================================
  // ACT VII — THE VICTORY: Resurrection (9 scenes)
  // ============================================================
  await seedScenes(7, [
    { slug: "the-empty-tomb", title: "The Empty Tomb", subtitle: "He is not here — He is risen!", dateApprox: "Sunday, Resurrection", convergenceScore: 4, era: "resurrection",
      accounts: [
        { gospel: "matthew", reference: "Matthew 28:1-10" },
        { gospel: "mark", reference: "Mark 16:1-8" },
        { gospel: "luke", reference: "Luke 24:1-12" },
        { gospel: "john", reference: "John 20:1-10" },
      ],
      gapNotes: ["John names 'the other disciple' who outran Peter to the tomb", "Mark's original ending may stop at 16:8 — they 'said nothing to anyone, for they were afraid'"],
      location: { label: "Garden Tomb, Jerusalem", lat: 31.784, lng: 35.230 },
    },
    { slug: "mary-magdalene-risen", title: "Mary Magdalene Sees the Risen Christ", subtitle: "She mistakes Him for the gardener", dateApprox: "Sunday, Resurrection", convergenceScore: 1, era: "resurrection",
      accounts: [{ gospel: "john", reference: "John 20:11-18" }],
      location: { label: "Garden Tomb, Jerusalem", lat: 31.784, lng: 35.230 },
    },
    { slug: "road-to-emmaus", title: "The Road to Emmaus", subtitle: "Jesus expounds all the Scriptures about Himself", dateApprox: "Sunday, Resurrection", convergenceScore: 1, era: "resurrection",
      accounts: [{ gospel: "luke", reference: "Luke 24:13-35" }],
      location: { label: "Road to Emmaus", lat: 31.840, lng: 35.015 },
    },
    { slug: "appearance-no-thomas", title: "Appearance to the Disciples (without Thomas)", subtitle: "Peace be unto you — He breathes the Holy Spirit", dateApprox: "Sunday evening, Resurrection", convergenceScore: 2, era: "resurrection",
      accounts: [
        { gospel: "luke", reference: "Luke 24:36-49" },
        { gospel: "john", reference: "John 20:19-23" },
      ],
      gapNotes: ["John 20:22 — Jesus breathes on them, echoing Genesis 2:7"],
      location: { label: "Jerusalem, locked room", lat: 31.778, lng: 35.235 },
    },
    { slug: "appearance-to-thomas", title: "Appearance to Thomas", subtitle: "My Lord and my God", dateApprox: "One week after Resurrection", convergenceScore: 1, era: "resurrection",
      accounts: [{ gospel: "john", reference: "John 20:24-29" }],
    },
    { slug: "breakfast-on-beach", title: "Breakfast on the Beach", subtitle: "Peter's triple restoration mirrors his triple denial", dateApprox: "c. AD 30", convergenceScore: 1, era: "resurrection",
      accounts: [{ gospel: "john", reference: "John 21:1-19" }],
      location: { label: "Sea of Tiberias (Galilee)", lat: 32.830, lng: 35.585 },
    },
    { slug: "great-commission", title: "The Great Commission", subtitle: "Go and make disciples of all nations", dateApprox: "c. AD 30", convergenceScore: 4, era: "resurrection",
      accounts: [
        { gospel: "matthew", reference: "Matthew 28:16-20" },
        { gospel: "mark", reference: "Mark 16:14-18" },
        { gospel: "luke", reference: "Luke 24:44-49" },
        { gospel: "john", reference: "John 20:21-23" },
      ],
      gapNotes: ["Each gospel records a different commission — they are complementary, not contradictory"],
      location: { label: "A mountain in Galilee", lat: 32.80, lng: 35.50 },
    },
    { slug: "the-ascension", title: "The Ascension", subtitle: "He was taken up — a cloud received Him", dateApprox: "40 days after Resurrection", convergenceScore: 1, era: "resurrection",
      accounts: [{ gospel: "luke", reference: "Luke 24:50-53" }],
      gapNotes: ["Only Luke records the Ascension in detail (also in Acts 1:9-11)"],
      location: { label: "Bethany / Mount of Olives", lat: 31.778, lng: 35.245 },
    },
    { slug: "post-resurrection-summary", title: "Post-Resurrection Appearances Summary", subtitle: "The earliest written account — predates all four Gospels", dateApprox: "c. AD 53 (written)", convergenceScore: 0, era: "resurrection",
      gapNotes: ["1 Corinthians 15:3-8 is the earliest written resurrection account — written ~20 years after the event, while eyewitnesses were still alive"],
    },
  ]);

  console.log("\nAll Acts III-VII seeded!");
}

main()
  .then(() => process.exit(0))
  .catch((e) => { console.error("Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
