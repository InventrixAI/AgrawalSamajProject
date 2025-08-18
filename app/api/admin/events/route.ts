import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data: events, error } = await supabase.from("events").select("*").order("event_date", { ascending: false })

    if (error) throw error

    // Convert UTC back to IST for proper display in admin panel
    const convertUTCToIST = (utcDateString: string) => {
      const utcDate = new Date(utcDateString)
      // Add 5.5 hours to UTC to get IST
      const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000))
      return istDate.toISOString()
    }

    // Process events to ensure correct timezone display
    const processedEvents = events.map(event => ({
      ...event,
      event_date: convertUTCToIST(event.event_date)
    }))

    return NextResponse.json({
      success: true,
      events: processedEvents,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, event_date, location, image_url, is_active } = await request.json()

    if (!title || !event_date) {
      return NextResponse.json({ success: false, error: "Title and event date are required" }, { status: 400 })
    }

    // Convert IST to UTC for database storage
    const convertISTToUTC = (istDateString: string) => {
      const istDate = new Date(istDateString)
      // IST is UTC+5:30, so subtract 5.5 hours to convert to UTC
      const utcDate = new Date(istDate.getTime() - (5.5 * 60 * 60 * 1000))
      return utcDate.toISOString()
    }

    const { data: event, error } = await supabase
      .from("events")
      .insert({
        title,
        description,
        event_date: convertISTToUTC(event_date),
        location,
        image_url,
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
