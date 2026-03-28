/**
 * Image Generation — Hybrid System
 *
 * PRIMARY: Stable Diffusion on VPS (via ComfyUI or Automatic1111 API)
 *   - Self-hosted, free, no cloud APIs
 *   - Generates photorealistic or artistic biblical illustrations
 *   - Models: Stable Diffusion XL, DreamShaper, etc.
 *
 * FALLBACK: Programmatic SVG illustrations
 *   - Instant, zero latency, works without VPS
 *   - Unique per topic (seeded from content hash)
 *
 * The system tries VPS first. If unavailable, falls back to SVG.
 * Generated images are cached in the database for reuse.
 */

import { generateIllustrationDataUri } from "@/lib/illustrations";

const SD_API_URL = process.env.SD_API_URL || "http://localhost:7860";

interface GenerateOptions {
  prompt: string;
  width?: number;
  height?: number;
  style?: "ancient" | "illuminated" | "realistic" | "cinematic";
}

const STYLE_PROMPTS: Record<string, string> = {
  ancient: "ancient middle eastern art style, parchment texture, gold leaf details, muted earth tones, manuscript illumination",
  illuminated: "medieval illuminated manuscript style, ornate borders, gold leaf, rich pigments, religious iconography, masterful detail",
  realistic: "photorealistic, dramatic cinematic lighting, biblical era, historically accurate clothing and architecture, 4k detailed",
  cinematic: "epic cinematic scene, dramatic lighting, volumetric rays, ancient middle east, film still quality, anamorphic lens",
};

/**
 * Check if Stable Diffusion API is available on VPS
 */
async function isSDAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${SD_API_URL}/sdapi/v1/options`, {
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Generate image via Stable Diffusion (Automatic1111 API)
 * Returns base64 image data or null
 */
async function generateWithSD(options: GenerateOptions): Promise<string | null> {
  const stylePrompt = STYLE_PROMPTS[options.style || "cinematic"];

  try {
    const res = await fetch(`${SD_API_URL}/sdapi/v1/txt2img`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `${options.prompt}, ${stylePrompt}, masterpiece, best quality`,
        negative_prompt: "text, watermark, logo, modern, contemporary, ugly, blurry, low quality, nsfw",
        width: options.width || 512,
        height: options.height || 320,
        steps: 25,
        cfg_scale: 7,
        sampler_name: "DPM++ 2M Karras",
        seed: -1,
      }),
      signal: AbortSignal.timeout(60000), // 60s for generation
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data.images?.[0]) {
      return `data:image/png;base64,${data.images[0]}`;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Smart image prompt generator based on topic/question
 */
function buildPrompt(topic: string): string {
  const t = topic.toLowerCase();

  if (t.includes("crucif") || t.includes("cross")) {
    return "Three crosses on a hill at sunset, dark sky with dramatic light breaking through clouds, ancient Jerusalem in background, first century Judea";
  }
  if (t.includes("resurrect") || t.includes("tomb") || t.includes("risen")) {
    return "Empty stone tomb with brilliant golden light emanating from within, rolled away stone, garden at dawn, first century Jerusalem";
  }
  if (t.includes("birth") || t.includes("nativity") || t.includes("bethlehem")) {
    return "Nativity scene in a humble stable, warm golden light, Mary and Joseph, star of Bethlehem shining above, ancient Bethlehem";
  }
  if (t.includes("baptis") || t.includes("jordan")) {
    return "Baptism scene at the Jordan River, dove descending from heaven, golden light from above, ancient river landscape";
  }
  if (t.includes("sermon") || t.includes("mount") || t.includes("teach")) {
    return "Teacher on a hillside addressing a crowd, green rolling hills of Galilee, warm afternoon light, first century clothing";
  }
  if (t.includes("last supper") || t.includes("passover")) {
    return "Ancient Middle Eastern upper room, long table with bread and wine, oil lamps, dramatic candlelight, twelve men gathered";
  }
  if (t.includes("prophec") || t.includes("scroll") || t.includes("isaiah")) {
    return "Ancient scroll unfurling with Hebrew text, golden light illuminating words, library of ancient manuscripts, mysterious atmosphere";
  }
  if (t.includes("exist") || t.includes("historical")) {
    return "Ancient stone inscription being examined, archaeological dig site, first century artifacts, warm desert lighting";
  }
  if (t.includes("quran") || t.includes("islam")) {
    return "Beautiful Islamic architectural interior with arabesque patterns, golden light, ancient manuscripts, scholarly atmosphere";
  }
  if (t.includes("roman") || t.includes("tacitus") || t.includes("pliny")) {
    return "Roman senator writing on papyrus in a marble-columned room, oil lamp, ancient Rome, scholarly setting";
  }
  if (t.includes("afterlife") || t.includes("consciousness") || t.includes("NDE")) {
    return "Ethereal tunnel of light, peaceful and luminous, boundary between worlds, soft golden glow, transcendent atmosphere";
  }
  if (t.includes("control") || t.includes("power")) {
    return "Ancient Christians in a Roman catacomb, humble gathering by candlelight, contrast between imperial power and simple faith";
  }
  if (t.includes("dead sea") || t.includes("qumran")) {
    return "Desert caves near the Dead Sea, ancient clay jars containing scrolls, dramatic desert landscape, archaeological discovery";
  }

  return `Biblical scene depicting ${topic}, ancient Middle Eastern setting, dramatic cinematic lighting, first century Judea`;
}

/**
 * Main function — generates an illustration for any topic.
 * Tries VPS Stable Diffusion first, falls back to SVG.
 */
export async function generateTopicImage(
  topic: string,
  options?: { style?: GenerateOptions["style"]; width?: number; height?: number }
): Promise<{ src: string; type: "ai" | "svg"; prompt?: string }> {
  const prompt = buildPrompt(topic);

  // Try Stable Diffusion on VPS
  const sdAvailable = await isSDAvailable();

  if (sdAvailable) {
    const image = await generateWithSD({
      prompt,
      width: options?.width || 512,
      height: options?.height || 320,
      style: options?.style || "cinematic",
    });

    if (image) {
      return { src: image, type: "ai", prompt };
    }
  }

  // Fallback to SVG
  const svgUri = generateIllustrationDataUri(topic, options?.width || 400, options?.height || 250);
  return { src: svgUri, type: "svg" };
}
