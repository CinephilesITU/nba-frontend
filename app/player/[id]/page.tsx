import { PlayerComparisonChart } from "@/components/player-comparison-chart"
import { PlayerRadarChart } from "@/components/player-radar-chart"
import { Navigation } from "@/components/navigation"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getPlayerById } from "@/lib/data-service"
import { Activity, ArrowLeft, TrendingUp } from "lucide-react"
import Link from "next/link"

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const playerId = Number(id)
  const player = getPlayerById(playerId)

  if (!player) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Player Not Found</h1>
          <Link href="/" className="text-primary hover:underline">
            Return to Home
          </Link>
        </div>
      </main>
    )
  }

  const regularStats = player.regularSeason
  const playoffStats = player.playoffs
  const efficiencyScore = regularStats
    ? (regularStats.pts + regularStats.ast + regularStats.reb).toFixed(1)
    : "-"

  const seasonComparisonData = [
    {
      category: "Points",
      regular: regularStats?.pts ?? 0,
      playoffs: playoffStats?.pts ?? 0,
    },
    {
      category: "Assists",
      regular: regularStats?.ast ?? 0,
      playoffs: playoffStats?.ast ?? 0,
    },
    {
      category: "Rebounds",
      regular: regularStats?.reb ?? 0,
      playoffs: playoffStats?.reb ?? 0,
    },
  ]

  const radarData = [
    {
      stat: "Points",
      value: ((regularStats?.pts ?? 0) / 35) * 100,
    },
    {
      stat: "Assists",
      value: ((regularStats?.ast ?? 0) / 12) * 100,
    },
    {
      stat: "Rebounds",
      value: ((regularStats?.reb ?? 0) / 15) * 100,
    },
    {
      stat: "Playoff Points",
      value: ((playoffStats?.pts ?? 0) / 35) * 100,
    },
    {
      stat: "Games Played",
      value: ((regularStats?.gp ?? 0) / 82) * 100,
    },
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 hover:gap-3 mb-8 animate-fade-in-up group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:animate-pulse" />
          <span className="font-medium">Back to Home</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="lg:col-span-1 p-8 animate-scale-in hover:shadow-2xl transition-all duration-300">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-6 group">
              <img
                src={player.headshoturl || "/placeholder.svg"}
                alt={player.playername}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2 animate-fade-in-up">{player.playername}</h1>
              <p className="text-muted-foreground mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                {player.team?.teamname ?? "Unknown Team"}
              </p>
              <div className="flex gap-2 justify-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 transition-colors">
                  {player.position}
                </Badge>
                <Badge variant="outline" className="hover:bg-muted transition-colors">
                  #{player.playerid}
                </Badge>
              </div>
            </div>
          </Card>

          <Card
            className="lg:col-span-2 p-8 animate-fade-in-up hover:shadow-2xl transition-all duration-300"
            style={{ animationDelay: "0.1s" }}
          >
            <h2 className="text-2xl font-bold mb-6">Season Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div
                className="text-center p-4 rounded-lg bg-primary/10 border border-primary/30 hover:scale-110 hover:bg-primary/20 transition-all duration-300 cursor-pointer animate-scale-in"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="text-3xl font-bold text-primary mb-1">{regularStats?.pts?.toFixed(1) ?? "-"}</div>
                <div className="text-sm text-muted-foreground">PPG</div>
              </div>
              <div
                className="text-center p-4 rounded-lg bg-secondary/10 border border-secondary/30 hover:scale-110 hover:bg-secondary/20 transition-all duration-300 cursor-pointer animate-scale-in"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="text-3xl font-bold text-secondary mb-1">{regularStats?.ast?.toFixed(1) ?? "-"}</div>
                <div className="text-sm text-muted-foreground">APG</div>
              </div>
              <div
                className="text-center p-4 rounded-lg bg-accent/10 border border-accent/30 hover:scale-110 hover:bg-accent/20 transition-all duration-300 cursor-pointer animate-scale-in"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="text-3xl font-bold text-accent mb-1">{regularStats?.reb?.toFixed(1) ?? "-"}</div>
                <div className="text-sm text-muted-foreground">RPG</div>
              </div>
              <div
                className="text-center p-4 rounded-lg bg-muted border border-border hover:scale-110 hover:bg-muted/80 transition-all duration-300 cursor-pointer animate-scale-in"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="text-3xl font-bold mb-1 flex items-center justify-center gap-1">
                  {efficiencyScore}
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <div className="text-sm text-muted-foreground">EFF Score</div>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="regular" className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="regular" className="transition-all duration-300">
              Regular Season
            </TabsTrigger>
            <TabsTrigger value="playoffs" className="transition-all duration-300">
              Playoffs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="regular" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6 hover:shadow-2xl transition-all duration-300 animate-slide-in-left">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary animate-pulse" />
                  Core Metrics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">Games Played</span>
                    <span className="font-bold">{regularStats?.gp ?? "-"}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">Points</span>
                    <span className="font-bold">{regularStats?.pts?.toFixed(1) ?? "-"}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">Assists</span>
                    <span className="font-bold">{regularStats?.ast?.toFixed(1) ?? "-"}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">Rebounds</span>
                    <span className="font-bold">{regularStats?.reb?.toFixed(1) ?? "-"}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-2xl transition-all duration-300 animate-slide-in-right">
                <h3 className="text-xl font-bold mb-6">Team Impact</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">Team</span>
                    <span className="font-bold">{player.team?.teamabbreviation ?? "-"}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">Conference</span>
                    <span className="font-bold">{player.team?.conferencename ?? "-"}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">Position</span>
                    <span className="font-bold">{player.position}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">Efficiency</span>
                    <span className="font-bold text-accent">{efficiencyScore}</span>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-8 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-xl font-bold mb-6 text-center">Performance Radar</h3>
              <PlayerRadarChart data={radarData} />
            </Card>
          </TabsContent>

          <TabsContent value="playoffs" className="space-y-8">
            {playoffStats ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6 hover:shadow-2xl transition-all duration-300 animate-slide-in-left">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-secondary animate-pulse" />
                    Playoff Metrics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                      <span className="text-muted-foreground">Games Played</span>
                      <span className="font-bold">{playoffStats.gp}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                      <span className="text-muted-foreground">Points</span>
                      <span className="font-bold">{playoffStats.pts.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                      <span className="text-muted-foreground">Assists</span>
                      <span className="font-bold">{playoffStats.ast.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                      <span className="text-muted-foreground">Rebounds</span>
                      <span className="font-bold">{playoffStats.reb.toFixed(1)}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 hover:shadow-2xl transition-all duration-300 animate-slide-in-right">
                  <h3 className="text-xl font-bold mb-6">Regular vs Playoff</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                      <span className="text-muted-foreground">Points Change</span>
                      <span className="font-bold">
                        {((playoffStats.pts ?? 0) - (regularStats?.pts ?? 0)).toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                      <span className="text-muted-foreground">Assists Change</span>
                      <span className="font-bold">
                        {((playoffStats.ast ?? 0) - (regularStats?.ast ?? 0)).toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                      <span className="text-muted-foreground">Rebounds Change</span>
                      <span className="font-bold">
                        {((playoffStats.reb ?? 0) - (regularStats?.reb ?? 0)).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">Playoff verisi bulunamadı.</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <Card className="p-8 mt-8 animate-fade-in-up hover:shadow-2xl transition-all duration-300" style={{ animationDelay: "0.3s" }}>
          <h3 className="text-2xl font-bold mb-6 text-center">Regular Season vs Playoffs</h3>
          <PlayerComparisonChart data={seasonComparisonData} />
        </Card>
      </div>
    </main>
  )
}
