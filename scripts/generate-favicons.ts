/**
 * Generate all favicon sizes from the SVG logo.
 * Run: npx tsx scripts/generate-favicons.ts
 */
import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const PUBLIC = join(process.cwd(), "public");
const SVG = readFileSync(join(PUBLIC, "logo-icon.svg"));

const SIZES = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "android-chrome-192x192.png", size: 192 },
  { name: "android-chrome-512x512.png", size: 512 },
  { name: "mstile-150x150.png", size: 150 },
];

async function main() {
  console.log("Generating favicons from logo-icon.svg...\n");

  for (const { name, size } of SIZES) {
    await sharp(SVG)
      .resize(size, size)
      .png()
      .toFile(join(PUBLIC, name));
    console.log(`  ${name} (${size}x${size})`);
  }

  // Generate ICO (use 32x32 PNG as base)
  const png32 = await sharp(SVG).resize(32, 32).png().toBuffer();
  // For a proper .ico we'd need a library, but we can use the 32x32 PNG
  // and rename. Most modern browsers accept PNG favicons.
  writeFileSync(join(PUBLIC, "favicon.ico"), png32);
  console.log("  favicon.ico (32x32 PNG)");

  console.log("\nDone! All favicons generated.");
}

main().catch(console.error);
