import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

const SCROLLING_NOTE_SINGLETON_ID = "00000000-0000-0000-0000-000000000002"; // A fixed UUID for the single scrolling note

export async function GET() {
  const supabase = createServerClient();

  try {
    const { data, error } = await supabase
      .from("scrolling_notes")
      .select("id, message")
      .eq("id", SCROLLING_NOTE_SINGLETON_ID)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching scrolling note:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, note: data });
  } catch (error: any) {
    console.error("Unexpected error fetching scrolling note:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const { message } = await req.json();

  if (typeof message !== "string" || !message) {
    return NextResponse.json({ success: false, error: "Message content is required." }, { status: 400 });
  }

  try {
    // Always upsert to ensure only one entry
    const { data, error } = await supabase
      .from("scrolling_notes")
      .upsert({ id: SCROLLING_NOTE_SINGLETON_ID, message: message }, { onConflict: "id" });

    if (error) {
      console.error("Error upserting scrolling note:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, note: data ? data[0] : null });
  } catch (error: any) {
    console.error("Unexpected error upserting scrolling note:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const supabase = createServerClient();

  try {
    const { error } = await supabase
      .from("scrolling_notes")
      .delete()
      .eq("id", SCROLLING_NOTE_SINGLETON_ID);

    if (error) {
      console.error("Error deleting scrolling note:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Unexpected error deleting scrolling note:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
