/**
 * Bible Text Importer — Smart Batch Edition
 * Handles multi-chapter references by splitting into chapter-by-chapter requests.
 * Retries on 429 with exponential backoff.
 * Fetches KJV + WEB, mirrors WEB as ASV.
 *
 * Usage: npx tsx scripts/import-bible-text.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const API_BASE = "https://bible-api.com";
const TRANSLATIONS = ["kjv", "web"] as const;
const BASE_DELAY = 1500;
const MAX_RETRIES = 3;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizeRef(ref: string): string {
  return ref
    .toLowerCase()
    .replace(/(\d)\s+/g, "$1+")
    .replace(/\s+/g, "+")
    .replace(/–/g, "-");
}

/**
 * Parse a reference like "Matthew 5:1-7:29" into its parts.
 * Returns { book, startChapter, startVerse, endChapter, endVerse }
 */
function parseReference(ref: string): {
  book: string;
  startChapter: number;
  startVerse: number;
  endChapter: number;
  endVerse: number;
} | null {
  // Match patterns like:
  // "Matthew 5:1-7:29" (cross-chapter)
  // "Luke 22:54-23:25" (cross-chapter)
  // "John 3:1-21" (single chapter)
  // "Mark 1:9-11" (single chapter)
  // "1 Corinthians 15:3-8" (numbered book)
  const match = ref.match(
    /^(\d?\s*[A-Za-z]+)\s+(\d+):(\d+)\s*-\s*(?:(\d+):)?(\d+)$/
  );
  if (!match) return null;

  const book = match[1].trim();
  const startChapter = parseInt(match[2]);
  const startVerse = parseInt(match[3]);
  const endChapter = match[4] ? parseInt(match[4]) : startChapter;
  const endVerse = parseInt(match[5]);

  return { book, startChapter, startVerse, endChapter, endVerse };
}

/**
 * Split a multi-chapter reference into individual chapter requests.
 * "Matthew 5:1-7:29" becomes:
 *   ["Matthew 5", "Matthew 6", "Matthew 7:1-29"]
 * Single-chapter refs stay as-is.
 */
function splitReference(ref: string): string[] {
  const parsed = parseReference(ref);
  if (!parsed) return [ref]; // Can't parse, try as-is

  const { book, startChapter, startVerse, endChapter, endVerse } = parsed;

  // Single chapter — no splitting needed
  if (startChapter === endChapter) {
    return [ref];
  }

  // Multi-chapter — split into per-chapter requests
  const chunks: string[] = [];

  for (let ch = startChapter; ch <= endChapter; ch++) {
    if (ch === startChapter && startVerse > 1) {
      // First chapter: start from specific verse to end of chapter
      chunks.push(`${book} ${ch}:${startVerse}-200`); // 200 = "to end"
    } else if (ch === endChapter) {
      // Last chapter: from verse 1 to specific end verse
      chunks.push(`${book} ${ch}:1-${endVerse}`);
    } else {
      // Middle chapters: fetch entire chapter
      chunks.push(`${book} ${ch}`);
    }
  }

  return chunks;
}

/**
 * Fetch a passage with retry and exponential backoff.
 */
