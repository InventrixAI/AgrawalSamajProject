import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { is_approved } = await request.json()
    const { id } = await params

    const { data: user, error } = await supabase
      .from("users")
      .update({ is_approved, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, user })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}
