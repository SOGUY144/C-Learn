import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ExternalLink, 
  CheckSquare, 
  Square,
  Play
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

  return (
    <section className="my-5 p-5 sm:p-6 rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-800/90 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <h2 className="text-sm font-semibold font-mono tracking-tight text-slate-200">
            Video Catalog
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            CEDT Computer Programming & Data Structures by Ajarn Nattee Niparnan
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <a
            href={`https://www.youtube.com/playlist?list=${PLAYLIST_PROGRAMMING_ID}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition"
          >
            <span>Playlist 1 (Prog)</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
          <a
            href={`https://www.youtube.com/playlist?list=${PLAYLIST_DSA_ID}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition"
          >
            <span>Playlist 2 (DSA)</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 my-4">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search videos (e.g. pointer, sort, vector)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition"
          />
        </div>

        <div className="sm:col-span-6 flex items-center gap-2">
          <button
            onClick={() => setPlaylistFilter('all')}
            className={`px-3 py-2 rounded-xl border text-xs font-mono transition flex-1 text-center ${
              playlistFilter === 'all'
                ? 'bg-indigo-600 border-indigo-500 text-white font-semibold shadow-sm'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({ALL_PLAYLIST_VIDEOS.length})
          </button>
          <button
            onClick={() => setPlaylistFilter('prog')}
            className={`px-3 py-2 rounded-xl border text-xs font-mono transition flex-1 text-center ${
              playlistFilter === 'prog'
                ? 'bg-indigo-600 border-indigo-500 text-white font-semibold shadow-sm'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Prog (30)
          </button>
          <button
            onClick={() => setPlaylistFilter('dsa')}
            className={`px-3 py-2 rounded-xl border text-xs font-mono transition flex-1 text-center ${
              playlistFilter === 'dsa'
                ? 'bg-indigo-600 border-indigo-500 text-white font-semibold shadow-sm'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            DSA
          </button>
        </div>
      </div>

      {/* Videos List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
        {filteredVideos.map(vid => (
          <div
            key={vid.id}
            className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
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
                <span>{vid.title}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 shrink-0" />
              </a>
            </div>

            {/* Checkbox row */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-[11px] text-slate-400">Watched:</span>
              <div className="flex items-center gap-2.5">
                {memberKeys.map(k => {
                  const isWatched = !!members[k]?.completedVideos?.[vid.id];
                  return (
                    <button
                      key={k}
                      onClick={() => onToggleVideo(k, vid.id)}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border transition text-xs ${
                        isWatched
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
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
          <div className="col-span-2 py-8 text-center text-slate-400 font-mono text-xs">
            No videos matching "{search}"
          </div>
        )}
      </div>
    </section>
  );
}
