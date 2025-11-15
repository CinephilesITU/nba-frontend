import { NextResponse } from "next/server"

import { getPlayersWithStats } from "@/lib/data-service"

export async function GET() {
  const data = getPlayersWithStats()
  return NextResponse.json({ players: data })
}
