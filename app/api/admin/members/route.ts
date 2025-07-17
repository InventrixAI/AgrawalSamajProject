import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data: members, error } = await supabase.from("members").select("*").order("name")

    if (error) throw error

    return NextResponse.json({
      success: true,
      members,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { name, phone, address, occupation, image_url, is_active } = await request.json()

    if (!name) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 })
    }

    const { data: member, error } = await supabase
      .from("members")
      .insert({
        name,
        phone,
        address,
        occupation,
        image_url,
        is_active: is_active !== undefined ? is_active : true,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, member })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
