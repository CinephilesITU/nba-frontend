"use client"

import { getTeamById } from "@/lib/mock-data"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Trophy } from "lucide-react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const team = getTeamById(id)

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

  const rankingsData = [
    {
      category: "Win Rank",
      regular: team.regularSeason.rank,
      playoffs: team.playoffs.rank,
    },
    {
      category: "Def Rating",
      regular: team.regularSeason.defRatingRank,
      playoffs: team.playoffs.defRatingRank,
    },
    {
      category: "Def Reb",
      regular: team.regularSeason.defRebRank,
      playoffs: team.playoffs.defRebRank,
    },
    {
      category: "Steals",
      regular: team.regularSeason.stealRank,
      playoffs: team.playoffs.stealRank,
    },
    {
      category: "Blocks",
      regular: team.regularSeason.blockRank,
      playoffs: team.playoffs.blockRank,
    },
  ]

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

        {/* Team Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="lg:col-span-1 p-8 text-center animate-scale-in hover:shadow-2xl transition-all duration-300">
            <div className="w-48 h-48 mx-auto rounded-lg overflow-hidden bg-muted flex items-center justify-center mb-6 group">
              <img
                src={team.logo || "/placeholder.svg"}
                alt={team.name}
                className="w-32 h-32 object-contain group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
              />
            </div>
            <h1 className="text-3xl font-bold mb-2 animate-fade-in-up">{team.name}</h1>
            <p className="text-muted-foreground mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              {team.conference} Conference
            </p>
            <div className="flex gap-2 justify-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 transition-colors">
                {team.abbreviation}
              </Badge>
              <Badge variant="outline" className="hover:bg-muted transition-colors">
                #{team.teamID}
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div
                className="text-center p-4 rounded-lg bg-accent/10 border border-accent/30 hover:scale-110 hover:bg-accent/20 transition-all duration-300 cursor-pointer animate-scale-in"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="text-3xl font-bold text-accent mb-1">{team.regularSeason.wins}</div>
                <div className="text-sm text-muted-foreground">Wins</div>
              </div>
              <div
                className="text-center p-4 rounded-lg bg-destructive/10 border border-destructive/30 hover:scale-110 hover:bg-destructive/20 transition-all duration-300 cursor-pointer animate-scale-in"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="text-3xl font-bold text-destructive mb-1">{team.regularSeason.losses}</div>
                <div className="text-sm text-muted-foreground">Losses</div>
              </div>
              <div
                className="text-center p-4 rounded-lg bg-primary/10 border border-primary/30 hover:scale-110 hover:bg-primary/20 transition-all duration-300 cursor-pointer animate-scale-in"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="text-3xl font-bold text-primary mb-1">
                  {(team.regularSeason.winPct * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Win %</div>
              </div>
              <div
                className="text-center p-4 rounded-lg bg-secondary/10 border border-secondary/30 hover:scale-110 hover:bg-secondary/20 transition-all duration-300 cursor-pointer animate-scale-in"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="text-3xl font-bold text-secondary mb-1">#{team.regularSeason.rank}</div>
                <div className="text-sm text-muted-foreground">Rank</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Team Stats Tabs */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card
                className="p-6 text-center hover:scale-110 hover:shadow-xl transition-all duration-300 cursor-pointer animate-scale-in"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="text-2xl font-bold text-primary mb-2">#{team.regularSeason.defRatingRank}</div>
                <div className="text-sm text-muted-foreground">Defensive Rating Rank</div>
              </Card>
              <Card
                className="p-6 text-center hover:scale-110 hover:shadow-xl transition-all duration-300 cursor-pointer animate-scale-in"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="text-2xl font-bold text-secondary mb-2">#{team.regularSeason.defRebRank}</div>
                <div className="text-sm text-muted-foreground">Defensive Rebound Rank</div>
              </Card>
              <Card
                className="p-6 text-center hover:scale-110 hover:shadow-xl transition-all duration-300 cursor-pointer animate-scale-in"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="text-2xl font-bold text-accent mb-2">#{team.regularSeason.stealRank}</div>
                <div className="text-sm text-muted-foreground">Steals Rank</div>
              </Card>
              <Card
                className="p-6 text-center hover:scale-110 hover:shadow-xl transition-all duration-300 cursor-pointer animate-scale-in"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="text-2xl font-bold mb-2">#{team.regularSeason.blockRank}</div>
                <div className="text-sm text-muted-foreground">Blocks Rank</div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="playoffs" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card
                className="p-6 text-center hover:scale-110 hover:shadow-xl transition-all duration-300 cursor-pointer animate-scale-in"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="text-2xl font-bold text-primary mb-2">#{team.playoffs.defRatingRank}</div>
                <div className="text-sm text-muted-foreground">Defensive Rating Rank</div>
              </Card>
              <Card
                className="p-6 text-center hover:scale-110 hover:shadow-xl transition-all duration-300 cursor-pointer animate-scale-in"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="text-2xl font-bold text-secondary mb-2">#{team.playoffs.defRebRank}</div>
                <div className="text-sm text-muted-foreground">Defensive Rebound Rank</div>
              </Card>
              <Card
                className="p-6 text-center hover:scale-110 hover:shadow-xl transition-all duration-300 cursor-pointer animate-scale-in"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="text-2xl font-bold text-accent mb-2">#{team.playoffs.stealRank}</div>
                <div className="text-sm text-muted-foreground">Steals Rank</div>
              </Card>
              <Card
                className="p-6 text-center hover:scale-110 hover:shadow-xl transition-all duration-300 cursor-pointer animate-scale-in"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="text-2xl font-bold mb-2">#{team.playoffs.blockRank}</div>
                <div className="text-sm text-muted-foreground">Blocks Rank</div>
              </Card>
            </div>

            <Card className="p-8 hover:shadow-2xl transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-lg bg-accent/10 border border-accent/30 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="text-4xl font-bold text-accent mb-2">{team.playoffs.wins}</div>
                  <div className="text-sm text-muted-foreground">Playoff Wins</div>
                </div>
                <div className="text-center p-6 rounded-lg bg-destructive/10 border border-destructive/30 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="text-4xl font-bold text-destructive mb-2">{team.playoffs.losses}</div>
                  <div className="text-sm text-muted-foreground">Playoff Losses</div>
                </div>
                <div className="text-center p-6 rounded-lg bg-primary/10 border border-primary/30 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="text-4xl font-bold text-primary mb-2">{(team.playoffs.winPct * 100).toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Playoff Win %</div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Rankings Comparison Chart */}
        <Card
          className="p-8 mt-8 animate-fade-in-up hover:shadow-2xl transition-all duration-300"
          style={{ animationDelay: "0.3s" }}
        >
          <h3 className="text-2xl font-bold mb-6 text-center">Rankings: Regular Season vs Playoffs</h3>
          <p className="text-center text-muted-foreground mb-6 text-sm">Lower rank number = Better performance</p>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={rankingsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary))" opacity={0.3} />
              <XAxis
                dataKey="category"
                stroke="hsl(var(--primary))"
                tick={{ fill: "hsl(var(--foreground))", fontSize: 14, fontWeight: 500 }}
              />
              <YAxis stroke="hsl(var(--primary))" reversed tick={{ fill: "hsl(var(--foreground))", fontSize: 14 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} iconType="circle" />
              <Bar dataKey="regular" fill="hsl(var(--primary))" name="Regular Season" radius={[8, 8, 0, 0]} />
              <Bar dataKey="playoffs" fill="hsl(var(--secondary))" name="Playoffs" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Team Roster */}
        {team.players && team.players.length > 0 && (
          <div className="mt-12 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <h2 className="text-3xl font-bold mb-8 text-center">Team Roster</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.players.map((player, index) => (
                <Link key={player.id} href={`/player/${player.playerID}`}>
                  <Card
                    className="group hover:bg-card/80 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="p-6">
                      <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={player.image || "/placeholder.svg"}
                          alt={player.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors duration-300">
                          {player.name}
                        </h3>
                        <Badge variant="outline" className="text-xs group-hover:bg-muted transition-colors">
                          {player.position}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        <div className="text-center group-hover:scale-110 transition-transform duration-300">
                          <div className="text-lg font-bold text-primary">{player.regularSeason.points}</div>
                          <div className="text-xs text-muted-foreground">PPG</div>
                        </div>
                        <div className="text-center group-hover:scale-110 transition-transform duration-300">
                          <div className="text-lg font-bold text-secondary">{player.regularSeason.assists}</div>
                          <div className="text-xs text-muted-foreground">APG</div>
                        </div>
                        <div className="text-center group-hover:scale-110 transition-transform duration-300">
                          <div className="text-lg font-bold text-accent">{player.regularSeason.rebounds}</div>
                          <div className="text-xs text-muted-foreground">RPG</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
