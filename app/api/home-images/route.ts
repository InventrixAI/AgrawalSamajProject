import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data: images, error } = await supabase
      .from("home_images")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    if (error) throw error

    return NextResponse.json({
      success: true,
      images,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
