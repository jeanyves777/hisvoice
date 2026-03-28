import { NextRequest, NextResponse } from "next/server";
import { generateTopicImage } from "@/lib/ai/image-gen";

/**
 * GET /api/intelligence/image?topic=crucifixion&style=cinematic
 * Generates an illustration for a topic.
 * Uses Stable Diffusion on VPS if available, SVG fallback otherwise.
 */
export async function GET(req: NextRequest) {
  const topic = req.nextUrl.searchParams.get("topic");
  const style = req.nextUrl.searchParams.get("style") as "ancient" | "illuminated" | "realistic" | "cinematic" | undefined;

  if (!topic) {
    return NextResponse.json({ error: "Topic required" }, { status: 400 });
  }

  const result = await generateTopicImage(topic, { style });

  return NextResponse.json({
    src: result.src,
    type: result.type,
    prompt: result.prompt,
  });
}
