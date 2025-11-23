"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Activity, RefreshCw, WifiOff } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usePlayers } from "@/lib/api/hooks"
import { buildMockPlayersResponse } from "@/lib/api/mock-data"

export function LivePlayersPanel() {
  const fallbackData = useMemo(() => buildMockPlayersResponse(), [])
  const { data, error, isLoading, isValidating } = usePlayers({
    fallbackData,
    revalidateOnMount: true,
  })

  const players = data?.players.slice(0, 6) ?? []

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Live API Snapshot</h2>
          </div>
          {isValidating && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <RefreshCw className="h-3 w-3 animate-spin" />
              syncing
            </Badge>
          )}
          {error && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <WifiOff className="h-3 w-3" />
              retrying fallback
            </Badge>
          )}
        </div>

        <Card className="p-4 md:p-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse space-y-3 rounded-lg border p-4">
                  <div className="h-4 w-24 bg-muted" />
                  <div className="h-6 w-32 bg-muted" />
                  <div className="h-4 w-20 bg-muted" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map((player) => (
                <Link
                  key={player.playerid}
                  href={`/player/${player.playerid}`}
                  className="rounded-lg border p-4 transition hover:border-primary hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="outline">{player.position}</Badge>
                    <Badge>#{player.playerid}</Badge>
                  </div>
                  <h3 className="text-lg font-semibold">{player.playername}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{player.team?.teamname ?? "Unknown team"}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">PPG</span>
                    <span className="font-bold">{player.regularSeason?.pts.toFixed(1) ?? "-"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">APG</span>
                    <span className="font-bold">{player.regularSeason?.ast.toFixed(1) ?? "-"}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {error && (
            <p className="mt-4 text-sm text-destructive">
              Can&apos;t reach API right now, showing cached mock data. Please try again shortly.
            </p>
          )}
        </Card>
      </div>
    </section>
  )
}
