"use client"

import useSWR, { type SWRConfiguration } from "swr"

import { apiFetch } from "@/lib/api/client"
import { PlayersResponse, TeamsResponse } from "@/lib/api/types"

const fetcher = <TResponse>(url: string) => apiFetch<TResponse>(url)

export function usePlayers(config?: SWRConfiguration<PlayersResponse>) {
  return useSWR<PlayersResponse>("/api/players", fetcher, config)
}

export function useTeams(config?: SWRConfiguration<TeamsResponse>) {
  return useSWR<TeamsResponse>("/api/teams", fetcher, config)
}
