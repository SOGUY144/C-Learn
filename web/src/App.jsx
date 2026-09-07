import React from 'react';
import { Terminal, Flame } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex items-center justify-center p-4">
      <div className="p-8 rounded-2xl bg-dark-900 border border-slate-800 text-center max-w-md">
        <div className="inline-flex p-3 rounded-xl bg-cyan-500/10 text-cyan-400 mb-4">
          <Terminal className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold font-mono text-cyan-400">C-Learn Tracker</h1>
        <p className="text-slate-400 mt-2 text-sm">Road to Day 27 C++ Contest</p>
        <div className="mt-4 flex items-center justify-center gap-2 text-amber-400">
          <Flame className="w-5 h-5 animate-pulse" />
          <span className="font-semibold text-sm">GUY &bull; FAN &bull; HAN</span>
        </div>
      </div>
    </div>
  );
}
