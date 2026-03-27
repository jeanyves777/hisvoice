import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, path, title } = await req.json();
    if (!sessionId || !path) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await db.analyticsPageView.create({
      data: { sessionId, path, title },
    });

    // Increment session page view count
    await db.analyticsSession.update({
      where: { id: sessionId },
      data: { pageViews: { increment: 1 } },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
