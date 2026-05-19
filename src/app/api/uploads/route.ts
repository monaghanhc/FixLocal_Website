import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const maxUploadBytes = 8 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function extensionFor(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return "jpg";
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Continue as the demo user before uploading." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing image file." }, { status: 400 });
    }

    if (!allowedTypes.has(file.type)) {
      return NextResponse.json(
        { error: "Upload a JPG, PNG, WEBP, or GIF image." },
        { status: 400 }
      );
    }

    if (file.size > maxUploadBytes) {
      return NextResponse.json({ error: "Image must be 8MB or smaller." }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const fileName = `${randomUUID()}.${extensionFor(file.type)}`;
    const filePath = path.join(uploadsDir, fileName);
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, bytes);
    await prisma.uploadedImage.create({
      data: {
        userId: user.id,
        imagePath: `/uploads/${fileName}`,
        originalName: file.name,
        mimeType: file.type,
        sizeBytes: file.size
      }
    });

    return NextResponse.json({
      imagePath: `/uploads/${fileName}`,
      fileName
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "File upload failed. Try another image." }, { status: 500 });
  }
}
