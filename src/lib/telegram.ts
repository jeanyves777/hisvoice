const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

type AlertLevel = "CRITICAL" | "ERROR" | "WARN" | "INFO";

const LEVEL_EMOJI: Record<AlertLevel, string> = {
  CRITICAL: "\u{1F534}",
  ERROR: "\u{1F7E0}",
  WARN: "\u{1F7E1}",
  INFO: "\u{1F535}",
};

let lastAlertTime = 0;
let alertCount = 0;
const RATE_LIMIT = 30; // max alerts per minute
const RATE_WINDOW = 60_000; // 1 minute

export async function sendTelegramAlert(
  level: AlertLevel,
  message: string,
  metadata?: {
    path?: string;
    userId?: string;
    ip?: string;
    stack?: string;
    source?: string;
  }
) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

  // Rate limiting
  const now = Date.now();
  if (now - lastAlertTime > RATE_WINDOW) {
    alertCount = 0;
    lastAlertTime = now;
  }
  if (alertCount >= RATE_LIMIT) return;
  alertCount++;

  const emoji = LEVEL_EMOJI[level];
  const timestamp = new Date().toISOString();

  let text = `${emoji} *HIS VOICE — ${level}*\n`;
  text += `\`${timestamp}\`\n\n`;
  text += `${message}\n`;

  if (metadata?.source) text += `\n*Source:* ${metadata.source}`;
  if (metadata?.path) text += `\n*Path:* ${metadata.path}`;
  if (metadata?.userId) text += `\n*User:* ${metadata.userId}`;
  if (metadata?.ip) text += `\n*IP:* ${metadata.ip}`;
  if (metadata?.stack) {
    const shortStack = metadata.stack.split("\n").slice(0, 5).join("\n");
    text += `\n\n\`\`\`\n${shortStack}\n\`\`\``;
  }

  try {
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: "Markdown",
        }),
      }
    );
  } catch {
    // Silently fail — don't crash the app if Telegram is unreachable
    console.error("[Telegram] Failed to send alert");
  }
}
