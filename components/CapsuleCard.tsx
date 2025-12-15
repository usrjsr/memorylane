'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CountdownTimer } from './CountdownTimer';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';

export function CapsuleCard({ capsule }: { capsule: any }) {
  const { data: session } = useSession();
  const [isUnlockedLocal, setIsUnlockedLocal] = useState(false);
  const [isSendingEmails, setIsSendingEmails] = useState(false);

  const unlockDate = new Date(capsule.unlockDate);

  const handleCapsuleUnlock = async () => {
    setIsUnlockedLocal(true);

    let capsuleId: string;
    if (typeof capsule._id === 'object' && capsule._id.toString) {
      capsuleId = capsule._id.toString();
    } else if (typeof capsule._id === 'string') {
      capsuleId = capsule._id;
    } else {
      console.error('Invalid capsule ID format:', capsule._id);
      return;
    }

    if (!isSendingEmails) {
      setIsSendingEmails(true);
      try {
        const response = await fetch(`/api/capsules/${capsuleId}/unlock`, {
          method: 'POST',
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Unlock emails sent:', data.emailsSent);
        } else {
          console.error('❌ Failed to send unlock emails');
        }
      } catch (error) {
        console.error('❌ Error sending unlock emails:', error);
      } finally {
        setIsSendingEmails(false);
      }
    }
  };

  const isUnlocked =
    capsule.status === "unlocked" ||
    isUnlockedLocal ||
    (capsule.unlockDate &&
      !isNaN(unlockDate.getTime()) &&
      unlockDate <= new Date());

  const isCollaborator = session?.user?.id && capsule.collaborators?.some(
    (collab: any) => {
      const collaboratorId = typeof collab === 'string' ? collab : collab?._id?.toString() || collab?.toString();
      return collaboratorId === session.user.id;
    }
  );

  let capsuleId: string;
  if (typeof capsule._id === 'object' && capsule._id.toString) {
    capsuleId = capsule._id.toString();
  } else if (typeof capsule._id === 'string') {
    capsuleId = capsule._id;
  } else {
    console.error('Invalid capsule ID format:', capsule._id);
    capsuleId = '';
  }

  return (
    <Card className="border-2 border-cyan-500/30 bg-slate-900 hover:border-cyan-500/60 hover:bg-slate-800/80 transition-all duration-300 rounded-2xl overflow-hidden group shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20">
      <CardHeader className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-b-2 border-cyan-500/20 pb-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg group-hover:shadow-cyan-500/50 transition-all">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-black text-white truncate">{capsule.title}</CardTitle>
            <p className="text-sm text-slate-400 truncate mt-1">
              by {capsule.ownerId?.name || 'Unknown'}
            </p>
            <CardDescription className="text-cyan-400 font-semibold mt-2">
              {capsule.theme || 'Other'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 pb-6 px-6">
        <p className="text-sm text-slate-300 mb-6 line-clamp-2 leading-relaxed">
          {capsule.description || 'No description'}
        </p>
        
        {isUnlocked ? (
          <Link
            href={`/unlocked/${capsuleId}`}
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold transition-all duration-200 group/link"
          >
            <span className="text-xl group-hover/link:scale-110 transition-transform duration-200">📂</span>
            <span className="border-b-2 border-cyan-400 group-hover/link:border-cyan-300">View Contents</span>
          </Link>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-sm font-bold text-slate-300">Locked until:</p>
            </div>
            <CountdownTimer unlockDate={capsule.unlockDate} onUnlock={handleCapsuleUnlock} />
            {!isUnlocked && isCollaborator && (
              <div className="mt-5 flex gap-3">
                <Link
                  href={`/capsule/${capsuleId}/upload`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/50 transform hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Memory
                </Link>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}