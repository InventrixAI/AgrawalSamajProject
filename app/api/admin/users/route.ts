import { NextResponse } from "next/server"
import { supabase, createServerClient } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const search = searchParams.get("search") || ""

    const offset = (page - 1) * limit

    let query = supabase
      .from("users")
      .select("id, email, role, is_approved, created_at, updated_at", { count: "exact" })

    if (search) {
      query = query.or(`email.ilike.%${search}%,role.ilike.%${search}%`)
    }

    const {
      data: users,
      error,
      count,
    } = await query.order("created_at", { ascending: false }).range(offset, offset + limit - 1)

    if (error) throw error

    return NextResponse.json({
      success: true,
      users: users || [],
      total: count || 0,
      page,
      limit,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { email, password, role, is_approved } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 })
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    const hashedPassword = await bcrypt.hash(password, 10)

    const server = createServerClient()
    const { data: user, error } = await server
      .from("users")
      .insert({
        email: normalizedEmail,
        password_hash: hashedPassword,
        role: role || "member",
        is_approved: is_approved || false,
      })
      .select()
      .single()

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
    console.error("Error creating user:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
