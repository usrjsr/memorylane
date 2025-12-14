import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Reaction } from "@/models/Reaction";
import { Capsule } from "@/models/Capsule";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id)
      return new NextResponse("Unauthorized", { status: 401 });

    const { capsuleId, emoji } = await req.json();
    await dbConnect();

    const capsule = await Capsule.findById(capsuleId);
    if (!capsule) return new NextResponse("Capsule not found", { status: 404 });

    const isPastUnlockDate = new Date(capsule.unlockDate) <= new Date();
    if (capsule.status !== "unlocked" && !isPastUnlockDate) {
      return new NextResponse("Capsule is locked", { status: 403 });
    }

    // 1. Find if this user already has ANY reaction on this capsule
    const existingReaction = await Reaction.findOne({
      capsuleId,
      userId: session.user.id,
    });

    if (existingReaction) {
      if (existingReaction.emoji === emoji) {
        // Same emoji → remove it (toggle off)
        await Reaction.deleteOne({ _id: existingReaction._id });
        console.log(`[REACTION] Removed ${emoji} from ${capsuleId}`);
        return NextResponse.json({ action: "removed" });
      } else {
        // Different emoji → replace the old one
        existingReaction.emoji = emoji;
        await existingReaction.save();
        console.log(`[REACTION] Changed to ${emoji} from ${capsuleId}`);
        return NextResponse.json({ action: "updated" });
      }
    } else {
      // No previous reaction → add new one
      await Reaction.create({
        capsuleId,
        userId: session.user.id,
        emoji,
      });
      console.log(`[REACTION] Added ${emoji} to ${capsuleId}`);
      return NextResponse.json({ action: "added" });
    }
  } catch (error) {
    console.error("[REACTION API] Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
