import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateUploadUrl } from "@/lib/s3";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { fileName, fileType, dogId } = await request.json();

  if (!fileName || !fileType || !dogId) {
    return NextResponse.json(
      { error: "fileName, fileType, and dogId are required." },
      { status: 400 }
    );
  }

  if (!ALLOWED_TYPES.includes(fileType)) {
    return NextResponse.json(
      { error: "File type not allowed. Accepted: PDF, JPEG, PNG, WebP" },
      { status: 400 }
    );
  }

  const dog = await prisma.dog.findUnique({ where: { id: dogId } });
  if (!dog || dog.userId !== session.user.id) {
    return NextResponse.json({ error: "Dog not found." }, { status: 404 });
  }

  const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const s3Key = `documents/${session.user.id}/${dogId}/${randomUUID()}-${sanitizedName}`;

  const uploadUrl = await generateUploadUrl(s3Key, fileType);

  return NextResponse.json({ uploadUrl, s3Key });
}
