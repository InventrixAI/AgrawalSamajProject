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
        committee_member_id: cm.id,
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

export async function POST(request) {
  try {
    const { name, description, image_url, pdf_url, is_active } = await request.json()

    if (!name) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    const { data: committee, error } = await supabase
      .from("committees")
      .insert({
        name,
        description,
        image_url,
        pdf_url,
        is_active: is_active !== undefined ? is_active : true,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, committee })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
