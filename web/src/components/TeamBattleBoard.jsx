import React from 'react';
import { Code2, GitCommit, ChevronRight, Check, Circle } from 'lucide-react';

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
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold font-mono uppercase tracking-wider text-zinc-300">
            Team Members
          </h2>
          <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
            3
          </span>
        </div>
        <span className="text-[11px] font-mono text-zinc-400">
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

          return (
            <div 
              key={key}
              className={`flex flex-col justify-between p-4 rounded-xl bg-zinc-900/60 border transition ${
                isQuestDone 
                  ? 'border-emerald-500/40 bg-zinc-900/90' 
                  : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {/* Member Meta */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold bg-zinc-850 border border-zinc-750 text-zinc-200">
                      {initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-zinc-100 font-mono text-sm">{key.toLowerCase()}</span>
                        {key === 'GUY' && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                            lead
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-zinc-400 font-mono block">
                        /{key}
                      </span>
                    </div>
                  </div>

                  {/* Streak Text */}
                  <div className="text-[11px] font-mono text-zinc-400">
                    <span className="text-zinc-200 font-semibold">{m.streak || 0}</span>d streak
                  </div>
                </div>

                {/* Day Status Pill */}
                <div className="mt-3 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 text-xs font-mono">
                  <span className="text-zinc-400">Day {activeDay}</span>
                  {isQuestDone ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                      <Check className="w-3 h-3" />
                      <span>Completed</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-zinc-400 text-[11px]">
                      <Circle className="w-2.5 h-2.5 fill-zinc-600 text-zinc-600" />
                      <span>Pending</span>
                    </span>
                  )}
                </div>

                {/* Compact Stats */}
                <div className="grid grid-cols-2 gap-2 mt-2.5 text-[11px] font-mono">
                  <div className="px-2.5 py-1.5 rounded-lg bg-zinc-950/40 border border-zinc-850">
                    <span className="text-zinc-400 block text-[10px]">Videos</span>
                    <span className="text-zinc-200 font-semibold">{videosDoneCount}</span>
                    <span className="text-zinc-400"> / 30</span>
                  </div>
                  <div className="px-2.5 py-1.5 rounded-lg bg-zinc-950/40 border border-zinc-850">
                    <span className="text-zinc-400 block text-[10px]">Tasks</span>
                    <span className="text-zinc-200 font-semibold">{questsDoneCount}</span>
                    <span className="text-zinc-400"> / 20</span>
                  </div>
                </div>
              </div>

              {/* Git Section */}
              <div className="mt-3 pt-3 border-t border-zinc-800/60">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono mb-1.5">
                  <span className="flex items-center gap-1">
                    <Code2 className="w-3 h-3 text-zinc-400" />
                    <span>Files</span>
                  </span>
                  <span>{files.length}</span>
                </div>

                {files.length > 0 ? (
                  <div className="space-y-1">
                    {files.slice(0, 2).map((file, idx) => (
                      <button
                        key={idx}
                        onClick={() => onViewCode(key, file)}
                        className="w-full flex items-center justify-between px-2 py-1 rounded bg-zinc-950/60 hover:bg-zinc-800/80 border border-zinc-850 text-left transition group text-xs font-mono"
                      >
                        <span className="text-zinc-300 group-hover:text-zinc-100 truncate text-[11px]">
                          {file.name}
                        </span>
                        <ChevronRight className="w-3 h-3 text-zinc-400 group-hover:text-zinc-200 shrink-0" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-400 italic py-0.5 font-mono">
                    No .cpp files found
                  </p>
                )}

                {memberGit.latestCommit && (
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-zinc-400 truncate font-mono">
                    <GitCommit className="w-3 h-3 shrink-0" />
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
