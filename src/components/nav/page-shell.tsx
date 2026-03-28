import { TopNav } from "./top-nav";
import { Footer } from "./footer";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <div className="min-h-[calc(100vh-4rem)]">{children}</div>
      <Footer />
    </>
  );
}
