import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function CountdownTimer({ targetDate = '2026-09-27T09:00:00' }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false
  });

  useEffect(() => {
    function update() {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPassed: false });
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.isPassed) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-700 text-zinc-300 font-mono text-xs">
        <Clock className="w-3.5 h-3.5 text-zinc-400" />
        <span>Contest in progress</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-300">
      <Clock className="w-3.5 h-3.5 text-zinc-400" />
      <span className="text-zinc-400">T-</span>
      <span className="font-semibold text-zinc-100">{timeLeft.days}d</span>
      <span className="text-zinc-400">:</span>
      <span className="font-semibold text-zinc-100">{String(timeLeft.hours).padStart(2, '0')}h</span>
      <span className="text-zinc-400">:</span>
      <span className="font-semibold text-zinc-100">{String(timeLeft.minutes).padStart(2, '0')}m</span>
      <span className="text-zinc-400">:</span>
      <span className="font-semibold text-zinc-100">{String(timeLeft.seconds).padStart(2, '0')}s</span>
    </div>
  );
}
