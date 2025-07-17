import { createServerClient } from "./supabase"
import bcrypt from "bcryptjs"

export async function signUp(email: string, password: string, memberData: any) {
  try {
    const supabase = createServerClient()
    const hashedPassword = await bcrypt.hash(password, 10)

    const { data: user, error: userError } = await supabase
      .from("users")
      .insert({
        email,
        password_hash: hashedPassword,
        role: "member",
        is_approved: false,
      })
      .select()
      .single()

    if (userError) throw userError

    const { error: memberError } = await supabase.from("members").insert({
      user_id: user.id,
      ...memberData,
    })

    if (memberError) throw memberError

    return { success: true, user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function signIn(email: string, password: string) {
  try {
    const supabase = createServerClient()

    const { data: user, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (error || !user) {
      return { success: false, error: "Invalid credentials" }
    }

    const isValid = await bcrypt.compare(password, user.password_hash)

    if (!isValid) {
      return { success: false, error: "Invalid credentials" }
    }

    if (!user.is_approved && user.role === "member") {
      return { success: false, error: "Account pending approval" }
    }

    return { success: true, user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
