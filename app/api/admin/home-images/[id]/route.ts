import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function PUT(request, { params }) {
  try {
    const { title, description, image_url, display_order, is_active } = await request.json()
    const { id } = params

    const supabase = createServerClient()

    const { data: image, error } = await supabase
      .from("home_images")
      .update({
        title,
        description,
        image_url,
        display_order,
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, image })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params

    const supabase = createServerClient()

    const { error } = await supabase.from("home_images").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
