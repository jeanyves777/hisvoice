import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, name, properties } = await req.json();
    if (!sessionId || !name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await db.analyticsEvent.create({
      data: {
        sessionId,
        name,
        properties: properties ? JSON.stringify(properties) : null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
