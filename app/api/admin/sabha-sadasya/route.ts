import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase
      .from("sabha_sadasya")
      .select("id, title, pdf_url")
      .order("uploaded_at", { ascending: false }); // Order by newest first

    if (error) {
      console.error("Error fetching Sabha Sadasya PDFs:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, pdfs: data });
  } catch (error: any) {
    console.error("Unexpected error fetching Sabha Sadasya PDFs:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const { pdf_url, title } = await req.json();

  // Basic validation
  if (typeof pdf_url !== "string" || typeof title !== "string" || !pdf_url || !title) {
    return NextResponse.json({ success: false, error: "Invalid PDF URL or title provided." }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("sabha_sadasya")
      .insert({ title, pdf_url })
      .select();

    if (error) {
      console.error("Error inserting Sabha Sadasya PDF:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, pdf: data[0] });
  } catch (error: any) {
    console.error("Unexpected error inserting Sabha Sadasya PDF:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const supabase = createServerClient();
  const { id } = await req.json();

  if (typeof id !== "string" || !id) {
    return NextResponse.json({ success: false, error: "Invalid ID provided." }, { status: 400 });
  }

  try {
    const { error } = await supabase
      .from("sabha_sadasya")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting Sabha Sadasya PDF:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Unexpected error deleting Sabha Sadasya PDF:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
