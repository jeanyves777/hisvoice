/**
 * Programmatic SVG Illustration Generator
 * Generates contextual, beautiful SVG art based on scene/topic data.
 * Zero external APIs. Pure math + SVG. Infinite variations.
 *
 * Each illustration is unique — generated from the topic's hash.
 */

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

// ============================================================
// SCENE TYPE DETECTION
// ============================================================

type SceneType =
  | "prophecy" | "nativity" | "baptism" | "teaching" | "miracle"
  | "parable" | "journey" | "confrontation" | "passion" | "crucifixion"
  | "resurrection" | "ascension" | "general";

function detectSceneType(topic: string): SceneType {
  const t = topic.toLowerCase();
  if (t.includes("prophec") || t.includes("isaiah") || t.includes("dead sea")) return "prophecy";
  if (t.includes("birth") || t.includes("nativity") || t.includes("manger") || t.includes("bethlehem")) return "nativity";
  if (t.includes("baptis") || t.includes("jordan")) return "baptism";
  if (t.includes("sermon") || t.includes("teach") || t.includes("beatitude") || t.includes("prayer")) return "teaching";
  if (t.includes("miracle") || t.includes("heal") || t.includes("feed") || t.includes("water") || t.includes("lazarus")) return "miracle";
  if (t.includes("parable") || t.includes("samaritan") || t.includes("prodigal") || t.includes("sower")) return "parable";
  if (t.includes("journey") || t.includes("emmaus") || t.includes("travel")) return "journey";
  if (t.includes("temple") || t.includes("debate") || t.includes("pharisee") || t.includes("confront")) return "confrontation";
  if (t.includes("passion") || t.includes("arrest") || t.includes("trial") || t.includes("gethsemane") || t.includes("supper")) return "passion";
  if (t.includes("crucif") || t.includes("cross") || t.includes("calvary") || t.includes("golgotha")) return "crucifixion";
  if (t.includes("resurrect") || t.includes("risen") || t.includes("tomb") || t.includes("alive")) return "resurrection";
  if (t.includes("ascen") || t.includes("heaven") || t.includes("commission")) return "ascension";
  return "general";
}

// ============================================================
// COLOR PALETTES BY SCENE TYPE
// ============================================================

const PALETTES: Record<SceneType, { bg: string; primary: string; secondary: string; accent: string }> = {
  prophecy:      { bg: "#0a0817", primary: "#D4826B", secondary: "#C9A96E", accent: "#F5C842" },
  nativity:      { bg: "#0a0a14", primary: "#F5C842", secondary: "#C9A96E", accent: "#6BAE84" },
  baptism:       { bg: "#060d14", primary: "#5B8FD4", secondary: "#6BAE84", accent: "#C9A96E" },
  teaching:      { bg: "#0a0908", primary: "#C9A96E", secondary: "#E8D5A3", accent: "#6BAE84" },
  miracle:       { bg: "#080a14", primary: "#A67EC8", secondary: "#F5C842", accent: "#5B8FD4" },
  parable:       { bg: "#0a0a06", primary: "#6BAE84", secondary: "#C9A96E", accent: "#D4A853" },
  journey:       { bg: "#0a0806", primary: "#D4A853", secondary: "#C9A96E", accent: "#6BAE84" },
  confrontation: { bg: "#0a0806", primary: "#D4826B", secondary: "#D4A853", accent: "#C9A96E" },
  passion:       { bg: "#0c0604", primary: "#8B2020", secondary: "#C9A96E", accent: "#D4826B" },
  crucifixion:   { bg: "#0a0404", primary: "#8B2020", secondary: "#C9A96E", accent: "#F5C842" },
  resurrection:  { bg: "#0a0a0a", primary: "#F5C842", secondary: "#C9A96E", accent: "#FFFFFF" },
  ascension:     { bg: "#06080e", primary: "#F5C842", secondary: "#5B8FD4", accent: "#C9A96E" },
  general:       { bg: "#080604", primary: "#C9A96E", secondary: "#E8D5A3", accent: "#F5C842" },
};

// ============================================================
// SVG GENERATORS
// ============================================================

function generateStars(rand: () => number, count: number, color: string): string {
  let stars = "";
  for (let i = 0; i < count; i++) {
    const x = rand() * 400;
    const y = rand() * 250;
    const r = rand() * 1.5 + 0.3;
    const opacity = rand() * 0.6 + 0.2;
    stars += `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${opacity}"/>`;
  }
  return stars;
}

function generateMountains(rand: () => number, color: string, yBase: number): string {
  let path = `M0,${yBase}`;
  let x = 0;
  while (x < 400) {
    const peakX = x + rand() * 60 + 20;
    const peakY = yBase - rand() * 80 - 30;
    path += ` L${peakX},${peakY}`;
    x = peakX + rand() * 40 + 10;
    const valleyY = yBase - rand() * 15;
    path += ` L${x},${valleyY}`;
  }
  path += ` L400,${yBase} Z`;
  return `<path d="${path}" fill="${color}" opacity="0.3"/>`;
}

function generateCross(palette: { primary: string; accent: string }): string {
  return `
    <line x1="200" y1="60" x2="200" y2="180" stroke="${palette.accent}" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
    <line x1="165" y1="95" x2="235" y2="95" stroke="${palette.accent}" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
    <circle cx="200" cy="95" r="35" fill="none" stroke="${palette.primary}" stroke-width="1" opacity="0.3"/>
  `;
}

