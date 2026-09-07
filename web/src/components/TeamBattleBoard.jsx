import React from 'react';
import { Flame, CheckCircle2, Clock, AlertTriangle, Code2, GitCommit, ChevronRight } from 'lucide-react';

export default function TeamBattleBoard({ 
  state, 
  gitData = {}, 
  activeDay = 1, 
  onViewCode 
}) {
  const members = state.members || {};
  const memberKeys = ['GUY', 'FAN', 'HAN'];

  return (
    <section className="my-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-mono tracking-tight flex items-center gap-2 text-slate-100">
            <span className="text-cyber-cyan">#</span> Team Battle Board
          </h2>
          <p className="text-xs text-slate-400">ติดตามวินัยรายวันและความคืบหน้าของสมาชิกทั้ง 3 คน</p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-dark-900 border border-slate-800 text-slate-400">
          เควสต์ปัจจุบัน: <b className="text-cyan-400">Day {activeDay}</b>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {memberKeys.map(key => {
          const m = members[key] || { id: key, name: key, streak: 0, completedQuests: {}, completedVideos: {} };
          const isQuestDone = !!m.completedQuests[activeDay];
          const videosDoneCount = Object.values(m.completedVideos || {}).filter(Boolean).length;
          const questsDoneCount = Object.values(m.completedQuests || {}).filter(Boolean).length;
          const memberGit = gitData[key] || { files: [], latestCommit: null };
          const files = memberGit.files || [];

          return (
            <div 
              key={key}
              className={`relative flex flex-col justify-between p-5 rounded-2xl bg-dark-900/90 border transition-all duration-300 hover:scale-[1.01] ${
                isQuestDone 
                  ? 'border-emerald-500/40 shadow-[0_0_25px_-5px_rgba(16,185,129,0.2)]' 
                  : 'border-slate-800/90 hover:border-slate-700'
              }`}
            >
              {/* Top Row: Avatar, Name, Streak */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-dark-850 border border-slate-750 shadow-inner">
                      {m.avatar || '👤'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-slate-100 font-mono text-base">{m.name}</h3>
                        {key === 'GUY' && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                            LEAD
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">{m.role || key}</p>
                    </div>
                  </div>

                  {/* Streak Flame Badge */}
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-mono text-xs font-bold ${
                    (m.streak || 0) > 0 
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 text-amber-400 shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]' 
                      : 'bg-dark-850 border border-slate-800 text-slate-400'
                  }`}>
                    <Flame className={`w-3.5 h-3.5 ${(m.streak || 0) > 0 ? 'text-amber-400 animate-bounce' : 'text-slate-500'}`} />
                    <span>{m.streak || 0} วัน</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-4">
                  {isQuestDone ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>เคลียร์เควสต์ Day {activeDay} แล้ว! 🎉</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
                      <span>ยังไม่ส่งเควสต์ Day {activeDay}</span>
                    </div>
                  )}
                </div>

                {/* Progress Indicators */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-dark-850 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block">ดูคลิปแล้ว</span>
                    <span className="text-sm font-bold text-cyan-400">{videosDoneCount}</span>
                    <span className="text-[10px] text-slate-400"> คลิป</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-dark-850 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block">เควสต์สำเร็จ</span>
                    <span className="text-sm font-bold text-cyber-emerald">{questsDoneCount}</span>
                    <span className="text-[10px] text-slate-400"> / 20 วัน</span>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Git Code Files & Commit Info */}
              <div className="mt-4 pt-4 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>โฟลเดอร์ <b className="text-slate-300">{key}/</b></span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {files.length} ไฟล์
                  </span>
                </div>

                {files.length > 0 ? (
                  <div className="space-y-1.5">
                    {files.slice(0, 2).map((file, idx) => (
                      <button
                        key={idx}
                        onClick={() => onViewCode(key, file)}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 border border-slate-800 hover:border-cyan-500/40 text-left transition group text-xs font-mono"
                      >
                        <span className="text-slate-300 group-hover:text-cyan-300 truncate">
                          {file.name}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition shrink-0" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic py-1">
                    ยังไม่มีไฟล์ .cpp ในโฟลเดอร์นี้
                  </p>
                )}

                {memberGit.latestCommit && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400 truncate font-mono">
                    <GitCommit className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate">{memberGit.latestCommit}</span>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}
