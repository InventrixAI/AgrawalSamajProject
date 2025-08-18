import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const {
      name,
      firm_full_name,
      family_head_name,
      firm_address,
      firm_colony,
      firm_state,
      firm_district,
      firm_city,
      home_address,
      state,
      district,
      city,
      business,
      mobile_no1,
      mobile_no2,
      mobile_no3,
      office_no,
      phone_no,
      email,
      gotra,
      total_members,
      status,
      image_url,
      is_active,
    } = await request.json()
    const { id } = await params

    const supabase = createServerClient()

    const { data: member, error } = await supabase
      .from("members")
      .update({
        name,
        firm_full_name,
        family_head_name,
        firm_address,
        firm_colony,
        firm_state,
        firm_district,
        firm_city,
        home_address,
        state,
        district,
        city,
        business,
        mobile_no1,
        mobile_no2,
        mobile_no3,
        office_no,
        phone_no,
        email,
        gotra,
        total_members,
        status,
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

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const supabase = createServerClient()

    const { error } = await supabase.from("members").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
