import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data: images, error } = await supabase
      .from("home_images")
      .select("*")
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

export async function POST(request) {
  try {
    const { title, description, image_url, display_order, is_active } = await request.json()

    if (!image_url) {
      return NextResponse.json({ success: false, error: "Image URL is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    const { data: image, error } = await supabase
      .from("home_images")
      .insert({
        title,
        description,
        image_url,
        display_order: display_order || 1,
        is_active: is_active !== undefined ? is_active : true,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, image })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
