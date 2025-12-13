// components/CapsuleCard.tsx
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CountdownTimer } from './CountdownTimer';
import Link from 'next/link';

export function CapsuleCard({ capsule }: { capsule: any }) {
  const unlockDate = new Date(capsule.unlockDate);

const isUnlocked =
  capsule.status === "unlocked" ||
  (capsule.unlockDate &&
   !isNaN(unlockDate.getTime()) &&
   unlockDate <= new Date());

  
  // Handle both ObjectId and string formats
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
    <Card>
      <CardHeader>
        <CardTitle>{capsule.title}</CardTitle>
        <CardDescription>{capsule.theme || 'Other'}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-2">
          {capsule.description || 'No description'}
        </p>
        {isUnlocked ? (
          <Link 
            href={`/unlocked/${capsuleId}`}
            className="text-blue-600 hover:underline font-semibold"
          >
            📂 View Contents
          </Link>
        ) : (
          <>
            <p className="text-sm font-medium">Unlocks on:</p>
            <CountdownTimer unlockDate={capsule.unlockDate} />
            {/* Debug: Show the ID */}
            <p className="text-xs text-gray-400 mt-2">ID: {capsuleId}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}