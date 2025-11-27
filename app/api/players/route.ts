import { NextResponse } from "next/server"

const API_BASE_URL = "http://134.122.55.126:5001/api/v1"



export async function GET() {
  try {
    console.log("[v0] Fetching players from:", `${API_BASE_URL}/players`)

    const response = await fetch(`${API_BASE_URL}/players`, {
      cache: "no-store",
    })

    console.log("[v0] Players API response status:", response.status)

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Players data received, count:", data.players?.length || 0)

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching players:", error)
    return NextResponse.json({ error: "Failed to fetch players from API" }, { status: 500 })
  }
}
