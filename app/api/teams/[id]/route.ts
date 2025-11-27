import { NextResponse } from "next/server"

const API_BASE_URL = "http://134.122.55.126:5001/api/v1"

// Next.js 15'te params asenkrondur (Promise). 
// Tip tanımını { params: Promise<{ id: string }> } olarak güncelledik.
export async function GET(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  // Params'ı await ederek içindeki id'yi alıyoruz
  const { id } = await params

  try {
    console.log("[v0] Fetching team details from:", `${API_BASE_URL}/teams/${id}`)

    const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
      cache: "no-store",
    })

    console.log("[v0] Team detail API response status:", response.status)

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Team detail data received for:", id)

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching team details:", error)
    return NextResponse.json({ error: `Failed to fetch team ${id} from API` }, { status: 500 })
  }
}