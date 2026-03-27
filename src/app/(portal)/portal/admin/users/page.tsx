import { requireRole } from "@/lib/auth-utils";
import { db } from "@/lib/db";

export const metadata = { title: "Admin — Users" };

export default async function AdminUsersPage() {
  await requireRole(["ADMIN"]);

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });

  return (
    <div>
      <h1 className="font-heading text-2xl text-parchment mb-6">User Management</h1>
      <p className="text-dim font-ui text-sm mb-4">{users.length} total users</p>

      <div className="bg-surface rounded-lg border overflow-hidden">
        <table className="w-full font-ui text-sm">
          <thead>
            <tr className="border-b text-dim text-left">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last Login</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b last:border-0 hover:bg-primary/50">
                <td className="px-4 py-3 text-parchment">{u.name}</td>
                <td className="px-4 py-3 text-dim">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded ${u.role === "ADMIN" ? "bg-[rgb(var(--gold)/.1)] text-gold" : "bg-primary text-dim"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={u.isActive ? "text-luke" : "text-prophecy"}>
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-dim">
                  {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : "Never"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
