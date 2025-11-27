import { NextResponse } from "next/server"

const API_BASE_URL = "http://134.122.55.126:5001/api/v1"



export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category") || "PTS"
  const season = searchParams.get("season") || "REGULAR"

  try {
    console.log("[v0] Fetching stats leaders from:", `${API_BASE_URL}/stats/leaders`)

    const response = await fetch(`${API_BASE_URL}/stats/leaders?category=${category}&season=${season}`, {
      cache: "no-store",
    })

    console.log("[v0] Stats leaders API response status:", response.status)

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Stats leaders data received, count:", data.leaders?.length || 0)

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching stats leaders:", error)
    return NextResponse.json({ error: "Failed to fetch stats leaders from API" }, { status: 500 })
  }
}
