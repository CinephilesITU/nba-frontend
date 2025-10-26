import { getPlayerById } from "@/lib/mock-data"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, TrendingUp, Activity } from "lucide-react"
import Link from "next/link"
import { PlayerRadarChart } from "@/components/player-radar-chart"
import { PlayerComparisonChart } from "@/components/player-comparison-chart"

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const player = getPlayerById(id)

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

  const seasonComparisonData = [
    {
      category: "Points",
      regular: player.regularSeason.points,
      playoffs: player.playoffs.points,
    },
    {
      category: "Assists",
      regular: player.regularSeason.assists,
      playoffs: player.playoffs.assists,
    },
    {
      category: "Rebounds",
      regular: player.regularSeason.rebounds,
      playoffs: player.playoffs.rebounds,
    },
    {
      category: "Steals",
      regular: player.regularSeason.steals,
      playoffs: player.playoffs.steals,
    },
    {
      category: "Blocks",
      regular: player.regularSeason.blocks,
      playoffs: player.playoffs.blocks,
    },
  ]

  const radarData = [
    {
      stat: "Points",
      value: (player.regularSeason.points / 35) * 100,
    },
    {
      stat: "Assists",
      value: (player.regularSeason.assists / 12) * 100,
    },
    {
      stat: "Rebounds",
      value: (player.regularSeason.rebounds / 15) * 100,
    },
    {
      stat: "FG%",
      value: player.regularSeason.fieldGoalPct,
    },
    {
      stat: "FT%",
      value: player.regularSeason.freeThrowPct,
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

        {/* Player Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="lg:col-span-1 p-8 animate-scale-in hover:shadow-2xl transition-all duration-300">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-6 group">
              <img
                src={player.image || "/placeholder.svg"}
                alt={player.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2 animate-fade-in-up">{player.name}</h1>
              <p className="text-muted-foreground mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                {player.team}
              </p>
              <div className="flex gap-2 justify-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 transition-colors">
                  {player.position}
                </Badge>
                <Badge variant="outline" className="hover:bg-muted transition-colors">
                  #{player.playerID}
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
                <div className="text-3xl font-bold text-primary mb-1">{player.regularSeason.points}</div>
                <div className="text-sm text-muted-foreground">PPG</div>
              </div>
              <div
                className="text-center p-4 rounded-lg bg-secondary/10 border border-secondary/30 hover:scale-110 hover:bg-secondary/20 transition-all duration-300 cursor-pointer animate-scale-in"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="text-3xl font-bold text-secondary mb-1">{player.regularSeason.assists}</div>
                <div className="text-sm text-muted-foreground">APG</div>
              </div>
              <div
                className="text-center p-4 rounded-lg bg-accent/10 border border-accent/30 hover:scale-110 hover:bg-accent/20 transition-all duration-300 cursor-pointer animate-scale-in"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="text-3xl font-bold text-accent mb-1">{player.regularSeason.rebounds}</div>
                <div className="text-sm text-muted-foreground">RPG</div>
              </div>
              <div
                className="text-center p-4 rounded-lg bg-muted border border-border hover:scale-110 hover:bg-muted/80 transition-all duration-300 cursor-pointer animate-scale-in"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="text-3xl font-bold mb-1 flex items-center justify-center gap-1">
                  {player.regularSeason.efficiency}
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <div className="text-sm text-muted-foreground">EFF</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Detailed Stats Tabs */}
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
              {/* Shooting Stats */}
              <Card className="p-6 hover:shadow-2xl transition-all duration-300 animate-slide-in-left">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary animate-pulse" />
                  Shooting Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                    <span className="text-muted-foreground">Field Goals</span>
                    <span className="font-bold">
                      {player.regularSeason.fieldGoalsMade}/{player.regularSeason.fieldGoalsAttempted} (
                      {player.regularSeason.fieldGoalPct}%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                    <span className="text-muted-foreground">3-Pointers</span>
                    <span className="font-bold">
                      {player.regularSeason.threePointsMade}/{player.regularSeason.threePointsAttempted} (
                      {player.regularSeason.threePointPct}%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                    <span className="text-muted-foreground">Free Throws</span>
                    <span className="font-bold">
                      {player.regularSeason.freeThrowsMade}/{player.regularSeason.freeThrowsAttempted} (
                      {player.regularSeason.freeThrowPct}%)
                    </span>
                  </div>
                </div>
              </Card>

              {/* Other Stats */}
              <Card className="p-6 hover:shadow-2xl transition-all duration-300 animate-slide-in-right">
                <h3 className="text-xl font-bold mb-6">Additional Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                    <span className="text-muted-foreground">Games Played</span>
                    <span className="font-bold">{player.regularSeason.gamesPlayed}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                    <span className="text-muted-foreground">Minutes Per Game</span>
                    <span className="font-bold">{player.regularSeason.minutes}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                    <span className="text-muted-foreground">Steals</span>
                    <span className="font-bold">{player.regularSeason.steals}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                    <span className="text-muted-foreground">Blocks</span>
                    <span className="font-bold">{player.regularSeason.blocks}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                    <span className="text-muted-foreground">Turnovers</span>
                    <span className="font-bold">{player.regularSeason.turnovers}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                    <span className="text-muted-foreground">Plus/Minus</span>
                    <span className="font-bold text-accent">+{player.regularSeason.plusMinus}</span>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Shooting Stats */}
              <Card className="p-6 hover:shadow-2xl transition-all duration-300 animate-slide-in-left">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-secondary animate-pulse" />
                  Shooting Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                    <span className="text-muted-foreground">Field Goals</span>
                    <span className="font-bold">
                      {player.playoffs.fieldGoalsMade}/{player.playoffs.fieldGoalsAttempted} (
                      {player.playoffs.fieldGoalPct}%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                    <span className="text-muted-foreground">3-Pointers</span>
                    <span className="font-bold">
                      {player.playoffs.threePointsMade}/{player.playoffs.threePointsAttempted} (
                      {player.playoffs.threePointPct}%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                    <span className="text-muted-foreground">Free Throws</span>
                    <span className="font-bold">
                      {player.playoffs.freeThrowsMade}/{player.playoffs.freeThrowsAttempted} (
                      {player.playoffs.freeThrowPct}%)
                    </span>
                  </div>
                </div>
              </Card>

              {/* Other Stats */}
              <Card className="p-6 hover:shadow-2xl transition-all duration-300 animate-slide-in-right">
                <h3 className="text-xl font-bold mb-6">Additional Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                    <span className="text-muted-foreground">Games Played</span>
                    <span className="font-bold">{player.playoffs.gamesPlayed}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                    <span className="text-muted-foreground">Minutes Per Game</span>
                    <span className="font-bold">{player.playoffs.minutes}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                    <span className="text-muted-foreground">Steals</span>
                    <span className="font-bold">{player.playoffs.steals}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                    <span className="text-muted-foreground">Blocks</span>
                    <span className="font-bold">{player.playoffs.blocks}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                    <span className="text-muted-foreground">Turnovers</span>
                    <span className="font-bold">{player.playoffs.turnovers}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                    <span className="text-muted-foreground">Plus/Minus</span>
                    <span className="font-bold text-accent">+{player.playoffs.plusMinus}</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Card
          className="p-8 mt-8 animate-fade-in-up hover:shadow-2xl transition-all duration-300"
          style={{ animationDelay: "0.3s" }}
        >
          <h3 className="text-2xl font-bold mb-6 text-center">Regular Season vs Playoffs</h3>
          <PlayerComparisonChart data={seasonComparisonData} />
        </Card>
      </div>
    </main>
  )
}
