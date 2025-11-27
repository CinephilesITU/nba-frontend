import { fetchPlayerById, fetchPlayerStats, fetchPlayers, type PlayerStats } from "@/lib/api"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, TrendingUp, Activity, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { PlayerRadarChart } from "@/components/player-radar-chart"
import { PlayerComparisonChart } from "@/components/player-comparison-chart"
import { Button } from "@/components/ui/button"

// TypeScript Fix: 'any' yerine 'PlayerStats' veya genel obje tipi kullanıldı.
// Dinamik erişim için (stats as Record<string, unknown>) dönüşümü yapıldı.
const getStatValue = (stats: PlayerStats | null | undefined, keys: string[]) => {
  if (!stats) return 0
  for (const key of keys) {
    // TypeScript, belirli bir interface'e string ile erişilmesine kızar.
    // Bu yüzden objeyi geçici olarak anahtar-değer yapısına dönüştürüyoruz.
    const val = (stats as unknown as Record<string, unknown>)[key]
    if (val !== undefined && val !== null) {
      return Number(val)
    }
  }
  return 0
}

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Paralel veri çekme işlemi başlatıyoruz
  const playerData = fetchPlayerById(id)
  const regularStatsData = fetchPlayerStats(id, "OVERALL", "REGULAR")
  const playoffStatsData = fetchPlayerStats(id, "OVERALL", "PLAYOFF")
  const allPlayersData = fetchPlayers() // Navigasyon için tüm listeyi çekiyoruz

  const [player, regularStats, playoffStats, allPlayers] = await Promise.all([
    playerData,
    regularStatsData,
    playoffStatsData,
    allPlayersData,
  ])

  if (!player || !regularStats) {
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

  // --- PAGINATION / NAVİGASYON MANTIĞI ---
  const currentIndex = allPlayers.findIndex((p) => p.playerID.toString() === id)
  
  // Eğer oyuncu listede bulunursa önceki ve sonrakini belirle (Döngüsel yapı: sonuncudan başa, baştan sona)
  const prevPlayer = currentIndex >= 0 
    ? allPlayers[currentIndex === 0 ? allPlayers.length - 1 : currentIndex - 1] 
    : null
    
  const nextPlayer = currentIndex >= 0 
    ? allPlayers[currentIndex === allPlayers.length - 1 ? 0 : currentIndex + 1] 
    : null
  // ---------------------------------------

  // --- VERİ DÜZELTME KISMI ---
  const regSteal = getStatValue(regularStats, ["steal", "STL_x", "STL", "stl", "steals", "STEALS"])
  const regBlock = getStatValue(regularStats, [
    "BLK_X",
    "BLK_x",
    "BLK",
    "blk",
    "blocks",
    "BLOCKS",
    "BLK_y",
    "blk_y",
  ])

  const playSteal = getStatValue(playoffStats, ["steal", "STL_x", "STL", "stl", "steals", "STEALS"])
  const playBlock = getStatValue(playoffStats, [
    "BLK_X",
    "BLK_x",
    "BLK",
    "blk",
    "blocks",
    "BLOCKS",
    "BLK_y",
    "blk_y",
  ])
  // ---------------------------

  const seasonComparisonData = playoffStats
    ? [
        {
          category: "Points",
          regular: regularStats.PTS || 0,
          playoffs: playoffStats.PTS || 0,
        },
        {
          category: "Assists",
          regular: regularStats.AST || 0,
          playoffs: playoffStats.AST || 0,
        },
        {
          category: "Rebounds",
          regular: regularStats.REB || 0,
          playoffs: playoffStats.REB || 0,
        },
        {
          category: "Steals",
          regular: regSteal,
          playoffs: playSteal,
        },
        {
          category: "Blocks",
          regular: regBlock,
          playoffs: playBlock,
        },
      ]
    : []

  const radarData = [
    {
      stat: "Points",
      value: (regularStats.PTS / 35) * 100,
    },
    {
      stat: "Assists",
      value: (regularStats.AST / 12) * 100,
    },
    {
      stat: "Rebounds",
      value: (regularStats.REB / 15) * 100,
    },
    {
      stat: "FG%",
      value: regularStats.FG_PCT ? regularStats.FG_PCT * 100 : 0,
    },
    {
      stat: "FT%",
      value: regularStats.FT_PCT ? regularStats.FT_PCT * 100 : 0,
    },
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-24">
        {/* Top Navigation Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 animate-fade-in-up">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 hover:gap-3 group self-start md:self-auto"
          >
            <ArrowLeft className="w-5 h-5 group-hover:animate-pulse" />
            <span className="font-medium">Back to Home</span>
          </Link>

          {/* Player Navigation Buttons */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            {prevPlayer && (
              <Button variant="outline" asChild className="group">
                <Link href={`/player/${prevPlayer.playerID}`} className="flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <div className="text-left hidden sm:block">
                    <div className="text-xs text-muted-foreground">Previous</div>
                    <div className="font-semibold text-sm truncate max-w-[100px]">{prevPlayer.playerName}</div>
                  </div>
                  <span className="sm:hidden">Prev</span>
                </Link>
              </Button>
            )}

            {nextPlayer && (
              <Button variant="outline" asChild className="group">
                <Link href={`/player/${nextPlayer.playerID}`} className="flex items-center gap-2">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-muted-foreground">Next</div>
                    <div className="font-semibold text-sm truncate max-w-[100px]">{nextPlayer.playerName}</div>
                  </div>
                  <span className="sm:hidden">Next</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Player Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="lg:col-span-1 p-8 animate-scale-in hover:shadow-2xl transition-all duration-300">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-6 group">
              <img
                src={player.headshotUrl || "/placeholder.svg?height=400&width=400"}
                alt={player.playerName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2 animate-fade-in-up">{player.playerName}</h1>
              <p className="text-muted-foreground mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                {player.teamName}
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
                <div className="text-3xl font-bold text-primary mb-1">{regularStats.PTS?.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">PPG</div>
              </div>
              <div
                className="text-center p-4 rounded-lg bg-secondary/10 border border-secondary/30 hover:scale-110 hover:bg-secondary/20 transition-all duration-300 cursor-pointer animate-scale-in"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="text-3xl font-bold text-secondary mb-1">{regularStats.AST?.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">APG</div>
              </div>
              <div
                className="text-center p-4 rounded-lg bg-accent/10 border border-accent/30 hover:scale-110 hover:bg-accent/20 transition-all duration-300 cursor-pointer animate-scale-in"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="text-3xl font-bold text-accent mb-1">{regularStats.REB?.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">RPG</div>
              </div>
              <div
                className="text-center p-4 rounded-lg bg-muted border border-border hover:scale-110 hover:bg-muted/80 transition-all duration-300 cursor-pointer animate-scale-in"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="text-3xl font-bold mb-1 flex items-center justify-center gap-1">
                  {regularStats.efficiency?.toFixed(1)}
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
            <TabsTrigger value="playoffs" className="transition-all duration-300" disabled={!playoffStats}>
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
                      {regularStats.FGM?.toFixed(1)}/{regularStats.FGA?.toFixed(1)} ({((regularStats.FG_PCT || 0) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                    <span className="text-muted-foreground">3-Pointers</span>
                    <span className="font-bold">
                      {regularStats.FG3M?.toFixed(1)}/{regularStats.FG3A?.toFixed(1)} (
                      {((regularStats.FG3_PCT || 0) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                    <span className="text-muted-foreground">Free Throws</span>
                    <span className="font-bold">
                      {regularStats.FTM?.toFixed(1)}/{regularStats.FTA?.toFixed(1)} ({((regularStats.FT_PCT || 0) * 100).toFixed(1)}%)
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
                    <span className="font-bold">{regularStats.GP_X}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                    <span className="text-muted-foreground">Minutes Per Game</span>
                    <span className="font-bold">{regularStats.MIN_X?.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                    <span className="text-muted-foreground">Steals</span>
                    <span className="font-bold">{regSteal.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                    <span className="text-muted-foreground">Blocks</span>
                    <span className="font-bold">{regBlock.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                    <span className="text-muted-foreground">Turnovers</span>
                    <span className="font-bold">{regularStats.TOV?.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                    <span className="text-muted-foreground">Plus/Minus</span>
                    <span className="font-bold text-accent">+{regularStats.PLUS_MINUS?.toFixed(1)}</span>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-8 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-xl font-bold mb-6 text-center">Performance Radar</h3>
              <PlayerRadarChart data={radarData} />
            </Card>
          </TabsContent>

          {playoffStats && (
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
                        {playoffStats.FGM?.toFixed(1)}/{playoffStats.FGA?.toFixed(1)} ({((playoffStats.FG_PCT || 0) * 100).toFixed(1)}
                        %)
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                      <span className="text-muted-foreground">3-Pointers</span>
                      <span className="font-bold">
                        {playoffStats.FG3M?.toFixed(1)}/{playoffStats.FG3A?.toFixed(1)} (
                        {((playoffStats.FG3_PCT || 0) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                      <span className="text-muted-foreground">Free Throws</span>
                      <span className="font-bold">
                        {playoffStats.FTM?.toFixed(1)}/{playoffStats.FTA?.toFixed(1)} ({((playoffStats.FT_PCT || 0) * 100).toFixed(1)}
                        %)
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
                      <span className="font-bold">{playoffStats.GP_X}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                      <span className="text-muted-foreground">Minutes Per Game</span>
                      <span className="font-bold">{playoffStats.MIN_X?.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                      <span className="text-muted-foreground">Steals</span>
                      <span className="font-bold">{playSteal.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                      <span className="text-muted-foreground">Blocks</span>
                      <span className="font-bold">{playBlock.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                      <span className="text-muted-foreground">Turnovers</span>
                      <span className="font-bold">{playoffStats.TOV?.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted hover:translate-x-2 transition-all duration-300">
                      <span className="text-muted-foreground">Plus/Minus</span>
                      <span className="font-bold text-accent">+{playoffStats.PLUS_MINUS?.toFixed(1)}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>

        {playoffStats && seasonComparisonData.length > 0 && (
          <Card
            className="p-8 mt-8 animate-fade-in-up hover:shadow-2xl transition-all duration-300"
            style={{ animationDelay: "0.3s" }}
          >
            <h3 className="text-2xl font-bold mb-6 text-center">Regular Season vs Playoffs</h3>
            <PlayerComparisonChart data={seasonComparisonData} />
          </Card>
        )}
      </div>
    </main>
  )
}