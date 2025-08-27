import { type NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // Validate size + type
    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: "File size exceeds 25MB limit" }, { status: 400 });
    }
    const allowedTypes = [
      "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: "Invalid file type. Only images (JPEG, PNG, GIF, WebP) and PDF files are allowed",
      }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
const buffer = Buffer.from(arrayBuffer);

const originalName = (file as any).name || "upload";
const isPdf = file.type === "application/pdf" || originalName.toLowerCase().endsWith(".pdf");

const uploadResult = await new Promise<any>((resolve, reject) => {
  cloudinary.uploader.upload_stream(
    {
      // For PDFs you can use 'raw' or 'image'. 'image' gives you page thumbs, 'raw' is fine for storage.
      resource_type: isPdf ? "raw" : "image",
      folder: "uploads",                 // optional, keeps things tidy
      use_filename: true,
      unique_filename: true,
      filename_override: originalName,   // preserves .pdf in public_id base
      format: isPdf ? "pdf" : undefined, // <- CRITICAL: ensures a .pdf delivery path exists
      type: "upload",                    // default, but set explicitly to avoid 'private/authenticated' surprises
    },
    (err, res) => (err ? reject(err) : resolve(res))
  ).end(buffer);
});


// SAFELY build a browser-viewable URL
const cloud = process.env.CLOUDINARY_CLOUD_NAME!;
const resourceType: string = uploadResult.resource_type;   // 'raw' or 'image'
const publicId: string = uploadResult.public_id;           // may include folder slashes
const format: string = uploadResult.format || (isPdf ? "pdf" : "");

// IMPORTANT: public_id can include slashes; don’t encode slashes, only encode each segment
const encodedPublicId = publicId
  .split("/")
  .map(seg => encodeURIComponent(seg))
  .join("/");

const deliveryUrl = isPdf
  ? `https://res.cloudinary.com/${cloud}/${resourceType}/upload/${encodedPublicId}.${format}`
  : uploadResult.secure_url;


  return NextResponse.json({
    success: true,
    url: uploadResult.secure_url,  // safest
  });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
