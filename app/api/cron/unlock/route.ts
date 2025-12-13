// app/api/cron/unlock/route.ts
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { Capsule } from '@/models/Capsule';
import { sendUnlockEmail } from '@/lib/email';

export async function GET(request: Request) {
  try {
    // Verify this is a legitimate cron request (for Vercel Cron)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const now = new Date();
    console.log(`⏰ [CRON] Running unlock check at ${now.toISOString()}`);
    
    // Find all locked capsules whose unlock date has passed
    const capsulesReadyToUnlock = await Capsule.find({
      status: 'locked',
      unlockDate: { $lte: now }
    });
    
    console.log(`📦 [CRON] Found ${capsulesReadyToUnlock.length} capsules ready to unlock`);
    
    const unlockResults = [];
    
    for (const capsule of capsulesReadyToUnlock) {
      try {
        // Update status to unlocked
        capsule.status = 'unlocked';
        await capsule.save();
        
        // Send email notifications to all recipients
        if (capsule.recipientEmails && capsule.recipientEmails.length > 0) {
          await sendUnlockEmail({
            recipients: capsule.recipientEmails,
            capsuleTitle: capsule.title,
            capsuleId: capsule._id.toString(),
            unlockDate: capsule.unlockDate
          });
        }
        
        unlockResults.push({
          id: capsule._id,
          title: capsule.title,
          recipients: capsule.recipientEmails.length,
          status: 'success'
        });
        
        console.log(`✅ [CRON] Unlocked capsule: ${capsule.title}`);
      } catch (error) {
        console.error(`❌ [CRON] Failed to unlock capsule ${capsule._id}:`, error);
        unlockResults.push({
          id: capsule._id,
          title: capsule.title,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return NextResponse.json({
      message: 'Unlock check completed',
      timestamp: now.toISOString(),
      processed: capsulesReadyToUnlock.length,
      results: unlockResults
    });
    
  } catch (error) {
    console.error('💥 [CRON] Fatal error:', error);
    return NextResponse.json(
      { 
        error: 'Cron job failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}