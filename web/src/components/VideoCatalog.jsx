import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Youtube, 
  ExternalLink, 
  CheckSquare, 
  Square, 
  Filter, 
  BookOpen, 
  Layers 
} from 'lucide-react';
import { ALL_PLAYLIST_VIDEOS, PLAYLIST_PROGRAMMING_ID, PLAYLIST_DSA_ID } from '../data/curriculum';

export default function VideoCatalog({ state, onToggleVideo }) {
  const [search, setSearch] = useState('');
  const [playlistFilter, setPlaylistFilter] = useState('all'); // 'all' | 'prog' | 'dsa'
  const [memberFilter, setMemberFilter] = useState('all'); // 'all' | 'GUY' | 'FAN' | 'HAN'

  const members = state.members || {};
  const memberKeys = ['GUY', 'FAN', 'HAN'];

  const filteredVideos = useMemo(() => {
    return ALL_PLAYLIST_VIDEOS.filter(vid => {
      // 1. Search filter
      if (search) {
        const query = search.toLowerCase();
        const matchesTitle = vid.title.toLowerCase().includes(query);
        const matchesId = vid.id.toLowerCase().includes(query);
        if (!matchesTitle && !matchesId) return false;
      }

      // 2. Playlist filter
      if (playlistFilter !== 'all' && vid.playlist !== playlistFilter) {
        return false;
      }

      // 3. Member filter
      if (memberFilter !== 'all') {
        const isWatched = !!members[memberFilter]?.completedVideos?.[vid.id];
        // If filtering by specific member, we can choose unwatched or watched, but let's show all or watched
      }

      return true;
    });
  }, [search, playlistFilter, memberFilter, members]);

  return (
    <section className="my-6 p-5 sm:p-6 rounded-2xl bg-dark-900/90 border border-slate-800 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-mono tracking-tight flex items-center gap-2 text-slate-100">
            <span className="text-cyber-purple">#</span> Full Curriculum Video Library
          </h2>
          <p className="text-xs text-slate-400">
            คลังคลิปทั้งหมดจากเพลย์ลิสต์ CEDT Computer Programming (30 คลิป) และ CEDT Data Structures
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`https://www.youtube.com/playlist?list=${PLAYLIST_PROGRAMMING_ID}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-850 hover:bg-dark-800 border border-slate-800 text-slate-300 hover:text-cyan-300 text-xs font-mono transition"
          >
            <Youtube className="w-3.5 h-3.5 text-rose-500" />
            <span>Playlist 1 (Prog)</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <a
            href={`https://www.youtube.com/playlist?list=${PLAYLIST_DSA_ID}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-850 hover:bg-dark-800 border border-slate-800 text-slate-300 hover:text-cyan-300 text-xs font-mono transition"
          >
            <Youtube className="w-3.5 h-3.5 text-rose-500" />
            <span>Playlist 2 (DSA)</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 my-4">
        {/* Search Input */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อคลิป หรือหัวข้อ (เช่น vector, pointer, sort)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-dark-850 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition"
          />
        </div>

        {/* Playlist Filter Buttons */}
        <div className="sm:col-span-6 flex items-center gap-2">
          <button
            onClick={() => setPlaylistFilter('all')}
            className={`px-3 py-2 rounded-xl border text-xs font-mono transition flex-1 text-center ${
              playlistFilter === 'all'
                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 font-bold'
                : 'bg-dark-850 border-slate-800 text-slate-400 hover:text-slate-300'
            }`}
          >
            ทั้งหมด ({ALL_PLAYLIST_VIDEOS.length})
          </button>
          <button
            onClick={() => setPlaylistFilter('prog')}
            className={`px-3 py-2 rounded-xl border text-xs font-mono transition flex-1 text-center ${
              playlistFilter === 'prog'
                ? 'bg-rose-500/10 border-rose-500/50 text-rose-300 font-bold'
                : 'bg-dark-850 border-slate-800 text-slate-400 hover:text-slate-300'
            }`}
          >
            CEDT Prog (30)
          </button>
          <button
            onClick={() => setPlaylistFilter('dsa')}
            className={`px-3 py-2 rounded-xl border text-xs font-mono transition flex-1 text-center ${
              playlistFilter === 'dsa'
                ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-300 font-bold'
                : 'bg-dark-850 border-slate-800 text-slate-400 hover:text-slate-300'
            }`}
          >
            CEDT DSA
          </button>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1">
        {filteredVideos.map(vid => (
          <div
            key={vid.id}
            className="p-3.5 rounded-xl bg-dark-850/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  vid.playlist === 'prog' 
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' 
                    : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                }`}>
                  {vid.playlist === 'prog' ? 'Prog' : 'DSA'} #{vid.num}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">⏱️ {vid.duration}</span>
              </div>

              <a
                href={vid.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs sm:text-sm font-medium text-slate-200 hover:text-cyan-300 transition flex items-center gap-1.5 group line-clamp-2"
              >
                <span>{vid.title}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 shrink-0" />
              </a>
            </div>

            {/* Checkbox row */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] text-slate-400">สถานะดู:</span>
              <div className="flex items-center gap-3">
                {memberKeys.map(k => {
                  const isWatched = !!members[k]?.completedVideos?.[vid.id];
                  return (
                    <button
                      key={k}
                      onClick={() => onToggleVideo(k, vid.id)}
                      className={`flex items-center gap-1 px-1.5 py-0.5 rounded border transition ${
                        isWatched
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-dark-900 border-slate-800 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      {isWatched ? (
                        <CheckSquare className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Square className="w-3 h-3 text-slate-500" />
                      )}
                      <span className="text-[10px] font-bold">{k}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}

        {filteredVideos.length === 0 && (
          <div className="col-span-2 py-8 text-center text-slate-400 font-mono text-xs">
            ไม่พบวิดีโอที่ตรงกับคำค้นหา "{search}"
          </div>
        )}
      </div>
    </section>
  );
}
