import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request, { params }) {
  try {
    const { member_id, position } = await request.json()
    const { id: committee_id } = params

    if (!member_id) {
      return NextResponse.json({ success: false, error: "Member ID is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    const { data: committeeMember, error } = await supabase
      .from("committee_members")
      .insert({
        committee_id,
        member_id,
        position: position || "Member",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, committeeMember })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
