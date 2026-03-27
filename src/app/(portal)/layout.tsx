import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TopNav } from "@/components/nav/top-nav";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  return (
    <>
      <TopNav />
      <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
    </>
  );
}
