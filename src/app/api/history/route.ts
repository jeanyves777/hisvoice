import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// POST — track page visit
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ ok: false });

  const { path, title } = await req.json();
  if (!path) return NextResponse.json({ error: "Path required" }, { status: 400 });

  await db.explorationHistory.create({
    data: {
      userId: session.user.id,
      path,
      title: title || null,
    },
  });

  return NextResponse.json({ ok: true });
}

// GET — get user's history
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json([]);

  const history = await db.explorationHistory.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(history);
}
