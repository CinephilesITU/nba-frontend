import { NextResponse } from "next/server"

const API_BASE_URL = "http://134.122.55.126:5001/api/v1"



export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const location = searchParams.get("location") || "OVERALL"
  const season = searchParams.get("season") || "REGULAR"

  try {
    console.log("[v0] Fetching player details from:", `${API_BASE_URL}/players/${id}`)

    const response = await fetch(`${API_BASE_URL}/players/${id}?location=${location}&season=${season}`, {
      cache: "no-store",
    })

    console.log("[v0] Player detail API response status:", response.status)

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Player detail data received for:", id)

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching player details:", error)
    return NextResponse.json({ error: `Failed to fetch player ${id} from API` }, { status: 500 })
  }
}
