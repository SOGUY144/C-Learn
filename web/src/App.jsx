import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Layers, 
  RefreshCw, 
  Github, 
  Check, 
  AlertCircle 
} from 'lucide-react';

import Header from './components/Header';
import TeamBattleBoard from './components/TeamBattleBoard';
import DailyRoadmap from './components/DailyRoadmap';
import VideoCatalog from './components/VideoCatalog';
import CodeModal from './components/CodeModal';
import SettingsModal from './components/SettingsModal';

import { 
  loadState, 
  saveState, 
  toggleVideoInState, 
  toggleQuestInState 
} from './services/storage';
import { 
  fetchMemberFiles, 
  fetchRecentCommits, 
  REPO_OWNER, 
  REPO_NAME 
} from './services/github';
import { 
  buildDiscordReportPayload, 
  sendDiscordWebhook 
} from './services/discord';
import { INITIAL_MEMBERS } from './data/curriculum';

export default function App() {
  const [state, setState] = useState(() => loadState());
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap' | 'catalog'
  const [activeDay, setActiveDay] = useState(1);
  const [gitData, setGitData] = useState({
    GUY: { files: [], latestCommit: null },
    FAN: { files: [], latestCommit: null },
    HAN: { files: [], latestCommit: null }
  });
  const [isSyncingGit, setIsSyncingGit] = useState(false);
  const [selectedCodeFile, setSelectedCodeFile] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSendingDiscord, setIsSendingDiscord] = useState(false);
  const [toast, setToast] = useState(null);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function updateState(updater) {
    setState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveState(next);
      return next;
    });
  }

  async function syncGitHubData() {
    setIsSyncingGit(true);
    const members = ['GUY', 'FAN', 'HAN'];
    const newGitData = {};

    for (const m of members) {
      try {
        const files = await fetchMemberFiles(m);
        const commits = await fetchRecentCommits(m);
        newGitData[m] = {
          files: files || [],
          latestCommit: commits && commits.length > 0 ? commits[0].message : null
        };
      } catch (err) {
        console.warn(`Error loading git data for ${m}:`, err);
        newGitData[m] = { files: [], latestCommit: null };
      }
    }

    setGitData(newGitData);
    setIsSyncingGit(false);
  }

  useEffect(() => {
    syncGitHubData();
  }, []);

  function handleToggleVideo(memberId, videoId) {
    updateState(prev => {
      const next = toggleVideoInState(prev, memberId, videoId);
      const isWatchedNow = next.members[memberId]?.completedVideos?.[videoId];
      if (isWatchedNow) {
        showToast(`${memberId}: video marked as watched`);
      }
      return next;
    });
  }

  function handleToggleQuest(memberId, dayNum) {
    updateState(prev => {
      const next = toggleQuestInState(prev, memberId, dayNum);
      const isCompleted = next.members[memberId]?.completedQuests?.[dayNum];
      if (isCompleted) {
        showToast(`${memberId}: Day ${dayNum} completed`);
      }
      return next;
    });
  }

  async function handleSendDiscord() {
    const webhookUrl = state.settings?.discordWebhook;
    if (!webhookUrl) {
      showToast('Configure Discord Webhook URL in Settings first', 'error');
      setIsSettingsOpen(true);
      return;
    }

    setIsSendingDiscord(true);
    try {
      const payload = buildDiscordReportPayload(state, gitData, activeDay);
      await sendDiscordWebhook(webhookUrl, payload);
      showToast('Discord report sent');
    } catch (err) {
      showToast(`Failed to send report: ${err.message}`, 'error');
    } finally {
      setIsSendingDiscord(false);
    }
  }

  function handleSaveSettings(newSettings) {
    updateState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...newSettings
      }
    }));
    showToast('Settings saved');
  }

  function handleResetData() {
    if (window.confirm('Reset all progress data?')) {
      const resetState = {
        members: JSON.parse(JSON.stringify(INITIAL_MEMBERS)),
        settings: state.settings
      };
      updateState(resetState);
      setIsSettingsOpen(false);
      showToast('Data reset complete');
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-zinc-800">
      
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom duration-200">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-xl border text-xs font-mono ${
            toast.type === 'error'
              ? 'bg-zinc-900 border-rose-800 text-rose-300'
              : 'bg-zinc-900 border-zinc-700 text-zinc-200'
          }`}>
            {toast.type === 'error' ? (
              <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            ) : (
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Header */}
      <Header
        state={state}
        targetContestDate={state.settings?.targetContestDate}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onSendDiscord={handleSendDiscord}
        isSendingDiscord={isSendingDiscord}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-5">
        
        {/* Navigation & Live Sync Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          
          {/* Tab Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeTab === 'roadmap'
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Roadmap</span>
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeTab === 'catalog'
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Videos</span>
            </button>
          </div>

          {/* GitHub Sync Button & Link */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={syncGitHubData}
              disabled={isSyncingGit}
              title="Refresh files from GitHub"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingGit ? 'animate-spin text-indigo-400' : ''}`} />
              <span className="hidden sm:inline">Sync Git</span>
            </button>
            <a
              href={`https://github.com/${REPO_OWNER}/${REPO_NAME}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>

        {/* Team Members Board */}
        <TeamBattleBoard
          state={state}
          gitData={gitData}
          activeDay={activeDay}
          onViewCode={(member, file) => setSelectedCodeFile({ member, file })}
        />

        {/* Tab Content */}
        {activeTab === 'roadmap' ? (
          <DailyRoadmap
            state={state}
            activeDay={activeDay}
            setActiveDay={setActiveDay}
            onToggleVideo={handleToggleVideo}
            onToggleQuest={handleToggleQuest}
          />
        ) : (
          <VideoCatalog
            state={state}
            onToggleVideo={handleToggleVideo}
          />
        )}

      </main>

      {/* Clean Developer Footer */}
      <footer className="w-full border-t border-zinc-800/80 bg-zinc-950 py-4 text-center text-xs text-zinc-400 font-mono">
        <p>C-Learn &bull; Contest Tracking &bull; CEDT 2110-104 & 2110328</p>
      </footer>

      {/* Code Inspector Modal */}
      {selectedCodeFile && (
        <CodeModal
          file={selectedCodeFile.file}
          member={selectedCodeFile.member}
          onClose={() => setSelectedCodeFile(null)}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          settings={state.settings}
          state={state}
          onSaveSettings={handleSaveSettings}
          onResetData={handleResetData}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

    </div>
  );
}
