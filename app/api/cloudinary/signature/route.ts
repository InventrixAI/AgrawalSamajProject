import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ success: false, error: "Cloudinary env vars missing" }, { status: 500 });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    // We will sign only timestamp and folder to keep it simple
    const paramsToSign = `folder=uploads&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

    return NextResponse.json({ success: true, timestamp, signature, folder: "uploads", apiKey, cloudName });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
