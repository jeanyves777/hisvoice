import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  // Always return success to prevent email enumeration
  const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });

  if (user) {
    // Generate a reset token (stored as a simple hash for now)
    const token = crypto.randomBytes(32).toString("hex");
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    // In production, store token in DB with expiry. For now, send the link.
    const emailResult = await sendEmail({
      to: email,
      subject: "His Voice — Password Reset",
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #FAF6F0;">
          <h1 style="color: #8B6914; font-family: serif;">His Voice</h1>
          <p style="color: #2C2416;">You requested a password reset.</p>
          <p style="color: #2C2416;">Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; margin: 20px 0; padding: 12px 24px; background: #8B6914; color: white; text-decoration: none; border-radius: 8px;">Reset Password</a>
          <p style="color: #7A6C5A; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (!emailResult) {
      console.warn("[ForgotPassword] Email not configured — reset link:", resetUrl);
    }
  }

  return NextResponse.json({ ok: true });
}
