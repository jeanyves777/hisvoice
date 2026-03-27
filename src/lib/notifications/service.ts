import { db } from "@/lib/db";

type NotificationType =
  | "SYSTEM"
  | "WELCOME"
  | "BOOKMARK"
  | "AI_INSIGHT"
  | "CONTENT_UPDATE"
  | "ADMIN_ALERT"
  | "ERROR_ALERT";

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  content?: string,
  link?: string
) {
  return db.notification.create({
    data: { userId, type, title, content, link },
  });
}

export async function getUnreadCount(userId: string): Promise<number> {
  return db.notification.count({
    where: { userId, readAt: null },
  });
}

export async function getNotifications(userId: string, limit = 20) {
  return db.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function markAsRead(notificationId: string) {
  return db.notification.update({
    where: { id: notificationId },
    data: { readAt: new Date() },
  });
}

export async function markAllAsRead(userId: string) {
  return db.notification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: new Date() },
  });
}
