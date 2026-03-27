import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createNotification } from "@/lib/notifications/service";
import { sendEmail, welcomeEmailTemplate } from "@/lib/email";
import { sendTelegramAlert } from "@/lib/telegram";
import { withErrorHandler } from "@/lib/errors/handler";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { name, email, password, phone } = body;

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Name, email, and password are required" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  const existing = await db.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone: phone || null,
      role: "USER",
    },
  });

  // Welcome notification
  await createNotification(
    user.id,
    "WELCOME",
    "Welcome to His Voice",
    "Begin your journey through the most documented life in human history.",
    "/timeline"
  );

  // Welcome email
  const emailTemplate = welcomeEmailTemplate(name);
  sendEmail({ to: email, ...emailTemplate }).catch(() => {});

  // Telegram alert (new user)
  sendTelegramAlert("INFO", `New user registered: ${name} (${email})`, {
    source: "auth",
  }).catch(() => {});

  return NextResponse.json(
    { message: "Account created successfully", userId: user.id },
    { status: 201 }
  );
});
