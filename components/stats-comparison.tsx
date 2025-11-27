"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useEffect, useState } from "react"
import { fetchPlayers, fetchPlayerById } from "@/lib/api"
import { Activity } from "lucide-react"

interface ChartData {
  name: string
  points: number
  assists: number
  rebounds: number
}

interface TopStats {
  points: { value: number; player: string }
  assists: { value: number; player: string }
  rebounds: { value: number; player: string }
}

export function StatsComparison() {
  const [data, setData] = useState<ChartData[]>([])
  const [topStats, setTopStats] = useState<TopStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true)
        // 1. Oyuncu listesini al
        const allPlayers = await fetchPlayers()
        
        // 2. İlk 5 oyuncuyu al
        const candidates = allPlayers.slice(0, 5)

        // 3. Bu oyuncuların detaylı istatistiklerini çek
        const detailedPlayers = await Promise.all(
          candidates.map(async (p) => {
            const details = await fetchPlayerById(p.playerID)
            return details || p
          })
        )

        // 4. Veriyi grafik formatına dönüştür
        const chartData = detailedPlayers.map(p => ({
          name: p.playerName.split(" ")[0], 
          fullName: p.playerName,
          points: p.stats?.PTS || 0,
          assists: p.stats?.AST || 0,
          rebounds: p.stats?.REB || 0,
        }))

        setData(chartData)

        // 5. En iyileri hesapla
        if (chartData.length > 0) {
          const maxPoints = chartData.reduce((prev, current) => (prev.points > current.points) ? prev : current)
          const maxAssists = chartData.reduce((prev, current) => (prev.assists > current.assists) ? prev : current)
          const maxRebounds = chartData.reduce((prev, current) => (prev.rebounds > current.rebounds) ? prev : current)

          setTopStats({
            points: { value: maxPoints.points, player: maxPoints.fullName },
            assists: { value: maxAssists.assists, player: maxAssists.fullName },
            rebounds: { value: maxRebounds.rebounds, player: maxRebounds.fullName }
          })
        }

      } catch (error) {
        console.error("Failed to load comparison stats", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <section id="stats" className="py-20">
        <div className="container mx-auto px-4 text-center">
           <div className="flex justify-center items-center gap-2">
            <Activity className="animate-spin text-[#f97316]" />
            <p className="text-muted-foreground">Loading comparison data...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="stats" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-2">Stats Comparison</h2>
          <p className="text-muted-foreground text-lg">Top 5 Players Performance Analysis</p>
        </div>

        <Card className="p-8 bg-card/50 backdrop-blur animate-scale-in">
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            <Badge className="bg-[#f97316]/20 text-[#f97316] border-[#f97316]/30 text-sm px-4 py-2 hover:bg-[#f97316]/30">Points Average</Badge>
            <Badge className="bg-[#a855f7]/20 text-[#a855f7] border-[#a855f7]/30 text-sm px-4 py-2 hover:bg-[#a855f7]/30">
              Assists Average
            </Badge>
            <Badge className="bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30 text-sm px-4 py-2 hover:bg-[#10b981]/30">Rebounds Average</Badge>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f97316" opacity={0.3} vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#f97316" 
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 14, fontWeight: 600 }} 
                />
                <YAxis 
                  stroke="#f97316" 
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 14, fontWeight: 600 }} 
                />
                <Tooltip
                  cursor={{ fill: 'rgba(249, 115, 22, 0.1)' }}
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #f97316",
                    borderRadius: "8px",
                    color: "#ffffff",
                  }}
                  itemStyle={{ color: "#ffffff", fontWeight: 500 }}
                  labelStyle={{ color: "#f97316", fontWeight: 700 }}
                />
                <Legend wrapperStyle={{ paddingTop: "20px", color: "#ffffff" }} iconType="circle" />
                
                <Bar dataKey="points" fill="#f97316" name="Points" radius={[8, 8, 0, 0]} maxBarSize={60} />
                <Bar dataKey="assists" fill="#a855f7" name="Assists" radius={[8, 8, 0, 0]} maxBarSize={60} />
                <Bar dataKey="rebounds" fill="#10b981" name="Rebounds" radius={[8, 8, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {topStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="p-6 text-center hover:scale-105 transition-transform duration-300 animate-fade-in-up bg-[#f97316]/10 border-[#f97316]/30">
              <div className="text-4xl font-bold text-[#f97316] mb-2">{topStats.points.value.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground mb-1">Highest Points Average</div>
              <div className="text-xs text-[#f97316] font-bold">{topStats.points.player}</div>
            </Card>

            <Card
              className="p-6 text-center hover:scale-105 transition-transform duration-300 animate-fade-in-up bg-[#a855f7]/10 border-[#a855f7]/30"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="text-4xl font-bold text-[#a855f7] mb-2">{topStats.assists.value.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground mb-1">Highest Assists Average</div>
              <div className="text-xs text-[#a855f7] font-bold">{topStats.assists.player}</div>
            </Card>

            <Card
              className="p-6 text-center hover:scale-105 transition-transform duration-300 animate-fade-in-up bg-[#10b981]/10 border-[#10b981]/30"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="text-4xl font-bold text-[#10b981] mb-2">{topStats.rebounds.value.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground mb-1">Highest Rebounds Average</div>
              <div className="text-xs text-[#10b981] font-bold">{topStats.rebounds.player}</div>
            </Card>
          </div>
        )}
      </div>
    </section>
  )
}