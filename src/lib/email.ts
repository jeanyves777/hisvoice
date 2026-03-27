import nodemailer from "nodemailer";

const transporter =
  process.env.SMTP_HOST
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "465"),
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    : null;

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!transporter) {
    console.warn("[Email] SMTP not configured — skipping email send");
    return false;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@hisvoice.app",
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    return true;
  } catch (error) {
    console.error("[Email] Failed to send:", error);
    return false;
  }
}

export function welcomeEmailTemplate(name: string): { subject: string; html: string } {
  return {
    subject: "Welcome to His Voice",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #FAF6F0;">
        <h1 style="color: #8B6914; font-family: serif;">His Voice</h1>
        <p style="color: #2C2416; font-size: 16px;">Welcome, ${name}!</p>
        <p style="color: #2C2416; font-size: 16px;">
          You now have access to the most comprehensive collection of historical
          witnesses to the life of Jesus ever assembled — from the Gospels to the
          Quran, from the Dead Sea Scrolls to Roman historians.
        </p>
        <p style="color: #7A6C5A; font-size: 14px;">
          Begin your journey at <a href="${process.env.NEXTAUTH_URL}/timeline" style="color: #8B6914;">the Timeline</a>.
        </p>
      </div>
    `,
  };
}
