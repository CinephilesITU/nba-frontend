import { Navigation } from "@/components/navigation"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TeamRankingsChart } from "@/components/team-rankings-chart"
import { getTeamById } from "@/lib/data-service"
import { ArrowLeft, Trophy } from "lucide-react"
import Link from "next/link"

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const teamId = Number(id)
  const team = getTeamById(teamId)

  if (!team) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Team Not Found</h1>
          <Link href="/" className="text-primary hover:underline">
            Return to Home
          </Link>
        </div>
      </main>
    )
  }

  const rankingData = [
    { category: "Def Rating", value: team.stats?.def_rating_rank ?? 0 },
    { category: "Def Reb", value: team.stats?.dreb_rank ?? 0 },
    { category: "Steals", value: team.stats?.stl_rank ?? 0 },
    { category: "Blocks", value: team.stats?.blk_rank ?? 0 },
  ]

  const opponentData = team.opponentStats

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 hover:gap-3 mb-8 animate-fade-in-up"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="lg:col-span-1 p-8 text-center animate-scale-in hover:shadow-2xl transition-all duration-300">
            <div className="w-48 h-48 mx-auto rounded-lg overflow-hidden bg-muted flex items-center justify-center mb-6 group">
              <img
                src={team.logourl || "/placeholder.svg"}
                alt={team.teamname}
                className="w-32 h-32 object-contain group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
              />
            </div>
            <h1 className="text-3xl font-bold mb-2 animate-fade-in-up">{team.teamname}</h1>
            <p className="text-muted-foreground mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              {team.conferencename} Conference
            </p>
            <div className="flex gap-2 justify-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 transition-colors">
                {team.teamabbreviation}
              </Badge>
              <Badge variant="outline" className="hover:bg-muted transition-colors">
                #{team.teamid}
              </Badge>
            </div>
          </Card>

          <Card
            className="lg:col-span-2 p-8 animate-fade-in-up hover:shadow-2xl transition-all duration-300"
            style={{ animationDelay: "0.1s" }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-primary animate-pulse" />
              Season Record
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="text-center p-4 rounded-lg bg-accent/10 border border-accent/30">
                <div className="text-3xl font-bold text-accent mb-1">{team.stats?.w ?? "-"}</div>
                <div className="text-sm text-muted-foreground">Wins</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                <div className="text-3xl font-bold text-destructive mb-1">{team.stats?.l ?? "-"}</div>
                <div className="text-sm text-muted-foreground">Losses</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/30">
                <div className="text-3xl font-bold text-primary mb-1">
                  {team.stats ? `${(team.stats.w_pct * 100).toFixed(1)}%` : "-"}
                </div>
                <div className="text-sm text-muted-foreground">Win %</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-secondary/10 border border-secondary/30">
                <div className="text-3xl font-bold text-secondary mb-1">{team.rank ?? "-"}</div>
                <div className="text-sm text-muted-foreground">Conference Rank</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted border border-border">
                <div className="text-3xl font-bold mb-1">{team.stats?.gp ?? "-"}</div>
                <div className="text-sm text-muted-foreground">Games</div>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="rankings" className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="rankings">Team Rankings</TabsTrigger>
            <TabsTrigger value="opponents">Opponent Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="rankings" className="space-y-8">
            <Card className="p-8 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-xl font-bold mb-6 text-center">Defensive Rankings</h3>
              <TeamRankingsChart data={rankingData} />
            </Card>
          </TabsContent>

          <TabsContent value="opponents" className="space-y-8">
            {opponentData ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{opponentData.opp_pts_off_tov.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Opponent Pts Off TO</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-secondary mb-1">{opponentData.opp_pts_2nd_chance.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Second Chance Pts</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-accent mb-1">{opponentData.opp_pts_paint.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Points in Paint</div>
                </Card>
              </div>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">Opponent statistics not available.</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {team.players && team.players.length > 0 && (
          <Card className="p-8 mt-8 animate-fade-in-up">
            <h3 className="text-2xl font-bold mb-6">Key Players</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {team.players.map((player) => (
                <Link key={player.playerid} href={`/player/${player.playerid}`}>
                  <Card className="p-4 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                        <img src={player.headshoturl} alt={player.playername} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold">{player.playername}</h4>
                        <p className="text-sm text-muted-foreground">{player.position}</p>
                        <div className="text-sm text-primary mt-2">
                          {player.regularSeason ? `${player.regularSeason.pts.toFixed(1)} PTS` : "-"}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </Card>
        )}
      </div>
    </main>
  )
}
