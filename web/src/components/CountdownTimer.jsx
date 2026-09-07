import React, { useState, useEffect } from 'react';
import { Clock, Zap } from 'lucide-react';

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
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-rose/20 border border-cyber-rose/50 text-cyber-rose font-mono font-bold animate-pulse text-sm">
        <Zap className="w-4 h-4" />
        <span>🏁 วันแข่งขันมาถึงแล้ว! สู้ให้เต็มที่!</span>
      </div>
    );
  }

  const units = [
    { label: 'วัน', val: timeLeft.days },
    { label: 'ชม.', val: String(timeLeft.hours).padStart(2, '0') },
    { label: 'นาที', val: String(timeLeft.minutes).padStart(2, '0') },
    { label: 'วินาที', val: String(timeLeft.seconds).padStart(2, '0') },
  ];

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-900/80 border border-slate-800 text-xs text-slate-400 font-mono">
        <Clock className="w-3.5 h-3.5 text-cyan-400" />
        <span>เหลือเวลา</span>
      </div>
      <div className="flex items-center gap-1.5 font-mono">
        {units.map((u, i) => (
          <React.Fragment key={u.label}>
            <div className="flex flex-col items-center justify-center min-w-[40px] px-2 py-1 rounded-lg bg-dark-900 border border-cyan-500/30 shadow-[0_0_15px_-3px_rgba(0,242,254,0.15)]">
              <span className="text-sm sm:text-base font-bold text-cyan-300 leading-none">
                {u.val}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 leading-none">{u.label}</span>
            </div>
            {i < units.length - 1 && (
              <span className="text-cyan-400 font-bold text-xs">:</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
