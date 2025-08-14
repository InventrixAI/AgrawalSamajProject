import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function PUT(request, { params }) {
  try {
    const { name, description, image_url, pdf_url, is_active } = await request.json()
    const { id } = params

    const updatePayload: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (name !== undefined) updatePayload.name = name
    if (description !== undefined) updatePayload.description = description
    if (image_url !== undefined) updatePayload.image_url = image_url
    if (pdf_url !== undefined) updatePayload.pdf_url = pdf_url
    if (is_active !== undefined) updatePayload.is_active = is_active

    const { data: committee, error } = await supabase
      .from("committees")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, committee })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params

    const { error } = await supabase.from("committees").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
