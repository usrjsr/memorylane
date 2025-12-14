import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getAuthSession } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Capsule } from "@/models/Capsule";
import { Media } from "@/models/Media";
import { User } from "@/models/User";
import { sendCapsuleCreationNotification } from "@/lib/email";
import { format } from "date-fns";

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
      collaborators,
      theme,
      privacy,
      mediaFiles,
    }: {
      title: string;
      description?: string;
      unlockDate: string | Date;
      recipients: string[];
      collaborators?: string[];
      theme?: string;
      privacy?: string;
      mediaFiles?: IncomingMedia[];
    } = body;

    if (!title || !unlockDate || !Array.isArray(recipients) || recipients.length === 0) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const ownerObjectId = new mongoose.Types.ObjectId(session.user.id);

    // Resolve collaborator emails to user IDs
    const collaboratorIds = [ownerObjectId];
    const collaboratorEmails = collaborators ? collaborators.filter((e) => e && e.trim()) : [];
    
    if (collaboratorEmails.length > 0) {
      const foundUsers = await User.find(
        { email: { $in: collaboratorEmails } },
        "_id"
      );
      foundUsers.forEach((user) => {
        if (!collaboratorIds.includes(user._id)) {
          collaboratorIds.push(user._id);
        }
      });
    }

    // 1) Create capsule first
    const capsule = await Capsule.create({
      title,
      description,
      ownerId: ownerObjectId,
      collaborators: collaboratorIds,
      recipientEmails: recipients.filter((e) => e && e.trim()),
      collaboratorEmails: collaboratorEmails,
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

    // 4) Get owner details for email
    const owner = await User.findById(ownerObjectId);
    const ownerName = owner?.name || "Someone";
    const formattedUnlockDate = format(new Date(unlockDate), "PPPpp");

    // 5) Send emails to recipients and collaborators
    const allEmails = [...new Set([...recipients.filter((e) => e && e.trim()), ...collaboratorEmails])];
    
    for (const email of allEmails) {
      await sendCapsuleCreationNotification({
        recipientEmail: email,
        capsuleTitle: title,
        capsuleId: capsule._id.toString(),
        creatorName: ownerName,
        unlockDate: formattedUnlockDate,
      });
    }

    console.log("✅ [CAPSULE_CREATE] Created", {
      capsuleId: capsule._id.toString(),
      mediaCount: createdMedia.length,
      emailsSent: allEmails.length,
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