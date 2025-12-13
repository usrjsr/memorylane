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
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  await dbConnect();

  try {
    const body = await req.json();

    const {
      title,
      description,
      unlockDate,
      recipients,
      theme,
      privacy,
      mediaFiles,
    }: {
      title: string;
      description?: string;
      unlockDate: string | Date;
      recipients: string[];
      theme?: string;
      privacy?: string;
      mediaFiles?: IncomingMedia[];
    } = body;

    if (!title || !unlockDate || !Array.isArray(recipients) || recipients.length === 0) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const ownerObjectId = new mongoose.Types.ObjectId(session.user.id);

    // 1) Create capsule first
    const capsule = await Capsule.create({
      title,
      description,
      ownerId: ownerObjectId,
      collaborators: [ownerObjectId],
      recipientEmails: recipients.filter((e) => e && e.trim()),
      unlockType: "date",
      unlockDate: new Date(unlockDate),
      status: "locked",
      theme: theme || "Other",
      privacy: privacy || "recipients-only",
      mediaIds: [],
    });

    // 2) Create media docs (if any)
    const cleanMedia = Array.isArray(mediaFiles) ? mediaFiles : [];
    const createdMedia = [];

    for (const m of cleanMedia) {
      if (!m?.url || !m?.type) continue;

      // IMPORTANT: m.type must be normalized ('image'|'video'|'audio'|'pdf')
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

    // 3) Save mediaIds on capsule
    if (createdMedia.length > 0) {
      capsule.mediaIds = createdMedia.map((d) => d._id);
      await capsule.save();
    }

    console.log("✅ [CAPSULE_CREATE] Created", {
      capsuleId: capsule._id.toString(),
      mediaCount: createdMedia.length,
    });

    return NextResponse.json(
      {
        capsuleId: capsule._id.toString(),
        mediaCount: createdMedia.length,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("💥 [CAPSULE_CREATE] Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err instanceof Error ? err.message : "Unknown" },
      { status: 500 }
    );
  }
}