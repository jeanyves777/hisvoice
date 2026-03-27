import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

type UserRole = "ADMIN" | "STAFF" | "USER";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  return user;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role as UserRole)) {
    redirect("/");
  }
  return user;
}

export function isAdmin(role: string) {
  return role === "ADMIN";
}

export function isStaff(role: string) {
  return role === "ADMIN" || role === "STAFF";
}
