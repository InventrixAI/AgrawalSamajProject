import { type NextRequest, NextResponse } from "next/server"
import { signIn } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 })
    }

    const result = await signIn(email, password)

    if (result.success) {
      return NextResponse.json({
        success: true,
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role,
          is_approved: result.user.is_approved,
          name: result.user.name, // Ensure name is passed here
        },
      })
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
