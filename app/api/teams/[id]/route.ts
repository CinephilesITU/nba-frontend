import { NextResponse } from "next/server"

import { getTeamById } from "@/lib/data-service"

interface RouteContext {
  params: { id: string }
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = params
  const teamId = Number(id)

  if (Number.isNaN(teamId)) {
    return NextResponse.json({ message: "Invalid team id" }, { status: 400 })
  }

  const team = getTeamById(teamId)

  if (!team) {
    return NextResponse.json({ message: "Team not found" }, { status: 404 })
  }

  return NextResponse.json(team)
}
