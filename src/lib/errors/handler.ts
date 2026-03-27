import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendTelegramAlert } from "@/lib/telegram";

type ApiHandler = (
  req: NextRequest,
  context?: { params: Record<string, string> }
) => Promise<NextResponse>;

export function withErrorHandler(handler: ApiHandler): ApiHandler {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      const stack = error instanceof Error ? error.stack : undefined;
      const path = req.nextUrl.pathname;
      const ip = req.headers.get("x-forwarded-for") ?? req.ip ?? "unknown";
      const userAgent = req.headers.get("user-agent") ?? undefined;

      // Log to database
      try {
        await db.errorLog.create({
          data: {
            level: "ERROR",
            source: "api",
            message,
            stack,
            path,
            ip,
            userAgent,
          },
        });
      } catch {
        console.error("[ErrorHandler] Failed to log error to DB");
      }

      // Send to Telegram
      sendTelegramAlert("ERROR", message, { path, ip, stack, source: "api" }).catch(
        () => {}
      );

      console.error(`[API Error] ${path}:`, message);

      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 }
      );
    }
  };
}

export async function logError(
  level: "ERROR" | "WARN" | "CRITICAL",
  source: string,
  message: string,
  metadata?: {
    stack?: string;
    userId?: string;
    path?: string;
    ip?: string;
    userAgent?: string;
    extra?: Record<string, unknown>;
  }
) {
  try {
    await db.errorLog.create({
      data: {
        level,
        source,
        message,
        stack: metadata?.stack,
        userId: metadata?.userId,
        path: metadata?.path,
        ip: metadata?.ip,
        userAgent: metadata?.userAgent,
        metadata: metadata?.extra ? JSON.stringify(metadata.extra) : undefined,
      },
    });
  } catch {
    console.error("[logError] Failed to write to DB:", message);
  }

  if (level === "CRITICAL" || level === "ERROR") {
    sendTelegramAlert(level, message, {
      source,
      path: metadata?.path,
      userId: metadata?.userId,
      ip: metadata?.ip,
      stack: metadata?.stack,
    }).catch(() => {});
  }
}
