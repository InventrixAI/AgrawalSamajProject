import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Get total members
    const { count: totalMembers } = await supabase
      .from("members")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)

    // Get pending approvals
    const { count: pendingApprovals } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("is_approved", false)

    // Get total events
    const { count: totalEvents } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)

    // Get total committees
    const { count: totalCommittees } = await supabase
      .from("committees")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)

    return NextResponse.json({
      success: true,
      stats: {
        totalMembers: totalMembers || 0,
        pendingApprovals: pendingApprovals || 0,
        totalEvents: totalEvents || 0,
        totalCommittees: totalCommittees || 0,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
