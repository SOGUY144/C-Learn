import React from 'react';
import { Terminal, Send, Settings, Flame, Trophy, ExternalLink } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

export default function Header({ 
  state, 
  targetContestDate, 
  onOpenSettings, 
  onSendDiscord, 
  isSendingDiscord 
}) {
  // Compute overall team readiness
  const members = state.members || {};
  let totalVideosWatched = 0;
  let totalQuestsDone = 0;
  const memberList = Object.values(members);

  memberList.forEach(m => {
    totalVideosWatched += Object.values(m.completedVideos || {}).filter(Boolean).length;
    totalQuestsDone += Object.values(m.completedQuests || {}).filter(Boolean).length;
  });

  // Max total points: 20 quests * 3 members = 60
  const maxQuests = 20 * 3;
  const readinessPercent = Math.min(100, Math.round((totalQuestsDone / maxQuests) * 100));

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-dark-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3 gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_-5px_rgba(0,242,254,0.3)]">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold font-mono tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  C-Learn
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  Arena v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>แข่ง C++ วันที่ 27</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">GUY • FAN • HAN</span>
              </p>
            </div>
          </div>

          {/* Countdown & Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 justify-between md:justify-end">
            <CountdownTimer targetDate={targetContestDate} />

            <div className="flex items-center gap-2">
              <button
                onClick={onSendDiscord}
                disabled={isSendingDiscord}
                title="ส่งสรุปสถานะทีมเข้า Discord ทันที"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:text-indigo-200 transition text-xs font-semibold shadow-[0_0_15px_-4px_rgba(99,102,241,0.2)] disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">แจ้งเตือน</span> Discord
              </button>

              <button
                onClick={onOpenSettings}
                title="ตั้งค่าระบบและ Webhook"
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-dark-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Global Team Readiness Gauge */}
        <div className="pb-2 flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono">ความพร้อมของทีม: <b className="text-cyan-400">{readinessPercent}%</b></span>
          </div>
          <div className="w-full bg-dark-900 rounded-full h-1.5 border border-slate-800/80 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyber-emerald transition-all duration-500 shadow-[0_0_10px_rgba(0,242,254,0.5)]"
              style={{ width: `${readinessPercent}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 font-mono shrink-0">
            {totalQuestsDone}/{maxQuests} เควสต์
          </span>
        </div>

      </div>
    </header>
  );
}
