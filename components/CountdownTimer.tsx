'use client';

import { useEffect, useState } from 'react';

export function CountdownTimer({ unlockDate, onUnlock }: { unlockDate: Date | string; onUnlock?: () => void }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isUnlocked: false,
    mounted: false
  });

  useEffect(() => {
    setTimeLeft(prev => ({ ...prev, mounted: true }));

    const calculateTimeLeft = () => {
      const unlockTime = new Date(unlockDate).getTime();
      const now = new Date().getTime();
      const distance = unlockTime - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isUnlocked: true, mounted: true });
        onUnlock?.();
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isUnlocked: false, mounted: true });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [unlockDate, onUnlock]);

  if (!timeLeft.mounted) {
    return (
      <div className="grid grid-cols-4 gap-3 max-w-sm animate-pulse">
        <div className="bg-slate-700/50 rounded-xl p-4 h-20"></div>
        <div className="bg-slate-700/50 rounded-xl p-4 h-20"></div>
        <div className="bg-slate-700/50 rounded-xl p-4 h-20"></div>
        <div className="bg-slate-700/50 rounded-xl p-4 h-20"></div>
      </div>
    );
  }

  if (timeLeft.isUnlocked) {
    return (
      <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-900/40 border-2 border-emerald-500 rounded-lg">
        <span className="text-2xl animate-bounce">🎉</span>
        <span className="text-base font-black text-emerald-300">Capsule Unlocked!</span>
      </div>
    );
  }

  const maxDigits = Math.max(
    String(timeLeft.days).length,
    String(timeLeft.hours).length,
    String(timeLeft.minutes).length,
    String(timeLeft.seconds).length
  );

  const TimeUnit = ({ value, label }: { value: number; label: string }) => {
    const getFontSize = () => {
      if (maxDigits >= 4) return 'text-lg sm:text-xl md:text-2xl';
      if (maxDigits === 3) return 'text-2xl sm:text-3xl md:text-4xl';
      return 'text-3xl sm:text-4xl md:text-5xl';
    };

    return (
      <div className="flex flex-col items-center">
        <div className="bg-gradient-to-br from-cyan-900/60 to-blue-900/60 border-2 border-cyan-500/50 rounded-xl p-3 sm:p-4 w-full hover:border-cyan-400 transition-all aspect-square flex items-center justify-center">
          <div className={`${getFontSize()} font-black text-white tabular-nums tracking-tight text-center leading-none`}>
            {String(value).padStart(2, '0')}
          </div>
        </div>
        <div className="text-xs sm:text-sm text-slate-400 font-bold mt-2 uppercase tracking-wider">
          {label}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </div>
      <div className="text-center">
        <p className="text-xs text-slate-500 font-medium">
          Unlocking on {new Date(unlockDate).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
}