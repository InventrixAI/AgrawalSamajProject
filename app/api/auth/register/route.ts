import { type NextRequest, NextResponse } from "next/server"
import { signUp } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone, address, occupation } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ success: false, error: "Email, password, and name are required" }, { status: 400 })
    }

    const memberData = {
      name,
      phone: phone || null,
      address: address || null,
      occupation: occupation || null,
    }

    const result = await signUp(email, password, memberData)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Registration successful. Please wait for admin approval.",
      })
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
