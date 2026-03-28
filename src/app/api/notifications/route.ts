import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getNotifications } from "@/lib/notifications/service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json([], { status: 200 });
  }

  const notifications = await getNotifications(session.user.id, 20);
  return NextResponse.json(notifications);
}
