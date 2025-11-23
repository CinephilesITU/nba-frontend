import { Hero } from "@/components/hero"
import { Navigation } from "@/components/navigation"
import { StatsComparison } from "@/components/stats-comparison"
import { TeamStandings } from "@/components/team-standings"
import { TopPlayers } from "@/components/top-players"
import { LivePlayersPanel } from "@/components/live-players-panel"
import { getPlayersWithStats, getTeamsWithStats } from "@/lib/data-service"

export default function Home() {
  const players = getPlayersWithStats()
  const teams = getTeamsWithStats()
  const eastTeams = teams.filter((team) => team.conferenceid === 1)
  const westTeams = teams.filter((team) => team.conferenceid === 2)

  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <TopPlayers players={players} />
      <LivePlayersPanel />
      <TeamStandings eastTeams={eastTeams} westTeams={westTeams} />
      <StatsComparison players={players} />
    </main>
  )
}
