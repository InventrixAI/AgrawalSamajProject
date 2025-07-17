import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function PUT(request, { params }) {
  try {
    const { name, phone, address, occupation, image_url, is_active } = await request.json()
    const { id } = params

    const { data: member, error } = await supabase
      .from("members")
      .update({
        name,
        phone,
        address,
        occupation,
        image_url,
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, member })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params

    const { error } = await supabase.from("members").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
