// Backend URL'i
const API_BASE_URL = "http://134.122.55.126:5001/api/v1"

// ------------------------------------------------------------------
// INTERFACES (Arayüzler)
// ------------------------------------------------------------------

export interface Player {
  playerID: number
  playerName: string
  teamID: number
  teamName?: string
  position: string
  headshotUrl: string
  TEAM_ABBREVIATION?: string
  Logo_URL?: string
  stats?: PlayerStats
}

export interface PlayerStats {
  GP_X?: number
  MIN_X?: number
  PTS: number
  REB: number
  AST: number
  steal?: number
  STL_x?: number
  BLK_x?: number
  efficiency: number
  FGM?: number
  FGA?: number
  FG_PCT?: number
  FG3M?: number
  FG3A?: number
  FG3_PCT?: number
  FTM?: number
  FTA?: number
  FT_PCT?: number
  OREB?: number
  DREB_x?: number
  TOV?: number
  PF?: number
  PLUS_MINUS?: number
  location?: string
  season_type?: string
}

export interface Team {
  teamID: number
  teamName: string
  teamAbbreviate?: string
  conference: string
  logoUrl?: string
  stats?: TeamStats
  roster?: RosterPlayer[]
}

export interface TeamStats {
  GP_y: number
  W_y: number
  L_y: number
  W_PCT: number
  W_RANK: number
  DEF_RATING: number
  DEF_RATING_RANK: number
  DREB_y: number
  DREB_RANK: number
  STL_y: number
  STL_RANK: number
  BLK_y: number
  BLK_RANK: number
}

export interface RosterPlayer {
  playerID: number
  playerName: string
  position: string
  headshotUrl: string
  avg_pts: number
}

export interface Leader {
  playerName: string
  headshotUrl: string
  value: number
}

// ------------------------------------------------------------------
// PLAYER FUNCTIONS
// ------------------------------------------------------------------

export async function fetchPlayers(): Promise<Player[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/players`, { cache: 'no-store' })
    
    if (!response.ok) {
      console.error(`[API Error] fetchPlayers failed: ${response.status}`)
      return []
    }

    const data = await response.json()
    console.log("[API] fetchPlayers response:", data)

    if (data.data?.players) return data.data.players
    if (data.players) return data.players

    return []
  } catch (error) {
    console.error("Error fetching players:", error)
    return []
  }
}

export async function fetchPlayerById(id: number | string): Promise<Player | null> {
  if (!id) return null

  try {
    const response = await fetch(`${API_BASE_URL}/players/${id}?location=OVERALL&season=REGULAR`, { cache: 'no-store' })
    
    if (!response.ok) {
      console.error(`[API Error] fetchPlayerById failed for ID ${id}: ${response.status}`)
      return null
    }

    const data = await response.json()
    console.log("[API] fetchPlayerById response:", data)

    if (data.data?.player) return data.data.player
    if (data.player) return data.player

    return null
  } catch (error) {
    console.error("Error fetching player:", error)
    return null
  }
}

export async function fetchPlayerStats(
  id: number | string,
  location = "OVERALL",
  season = "REGULAR",
): Promise<PlayerStats | null> {
  if (!id) return null

  try {
    const response = await fetch(`${API_BASE_URL}/players/${id}?location=${location}&season=${season}`)
    
    if (!response.ok) return null

    const data = await response.json()

    if (data.data?.player?.stats) return data.data.player.stats
    if (data.player?.stats) return data.player.stats

    return null
  } catch (error) {
    console.error("Error fetching player stats:", error)
    return null
  }
}

// ------------------------------------------------------------------
// TEAM FUNCTIONS (HATA VEREN KISIM GÜNCELLENDİ)
// ------------------------------------------------------------------

export async function fetchTeams(conference?: string): Promise<Team[]> {
  try {
    const url = conference
      ? `${API_BASE_URL}/teams?conference=${conference}`
      : `${API_BASE_URL}/teams`
    
    const response = await fetch(url, { cache: 'no-store' })
    
    if (!response.ok) {
      console.error(`[API Error] fetchTeams failed: ${response.status}`)
      return []
    }

    const data = await response.json()

    if (data.data?.teams) return data.data.teams
    if (data.teams) return data.teams

    return []
  } catch (error) {
    console.error("Error fetching teams:", error)
    return []
  }
}

export async function fetchTeamById(id: number | string): Promise<Team | null> {
  // 1. ID Kontrolü: Eğer ID yoksa veya undefined ise istek atma
  if (!id || id === "undefined" || id === "null") {
    console.error("[API Error] fetchTeamById called with invalid ID:", id)
    return null
  }

  try {
    // 2. HTTP İsteği
    const response = await fetch(`${API_BASE_URL}/teams/${id}`, { 
      cache: 'no-store' // Verilerin güncel kalması için cacheleme yapma
    })

    // 3. HTTP Status Kontrolü (404, 500 vb. engellemek için)
    if (!response.ok) {
      console.error(`[API Error] fetchTeamById failed for ID ${id}: ${response.status} ${response.statusText}`)
      // Eğer response JSON değilse (örn HTML hata sayfası), text olarak okuyup logla ama hata fırlatma
      const textBody = await response.text()
      console.error("Response Body:", textBody)
      return null
    }

    // 4. JSON Ayrıştırma
    const data = await response.json()
    console.log("[API] fetchTeamById response:", data)

    if (data.data?.team) {
      return data.data.team
    }
    if (data.team) return data.team

    return null
  } catch (error) {
    console.error("Error fetching team:", error)
    return null
  }
}

// ------------------------------------------------------------------
// STATS/LEADERS FUNCTIONS
// ------------------------------------------------------------------

export async function fetchLeaders(category = "PTS", season = "REGULAR"): Promise<Leader[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/stats/leaders?category=${category}&season=${season}`, { cache: 'no-store' })
    
    if (!response.ok) return []

    const data = await response.json()

    if (data.data && Array.isArray(data.data)) {
      return data.data
    }
    if (data.leaders) return data.leaders

    return []
  } catch (error) {
    console.error("Error fetching leaders:", error)
    return []
  }
}

export async function searchPlayers(query: string): Promise<Player[]> {
  // Backend en az 2 karakter istiyor
  if (!query || query.length < 2) return []

  try {
    const response = await fetch(`${API_BASE_URL}/players/search?q=${encodeURIComponent(query)}`)
    const data = await response.json()

    console.log("[API] searchPlayers response:", data)

    if (data.status === "success" && data.data) {
      return data.data
    }
    
    return []
  } catch (error) {
    console.error("Error searching players:", error)
    return []
  }
}