import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function DELETE(request, { params }) {
  try {
    const { id: committee_id, memberId: member_id } = params

    const supabase = createServerClient()

    const { error } = await supabase
      .from("committee_members")
      .delete()
      .eq("committee_id", committee_id)
      .eq("member_id", member_id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
