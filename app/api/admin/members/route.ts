import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    // Get total count first
    const { count, error: countError } = await supabase.from("members").select("*", { count: "exact", head: true })

    if (countError) throw countError

    // Fetch all members in batches to avoid any limits
    let allMembers = []
    const pageSize = 1000
    let currentPage = 0
    let hasMore = true

    while (hasMore) {
      const start = currentPage * pageSize
      const end = start + pageSize - 1

      const { data: pageMembers, error } = await supabase
        .from("members")
        .select("*")
        .order("family_head_name")
        .range(start, end)

      if (error) throw error

      if (pageMembers && pageMembers.length > 0) {
        allMembers = [...allMembers, ...pageMembers]

        // Check if we got fewer results than requested (last page)
        if (pageMembers.length < pageSize) {
          hasMore = false
        } else {
          currentPage++
        }
      } else {
        hasMore = false
      }

      // Safety check - if we've fetched more than expected, break
      // Remove the arbitrary limit of 10 pages and use actual count
      if (allMembers.length >= (count || 0)) {
        hasMore = false
      }
    }

    return NextResponse.json({
      success: true,
      members: allMembers,
      total: count,
    })
  } catch (error) {
    console.error("Error fetching members:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
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

    if (!family_head_name) {
      return NextResponse.json({ success: false, error: "Family head name is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    const { data: member, error } = await supabase
      .from("members")
      .insert({
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
        total_members: total_members || 1,
        status: status || "active",
        image_url,
        is_active: is_active !== undefined ? is_active : true,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, member })
  } catch (error) {
    console.error("Error creating member:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
