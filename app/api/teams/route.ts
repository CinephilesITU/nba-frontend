import { NextResponse } from "next/server"

import { getTeamsWithStats } from "@/lib/data-service"

export async function GET() {
  const data = getTeamsWithStats()
  return NextResponse.json({ teams: data })
}
