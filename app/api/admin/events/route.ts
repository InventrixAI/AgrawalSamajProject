import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data: events, error } = await supabase.from("events").select("*").order("event_date", { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      events,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

export async function POST(request: Request) {
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

    if (!title || !event_date) {
      return NextResponse.json({ success: false, error: "Title and event date are required" }, { status: 400 })
    }

    const { data: event, error } = await supabase
      .from("events")
      .insert({
        title,
        description,
        event_date,
        location,
        image_url,
        contact_person_name,
        contact_person_address,
        contact_person_mobile,
        is_active: is_active !== undefined ? is_active : true,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, event })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}
