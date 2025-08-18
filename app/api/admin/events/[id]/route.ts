import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { 
      title, 
      description, 
      event_date, 
      location, 
      image_url, 
      contact_person_name,
      contact_person_address,
      contact_person_mobile,
      is_active 
    } = await request.json()
    const { id } = params

    const { data: event, error } = await supabase
      .from("events")
      .update({
        title,
        description,
        event_date,
        location,
        image_url,
        contact_person_name,
        contact_person_address,
        contact_person_mobile,
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, event })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const { error } = await supabase.from("events").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}
