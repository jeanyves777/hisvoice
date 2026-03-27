import { TopNav } from "@/components/nav/top-nav";
import { AnalyticsTracker } from "@/components/tracking/analytics-tracker";
import { CinematicHero } from "@/components/home/cinematic-hero";

export default function HomePage() {
  return (
    <>
      <AnalyticsTracker />
      <TopNav />
      <CinematicHero />
    </>
  );
}