function generateWaves(rand: () => number, color: string, y: number): string {
  let wave = `<path d="M0,${y}`;
  for (let x = 0; x <= 400; x += 20) {
    const cy = y + Math.sin(x * 0.05 + rand() * 3) * (rand() * 15 + 5);
    wave += ` Q${x + 10},${cy} ${x + 20},${y}`;
  }
  wave += `" fill="none" stroke="${color}" stroke-width="0.8" opacity="0.3"/>`;
  return wave;
}

function generateRays(cx: number, cy: number, color: string, count: number, rand: () => number): string {
  let rays = "";
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + rand() * 0.3;
    const len = rand() * 60 + 40;
    const x2 = cx + Math.cos(angle) * len;
    const y2 = cy + Math.sin(angle) * len;
    rays += `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="0.5" opacity="${rand() * 0.3 + 0.1}"/>`;
  }
  return rays;
}

// ============================================================
// MAIN GENERATOR
// ============================================================

export function generateIllustration(topic: string, width = 400, height = 250): string {
  const type = detectSceneType(topic);
  const palette = PALETTES[type];
  const seed = hashString(topic);
  const rand = seededRandom(seed);

  let elements = "";

  // Background gradient
  elements += `<defs><linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="${palette.bg}"/>
    <stop offset="100%" stop-color="${palette.bg}" stop-opacity="0.8"/>
  </linearGradient></defs>`;
  elements += `<rect width="${width}" height="${height}" fill="url(#bg)"/>`;

  // Stars (for most scenes)
  if (type !== "teaching" && type !== "confrontation") {
    elements += generateStars(rand, 30 + Math.floor(rand() * 30), palette.secondary);
  }

  // Scene-specific elements
  switch (type) {
    case "crucifixion":
    case "passion":
      elements += generateMountains(rand, "#1a0808", 220);
      elements += generateCross(palette);
      // Darkness overlay
      elements += `<rect width="${width}" height="${height}" fill="${palette.bg}" opacity="0.3"/>`;
      break;

    case "resurrection":
    case "ascension":
      elements += generateRays(200, 100, palette.primary, 24, rand);
      elements += `<circle cx="200" cy="100" r="40" fill="${palette.primary}" opacity="0.15"/>`;
      elements += `<circle cx="200" cy="100" r="20" fill="${palette.primary}" opacity="0.3"/>`;
      elements += generateMountains(rand, "#0a0a0a", 230);
      break;

    case "nativity":
      elements += generateMountains(rand, "#0a0808", 200);
      // Star of Bethlehem
      elements += `<circle cx="200" cy="50" r="4" fill="${palette.primary}"/>`;
      elements += generateRays(200, 50, palette.primary, 12, rand);
      break;

    case "baptism":
      elements += generateWaves(rand, palette.primary, 160);
      elements += generateWaves(rand, palette.secondary, 180);
      elements += generateWaves(rand, palette.primary, 200);
      // Dove
      elements += `<path d="M195,80 Q200,70 210,75 Q220,70 215,80 Q220,85 210,83 Q200,90 195,80Z" fill="${palette.accent}" opacity="0.6"/>`;
      break;

    case "teaching":
      elements += generateMountains(rand, "#0a0806", 210);
      // Scroll/tablet shape
      elements += `<rect x="160" y="60" width="80" height="100" rx="5" fill="none" stroke="${palette.primary}" stroke-width="1" opacity="0.4"/>`;
      // Text lines
      for (let i = 0; i < 5; i++) {
        const lineWidth = 40 + rand() * 25;
        elements += `<line x1="175" y1="${80 + i * 15}" x2="${175 + lineWidth}" y2="${80 + i * 15}" stroke="${palette.secondary}" stroke-width="0.8" opacity="0.3"/>`;
      }
      break;

    case "miracle":
      elements += generateWaves(rand, palette.primary, 190);
      elements += generateRays(200, 120, palette.accent, 16, rand);
      elements += `<circle cx="200" cy="120" r="25" fill="${palette.primary}" opacity="0.1"/>`;
      break;

    case "prophecy":
      // Scroll
      elements += `<rect x="130" y="50" width="140" height="150" rx="8" fill="none" stroke="${palette.primary}" stroke-width="1.5" opacity="0.5"/>`;
      elements += `<ellipse cx="130" cy="125" rx="8" ry="75" fill="${palette.bg}" stroke="${palette.primary}" stroke-width="1" opacity="0.5"/>`;
      elements += `<ellipse cx="270" cy="125" rx="8" ry="75" fill="${palette.bg}" stroke="${palette.primary}" stroke-width="1" opacity="0.5"/>`;
      // Text lines on scroll
      for (let i = 0; i < 7; i++) {
        const w = 60 + rand() * 40;
        elements += `<line x1="155" y1="${70 + i * 17}" x2="${155 + w}" y2="${70 + i * 17}" stroke="${palette.secondary}" stroke-width="0.6" opacity="0.3"/>`;
      }
      elements += generateStars(rand, 20, palette.accent);
      break;

    default:
      elements += generateMountains(rand, palette.primary + "20", 210);
      elements += generateMountains(rand, palette.secondary + "15", 230);
      break;
  }

  // Border glow
  elements += `<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="8" fill="none" stroke="${palette.primary}" stroke-width="0.5" opacity="0.2"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${elements}</svg>`;
}

/**
 * Generate a data URI for use in img src
 */
export function generateIllustrationDataUri(topic: string, width = 400, height = 250): string {
  const svg = generateIllustration(topic, width, height);
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
