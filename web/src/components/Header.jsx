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
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0b0f17]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-3">
          
          {/* Brand & Team */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 shadow-sm">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold font-mono tracking-tight text-white">
                  C-Learn
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-850 text-indigo-300 border border-slate-700/60">
                  เตรียมแข่ง 27 ก.ย.
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                guy &bull; fan &bull; han
              </p>
            </div>
          </div>

          {/* Countdown & Action Buttons */}
          <div className="flex items-center gap-2.5 justify-between sm:justify-end">
            <CountdownTimer targetDate={targetContestDate} />

            <div className="flex items-center gap-1.5">
              <button
                onClick={onSendDiscord}
                disabled={isSendingDiscord}
                title="ส่งรายงานความคืบหน้าเข้า Discord"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white text-xs font-mono transition shadow-sm disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-indigo-400" />
                <span>รายงาน Discord</span>
              </button>

              <button
                onClick={onOpenSettings}
                title="ตั้งค่าระบบ"
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Minimal Progress Bar */}
        <div className="pb-3 flex items-center gap-3 text-xs font-mono text-slate-400">
          <span className="text-[11px] font-medium text-slate-300 shrink-0">
            ความพร้อมรวม {readinessPercent}%
          </span>
          <div className="flex-1 bg-slate-900 rounded-full h-1.5 border border-slate-800/80 overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${readinessPercent}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 shrink-0">
            {totalQuestsDone}/{maxQuests} ภารกิจ
          </span>
        </div>

      </div>
    </header>
  );
}
