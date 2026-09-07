import React from 'react';
import { 
  CheckSquare, 
  Square, 
  Youtube, 
  ExternalLink, 
  FileCode2, 
  CheckCircle2, 
  Sparkles,
  Calendar,
  ChevronLeft,
  ChevronRight,
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

  // Check if current day is complete for each member
  const isGuyQuestDone = !!members.GUY?.completedQuests?.[activeDay];
  const isFanQuestDone = !!members.FAN?.completedQuests?.[activeDay];
  const isHanQuestDone = !!members.HAN?.completedQuests?.[activeDay];

  const allDoneToday = isGuyQuestDone && isFanQuestDone && isHanQuestDone;

  return (
    <section className="my-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-mono tracking-tight flex items-center gap-2 text-slate-100">
            <span className="text-cyber-emerald">#</span> 20-Day Quest Roadmap
          </h2>
          <p className="text-xs text-slate-400">ตารางฝึกซ้อมรายวันนับถอยหลังสู่การแข่งวันที่ 27</p>
        </div>

        {/* Day Navigation Prev/Next */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveDay(prev => Math.max(1, prev - 1))}
            disabled={activeDay <= 1}
            className="p-1.5 rounded-lg bg-dark-900 border border-slate-800 text-slate-400 hover:text-cyan-400 disabled:opacity-30 disabled:hover:text-slate-400 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-dark-900 border border-slate-800 text-cyan-300 font-bold">
            Day {activeDay} / 20
          </span>
          <button
            onClick={() => setActiveDay(prev => Math.min(20, prev + 1))}
            disabled={activeDay >= 20}
            className="p-1.5 rounded-lg bg-dark-900 border border-slate-800 text-slate-400 hover:text-cyan-400 disabled:opacity-30 disabled:hover:text-slate-400 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Day Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        {DAYS_ROADMAP.map(d => {
          const isActive = d.day === activeDay;
          const dayQuestsDoneCount = memberKeys.filter(k => !!members[k]?.completedQuests?.[d.day]).length;

          return (
            <button
              key={d.day}
              onClick={() => setActiveDay(d.day)}
              className={`flex flex-col items-center min-w-[58px] px-2 py-2 rounded-xl border text-xs font-mono transition shrink-0 ${
                isActive
                  ? 'bg-cyan-500/10 border-cyan-500/60 text-cyan-300 shadow-[0_0_15px_-3px_rgba(0,242,254,0.25)]'
                  : 'bg-dark-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              <span className="text-[10px] text-slate-400">DAY</span>
              <span className="text-sm font-bold my-0.5">{d.day}</span>
              <div className="flex gap-0.5 mt-0.5">
                {memberKeys.map(k => {
                  const done = !!members[k]?.completedQuests?.[d.day];
                  return (
                    <span 
                      key={k} 
                      className={`w-1.5 h-1.5 rounded-full ${done ? 'bg-emerald-400' : 'bg-slate-700'}`}
                    />
                  );
                })}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Quest Card for Active Day */}
      <div className="mt-4 p-5 sm:p-6 rounded-2xl bg-dark-900/90 border border-slate-800 shadow-xl">
        
        {/* Phase Badge & Day Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 mb-1.5">
              {currentDayData.phase}
            </span>
            <h3 className="text-lg sm:text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
              <span className="text-cyan-400">Day {currentDayData.day}:</span> {currentDayData.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {currentDayData.description}
            </p>
          </div>

          {allDoneToday && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs shrink-0 self-start sm:self-center">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>ทีมเคลียร์เควสต์วันนี้ครบ 100%!</span>
            </div>
          )}
        </div>

        {/* 2-Column Grid: Left = Video Checklist, Right = Coding Challenge */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
          
          {/* Left Column (Videos): 7 Cols */}
          <div className="lg:col-span-7">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-3">
              <Youtube className="w-4 h-4 text-rose-500" />
              <span>วิดีโอที่ต้องดูประจำวัน ({currentDayData.videos.length} คลิป)</span>
            </h4>

            <div className="space-y-2.5">
              {currentDayData.videos.map((vid, idx) => (
                <div 
                  key={vid.id || idx}
                  className="p-3 rounded-xl bg-dark-850/80 border border-slate-800/90 hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          {vid.playlist === 'prog' ? 'CEDT Prog' : 'CEDT DSA'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">⏱️ {vid.duration}</span>
                      </div>
                      <a 
                        href={vid.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs sm:text-sm font-medium text-slate-200 hover:text-cyan-300 transition flex items-center gap-1.5 group"
                      >
                        <span>{vid.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 shrink-0" />
                      </a>
                    </div>
                  </div>

                  {/* Multi-member Checkboxes */}
                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center gap-4 text-xs font-mono">
                    <span className="text-[10px] text-slate-400">เช็คชื่อดูคลิป:</span>
                    {memberKeys.map(k => {
                      const isWatched = !!members[k]?.completedVideos?.[vid.id];
                      return (
                        <button
                          key={k}
                          onClick={() => onToggleVideo(k, vid.id)}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition ${
                            isWatched 
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                              : 'bg-dark-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                          }`}
                        >
                          {isWatched ? (
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-slate-500" />
                          )}
                          <span className="font-bold">{k}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (Coding Challenge & Submit): 5 Cols */}
          <div className="lg:col-span-5 flex flex-col justify-between p-4 rounded-xl bg-gradient-to-b from-dark-850 to-dark-900 border border-cyan-500/20 shadow-inner">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  <FileCode2 className="w-4 h-4" />
                  <span>โจทย์โค้ดประจำวัน</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {currentDayData.challenge.filename}
                </span>
              </div>

              <h4 className="font-bold font-mono text-sm text-slate-100 mb-2">
                {currentDayData.challenge.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-dark-950/60 p-3 rounded-xl border border-slate-800/80 mb-4">
                {currentDayData.challenge.description}
              </p>

              <div className="text-[11px] text-slate-400 space-y-1 mb-4">
                <p>💡 <b>วิธีส่งงาน:</b></p>
                <p>1. เขียนโค้ดเซฟลงโฟลเดอร์ของตัวเอง เช่น <code>FAN/{currentDayData.challenge.filename}</code></p>
                <p>2. Commit & Push ขึ้น GitHub Repo <code>SOGUY144/C-Learn</code></p>
                <p>3. กดปุ่มยืนยันเควสต์ประจำวันด้านล่างนี้</p>
              </div>
            </div>

            {/* Team Quest Completion Toggles */}
            <div className="pt-3 border-t border-slate-800/80">
              <span className="text-xs font-mono text-slate-400 block mb-2">
                สถานะเควสต์ Day {activeDay} ของแต่ละคน:
              </span>
              <div className="grid grid-cols-3 gap-2 font-mono">
                {memberKeys.map(k => {
                  const isDone = !!members[k]?.completedQuests?.[activeDay];
                  return (
                    <button
                      key={k}
                      onClick={() => onToggleQuest(k, activeDay)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition ${
                        isDone
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_-4px_rgba(16,185,129,0.3)]'
                          : 'bg-dark-900 hover:bg-dark-850 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold mb-1">{k}</span>
                      {isDone ? (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>เสร็จแล้ว</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400">ยังไม่ส่ง</span>
                      )}
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
