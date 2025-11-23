import { getPlayersWithStats, getTeamsWithStats } from "@/lib/data-service"
import { PlayersResponse, TeamsResponse } from "@/lib/api/types"

export function buildMockPlayersResponse(): PlayersResponse {
  return {
    players: getPlayersWithStats(),
  }
}

export function buildMockTeamsResponse(): TeamsResponse {
  return {
    teams: getTeamsWithStats(),
  }
}
