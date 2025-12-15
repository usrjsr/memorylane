import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Capsule } from "@/models/Capsule";
import { User } from "@/models/User";
import { sendUnlockNotification } from "@/lib/email";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await dbConnect();

    
    const capsule = await Capsule.findById(id).populate(
      "collaborators",
      "email name"
    );

    if (!capsule) {
      return NextResponse.json({ error: "Capsule not found" }, { status: 404 });
    }

    if (capsule.status !== "unlocked") {
      capsule.status = "unlocked";
      await capsule.save();
    }

    const owner = await User.findById(capsule.ownerId).lean();
    const senderName = owner?.name || "Someone special";
    const ownerEmail = owner?.email;

    const recipientEmails = Array.isArray(capsule.recipientEmails)
      ? capsule.recipientEmails
      : [];

    const collaboratorEmails = Array.isArray(capsule.collaborators)
      ? capsule.collaborators
          .map((u: any) => u?.email)
          .filter((e: any) => typeof e === "string" && e.length > 0)
      : [];

    const allEmails = [
      ...new Set(
        [ownerEmail, ...recipientEmails, ...collaboratorEmails].filter(Boolean)
      ),
    ];

    const results = await Promise.all(
      allEmails.map((email) =>
        sendUnlockNotification({
          recipientEmail: email,
          capsuleTitle: capsule.title,
          capsuleId: capsule._id.toString(),
          senderName,
        })
      )
    );

    const successCount = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success);

    if (failed.length) {
      console.error(
        `⚠️ [API] ${failed.length}/${results.length} emails failed`
      );
    }

    return NextResponse.json({
      success: true,
      message: "Capsule unlocked and emails sent",
      emailsSent: successCount,
      recipients: allEmails,
    });
  } catch (error) {
    console.error("❌ [API] Error unlocking capsule:", error);
    return NextResponse.json(
      { error: "Failed to unlock capsule" },
      { status: 500 }
    );
  }
}
