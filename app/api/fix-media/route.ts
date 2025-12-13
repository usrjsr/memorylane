// app/api/fix-media/route.ts
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { Media } from '@/models/Media';
import { Capsule } from '@/models/Capsule';
import mongoose from 'mongoose';

export async function GET() {
  await dbConnect();
  
  // Find all media without capsuleId or with null
  const orphanMedia = await Media.find({
    $or: [
      { capsuleId: null },
      { capsuleId: { $exists: false } }
    ]
  });
  
  console.log(`Found ${orphanMedia.length} orphan media files`);
  
  let fixedCount = 0;
  
  for (const media of orphanMedia) {
    // Find capsules that have this media in their mediaIds
    const capsule = await Capsule.findOne({
      mediaIds: { $in: [media._id] }
    });
    
    if (capsule) {
      media.capsuleId = capsule._id;
      await media.save();
      fixedCount++;
      console.log(`✅ Fixed media ${media._id} -> capsule ${capsule._id}`);
    }
  }
  
  return NextResponse.json({
    message: `Fixed ${fixedCount} media files`,
    orphanMedia: orphanMedia.length,
    fixedCount,
    success: true
  });
}