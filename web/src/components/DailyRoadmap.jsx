import React from 'react';
import { 
  CheckSquare, 
  Square, 
  ExternalLink, 
  Code2, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  BookOpen
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
    <section className="my-6">
      {/* Section Title */}
      <div className="flex items-center justify-between gap-2 mb-3 px-0.5">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold font-mono tracking-tight text-slate-200">
            Training Roadmap
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/60">
            20 Days
          </span>
        </div>

        {/* Prev / Next Buttons */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <button
            onClick={() => setActiveDay(prev => Math.max(1, prev - 1))}
            disabled={activeDay <= 1}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 py-1 text-slate-400">
            Day {activeDay} of 20
          </span>
          <button
            onClick={() => setActiveDay(prev => Math.min(20, prev + 1))}
            disabled={activeDay >= 20}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day Selector Pill Carousel */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {DAYS_ROADMAP.map(d => {
          const isActive = d.day === activeDay;
          const completedInDay = memberKeys.filter(k => !!members[k]?.completedQuests?.[d.day]).length;

          return (
            <button
              key={d.day}
              onClick={() => setActiveDay(d.day)}
              className={`flex flex-col items-center min-w-[50px] px-2 py-2 rounded-xl border text-xs font-mono transition-all shrink-0 ${
                isActive
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-slate-900/50 hover:bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className={`text-[10px] ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                DAY
              </span>
              <span className="text-sm font-semibold my-0.5">
                {String(d.day).padStart(2, '0')}
              </span>
              <div className="flex gap-1 mt-0.5">
                {memberKeys.map(k => {
                  const done = !!members[k]?.completedQuests?.[d.day];
                  return (
                    <span 
                      key={k}
                      className={`w-1 h-1 rounded-full ${
                        done 
                          ? isActive ? 'bg-white' : 'bg-emerald-400' 
                          : isActive ? 'bg-indigo-400' : 'bg-slate-700'
                      }`}
                    />
                  );
                })}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Roadmap Card */}
      <div className="mt-4 p-5 sm:p-6 rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-800/90 shadow-sm">
        
        {/* Day Meta Header */}
        <div className="pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {currentDayData.phase}
            </span>
          </div>
          <h3 className="text-lg font-semibold font-mono text-white">
            Day {currentDayData.day}: {currentDayData.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {currentDayData.description}
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
          
          {/* Left Column (Videos): 7 Cols */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400">
              <span className="font-semibold text-slate-300">Videos to Watch</span>
              <span>{currentDayData.videos.length} videos</span>
            </div>

            <div className="space-y-2.5">
              {currentDayData.videos.map((vid, idx) => (
                <div 
                  key={vid.id || idx}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                          {vid.playlist === 'prog' ? 'CEDT Prog' : 'CEDT DSA'} #{vid.num}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{vid.duration}</span>
                      </div>
                      <a 
                        href={vid.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs sm:text-sm font-medium text-slate-200 hover:text-indigo-300 transition flex items-center gap-1.5 group"
                      >
                        <span>{vid.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 shrink-0" />
                      </a>
                    </div>
                  </div>

                  {/* Member Checks */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/70 flex items-center gap-3 text-xs font-mono">
                    <span className="text-xs text-slate-400">Check:</span>
                    {memberKeys.map(k => {
                      const isWatched = !!members[k]?.completedVideos?.[vid.id];
                      return (
                        <button
                          key={k}
                          onClick={() => onToggleVideo(k, vid.id)}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-xs transition ${
                            isWatched 
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          {isWatched ? (
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-slate-500" />
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

          {/* Right Column (Practice Challenge): 5 Cols */}
          <div className="lg:col-span-5 flex flex-col justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800/90">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-xs font-mono font-medium text-slate-400 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Practice Problem</span>
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {currentDayData.challenge.filename}
                </span>
              </div>

              <h4 className="font-semibold font-mono text-sm text-slate-100 mb-2">
                {currentDayData.challenge.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 mb-3.5">
                {currentDayData.challenge.description}
              </p>

              <div className="text-xs text-slate-400 font-mono space-y-1 mb-4">
                <p>Target folder: <code>NAME/{currentDayData.challenge.filename}</code></p>
                <p>Commit your C++ code to GitHub, then mark task completed below.</p>
              </div>
            </div>

            {/* Member Toggles */}
            <div className="pt-3 border-t border-slate-800/80">
              <span className="text-xs font-mono text-slate-400 block mb-2">
                Day {activeDay} Submission:
              </span>
              <div className="grid grid-cols-3 gap-2 font-mono">
                {memberKeys.map(k => {
                  const isDone = !!members[k]?.completedQuests?.[activeDay];
                  return (
                    <button
                      key={k}
                      onClick={() => onToggleQuest(k, activeDay)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs transition ${
                        isDone
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="font-semibold mb-0.5">{k.toLowerCase()}</span>
                      <span className="text-[10px] text-slate-400">
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
