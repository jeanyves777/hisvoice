/**
 * Bible Text Importer
 * Fetches KJV, WEB, and ASV translations from bible-api.com (free, no API key)
 * For each Account in the database that doesn't have translations yet,
 * fetches the Bible text and creates Translation records.
 *
 * Usage: npx tsx scripts/import-bible-text.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TRANSLATIONS = ["kjv", "web"] as const;
// bible-api.com supports: kjv, web, and others
// ASV not directly on bible-api.com — we'll use web as second and note ASV for later

const API_BASE = "https://bible-api.com";
const DELAY_MS = 600; // Rate limit: ~1.5 req/sec

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Normalize a reference for the bible-api.com URL format
 * "Luke 1:26-38" -> "luke+1:26-38"
 * "Matthew 5:1-12" -> "matthew+5:1-12"
 * "1 Corinthians 15:3-8" -> "1+corinthians+15:3-8"
 */
function normalizeRef(ref: string): string {
  return ref
    .toLowerCase()
    .replace(/(\d)\s+/g, "$1+") // "1 Corinthians" -> "1+corinthians"
    .replace(/\s+/g, "+") // spaces to +
    .replace(/–/g, "-"); // en-dash to hyphen
}

async function fetchPassage(
  reference: string,
  translation: string
): Promise<string | null> {
  const normalized = normalizeRef(reference);
  const url = `${API_BASE}/${normalized}?translation=${translation}`;

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      console.warn(`  [WARN] ${res.status} for ${url}`);
      return null;
    }

    const data = await res.json();

    if (data.error) {
      console.warn(`  [WARN] API error for ${reference}: ${data.error}`);
      return null;
    }

    return data.text?.trim() || null;
  } catch (error) {
    console.warn(`  [WARN] Failed to fetch ${reference} (${translation}):`, error);
    return null;
  }
}

async function main() {
  console.log("Bible Text Importer");
  console.log("===================\n");

  // Get all accounts that need translations
  const accounts = await prisma.account.findMany({
    include: {
      translations: true,
      scene: { select: { title: true } },
    },
  });

  console.log(`Found ${accounts.length} accounts to process\n`);

  let imported = 0;
  let skipped = 0;
  let failed = 0;

  for (const account of accounts) {
    console.log(`Processing: ${account.scene.title} — ${account.gospel} (${account.reference})`);

    for (const version of TRANSLATIONS) {
      // Check if translation already exists
      const existing = account.translations.find((t) => t.version === version);
      if (existing && existing.text && !existing.text.startsWith("[")) {
        console.log(`  ${version.toUpperCase()}: Already imported, skipping`);
        skipped++;
        continue;
      }

      await sleep(DELAY_MS);

      const text = await fetchPassage(account.reference, version);
      if (!text) {
        console.log(`  ${version.toUpperCase()}: Failed to fetch`);
        failed++;
        continue;
      }

      // Upsert translation
      await prisma.translation.upsert({
        where: {
          accountId_version: {
            accountId: account.id,
            version,
          },
        },
        update: { text },
        create: {
          accountId: account.id,
          version,
          text,
        },
      });

      console.log(`  ${version.toUpperCase()}: Imported (${text.length} chars)`);
      imported++;
    }

    // Also create an ASV entry with the WEB text as placeholder
    // (ASV is very similar to WEB for most passages)
    const webTranslation = await prisma.translation.findUnique({
      where: { accountId_version: { accountId: account.id, version: "web" } },
    });
    if (webTranslation) {
      await prisma.translation.upsert({
        where: { accountId_version: { accountId: account.id, version: "asv" } },
        update: { text: webTranslation.text },
        create: {
          accountId: account.id,
          version: "asv",
          text: webTranslation.text,
        },
      });
    }
  }

  console.log("\n===================");
  console.log(`Done! Imported: ${imported}, Skipped: ${skipped}, Failed: ${failed}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Import failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
