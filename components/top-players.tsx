"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TrendingUp, Activity, ChevronLeft, ChevronRight, Search, X } from "lucide-react"
import Link from "next/link"
import { fetchPlayers, fetchPlayerById, searchPlayers, type Player } from "@/lib/api"
import { useEffect, useState } from "react"

export function TopPlayers() {
  const [allPlayers, setAllPlayers] = useState<Player[]>([]) // Ana veritabanı (tüm liste)
  const [currentList, setCurrentList] = useState<Player[]>([]) // Şu an üzerinde çalışılan liste (Arama veya Tümü)
  const [displayedPlayers, setDisplayedPlayers] = useState<Player[]>([]) // Ekranda görünen 8 kişi
  
  const [loading, setLoading] = useState(true) 
  const [pageLoading, setPageLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // Arama State'i
  const [searchQuery, setSearchQuery] = useState("")

  // Sayfalama Ayarları
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // 1. BAŞLANGIÇ: Tüm listeyi çek
  useEffect(() => {
    async function loadInitialList() {
      try {
        setLoading(true)
        const data = await fetchPlayers()
        setAllPlayers(data)
        setCurrentList(data)
      } catch (error) {
        console.error("Failed to load player list", error)
      } finally {
        setLoading(false)
      }
    }
    loadInitialList()
  }, [])

  // 2. ARAMA MANTIĞI (Backend Entegrasyonlu)
  useEffect(() => {
    // Debounce: Kullanıcı yazmayı bitirene kadar bekle (500ms)
    const timeoutId = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true)
        setPageLoading(true)
        try {
          // Backend'den arama yap
          const results = await searchPlayers(searchQuery)
          setCurrentList(results)
          setCurrentPage(1) // Aramada ilk sayfaya dön
        } catch (error) {
          console.error("Search error:", error)
        } finally {
          setIsSearching(false)
          setPageLoading(false)
        }
      } else if (searchQuery.length === 0) {
        // Arama temizlendiyse ana listeye dön
        setCurrentList(allPlayers)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, allPlayers])

  // 3. SAYFA DETAYLARINI ÇEKME
  useEffect(() => {
    async function loadPageStats() {
      // Eğer liste boşsa işlem yapma
      if (currentList.length === 0) {
        setDisplayedPlayers([])
        return
      }

      setPageLoading(true)
      
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const currentSlice = currentList.slice(startIndex, endIndex)

      // Görünen 8 kişi için detay çek
      const detailedData = await Promise.all(
        currentSlice.map(async (p) => {
          // Eğer zaten stats verisi varsa tekrar çekme (performans için)
          if (p.stats) return p
          
          const details = await fetchPlayerById(p.playerID)
          return details || p 
        })
      )

      setDisplayedPlayers(detailedData)
      setPageLoading(false)
    }

    loadPageStats()
  }, [currentList, currentPage])

  // Kontroller
  const totalPages = Math.ceil(currentList.length / itemsPerPage)

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(1, prev - 1))
  const handleNextPage = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1))
  
  const clearSearch = () => {
    setSearchQuery("")
    setCurrentList(allPlayers)
    setCurrentPage(1)
  }

  const formatStat = (val: number | undefined) => (val ? Number(val).toFixed(1) : "0.0")

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <section id="players" className="py-20 relative min-h-screen">
      <div className="container mx-auto px-4">
        
        {/* Header & Search Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-12 animate-fade-in-up gap-6">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-bold mb-2">Player Roster</h2>
            <p className="text-muted-foreground text-lg">
              {loading ? "Loading..." : `Showing ${currentList.length} Players`}
            </p>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search players..."
                className="pl-9 pr-9 bg-background/50 border-primary/20 focus:border-primary transition-all"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <button 
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2 bg-primary/10 border-primary hidden md:flex whitespace-nowrap">
              Regular Season
            </Badge>
          </div>
        </div>

        {/* Loading State */}
        {(loading || (isSearching && displayedPlayers.length === 0)) ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Activity className="animate-spin text-primary w-8 h-8 mb-4" />
            <p className="text-muted-foreground">Fetching data...</p>
          </div>
        ) : currentList.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-lg border border-dashed border-muted-foreground/30">
            {/* DÜZELTİLEN KISIM: Tırnak işaretleri &quot; ile değiştirildi */}
            <p className="text-xl text-muted-foreground">No players found matching &quot;{searchQuery}&quot;</p>
            <Button variant="link" onClick={clearSearch} className="mt-2 text-primary">
              Clear search and show all
            </Button>
          </div>
        ) : (
          /* Grid */
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-300 ${pageLoading ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
            {displayedPlayers.map((player, index) => (
              <Link key={player.playerID} href={`/player/${player.playerID}`}>
                <Card
                  className="group relative overflow-hidden bg-card hover:bg-card/80 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer animate-scale-in h-full"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="p-6 relative z-10 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        #{player.playerID}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {player.position || "N/A"}
                      </Badge>
                    </div>

                    <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-muted relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={player.headshotUrl || "/placeholder.svg?height=200&width=200"}
                        alt={player.playerName}
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=200&width=200"
                        }}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors truncate">
                      {player.playerName}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {player.teamName || "Team ID: " + player.teamID}
                    </p>

                    <div className="space-y-2 mt-auto">
                      {player.stats ? (
                        <>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Points</span>
                            <span className="font-bold text-primary">
                              {formatStat(player.stats.PTS)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Assists</span>
                            <span className="font-bold text-secondary">
                              {formatStat(player.stats.AST)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Rebounds</span>
                            <span className="font-bold text-accent">
                              {formatStat(player.stats.REB)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Activity className="w-3 h-3" />
                              Eff
                            </span>
                            <span className="font-bold flex items-center gap-1">
                              {formatStat(player.stats.efficiency)}
                              <TrendingUp className="w-3 h-3 text-accent" />
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
                          {pageLoading ? "Loading stats..." : "No stats available"}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12 animate-fade-in-up">
            <Button
              variant="outline"
              onClick={handlePrevPage}
              disabled={currentPage === 1 || pageLoading}
              className="w-32"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <div className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>

            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={currentPage === totalPages || pageLoading}
              className="w-32"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}