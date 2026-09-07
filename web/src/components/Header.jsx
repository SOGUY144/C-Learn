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
    totalQuestsDone += Object.values(m?.completedQuests || {}).filter(Boolean).length;
  });

  const maxQuests = 20 * 3;
  const readinessPercent = Math.min(100, Math.round((totalQuestsDone / maxQuests) * 100));

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.07] bg-[#080c14]/80 backdrop-blur-xl transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-3">
          
          {/* Brand & Team */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500/20 to-sky-500/10 border border-indigo-500/30 text-indigo-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
              <Terminal className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold font-mono tracking-tight text-slate-100">
                  C-Learn
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  เตรียมแข่ง 27 ก.ย.
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-wide">
                guy &bull; fan &bull; han
              </p>
            </div>
          </div>

          {/* Countdown & Action Buttons */}
          <div className="flex items-center gap-2 justify-between sm:justify-end">
            <CountdownTimer targetDate={targetContestDate} />

            <div className="flex items-center gap-1.5">
              <button
                onClick={onSendDiscord}
                disabled={isSendingDiscord}
                title="ส่งรายงานความคืบหน้าเข้า Discord"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/[0.08] hover:border-white/[0.15] text-slate-200 hover:text-white text-xs font-mono transition shadow-sm disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-indigo-400" />
                <span>รายงาน Discord</span>
              </button>

              <button
                onClick={onOpenSettings}
                title="ตั้งค่าระบบ"
                className="p-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/[0.08] hover:border-white/[0.15] text-slate-400 hover:text-white transition"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Linear-style Progress Bar */}
        <div className="pb-2.5 flex items-center gap-3 text-xs font-mono text-slate-400">
          <span className="text-[11px] font-medium text-slate-300 shrink-0">
            ความพร้อมรวม {readinessPercent}%
          </span>
          <div className="flex-1 bg-slate-950/80 rounded-full h-1.5 border border-white/[0.06] overflow-hidden p-[1px]">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 transition-all duration-500 shadow-[0_0_12px_rgba(99,102,241,0.5)]"
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
