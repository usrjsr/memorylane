// app/api/capsules/unlock/route.ts
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import { Capsule } from '@/models/Capsule';
import { sendUnlockEmail } from '@/lib/email';

// Manual unlock by capsule owner (for testing)
export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { capsuleId } = await req.json();
    
    if (!capsuleId) {
      return NextResponse.json({ error: 'Capsule ID required' }, { status: 400 });
    }

    await dbConnect();
    
    const capsule = await Capsule.findById(capsuleId);
    
    if (!capsule) {
      return NextResponse.json({ error: 'Capsule not found' }, { status: 404 });
    }
    
    // Check if user is the owner
    if (capsule.ownerId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Only owner can manually unlock' }, { status: 403 });
    }
    
    if (capsule.status === 'unlocked') {
      return NextResponse.json({ 
        message: 'Capsule is already unlocked',
        capsule: { id: capsule._id, title: capsule.title }
      });
    }
    
    // Unlock the capsule
    capsule.status = 'unlocked';
    await capsule.save();
    
    // Send notifications
    if (capsule.recipientEmails && capsule.recipientEmails.length > 0) {
      await sendUnlockEmail({
        recipients: capsule.recipientEmails,
        capsuleTitle: capsule.title,
        capsuleId: capsule._id.toString(),
        unlockDate: capsule.unlockDate
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Capsule unlocked successfully',
      capsule: {
        id: capsule._id,
        title: capsule.title,
        status: capsule.status
      }
    });
    
  } catch (error) {
    console.error('[UNLOCK_API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to unlock capsule' },
      { status: 500 }
    );
  }
}