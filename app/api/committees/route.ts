import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data: committees, error } = await supabase
      .from("committees")
      .select(`
        *,
        members:committee_members(
          id,
          position,
          member:members(
            id,
            name,
            image_url
          )
        )
      `)
      .eq("is_active", true)
      .order("name")

    if (error) throw error

    // Transform the data to flatten member information
    const transformedCommittees = committees.map((committee) => ({
      ...committee,
      members: committee.members.map((cm) => ({
        id: cm.member.id,
        name: cm.member.name,
        image_url: cm.member.image_url,
        position: cm.position,
      })),
    }))

    return NextResponse.json({
      success: true,
      committees: transformedCommittees,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
