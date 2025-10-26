import { Hero } from "@/components/hero"
import { TopPlayers } from "@/components/top-players"
import { TeamStandings } from "@/components/team-standings"
import { StatsComparison } from "@/components/stats-comparison"
import { Navigation } from "@/components/navigation"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <TopPlayers />
      <TeamStandings />
      <StatsComparison />
    </main>
  )
}
