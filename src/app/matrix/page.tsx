import { TopNav } from "@/components/nav/top-nav";
import { MatrixGrid } from "./matrix-grid";

export const metadata = { title: "Universal Matrix" };

// The matrix data — hardcoded from the plan's Universal Matrix tables
// This is the cross-tradition comparison of how each tradition describes Jesus
const TRADITIONS = [
  { key: "gospels", label: "Gospels", color: "#C9A96E" },
  { key: "quran", label: "Quran", color: "#6BAE84" },
  { key: "talmud", label: "Talmud", color: "#5B8FD4" },
  { key: "gnostic", label: "Gnostic", color: "#A67EC8" },
  { key: "roman", label: "Roman/Greek", color: "#D4826B" },
  { key: "bahai", label: "Bah\u00e1'\u00ed", color: "#D4A853" },
  { key: "mandaean", label: "Mandaean", color: "#A67EC8" },
  { key: "manichaean", label: "Manichaean", color: "#D4826B" },
];

type CellStatus = "yes" | "no" | "partial" | "silent" | "unique";

interface MatrixRow {
  event: string;
  cells: Record<string, { status: CellStatus; note: string }>;
  agreementScore: number;
}

const MATRIX_DATA: MatrixRow[] = [
  {
    event: "Jesus existed as a person",
    agreementScore: 10,
    cells: {
      gospels: { status: "yes", note: "Central figure of all 4 Gospels" },
      quran: { status: "yes", note: "Named in 25 chapters, 93+ verses" },
      talmud: { status: "yes", note: "References 'Yeshu' — confirms existence" },
      gnostic: { status: "yes", note: "Central figure in all Gnostic gospels" },
      roman: { status: "yes", note: "Tacitus, Pliny, Josephus all confirm" },
      bahai: { status: "yes", note: "Manifestation of God" },
      mandaean: { status: "yes", note: "Referenced in Ginza Rabba" },
      manichaean: { status: "yes", note: "'Jesus the Luminous'" },
    },
  },
  {
    event: "Virgin birth",
    agreementScore: 5,
    cells: {
      gospels: { status: "yes", note: "Matthew 1:18-25; Luke 1:26-38" },
      quran: { status: "yes", note: "Surah 19:16-35 — detailed account" },
      talmud: { status: "no", note: "Denied — called 'illegitimate'" },
      gnostic: { status: "partial", note: "Some affirm, some deny" },
      roman: { status: "silent", note: "Not mentioned directly" },
      bahai: { status: "yes", note: "Affirmed — spiritual meaning emphasized" },
      mandaean: { status: "silent", note: "Not mentioned in surviving texts" },
      manichaean: { status: "yes", note: "'Jesus born of a virgin'" },
    },
  },
  {
    event: "Performed miracles",
    agreementScore: 7,
    cells: {
      gospels: { status: "yes", note: "Extensive — healing, raising dead, nature miracles" },
      quran: { status: "yes", note: "Surah 3:49 — healed blind, raised dead, clay birds" },
      talmud: { status: "yes", note: "Acknowledged as real but called 'sorcery'" },
      gnostic: { status: "yes", note: "Expanded supernatural miracles" },
      roman: { status: "yes", note: "Celsus admits miracles but calls them sorcery" },
      bahai: { status: "yes", note: "Affirmed — 'divine power'" },
      mandaean: { status: "silent", note: "Not detailed in surviving texts" },
      manichaean: { status: "yes", note: "'Miracles of the Luminous One'" },
    },
  },
  {
    event: "Had followers / disciples",
    agreementScore: 8,
    cells: {
      gospels: { status: "yes", note: "12 named disciples in all 4 Gospels" },
      quran: { status: "yes", note: "'al-Hawariyyun' — the disciples" },
      talmud: { status: "yes", note: "5 disciples named in Sanhedrin 43a" },
      gnostic: { status: "yes", note: "Named differently in various texts" },
      roman: { status: "yes", note: "Pliny confirms 'Christians' as movement" },
      bahai: { status: "yes", note: "Acknowledged as historical" },
      mandaean: { status: "yes", note: "Referenced indirectly" },
      manichaean: { status: "yes", note: "Followers of 'Jesus the Splendour'" },
    },
  },
  {
    event: "Crucifixion",
    agreementScore: 6,
    cells: {
      gospels: { status: "yes", note: "All 4 Gospels — central event" },
      quran: { status: "no", note: "Surah 4:157 — 'they did not kill him'" },
      talmud: { status: "yes", note: "'Hanged on Passover eve' — Sanhedrin 43a" },
      gnostic: { status: "partial", note: "Some deny physical death (Docetism)" },
      roman: { status: "yes", note: "Tacitus: 'suffered extreme penalty under Pilate'" },
      bahai: { status: "yes", note: "Affirmed — spiritual meaning emphasized" },
      mandaean: { status: "silent", note: "Not mentioned in detail" },
      manichaean: { status: "partial", note: "Docetic view in some texts" },
    },
  },
  {
    event: "Resurrection",
    agreementScore: 2,
    cells: {
      gospels: { status: "yes", note: "All 4 Gospels + Paul (1 Cor 15)" },
      quran: { status: "silent", note: "Not affirmed (not denied explicitly)" },
      talmud: { status: "no", note: "Toledot Yeshu offers alternate explanation" },
      gnostic: { status: "partial", note: "Some affirm, some present differently" },
      roman: { status: "silent", note: "Pliny: worshipped 'as to a god'" },
      bahai: { status: "partial", note: "Affirmed spiritually, not physically" },
      mandaean: { status: "silent", note: "Not mentioned" },
      manichaean: { status: "silent", note: "Not mentioned" },
    },
  },
  {
    event: "Ascension to heaven",
    agreementScore: 3,
    cells: {
      gospels: { status: "yes", note: "Luke 24:51; Acts 1:9" },
      quran: { status: "yes", note: "Surah 4:158 — 'Allah raised him up'" },
      talmud: { status: "silent", note: "Not mentioned" },
      gnostic: { status: "partial", note: "Some describe mystical ascension" },
      roman: { status: "silent", note: "Not mentioned directly" },
      bahai: { status: "yes", note: "Affirmed" },
      mandaean: { status: "silent", note: "Not mentioned" },
      manichaean: { status: "silent", note: "Not mentioned" },
    },
  },
  {
    event: "Second Coming",
    agreementScore: 4,
    cells: {
      gospels: { status: "yes", note: "Matthew 24-25; Revelation 19" },
      quran: { status: "yes", note: "Hadith: returns at end of days" },
      talmud: { status: "silent", note: "Not applicable" },
      gnostic: { status: "silent", note: "Not a focus in surviving texts" },
      roman: { status: "silent", note: "Not applicable" },
      bahai: { status: "yes", note: "Jesus returns 'in glory of the Father'" },
      mandaean: { status: "silent", note: "Not applicable" },
      manichaean: { status: "silent", note: "Not central" },
    },
  },
  {
    event: "Called Messiah / Christ",
    agreementScore: 3,
    cells: {
      gospels: { status: "yes", note: "Central claim of all 4 Gospels" },
      quran: { status: "yes", note: "'al-Masih' — used 11 times" },
      talmud: { status: "no", note: "Denied — Messiah has not come" },
      gnostic: { status: "partial", note: "Some affirm, others reject" },
      roman: { status: "yes", note: "Tacitus: 'Christus'" },
      bahai: { status: "yes", note: "Manifestation of God" },
      mandaean: { status: "no", note: "Not affirmed" },
      manichaean: { status: "silent", note: "Not central" },
    },
  },
  {
    event: "Called Son of God",
    agreementScore: 2,
    cells: {
      gospels: { status: "yes", note: "Central — John 10:30, Col 1:15-20" },
      quran: { status: "no", note: "Denied — Surah 4:171, 9:30" },
      talmud: { status: "no", note: "Denied — blasphemy" },
      gnostic: { status: "partial", note: "Some affirm mystically" },
      roman: { status: "silent", note: "Pliny: worshipped 'as to a god'" },
      bahai: { status: "no", note: "'Son' is metaphorical, not literal" },
      mandaean: { status: "no", note: "Not affirmed" },
      manichaean: { status: "partial", note: "Divine figure, theology differs" },
    },
  },
  {
    event: "Called Word of God (Logos)",
    agreementScore: 3,
    cells: {
      gospels: { status: "yes", note: "John 1:1 — 'The Word was God'" },
      quran: { status: "yes", note: "'Kalimatullah' — Surah 4:171" },
      talmud: { status: "silent", note: "Not in this context" },
      gnostic: { status: "partial", note: "Some Gnostic texts affirm" },
      roman: { status: "silent", note: "Not mentioned" },
      bahai: { status: "yes", note: "'Word of God'" },
      mandaean: { status: "silent", note: "Not mentioned" },
      manichaean: { status: "silent", note: "Not mentioned" },
    },
  },
];

export default function MatrixPage() {
  return (
    <>
      <TopNav />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl text-gold mb-2 text-center">
          The Universal Matrix
        </h1>
        <p className="text-dim text-center font-body mb-2 max-w-2xl mx-auto">
          How every tradition in human history describes the same events of Jesus&apos;s life
          — the most comprehensive cross-tradition comparison ever assembled.
        </p>
        <p className="text-dim text-center font-ui text-xs mb-8">
          Green = confirms &middot; Red = denies &middot; Yellow = partial &middot; Gray = silent &middot; Blue = unique claim
        </p>
        <MatrixGrid traditions={TRADITIONS} rows={MATRIX_DATA} />
      </main>
    </>
  );
}
