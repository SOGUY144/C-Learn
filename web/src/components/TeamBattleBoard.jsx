import React from 'react';
import { Code2, GitCommit, ChevronRight, Check, Clock, Flame } from 'lucide-react';

const AVATAR_STYLES = {
  GUY: {
    bg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300',
    accent: 'bg-indigo-500'
  },
  FAN: {
    bg: 'bg-sky-500/10 border-sky-500/20 text-sky-300',
    accent: 'bg-sky-500'
  },
  HAN: {
    bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
    accent: 'bg-emerald-500'
  }
};

export default function TeamBattleBoard({ 
  state, 
  gitData = {}, 
  activeDay = 1, 
  onViewCode 
}) {
  const members = state.members || {};
  const memberKeys = ['GUY', 'FAN', 'HAN'];

  return (
    <section className="my-5">
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold font-mono tracking-tight text-slate-200">
            Team Members
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/60">
            3 Active
          </span>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Tracking Day {activeDay}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {memberKeys.map(key => {
          const m = members[key] || { id: key, name: key, streak: 0, completedQuests: {}, completedVideos: {} };
          const isQuestDone = !!m.completedQuests[activeDay];
          const videosDoneCount = Object.values(m.completedVideos || {}).filter(Boolean).length;
          const questsDoneCount = Object.values(m.completedQuests || {}).filter(Boolean).length;
          const memberGit = gitData[key] || { files: [], latestCommit: null };
          const files = memberGit.files || [];
          const initials = key.slice(0, 2);
          const style = AVATAR_STYLES[key] || AVATAR_STYLES.GUY;

          return (
            <div 
              key={key}
              className={`relative flex flex-col justify-between p-4 rounded-2xl bg-slate-900/50 backdrop-blur-sm border transition-all duration-200 hover:border-slate-700/80 hover:bg-slate-900/70 shadow-sm ${
                isQuestDone 
                  ? 'border-emerald-500/30 ring-1 ring-emerald-500/20' 
                  : 'border-slate-800/80'
              }`}
            >
              {/* Member Meta */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-mono font-bold border ${style.bg} shadow-inner`}>
                      {initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-100 font-mono text-sm tracking-tight">{key.toLowerCase()}</span>
                        {key === 'GUY' && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            lead
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono block">
                        /{key}
                      </span>
                    </div>
                  </div>

                  {/* Streak Pill */}
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-xs font-medium">
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>{m.streak || 0}d</span>
                  </div>
                </div>

                {/* Day Status Row */}
                <div className="mt-3.5 flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs font-mono">
                  <span className="text-slate-400">Day {activeDay}</span>
                  {isQuestDone ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-medium text-xs">
                      <Check className="w-3.5 h-3.5" />
                      <span>Completed</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-400 text-xs">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Pending</span>
                    </span>
                  )}
                </div>

                {/* Progress Indicators */}
                <div className="grid grid-cols-2 gap-2 mt-2.5 text-xs font-mono">
                  <div className="px-3 py-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
                    <span className="text-slate-400 block text-[10px]">Videos</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-sm font-semibold text-slate-100">{videosDoneCount}</span>
                      <span className="text-[10px] text-slate-400">/ 30</span>
                    </div>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
                    <span className="text-slate-400 block text-[10px]">Tasks</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-sm font-semibold text-slate-100">{questsDoneCount}</span>
                      <span className="text-[10px] text-slate-400">/ 20</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Git Section */}
              <div className="mt-3.5 pt-3 border-t border-slate-800/70">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                  <span className="flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Files in /{key}</span>
                  </span>
                  <span className="text-slate-400">{files.length}</span>
                </div>

                {files.length > 0 ? (
                  <div className="space-y-1.5">
                    {files.slice(0, 2).map((file, idx) => (
                      <button
                        key={idx}
                        onClick={() => onViewCode(key, file)}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-950/50 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 text-left transition group text-xs font-mono"
                      >
                        <span className="text-slate-300 group-hover:text-white truncate text-xs">
                          {file.name}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-300 shrink-0" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic py-1 font-mono">
                    No .cpp files committed yet
                  </p>
                )}

                {memberGit.latestCommit && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400 truncate font-mono">
                    <GitCommit className="w-3 h-3 text-slate-400 shrink-0" />
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
