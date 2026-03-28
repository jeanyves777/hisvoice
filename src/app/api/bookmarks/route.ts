import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { withErrorHandler } from "@/lib/errors/handler";

// GET — list user's bookmarks
export const GET = withErrorHandler(async () => {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json([], { status: 200 });

  const bookmarks = await db.bookmark.findMany({
    where: { userId: session.user.id },
    include: {
      scene: { select: { slug: true, title: true } },
      prophecy: { select: { slug: true, label: true } },
      source: { select: { slug: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookmarks);
});

// POST — create bookmark
export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sceneId, prophecyId, sourceId, note } = await req.json();

  const bookmark = await db.bookmark.create({
    data: {
      userId: session.user.id,
      sceneId: sceneId || null,
      prophecyId: prophecyId || null,
      sourceId: sourceId || null,
      note: note || null,
    },
  });

  return NextResponse.json(bookmark, { status: 201 });
});

// DELETE — remove bookmark
export const DELETE = withErrorHandler(async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await db.bookmark.deleteMany({
    where: { id, userId: session.user.id },
  });

  return NextResponse.json({ ok: true });
});
