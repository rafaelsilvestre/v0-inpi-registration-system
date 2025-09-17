import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchTerm, searchType } = await request.json()

    if (!searchTerm || !searchType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Simulate INPI API integration
    // In a real implementation, this would call the actual INPI API
    const mockResults = [
      {
        id: Math.random().toString(36).substr(2, 9),
        title: searchTerm.toUpperCase(),
        status: "Ativo",
        number:
          "BR" +
          Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, "0"),
        applicant: "EMPRESA EXEMPLO LTDA",
        class: searchType === "trademark" ? "35" : undefined,
        type: searchType,
      },
    ]

    // Calculate cost
    const cost = searchType === "trademark" ? 25.0 : searchType === "patent" ? 50.0 : 35.0

    // Save consultation to database
    const { data: consultation, error: dbError } = await supabase
      .from("inpi_consultations")
      .insert({
        user_id: user.id,
        search_term: searchTerm,
        search_type: searchType,
        status: "completed",
        results: mockResults,
        cost: cost,
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    // Create billing record
    await supabase.from("billing_records").insert({
      user_id: user.id,
      consultation_id: consultation.id,
      service_type: "consultation",
      amount: cost,
      status: "pending",
    })

    return NextResponse.json({
      success: true,
      consultation,
      results: mockResults,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
