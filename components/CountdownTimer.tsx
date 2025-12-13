'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

export function CountdownTimer({ unlockDate }: { unlockDate: Date }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const distance = new Date(unlockDate).getTime() - new Date().getTime();
      if (distance < 0) {
        setTimeLeft('Unlocked!');
        clearInterval(timer);
      } else {
        setTimeLeft(formatDistanceToNow(new Date(unlockDate), { addSuffix: true }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [unlockDate]);

  return <div className="text-sm font-medium">{timeLeft}</div>;
}