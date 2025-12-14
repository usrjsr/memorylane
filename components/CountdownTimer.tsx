'use client';

import { useEffect, useState } from 'react';

export function CountdownTimer({ unlockDate }: { unlockDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isUnlocked: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const distance = new Date(unlockDate).getTime() - new Date().getTime();
      
      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isUnlocked: true });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isUnlocked: false });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [unlockDate]);

  if (timeLeft.isUnlocked) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 border-2 border-green-300 rounded-lg">
        <span className="text-lg">🎉</span>
        <span className="text-sm font-bold text-green-700">Unlocked!</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2 max-w-sm">
      <div className="flex flex-col items-center bg-amber-100 border-2 border-amber-300 rounded-xl p-3">
        <div className="text-2xl font-bold text-amber-900 tabular-nums">
          {String(timeLeft.days).padStart(2, '0')}
        </div>
        <div className="text-xs text-amber-700 font-medium mt-1">Days</div>
      </div>
      
      <div className="flex flex-col items-center bg-amber-100 border-2 border-amber-300 rounded-xl p-3">
        <div className="text-2xl font-bold text-amber-900 tabular-nums">
          {String(timeLeft.hours).padStart(2, '0')}
        </div>
        <div className="text-xs text-amber-700 font-medium mt-1">Hours</div>
      </div>
      
      <div className="flex flex-col items-center bg-amber-100 border-2 border-amber-300 rounded-xl p-3">
        <div className="text-2xl font-bold text-amber-900 tabular-nums">
          {String(timeLeft.minutes).padStart(2, '0')}
        </div>
        <div className="text-xs text-amber-700 font-medium mt-1">Mins</div>
      </div>
      
      <div className="flex flex-col items-center bg-amber-100 border-2 border-amber-300 rounded-xl p-3">
        <div className="text-2xl font-bold text-amber-900 tabular-nums">
          {String(timeLeft.seconds).padStart(2, '0')}
        </div>
        <div className="text-xs text-amber-700 font-medium mt-1">Secs</div>
      </div>
    </div>
  );
}