import { NextResponse } from "next/server"

import { getPlayerById } from "@/lib/data-service"

interface RouteContext {
  params: { id: string }
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = params
  const playerId = Number(id)

  if (Number.isNaN(playerId)) {
    return NextResponse.json({ message: "Invalid player id" }, { status: 400 })
  }

  const player = getPlayerById(playerId)

  if (!player) {
    return NextResponse.json({ message: "Player not found" }, { status: 404 })
  }

  return NextResponse.json(player)
}
