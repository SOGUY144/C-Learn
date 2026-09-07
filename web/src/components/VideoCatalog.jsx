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
  const [playlistFilter, setPlaylistFilter] = useState('all'); // 'all' | 'prog' | 'dsa'

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
    <section className="my-5 p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-zinc-800">
        <div>
          <h2 className="text-sm font-semibold font-mono uppercase tracking-wider text-zinc-300">
            Video Catalog
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            CEDT Computer Programming & Data Structures by Ajarn Nattee Niparnan
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <a
            href={`https://www.youtube.com/playlist?list=${PLAYLIST_PROGRAMMING_ID}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-zinc-100 transition"
          >
            <span>Playlist 1 (Prog)</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>
          <a
            href={`https://www.youtube.com/playlist?list=${PLAYLIST_DSA_ID}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-zinc-100 transition"
          >
            <span>Playlist 2 (DSA)</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 my-3.5">
        <div className="sm:col-span-6 relative">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search videos (e.g. pointer, sort, vector)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-950/60 border border-zinc-800 text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition"
          />
        </div>

        <div className="sm:col-span-6 flex items-center gap-1.5">
          <button
            onClick={() => setPlaylistFilter('all')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition flex-1 text-center ${
              playlistFilter === 'all'
                ? 'bg-zinc-800 border-zinc-600 text-zinc-100 font-semibold'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-300'
            }`}
          >
            All ({ALL_PLAYLIST_VIDEOS.length})
          </button>
          <button
            onClick={() => setPlaylistFilter('prog')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition flex-1 text-center ${
              playlistFilter === 'prog'
                ? 'bg-zinc-800 border-zinc-600 text-zinc-100 font-semibold'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-300'
            }`}
          >
            Prog (30)
          </button>
          <button
            onClick={() => setPlaylistFilter('dsa')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition flex-1 text-center ${
              playlistFilter === 'dsa'
                ? 'bg-zinc-800 border-zinc-600 text-zinc-100 font-semibold'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-300'
            }`}
          >
            DSA
          </button>
        </div>
      </div>

      {/* Videos List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[500px] overflow-y-auto pr-1">
        {filteredVideos.map(vid => (
          <div
            key={vid.id}
            className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-850 hover:border-zinc-800 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                  {vid.playlist === 'prog' ? 'Prog' : 'DSA'} #{vid.num}
                </span>
                <span className="text-[11px] text-zinc-400 font-mono">{vid.duration}</span>
              </div>

              <a
                href={vid.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-zinc-200 hover:text-zinc-100 transition flex items-center gap-1.5 group line-clamp-2"
              >
                <span>{vid.title}</span>
                <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-zinc-300 shrink-0" />
              </a>
            </div>

            {/* Checkbox row */}
            <div className="mt-3 pt-2 border-t border-zinc-850 flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] text-zinc-400">Watched:</span>
              <div className="flex items-center gap-2.5">
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
          </div>
        ))}

        {filteredVideos.length === 0 && (
          <div className="col-span-2 py-8 text-center text-zinc-400 font-mono text-xs">
            No videos matching "{search}"
          </div>
        )}
      </div>
    </section>
  );
}
