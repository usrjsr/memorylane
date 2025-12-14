// app/api/cron/unlock/route.ts

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Capsule } from "@/models/Capsule";
import { User } from "@/models/User";
import { sendUnlockNotification } from "@/lib/email";

export async function GET(req: Request) {
  // Optional: Verify cron secret for security (Uncomment this when deploying)
  // const authHeader = req.headers.get("authorization");
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //     return new NextResponse("Unauthorized", { status: 401 });
  // }

  try {
    await dbConnect();

    // Find all capsules that should be unlocked
    const capsulesToUnlock = await Capsule.find({
      status: "locked",
      unlockDate: { $lte: new Date() },
    });

    console.log(`🔓 [CRON] Found ${capsulesToUnlock.length} capsules to unlock`);

    for (const capsule of capsulesToUnlock) {
      // 1. Update status
      capsule.status = "unlocked";
      await capsule.save();

      // 2. Get the owner's name for the email
      const owner = await User.findById(capsule.ownerId);
      const senderName = owner?.name || "Someone special";

      // 3. Send email to each recipient
      for (const recipientEmail of capsule.recipientEmails || []) {
        const emailResult = await sendUnlockNotification({
          recipientEmail,
          capsuleTitle: capsule.title,
          capsuleId: capsule._id.toString(),
          senderName,
        });
        
        if (!emailResult.success) {
          console.error(`❌ [CRON] Failed to send unlock email to ${recipientEmail}:`, emailResult.error);
        }
      }

      console.log(`✅ [CRON] Unlocked and notified: ${capsule.title}`);
    }

    return NextResponse.json({
      success: true,
      unlocked: capsulesToUnlock.length,
    });
  } catch (error) {
    console.error("💥 [CRON] Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}