import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getGeoFromIp } from "@/lib/tracking/geo";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fingerprint, browser, os, device, screenRes, language, referrer, utmSource, utmMedium, utmCampaign } = body;

    if (!fingerprint) {
      return NextResponse.json({ error: "Fingerprint required" }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.ip ?? "unknown";
    const geo = await getGeoFromIp(ip);

    const visitor = await db.analyticsVisitor.upsert({
      where: { fingerprint },
      update: {
        lastSeenAt: new Date(),
        ip,
        country: geo.country,
        city: geo.city,
        region: geo.region,
        browser,
        os,
        device,
        screenRes,
        language,
      },
      create: {
        fingerprint,
        ip,
        country: geo.country,
        city: geo.city,
        region: geo.region,
        browser,
        os,
        device,
        screenRes,
        language,
        referrer,
        utmSource,
        utmMedium,
        utmCampaign,
      },
    });

    // Create a new session
    const session = await db.analyticsSession.create({
      data: { visitorId: visitor.id },
    });

    return NextResponse.json({ visitorId: visitor.id, sessionId: session.id });
  } catch (error) {
    console.error("[Tracking] Identify error:", error);
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
  }
}
