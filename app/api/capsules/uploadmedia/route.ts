// app/api/capsules/uploadmedia/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getAuthSession } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Capsule } from "@/models/Capsule";
import { Media } from "@/models/Media";

type IncomingMedia = {
  url: string;
  name?: string;
  type: "image" | "video" | "audio" | "pdf";
  key?: string;
};

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await dbConnect();

  try {
    const body = await req.json();
    const {
      capsuleId,
      mediaFiles,
    }: { capsuleId: string; mediaFiles: IncomingMedia[] } = body;

    if (!capsuleId || !Array.isArray(mediaFiles) || mediaFiles.length === 0) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const capsule = await Capsule.findById(capsuleId);
    if (!capsule) return new NextResponse("Capsule not found", { status: 404 });

    const ownerObjectId = new mongoose.Types.ObjectId(session.user.id);

    // Create media docs
    const createdMedia = [];
    for (const m of mediaFiles) {
      if (!m?.url || !m?.type) continue;

      const doc = await Media.create({
        capsuleId: capsule._id,
        uploaderId: ownerObjectId,
        fileUrl: m.url,
        fileType: m.type,
        fileName: m.name || "file",
        fileKey: m.key,
      });

      createdMedia.push(doc);
    }

    if (createdMedia.length > 0) {
      capsule.mediaIds.push(...createdMedia.map((d) => d._id));
      await capsule.save();
    }

    return NextResponse.json(
      {
        capsuleId: capsule._id.toString(),
        addedCount: createdMedia.length,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("💥 [UPLOAD_MEDIA] Error:", err);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: err instanceof Error ? err.message : "Unknown",
      },
      { status: 500 }
    );
  }
}
