import { NextRequest, NextResponse } from "next/server";
import {cloudinary} from "../../../../lib/cloudinary";

export async function POST(req: NextRequest) {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
        return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: "adoption-app" }, (error, result) => {
                if (error) reject(error);
                resolve(result);
            }).end(buffer);
    });

    return NextResponse.json({ success: true, data: uploadResult });
}
