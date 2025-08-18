import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { direction } = await request.json()
    const { id } = await params

    const supabase = createServerClient()

    // Get current image
    const { data: currentImage, error: currentError } = await supabase
      .from("home_images")
      .select("*")
      .eq("id", id)
      .single()

    if (currentError) throw currentError

    // Get all images ordered by display_order
    const { data: allImages, error: allError } = await supabase
      .from("home_images")
      .select("*")
      .order("display_order", { ascending: true })

    if (allError) throw allError

    const currentIndex = allImages.findIndex((img) => img.id === id)

    if (direction === "up" && currentIndex > 0) {
      // Swap with previous image
      const prevImage = allImages[currentIndex - 1]

      await supabase.from("home_images").update({ display_order: prevImage.display_order }).eq("id", currentImage.id)

      await supabase.from("home_images").update({ display_order: currentImage.display_order }).eq("id", prevImage.id)
    } else if (direction === "down" && currentIndex < allImages.length - 1) {
      // Swap with next image
      const nextImage = allImages[currentIndex + 1]

      await supabase.from("home_images").update({ display_order: nextImage.display_order }).eq("id", currentImage.id)

      await supabase.from("home_images").update({ display_order: currentImage.display_order }).eq("id", nextImage.id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}
