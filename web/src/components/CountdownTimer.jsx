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
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs">
        <Clock className="w-3.5 h-3.5" />
        <span>Contest Started</span>
      </div>
    );
  }

  const items = [
    { value: timeLeft.days, label: 'd' },
    { value: String(timeLeft.hours).padStart(2, '0'), label: 'h' },
    { value: String(timeLeft.minutes).padStart(2, '0'), label: 'm' },
    { value: String(timeLeft.seconds).padStart(2, '0'), label: 's' }
  ];

  return (
    <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800/80 rounded-xl px-2.5 py-1 text-xs font-mono backdrop-blur-sm">
      <Clock className="w-3.5 h-3.5 text-indigo-400 mr-1 shrink-0" />
      <div className="flex items-center gap-1 text-slate-300">
        {items.map((item, idx) => (
          <React.Fragment key={item.label}>
            <span className="font-semibold text-slate-100">{item.value}</span>
            <span className="text-[10px] text-slate-400 mr-0.5">{item.label}</span>
            {idx < items.length - 1 && <span className="text-slate-600">:</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
