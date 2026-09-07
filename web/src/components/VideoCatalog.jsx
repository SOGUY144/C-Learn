import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ExternalLink, 
  CheckSquare, 
  Square
} from 'lucide-react';
import { ALL_PLAYLIST_VIDEOS, PLAYLIST_PROGRAMMING_ID, PLAYLIST_DSA_ID } from '../data/curriculum';

export default function VideoCatalog({ state, onToggleVideo }) {
  const [search, setSearch] = useState('');
  const [playlistFilter, setPlaylistFilter] = useState('all');

  const members = state.members || {};
  const memberKeys = ['GUY', 'FAN', 'HAN'];

  const filteredVideos = useMemo(() => {
    return ALL_PLAYLIST_VIDEOS.filter(vid => {
      if (search) {
        const query = search.toLowerCase();
        const matchesTitle = vid.title.toLowerCase().includes(query);
        const matchesId = vid.id.toLowerCase().includes(query);
        if (!matchesTitle && !matchesId) return false;
      }

      if (playlistFilter !== 'all' && vid.playlist !== playlistFilter) {
        return false;
      }

      return true;
    });
  }, [search, playlistFilter]);

  const progCount = ALL_PLAYLIST_VIDEOS.filter(v => v.playlist === 'prog').length;
  const dsaCount = ALL_PLAYLIST_VIDEOS.filter(v => v.playlist === 'dsa').length;

  return (
    <section className="linear-card my-5 p-5 sm:p-6 rounded-2xl shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
        <div>
          <h2 className="text-sm font-semibold font-mono tracking-tight text-slate-200">
            คลังวิดีโอทั้งหมด (161 คลิป)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            CEDT Computer Programming & Data Structures โดย อ.ณัฐที นิภานันท์ (จุฬาลงกรณ์มหาวิทยาลัย)
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <a
            href={`https://www.youtube.com/playlist?list=${PLAYLIST_PROGRAMMING_ID}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/[0.15] text-slate-300 hover:text-white transition shadow-sm"
          >
            <span>เพลย์ลิสต์ Prog บน YouTube</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>
          <a
            href={`https://www.youtube.com/playlist?list=${PLAYLIST_DSA_ID}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/[0.15] text-slate-300 hover:text-white transition shadow-sm"
          >
            <span>เพลย์ลิสต์ DSA บน YouTube</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 my-4">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาคลิปวิดีโอ (เช่น vector, sort, loop, pointer, binary search)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition shadow-inner"
          />
        </div>

        <div className="sm:col-span-6 flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/[0.06]">
          <button
            onClick={() => setPlaylistFilter('all')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition flex-1 text-center ${
              playlistFilter === 'all'
                ? 'bg-indigo-600 border-indigo-400 text-white font-medium shadow-[0_0_12px_rgba(99,102,241,0.35)]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ทั้งหมด ({ALL_PLAYLIST_VIDEOS.length})
          </button>
          <button
            onClick={() => setPlaylistFilter('prog')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition flex-1 text-center ${
              playlistFilter === 'prog'
                ? 'bg-indigo-600 border-indigo-400 text-white font-medium shadow-[0_0_12px_rgba(99,102,241,0.35)]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Prog ({progCount})
          </button>
          <button
            onClick={() => setPlaylistFilter('dsa')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition flex-1 text-center ${
              playlistFilter === 'dsa'
                ? 'bg-indigo-600 border-indigo-400 text-white font-medium shadow-[0_0_12px_rgba(99,102,241,0.35)]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            DSA ({dsaCount})
          </button>
        </div>
      </div>

      {/* Videos List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1">
        {filteredVideos.map(vid => (
          <div
            key={vid.id}
            className="p-3.5 rounded-xl bg-black/30 border border-white/[0.06] hover:border-white/[0.14] transition flex flex-col justify-between shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-slate-300">
                  {vid.playlist === 'prog' ? 'Prog' : 'DSA'} #{vid.num}
                </span>
                <span className="text-xs text-slate-400 font-mono">{vid.duration}</span>
              </div>

              <a
                href={vid.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs sm:text-sm font-medium text-slate-200 hover:text-indigo-300 transition flex items-center gap-1.5 group line-clamp-2"
              >
                <span className="group-hover:translate-x-0.5 transition-transform">{vid.title}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0 transition-colors" />
              </a>
            </div>

            {/* Checkbox row */}
            <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
              <span className="text-[11px] text-slate-400">ดูแล้ว:</span>
              <div className="flex items-center gap-2">
                {memberKeys.map(k => {
                  const isWatched = !!members[k]?.completedVideos?.[vid.id];
                  return (
                    <button
                      key={k}
                      onClick={() => onToggleVideo(k, vid.id)}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border transition text-xs ${
                        isWatched
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
                          : 'bg-black/30 border-white/[0.06] text-slate-400 hover:border-white/[0.12] hover:text-slate-200'
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
          </div>
        ))}

        {filteredVideos.length === 0 && (
          <div className="col-span-2 py-10 text-center text-slate-400 font-mono text-xs">
            ไม่พบคลิปวิดีโอที่ตรงกับ "{search}"
          </div>
        )}
      </div>
    </section>
  );
}
