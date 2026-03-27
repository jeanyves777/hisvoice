import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const [scenes, prophecies] = await Promise.all([
    db.scene.findMany({
      select: { slug: true, title: true, subtitle: true },
      orderBy: { sortOrder: "asc" },
    }),
    db.prophecy.findMany({
      select: { slug: true, label: true, reference: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const items = [
    ...scenes.map((s) => ({
      type: "scene" as const,
      slug: s.slug,
      title: s.title,
      subtitle: s.subtitle || undefined,
      href: `/scene/${s.slug}`,
    })),
    ...prophecies.map((p) => ({
      type: "prophecy" as const,
      slug: p.slug,
      title: p.label,
      subtitle: p.reference,
      href: `/prophecies/${p.slug}`,
    })),
  ];

  return NextResponse.json(items);
}
