import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .eq("is_active", true)
      .order("event_date", { ascending: true })

    if (error) throw error

    // Convert UTC back to IST for proper display
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