async function fetchWithRetry(
  reference: string,
  translation: string,
  attempt = 1
): Promise<string | null> {
  const normalized = normalizeRef(reference);
  const url = `${API_BASE}/${normalized}?translation=${translation}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });

    if (res.status === 429) {
      if (attempt <= MAX_RETRIES) {
        const wait = BASE_DELAY * Math.pow(2, attempt);
        console.log(`    [429] Rate limited, waiting ${wait}ms (retry ${attempt}/${MAX_RETRIES})`);
        await sleep(wait);
        return fetchWithRetry(reference, translation, attempt + 1);
      }
      return null;
    }

    if (!res.ok) {
      // Try without the verse range (fetch whole chapter)
      if (res.status === 400 && reference.includes(":")) {
        console.log(`    [400] Bad range, trying chapter-only...`);
        const chapterOnly = reference.replace(/:\d+.*$/, "");
        if (chapterOnly !== reference) {
          return fetchWithRetry(chapterOnly, translation, 1);
        }
      }
      return null;
    }

    const data = await res.json();
    if (data.error) return null;
    return data.text?.trim() || null;
  } catch {
    if (attempt <= MAX_RETRIES) {
      await sleep(BASE_DELAY * attempt);
      return fetchWithRetry(reference, translation, attempt + 1);
    }
    return null;
  }
}

/**
 * Fetch a full passage, splitting multi-chapter refs into chunks.
 */
async function fetchFullPassage(
  reference: string,
  translation: string
): Promise<string | null> {
  const chunks = splitReference(reference);

  if (chunks.length === 1) {
    // Simple single request
    await sleep(BASE_DELAY);
    return fetchWithRetry(chunks[0], translation);
  }

  // Multi-chapter: fetch each chunk and concatenate
  console.log(`    Splitting into ${chunks.length} chapter requests...`);
  const parts: string[] = [];

  for (const chunk of chunks) {
    await sleep(BASE_DELAY);
    const text = await fetchWithRetry(chunk, translation);
    if (text) {
      parts.push(text);
    } else {
      console.log(`    [MISS] Failed chunk: ${chunk}`);
    }
  }

  if (parts.length === 0) return null;
  return parts.join("\n\n");
}

async function main() {
  console.log("Bible Text Importer — Smart Batch Edition");
  console.log("==========================================\n");

  const accounts = await prisma.account.findMany({
    include: {
      translations: true,
      scene: { select: { title: true } },
    },
    orderBy: { sortOrder: "asc" },
  });

  console.log(`Total accounts: ${accounts.length}\n`);

  // Find accounts missing translations
  const needsWork = accounts.filter((a) => {
    const hasKjv = a.translations.some((t) => t.version === "kjv" && t.text && !t.text.startsWith("["));
    const hasWeb = a.translations.some((t) => t.version === "web" && t.text && !t.text.startsWith("["));
    return !hasKjv || !hasWeb;
  });

  console.log(`Accounts needing work: ${needsWork.length}\n`);

  let imported = 0;
  let failed = 0;

  for (const account of needsWork) {
    console.log(`\n[${account.scene.title}] ${account.gospel} — ${account.reference}`);

    for (const version of TRANSLATIONS) {
      const existing = account.translations.find((t) => t.version === version);
      if (existing && existing.text && !existing.text.startsWith("[")) {
        continue; // Already has text
      }

      const text = await fetchFullPassage(account.reference, version);

      if (!text) {
        console.log(`  ${version.toUpperCase()}: FAILED`);
        failed++;
        continue;
      }

      await prisma.translation.upsert({
        where: { accountId_version: { accountId: account.id, version } },
        update: { text },
        create: { accountId: account.id, version, text },
      });

      console.log(`  ${version.toUpperCase()}: OK (${text.length} chars)`);
      imported++;
    }

    // Mirror WEB as ASV
    const webText = await prisma.translation.findUnique({
      where: { accountId_version: { accountId: account.id, version: "web" } },
    });
    if (webText?.text) {
      await prisma.translation.upsert({
        where: { accountId_version: { accountId: account.id, version: "asv" } },
        update: { text: webText.text },
        create: { accountId: account.id, version: "asv", text: webText.text },
      });
    }
  }

  // Final check
  const stillMissing = await prisma.account.findMany({
    where: {
      translations: { none: { version: "kjv" } },
    },
    include: { scene: { select: { title: true } } },
  });

  console.log("\n==========================================");
  console.log(`Imported: ${imported}, Failed: ${failed}`);
  if (stillMissing.length > 0) {
    console.log(`\nStill missing KJV (${stillMissing.length}):`);
    stillMissing.forEach((a) => console.log(`  ${a.reference} — ${a.scene.title}`));
  } else {
    console.log("\nAll accounts have KJV text!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => { console.error("Import failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
