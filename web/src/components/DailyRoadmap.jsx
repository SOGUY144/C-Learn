import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  ExternalLink, 
  Code2, 
  ChevronLeft, 
  ChevronRight,
  FileCode,
  Copy,
  Check,
  Lightbulb
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
  const [copied, setCopied] = useState(false);

  function handleCopyInput(text) {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="my-6">
      {/* Section Title */}
      <div className="flex items-center justify-between gap-2 mb-3 px-0.5">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold font-mono tracking-tight text-slate-200">
            ตารางการฝึกซ้อม 20 วัน
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
            20 วันสู่สนามแข่ง
          </span>
        </div>

        {/* Prev / Next Buttons */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <button
            onClick={() => setActiveDay(prev => Math.max(1, prev - 1))}
            disabled={activeDay <= 1}
            title="วันก่อนหน้า"
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 py-1 text-slate-400">
            วันที่ {activeDay} จาก 20 วัน
          </span>
          <button
            onClick={() => setActiveDay(prev => Math.min(20, prev + 1))}
            disabled={activeDay >= 20}
            title="วันถัดไป"
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day Selector Pill Carousel */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {DAYS_ROADMAP.map(d => {
          const isActive = d.day === activeDay;
          return (
            <button
              key={d.day}
              onClick={() => setActiveDay(d.day)}
              className={`flex flex-col items-center min-w-[54px] px-2 py-2 rounded-xl border text-xs font-mono transition-all shrink-0 ${
                isActive
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_18px_rgba(99,102,241,0.45)] font-semibold scale-105'
                  : 'bg-[#0b0f19]/90 hover:bg-white/[0.05] border-white/[0.07] hover:border-white/[0.15] text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className={`text-[10px] ${isActive ? 'text-indigo-200 font-medium' : 'text-slate-400'}`}>
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
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        done 
                          ? isActive ? 'bg-white shadow-[0_0_6px_#fff]' : 'bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.8)]' 
                          : isActive ? 'bg-indigo-300/60' : 'bg-slate-700/80'
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
      <div className="linear-card mt-4 p-5 sm:p-6 rounded-2xl shadow-xl">
        
        {/* Day Meta Header */}
        <div className="pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              {currentDayData.phase}
            </span>
          </div>
          <h3 className="text-lg font-semibold font-mono text-white tracking-tight">
            วันที่ {currentDayData.day}: {currentDayData.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
            {currentDayData.description}
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
          
          {/* Left Column (Videos): 5 Cols */}
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400">
              <span className="font-semibold text-slate-300">วิดีโอที่ต้องดูประจำวัน</span>
              <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[11px]">{currentDayData.videos.length} คลิป</span>
            </div>

            <div className="space-y-2.5">
              {currentDayData.videos.map((vid, idx) => (
                <div 
                  key={vid.id || idx}
                  className="p-3.5 rounded-xl bg-black/30 border border-white/[0.06] hover:border-white/[0.14] transition shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-slate-300">
                          {vid.playlist === 'prog' ? 'Prog' : 'DSA'} #{vid.num}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{vid.duration}</span>
                      </div>
                      <a 
                        href={vid.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs sm:text-sm font-medium text-slate-200 hover:text-indigo-300 transition flex items-center gap-1.5 group"
                      >
                        <span className="group-hover:translate-x-0.5 transition-transform">{vid.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0 transition-colors" />
                      </a>
                    </div>
                  </div>

                  {/* Member Checks */}
                  <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center gap-2.5 text-xs font-mono">
                    <span className="text-slate-400 text-[11px]">บันทึกการดู:</span>
                    {memberKeys.map(k => {
                      const isWatched = !!members[k]?.completedVideos?.[vid.id];
                      return (
                        <button
                          key={k}
                          onClick={() => onToggleVideo(k, vid.id)}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-xs transition ${
                            isWatched 
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]' 
                              : 'bg-black/30 border-white/[0.06] text-slate-400 hover:border-white/[0.14] hover:text-slate-200'
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

          {/* Right Column (Practice Challenge): 7 Cols */}
          <div className="lg:col-span-7 flex flex-col justify-between p-5 rounded-2xl bg-[#070b13]/90 border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07)]">
            <div>
              {/* Problem Header */}
              <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-200 tracking-tight">
                    โจทย์ฝึกเขียนโค้ดประจำวัน
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  {currentDayData.challenge.filename}
                </span>
              </div>

              {/* Title & Description */}
              <h4 className="font-semibold text-base text-slate-100 mb-2 tracking-tight">
                {currentDayData.challenge.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                {currentDayData.challenge.description}
              </p>

              {/* Specifications: Input / Output */}
              <div className="space-y-2 mb-4 text-xs font-mono bg-black/40 p-3.5 rounded-xl border border-white/[0.06] shadow-inner">
                {currentDayData.challenge.input && (
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">ข้อมูลนำเข้า (Input):</span>
                    <span className="text-slate-200 block mt-0.5 leading-normal">{currentDayData.challenge.input}</span>
                  </div>
                )}
                {currentDayData.challenge.output && (
                  <div className="pt-2 border-t border-white/[0.05]">
                    <span className="text-slate-400 font-semibold block text-[11px]">ข้อมูลส่งออก (Output):</span>
                    <span className="text-slate-200 block mt-0.5 leading-normal whitespace-pre-line">{currentDayData.challenge.output}</span>
                  </div>
                )}
              </div>

              {/* Side-by-side Sample Test Cases */}
              {(currentDayData.challenge.sampleInput || currentDayData.challenge.sampleOutput) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4 font-mono text-xs">
                  {/* Sample Input */}
                  <div className="rounded-xl bg-black/60 border border-white/[0.08] overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-white/[0.03] border-b border-white/[0.06] text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block"></span>
                        <span className="text-slate-300 font-medium">ตัวอย่าง Input</span>
                      </div>
                      {currentDayData.challenge.sampleInput && (
                        <button
                          onClick={() => handleCopyInput(currentDayData.challenge.sampleInput)}
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] text-slate-400 hover:text-white hover:bg-white/[0.05] transition"
                          title="คัดลอกตัวอย่าง Input"
                        >
                          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span className={copied ? 'text-emerald-400 font-medium' : ''}>
                            {copied ? 'คัดลอกแล้ว' : 'คัดลอก'}
                          </span>
                        </button>
                      )}
                    </div>
                    <pre className="p-3 text-emerald-300/90 text-xs whitespace-pre-wrap leading-normal font-mono selection:bg-emerald-500/20">
                      {currentDayData.challenge.sampleInput || '-'}
                    </pre>
                  </div>

                  {/* Sample Output */}
                  <div className="rounded-xl bg-black/60 border border-white/[0.08] overflow-hidden shadow-sm">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.03] border-b border-white/[0.06] text-[11px] text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-sky-500/80 inline-block"></span>
                      <span className="font-medium">ตัวอย่าง Output</span>
                    </div>
                    <pre className="p-3 text-sky-300/90 text-xs whitespace-pre-wrap leading-normal font-mono selection:bg-sky-500/20">
                      {currentDayData.challenge.sampleOutput || '-'}
                    </pre>
                  </div>
                </div>
              )}

              {/* Hint / Advice Box */}
              {currentDayData.challenge.hint && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-500/[0.05] border border-amber-500/20 text-xs font-mono mb-4 text-amber-200/90 leading-relaxed shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-amber-300 block text-[11px] mb-0.5">คำแนะนำ & เทคนิค:</span>
                    <span>{currentDayData.challenge.hint}</span>
                  </div>
                </div>
              )}

              {/* Compact GitHub Target File Strip */}
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/[0.06] mb-4 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <FileCode className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>ส่งโค้ดใน GitHub:</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300 overflow-x-auto">
                  <span className="px-2 py-0.5 rounded bg-black/50 border border-white/[0.06] text-slate-200">GUY/{currentDayData.challenge.filename}</span>
                  <span className="px-2 py-0.5 rounded bg-black/50 border border-white/[0.06] text-slate-200">FAN/{currentDayData.challenge.filename}</span>
                  <span className="px-2 py-0.5 rounded bg-black/50 border border-white/[0.06] text-slate-200">HAN/{currentDayData.challenge.filename}</span>
                </div>
              </div>
            </div>

            {/* Member Submission Status */}
            <div className="pt-3 border-t border-white/[0.06]">
              <div className="flex items-center justify-between mb-2 text-xs font-mono">
                <span className="text-slate-400 font-medium">สถานะส่งงานประจำวันที่ {activeDay}:</span>
                <span className="text-[10px] text-slate-500">คลิกเพื่อเปลี่ยนสถานะ</span>
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono">
                {memberKeys.map(k => {
                  const isDone = !!members[k]?.completedQuests?.[activeDay];
                  return (
                    <button
                      key={k}
                      onClick={() => onToggleQuest(k, activeDay)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs transition ${
                        isDone
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                          : 'bg-black/30 hover:bg-white/[0.05] border-white/[0.07] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="font-semibold mb-0.5 text-slate-200">{k.toLowerCase()}</span>
                      <span className={`text-[10px] ${isDone ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                        {isDone ? 'ส่งงานแล้ว' : 'ยังไม่ส่ง'}
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
