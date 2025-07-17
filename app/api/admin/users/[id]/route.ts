import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function PUT(request, { params }) {
  try {
    const { email, password, role, is_approved } = await request.json()
    const { id } = params

    const updateData = {
      email,
      role,
      is_approved,
      updated_at: new Date().toISOString(),
    }

    // Only update password if provided
    if (password) {
      updateData.password_hash = await bcrypt.hash(password, 10)
    }

    const { data: user, error } = await supabase.from("users").update(updateData).eq("id", id).select().single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        is_approved: user.is_approved,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params

    const { error } = await supabase.from("users").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
