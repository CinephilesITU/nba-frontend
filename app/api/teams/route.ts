import { NextResponse } from "next/server"

const API_BASE_URL = "http://134.122.55.126:5001/api/v1"



export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const conference = searchParams.get("conference")

  try {
    const url = conference ? `${API_BASE_URL}/teams?conference=${conference}` : `${API_BASE_URL}/teams`

    console.log("[v0] Fetching teams from:", url)

    const response = await fetch(url, {
      cache: "no-store",
    })

    console.log("[v0] Teams API response status:", response.status)

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Teams data received, count:", data.teams?.length || 0)

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching teams:", error)
    return NextResponse.json({ error: "Failed to fetch teams from API" }, { status: 500 })
  }
}
