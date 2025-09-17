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

    const { recordId, paymentMethod = "credit_card" } = await request.json()

    if (!recordId) {
      return NextResponse.json({ error: "Missing record ID" }, { status: 400 })
    }

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update billing record with payment information
    const { data: updatedRecord, error: updateError } = await supabase
      .from("billing_records")
      .update({
        status: "paid",
        payment_date: new Date().toISOString(),
        payment_method: paymentMethod,
        invoice_number: `INV-${Date.now()}`,
      })
      .eq("id", recordId)
      .eq("user_id", user.id) // Ensure user can only pay their own bills
      .select()
      .single()

    if (updateError) {
      console.error("Payment update error:", updateError)
      return NextResponse.json({ error: "Payment processing failed" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      record: updatedRecord,
      message: "Payment processed successfully",
    })
  } catch (error) {
    console.error("Payment API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
