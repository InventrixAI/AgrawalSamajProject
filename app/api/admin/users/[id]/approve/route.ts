import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function PUT(request, { params }) {
  try {
    const { is_approved } = await request.json()
    const { id } = params

    const { data: user, error } = await supabase
      .from("users")
      .update({ is_approved, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, user })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
