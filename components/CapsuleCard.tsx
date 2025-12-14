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
    <Card className="border-2 border-amber-200 bg-white hover:shadow-xl transition-all duration-300 hover:border-amber-300 rounded-2xl overflow-hidden">
      <CardHeader className="bg-amber-50 border-b-2 border-amber-200 pb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-bold text-amber-900 truncate">{capsule.title}</CardTitle>
            <CardDescription className="text-amber-700 font-medium mt-1">
              {capsule.theme || 'Other'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-5 pb-6 px-6">
        <p className="text-sm text-amber-800 mb-4 line-clamp-2">
          {capsule.description || 'No description'}
        </p>
        {isUnlocked ? (
          <Link 
            href={`/unlocked/${capsuleId}`}
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-800 font-semibold transition-colors duration-200 group"
          >
            <span className="text-xl group-hover:scale-110 transition-transform duration-200">📂</span>
            <span className="border-b-2 border-amber-600 group-hover:border-amber-800">View Contents</span>
          </Link>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-sm font-semibold text-amber-900">Locked until:</p>
            </div>
            <CountdownTimer unlockDate={capsule.unlockDate} />
            <p className="text-xs text-amber-600 mt-3 font-mono">ID: {capsuleId}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}