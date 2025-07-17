import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data: members, error } = await supabase.from("members").select("*").eq("is_active", true).order("name")

    if (error) throw error

    return NextResponse.json({
      success: true,
      members,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
