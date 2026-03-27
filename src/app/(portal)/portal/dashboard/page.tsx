import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;

  const [bookmarkCount, notifCount] = await Promise.all([
    db.bookmark.count({ where: { userId: user?.id } }),
    db.notification.count({ where: { userId: user?.id, readAt: null } }),
  ]);

  return (
    <div>
      <h1 className="font-heading text-2xl text-parchment mb-6">
        Welcome back, {user?.name?.split(" ")[0]}
      </h1>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="p-4 bg-surface rounded-lg border">
          <p className="font-ui text-2xl text-gold">{bookmarkCount}</p>
          <p className="font-ui text-sm text-dim">Bookmarks</p>
        </div>
        <div className="p-4 bg-surface rounded-lg border">
          <p className="font-ui text-2xl text-gold">{notifCount}</p>
          <p className="font-ui text-sm text-dim">Unread Notifications</p>
        </div>
        <div className="p-4 bg-surface rounded-lg border">
          <p className="font-ui text-2xl text-gold">113</p>
          <p className="font-ui text-sm text-dim">Scenes to Explore</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Link href="/timeline" className="px-4 py-2 bg-[rgb(var(--gold))] text-white rounded-md font-ui text-sm">
          Continue Journey
        </Link>
        <Link href="/portal/settings" className="px-4 py-2 border border-gold text-gold rounded-md font-ui text-sm">
          Settings
        </Link>
        {(user?.role === "ADMIN" || user?.role === "STAFF") && (
          <Link href="/portal/admin/users" className="px-4 py-2 border text-dim rounded-md font-ui text-sm">
            Admin Panel
          </Link>
        )}
      </div>
    </div>
  );
}
