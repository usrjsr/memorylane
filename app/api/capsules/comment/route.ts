import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAuthSession } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Capsule } from "@/models/Capsule";
import { Comment } from "@/models/Comment";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { capsuleId, text } = body;

    if (!capsuleId || !text) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    // Check if unlocked
    const capsule = await Capsule.findById(capsuleId);
    const isPastUnlockDate = new Date(capsule.unlockDate) <= new Date();

    if (capsule.status !== "unlocked" && !isPastUnlockDate) {
      return new NextResponse("Capsule is still locked", { status: 403 });
    }

    // Create the comment
    const newComment = await Comment.create({
      capsuleId,
      userId: session.user.id,
      userName: session.user.name,
      userImage: session.user.image,
      text: text.trim(),
    });

    console.log("✅ [COMMENT_CREATED]", newComment._id);

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("💥 [COMMENT_POST_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
