"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { fetchTeams, type Team } from "@/lib/api"
import { useEffect, useState } from "react"
import { Activity } from "lucide-react"

export function TeamStandings() {
  const [eastTeams, setEastTeams] = useState<Team[]>([])
  const [westTeams, setWestTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTeams() {
      try {
        setLoading(true)
        const [eastResponse, westResponse] = await Promise.all([
          fetchTeams("East"), 
          fetchTeams("West")
        ])
        

        let filteredEast = eastResponse
        if (eastResponse.length > 0) {
           const hasWrongConference = eastResponse.some(t => t.conference?.includes("West"))
           if (hasWrongConference) {
             filteredEast = eastResponse.filter(t => t.conference === "East" || t.conference === "Eastern")
           }
        }

        // Batı Takımları Filtresi
        let filteredWest = westResponse
        if (westResponse.length > 0) {
           const hasWrongConference = westResponse.some(t => t.conference?.includes("East"))
           if (hasWrongConference) {
             filteredWest = westResponse.filter(t => t.conference === "West" || t.conference === "Western")
           }
        }

        setEastTeams(filteredEast.slice(0, 4))
        setWestTeams(filteredWest.slice(0, 4))
      } catch (error) {
        console.error("Takımlar yüklenirken hata oluştu:", error)
      } finally {
        setLoading(false)
      }
    }
    loadTeams()
  }, [])

  if (loading) {
    return (
      <section id="teams" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
           <div className="flex justify-center items-center gap-2">
            <Activity className="animate-spin text-primary" />
            <p className="text-muted-foreground">Loading standings...</p>
          </div>
        </div>
      </section>
    )
  }

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
            {eastTeams.length > 0 ? (
              eastTeams.map((team, index) => (
                <Link key={team.teamID} href={`/team/${team.teamID}`}>
                  <Card
                    className="group hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer animate-slide-in-left"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="p-6 flex items-center gap-6">
                      <div className="flex items-center gap-4 flex-1">
                        <Badge className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold bg-primary">
                          {index + 1}
                        </Badge>
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted flex items-center justify-center relative">
                          <img
                            src={team.logoUrl || "/placeholder.svg?height=50&width=50"}
                            alt={team.teamName}
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                            {team.teamName}
                          </h3>
                          <p className="text-sm text-muted-foreground">{team.conference} Conference</p>
                        </div>
                      </div>

                      <div className="hidden sm:block text-center min-w-[60px]">
                        <div className="text-2xl font-bold text-primary">{team.teamAbbreviate}</div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground">No teams found in East.</div>
            )}
          </TabsContent>

          <TabsContent value="west" className="space-y-4 animate-fade-in-up">
            {westTeams.length > 0 ? (
              westTeams.map((team, index) => (
                <Link key={team.teamID} href={`/team/${team.teamID}`}>
                  <Card
                    className="group hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer animate-slide-in-right"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="p-6 flex items-center gap-6">
                      <div className="flex items-center gap-4 flex-1">
                        <Badge className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold bg-secondary">
                          {index + 1}
                        </Badge>
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted flex items-center justify-center relative">
                          <img
                            src={team.logoUrl || "/placeholder.svg?height=50&width=50"}
                            alt={team.teamName}
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg group-hover:text-secondary transition-colors">
                            {team.teamName}
                          </h3>
                          <p className="text-sm text-muted-foreground">{team.conference} Conference</p>
                        </div>
                      </div>

                      <div className="hidden sm:block text-center min-w-[60px]">
                        <div className="text-2xl font-bold text-secondary">{team.teamAbbreviate}</div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground">No teams found in West.</div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}