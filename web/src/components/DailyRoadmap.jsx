import React from 'react';
import { 
  CheckSquare, 
  Square, 
  ExternalLink, 
  Code2, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  Play
} from 'lucide-react';
import { DAYS_ROADMAP } from '../data/curriculum';

export default function DailyRoadmap({
  state,
  activeDay = 1,
  setActiveDay,
  onToggleVideo,
  onToggleQuest
}) {
  const currentDayData = DAYS_ROADMAP.find(d => d.day === activeDay) || DAYS_ROADMAP[0];
  const members = state.members || {};
  const memberKeys = ['GUY', 'FAN', 'HAN'];

  return (
    <section className="my-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold font-mono uppercase tracking-wider text-zinc-300">
            Roadmap
          </h2>
          <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
            Day {activeDay} of 20
          </span>
        </div>

        {/* Prev / Next */}
        <div className="flex items-center gap-1.5 font-mono">
          <button
            onClick={() => setActiveDay(prev => Math.max(1, prev - 1))}
            disabled={activeDay <= 1}
            className="p-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 disabled:opacity-30 transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveDay(prev => Math.min(20, prev + 1))}
            disabled={activeDay >= 20}
            className="p-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 disabled:opacity-30 transition"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none">
        {DAYS_ROADMAP.map(d => {
          const isActive = d.day === activeDay;
          return (
            <button
              key={d.day}
              onClick={() => setActiveDay(d.day)}
              className={`flex flex-col items-center min-w-[44px] px-2 py-1.5 rounded-lg border text-xs font-mono transition shrink-0 ${
                isActive
                  ? 'bg-zinc-800 border-zinc-600 text-zinc-100 font-semibold'
                  : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
              }`}
            >
              <span className="text-[10px] text-zinc-400">D</span>
              <span className="text-xs">{String(d.day).padStart(2, '0')}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Box */}
      <div className="mt-3 p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
        
        {/* Day Meta Header */}
        <div className="pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              {currentDayData.phase}
            </span>
          </div>
          <h3 className="text-base font-semibold font-mono text-zinc-100">
            Day {currentDayData.day}: {currentDayData.title}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            {currentDayData.description}
          </p>
        </div>

        {/* 2-Column: Video list & Challenge */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4">
          
          {/* Videos List (7 cols) */}
          <div className="lg:col-span-7">
            <div className="text-xs font-mono text-zinc-400 mb-2.5">
              Assigned Videos ({currentDayData.videos.length})
            </div>

            <div className="space-y-2">
              {currentDayData.videos.map((vid, idx) => (
                <div 
                  key={vid.id || idx}
                  className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-850 hover:border-zinc-800 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                          {vid.playlist === 'prog' ? 'Prog' : 'DSA'}
                        </span>
                        <span className="text-[11px] text-zinc-400 font-mono">{vid.duration}</span>
                      </div>
                      <a 
                        href={vid.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs font-medium text-zinc-200 hover:text-zinc-100 transition flex items-center gap-1.5 group"
                      >
                        <span>{vid.title}</span>
                        <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-zinc-300 shrink-0" />
                      </a>
                    </div>
                  </div>

                  {/* Member Checks */}
                  <div className="mt-2.5 pt-2 border-t border-zinc-850 flex items-center gap-3 text-xs font-mono">
                    <span className="text-[11px] text-zinc-400">Watched:</span>
                    {memberKeys.map(k => {
                      const isWatched = !!members[k]?.completedVideos?.[vid.id];
                      return (
                        <button
                          key={k}
                          onClick={() => onToggleVideo(k, vid.id)}
                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] border transition ${
                            isWatched 
                              ? 'bg-zinc-800 border-zinc-600 text-zinc-100' 
                              : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-300'
                          }`}
                        >
                          {isWatched ? (
                            <CheckSquare className="w-3 h-3 text-zinc-300" />
                          ) : (
                            <Square className="w-3 h-3 text-zinc-600" />
                          )}
                          <span>{k.toLowerCase()}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Practice Problem (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-4 rounded-lg bg-zinc-950/60 border border-zinc-850">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Practice Problem</span>
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                  {currentDayData.challenge.filename}
                </span>
              </div>

              <h4 className="font-semibold font-mono text-xs text-zinc-200 mb-1.5">
                {currentDayData.challenge.title}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-900/40 p-2.5 rounded border border-zinc-850 mb-3">
                {currentDayData.challenge.description}
              </p>

              <div className="text-[11px] text-zinc-400 font-mono space-y-1 mb-4">
                <p>Target file: <code>{members.GUY?.id || 'NAME'}/{currentDayData.challenge.filename}</code></p>
                <p>Commit to repo when finished, then toggle status below.</p>
              </div>
            </div>

            {/* Member Complete Toggles */}
            <div className="pt-3 border-t border-zinc-850">
              <span className="text-[11px] font-mono text-zinc-400 block mb-2">
                Day {activeDay} submission status:
              </span>
              <div className="grid grid-cols-3 gap-2 font-mono">
                {memberKeys.map(k => {
                  const isDone = !!members[k]?.completedQuests?.[activeDay];
                  return (
                    <button
                      key={k}
                      onClick={() => onToggleQuest(k, activeDay)}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs transition ${
                        isDone
                          ? 'bg-zinc-800 border-zinc-600 text-zinc-100'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-300'
                      }`}
                    >
                      <span className="font-semibold text-xs mb-0.5">{k.toLowerCase()}</span>
                      <span className="text-[10px] text-zinc-400">
                        {isDone ? 'Completed' : 'Pending'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
