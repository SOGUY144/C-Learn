import React from 'react';
import { Terminal, Send, Settings } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

export default function Header({ 
  state, 
  targetContestDate, 
  onOpenSettings, 
  onSendDiscord, 
  isSendingDiscord 
}) {
  const members = state.members || {};
  let totalQuestsDone = 0;
  const memberList = Object.values(members);

  memberList.forEach(m => {
    totalQuestsDone += Object.values(m.completedQuests || {}).filter(Boolean).length;
  });

  const maxQuests = 20 * 3;
  const readinessPercent = Math.min(100, Math.round((totalQuestsDone / maxQuests) * 100));

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-3">
          
          {/* Logo & Meta */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold font-mono tracking-tight text-zinc-100">
                  C-Learn
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                  Sept 27 Contest
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                Team: guy &bull; fan &bull; han
              </p>
            </div>
          </div>

          {/* Countdown & Action Buttons */}
          <div className="flex items-center gap-3 justify-between sm:justify-end">
            <CountdownTimer targetDate={targetContestDate} />

            <div className="flex items-center gap-1.5">
              <button
                onClick={onSendDiscord}
                disabled={isSendingDiscord}
                title="Send status report to Discord"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-zinc-100 text-xs font-mono transition disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-zinc-400" />
                <span>Discord</span>
              </button>

              <button
                onClick={onOpenSettings}
                title="Settings"
                className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Minimal Progress Line */}
        <div className="pb-2.5 flex items-center gap-3 text-xs font-mono text-zinc-400">
          <span className="text-[11px] shrink-0">Progress {readinessPercent}%</span>
          <div className="flex-1 bg-zinc-900 rounded-full h-1 border border-zinc-800 overflow-hidden">
            <div 
              className="h-full bg-zinc-300 transition-all duration-300"
              style={{ width: `${readinessPercent}%` }}
            />
          </div>
          <span className="text-[11px] text-zinc-400 shrink-0">
            {totalQuestsDone}/{maxQuests} tasks
          </span>
        </div>

      </div>
    </header>
  );
}
