import { PlayerWithStats, TeamWithStats } from "@/lib/types"

export interface PlayersResponse {
  players: PlayerWithStats[]
}

export interface TeamsResponse {
  teams: TeamWithStats[]
}
