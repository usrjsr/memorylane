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

   
    const capsule = await Capsule.findById(id);
    if (!capsule) {
      return NextResponse.json(
        { error: "Capsule not found" },
        { status: 404 }
      );
    }

   
    if (capsule.status !== "unlocked") {
      capsule.status = "unlocked";
      await capsule.save();
    }

    
    const owner = await User.findById(capsule.ownerId);
    const senderName = owner?.name || "Someone special";
    const ownerEmail = owner?.email;

    // Send to owner + recipients (collaboratorEmails doesn't exist in model)
    const recipientEmails = Array.isArray(capsule.recipientEmails) ? capsule.recipientEmails : [];
    const allEmails = [...new Set([ownerEmail, ...recipientEmails].filter(Boolean))];
    
    const emailPromises = allEmails.map((email: string) =>
        sendUnlockNotification({
            recipientEmail: email,
            capsuleTitle: capsule.title,
            capsuleId: capsule._id.toString(),
            senderName,
        })
    );


    const results = await Promise.all(emailPromises);
    const successCount = results.filter((r) => r.success).length;
    const failedEmails = results.filter((r) => !r.success);

    if (failedEmails.length > 0) {
      console.error(
        `⚠️ [API] ${failedEmails.length}/${results.length} emails failed to send`
      );
    }

    console.log(
      `✅ [API] Capsule ${id} unlocked and ${successCount}/${allEmails.length} emails sent to: ${allEmails.join(", ")}`
    );

    return NextResponse.json({
      success: true,
      message: "Capsule unlocked and emails sent",
      emailsSent: successCount,
    });
  } catch (error) {
    console.error("❌ [API] Error unlocking capsule:", error);
    return NextResponse.json(
      { error: "Failed to unlock capsule" },
      { status: 500 }
    );
  }
}
