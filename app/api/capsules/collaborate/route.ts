// app/api/capsules/collaborate/route.ts

import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Capsule } from "@/models/Capsule";
import { User } from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();

    const { capsuleId, email } = await req.json();

    if (!capsuleId || !email) {
      return new NextResponse("Missing capsuleId or email", { status: 400 });
    }

    
    const capsule = await Capsule.findById(capsuleId);
    if (!capsule) {
      return new NextResponse("Capsule not found", { status: 404 });
    }

   
    if (capsule.ownerId.toString() !== session.user.id) {
      return new NextResponse("Forbidden: Only the capsule owner can manage collaborators.", { status: 403 });
    }

    const userToAdd = await User.findOne({ email: email.toLowerCase() });
    if (!userToAdd) {
      return new NextResponse("User not found. They must sign up to collaborate.", { status: 404 });
    }
    
   
    if (capsule.recipientEmails.includes(email.toLowerCase())) {
         return new NextResponse("This user is a recipient. They cannot be added as a collaborator.", { status: 400 });
    }

    
    if (capsule.collaborators.includes(userToAdd._id)) {
      return new NextResponse("User is already contributing to this capsule.", { status: 400 });
    }
    

    capsule.collaborators.push(userToAdd._id);
    await capsule.save();

    return NextResponse.json({ success: true, email });
  } catch (error) {
    console.error("💥 [COLLABORATE] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}