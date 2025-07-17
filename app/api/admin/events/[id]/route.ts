import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function PUT(request, { params }) {
  try {
    const { title, description, event_date, location, image_url, is_active } = await request.json()
    const { id } = params

    const { data: event, error } = await supabase
      .from("events")
      .update({
        title,
        description,
        event_date,
        location,
        image_url,
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, event })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params

    const { error } = await supabase.from("events").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
