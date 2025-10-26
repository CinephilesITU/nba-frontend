"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockTeams } from "@/lib/mock-data"
import Link from "next/link"

export function TeamStandings() {
  return (
    <section id="teams" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-2">Team Standings</h2>
          <p className="text-muted-foreground text-lg">Conference Leaders</p>
        </div>

        <Tabs defaultValue="east" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="east" className="text-lg">
              Eastern Conference
            </TabsTrigger>
            <TabsTrigger value="west" className="text-lg">
              Western Conference
            </TabsTrigger>
          </TabsList>

          <TabsContent value="east" className="space-y-4 animate-fade-in-up">
            {mockTeams.east.map((team, index) => (
              <Link key={team.id} href={`/team/${team.teamID}`}>
                <Card
                  className="group hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer animate-slide-in-left"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-6 flex items-center gap-6">
                    <div className="flex items-center gap-4 flex-1">
                      <Badge className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold bg-primary">
                        {team.regularSeason.rank}
                      </Badge>
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                        <img
                          src={team.logo || "/placeholder.svg"}
                          alt={team.name}
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{team.name}</h3>
                        <p className="text-sm text-muted-foreground">Eastern Conference</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent">{team.regularSeason.wins}</div>
                        <div className="text-xs text-muted-foreground">Wins</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-destructive">{team.regularSeason.losses}</div>
                        <div className="text-xs text-muted-foreground">Losses</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {(team.regularSeason.winPct * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Win %</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </TabsContent>

          <TabsContent value="west" className="space-y-4 animate-fade-in-up">
            {mockTeams.west.map((team, index) => (
              <Link key={team.id} href={`/team/${team.teamID}`}>
                <Card
                  className="group hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer animate-slide-in-right"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-6 flex items-center gap-6">
                    <div className="flex items-center gap-4 flex-1">
                      <Badge className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold bg-secondary">
                        {team.regularSeason.rank}
                      </Badge>
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                        <img
                          src={team.logo || "/placeholder.svg"}
                          alt={team.name}
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-secondary transition-colors">{team.name}</h3>
                        <p className="text-sm text-muted-foreground">Western Conference</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent">{team.regularSeason.wins}</div>
                        <div className="text-xs text-muted-foreground">Wins</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-destructive">{team.regularSeason.losses}</div>
                        <div className="text-xs text-muted-foreground">Losses</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-secondary">
                          {(team.regularSeason.winPct * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Win %</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
