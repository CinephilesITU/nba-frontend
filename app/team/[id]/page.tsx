import { fetchTeamById } from "@/lib/api"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trophy } from "lucide-react"
import Link from "next/link"

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const team = await fetchTeamById(id)

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

  // NOT: 'rankingsData' değişkeni aşağıdaki grafik yorum satırında olduğu için kaldırıldı.
  // Grafiği açacağınız zaman tekrar ekleyebilirsiniz.

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

        {/* Team Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="lg:col-span-1 p-8 text-center animate-scale-in hover:shadow-2xl transition-all duration-300">
            <div className="w-48 h-48 mx-auto rounded-lg overflow-hidden bg-muted flex items-center justify-center mb-6 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={team.logoUrl || "/placeholder.svg?height=200&width=200"}
                alt={team.teamName}
                className="w-32 h-32 object-contain group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
              />
            </div>
            <h1 className="text-3xl font-bold mb-2 animate-fade-in-up">{team.teamName}</h1>
            <p className="text-muted-foreground mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              {team.conference} Conference
            </p>
            <div className="flex gap-2 justify-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 transition-colors">
                {team.teamAbbreviate}
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
              Season Statistics
            </h2>
            {team.stats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div
                  className="text-center p-4 rounded-lg bg-accent/10 border border-accent/30 hover:scale-110 hover:bg-accent/20 transition-all duration-300 cursor-pointer animate-scale-in"
                  style={{ animationDelay: "0.1s" }}
                >
                  <div className="text-3xl font-bold text-accent mb-1">{team.stats.W_y}</div>
                  <div className="text-sm text-muted-foreground">Wins</div>
                </div>
                <div
                  className="text-center p-4 rounded-lg bg-destructive/10 border border-destructive/30 hover:scale-110 hover:bg-destructive/20 transition-all duration-300 cursor-pointer animate-scale-in"
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="text-3xl font-bold text-destructive mb-1">{team.stats.L_y}</div>
                  <div className="text-sm text-muted-foreground">Losses</div>
                </div>
                <div
                  className="text-center p-4 rounded-lg bg-primary/10 border border-primary/30 hover:scale-110 hover:bg-primary/20 transition-all duration-300 cursor-pointer animate-scale-in"
                  style={{ animationDelay: "0.3s" }}
                >
                  <div className="text-3xl font-bold text-primary mb-1">{(team.stats.W_PCT * 100).toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Win %</div>
                </div>
                <div
                  className="text-center p-4 rounded-lg bg-secondary/10 border border-secondary/30 hover:scale-110 hover:bg-secondary/20 transition-all duration-300 cursor-pointer animate-scale-in"
                  style={{ animationDelay: "0.4s" }}
                >
                  <div className="text-3xl font-bold text-secondary mb-1">#{team.stats.W_RANK}</div>
                  <div className="text-sm text-muted-foreground">Rank</div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center">No statistics available</p>
            )}
          </Card>
        </div>

        {/* Team Defensive Stats */}
        {team.stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card
              className="p-6 text-center hover:scale-110 hover:shadow-xl transition-all duration-300 cursor-pointer animate-scale-in"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="text-2xl font-bold text-primary mb-2">#{team.stats.DEF_RATING_RANK}</div>
              <div className="text-sm text-muted-foreground">Defensive Rating Rank</div>
              <div className="text-lg font-semibold text-muted-foreground mt-2">
                {team.stats.DEF_RATING?.toFixed(1)}
              </div>
            </Card>
            <Card
              className="p-6 text-center hover:scale-110 hover:shadow-xl transition-all duration-300 cursor-pointer animate-scale-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="text-2xl font-bold text-secondary mb-2">#{team.stats.DREB_RANK}</div>
              <div className="text-sm text-muted-foreground">Defensive Rebound Rank</div>
              <div className="text-lg font-semibold text-muted-foreground mt-2">{team.stats.DREB_y?.toFixed(1)}</div>
            </Card>
            <Card
              className="p-6 text-center hover:scale-110 hover:shadow-xl transition-all duration-300 cursor-pointer animate-scale-in"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="text-2xl font-bold text-accent mb-2">#{team.stats.STL_RANK}</div>
              <div className="text-sm text-muted-foreground">Steals Rank</div>
              <div className="text-lg font-semibold text-muted-foreground mt-2">{team.stats.STL_y?.toFixed(1)}</div>
            </Card>
            <Card
              className="p-6 text-center hover:scale-110 hover:shadow-xl transition-all duration-300 cursor-pointer animate-scale-in"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="text-2xl font-bold mb-2">#{team.stats.BLK_RANK}</div>
              <div className="text-sm text-muted-foreground">Blocks Rank</div>
              <div className="text-lg font-semibold text-muted-foreground mt-2">{team.stats.BLK_y?.toFixed(1)}</div>
            </Card>
          </div>
        )}

        {/* Team Roster */}
        {team.roster && team.roster.length > 0 && (
          <div className="mt-12 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <h2 className="text-3xl font-bold mb-8 text-center">Team Roster</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.roster.map((player, index) => (
                <Link key={player.playerID} href={`/player/${player.playerID}`}>
                  <Card
                    className="group hover:bg-card/80 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="p-6">
                      <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={player.headshotUrl || "/placeholder.svg?height=300&width=300"}
                          alt={player.playerName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors duration-300">
                          {player.playerName}
                        </h3>
                        <Badge variant="outline" className="text-xs group-hover:bg-muted transition-colors">
                          {player.position}
                        </Badge>
                      </div>
                      <div className="text-center mt-4 group-hover:scale-110 transition-transform duration-300">
                        <div className="text-2xl font-bold text-primary">{player.avg_pts?.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground">PPG</div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Rankings Comparison Chart (Commented Out) */}
      </div>
    </main>
  )
}