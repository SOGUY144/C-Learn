import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  Layers, 
  RefreshCw, 
  Github, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
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
  const [selectedCodeFile, setSelectedCodeFile] = useState(null); // { member, file }
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSendingDiscord, setIsSendingDiscord] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string }

  // Show auto-dismissing toast
  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  // Persist state changes
  function updateState(updater) {
    setState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveState(next);
      return next;
    });
  }

  // Load GitHub data for all 3 members
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

  // Fire celebratory confetti
  function triggerCelebration() {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Ignore if canvas unsupported
    }
  }

  // Toggle Video
  function handleToggleVideo(memberId, videoId) {
    updateState(prev => {
      const next = toggleVideoInState(prev, memberId, videoId);
      const isWatchedNow = next.members[memberId]?.completedVideos?.[videoId];
      if (isWatchedNow) {
        showToast(`🎉 ${memberId} ดูคลิปนี้จบแล้ว!`);
      }
      return next;
    });
  }

  // Toggle Day Quest
  function handleToggleQuest(memberId, dayNum) {
    updateState(prev => {
      const next = toggleQuestInState(prev, memberId, dayNum);
      const isCompleted = next.members[memberId]?.completedQuests?.[dayNum];
      if (isCompleted) {
        triggerCelebration();
        showToast(`🔥 ยอดเยี่ยม! ${memberId} เคลียร์เควสต์ Day ${dayNum} สำเร็จ!`);
      }
      return next;
    });
  }

  // Send Discord Report
  async function handleSendDiscord() {
    const webhookUrl = state.settings?.discordWebhook;
    if (!webhookUrl) {
      showToast('กรุณาระบุ Discord Webhook URL ในปุ่มตั้งค่า (⚙️) ก่อนครับ', 'error');
      setIsSettingsOpen(true);
      return;
    }

    setIsSendingDiscord(true);
    try {
      const payload = buildDiscordReportPayload(state, gitData, activeDay);
      await sendDiscordWebhook(webhookUrl, payload);
      triggerCelebration();
      showToast('📢 ส่งรายงานความคืบหน้าเข้า Discord เรียบร้อยแล้ว! 🎉');
    } catch (err) {
      showToast(`ส่งรายงานไม่สำเร็จ: ${err.message}`, 'error');
    } finally {
      setIsSendingDiscord(false);
    }
  }

  // Save Settings
  function handleSaveSettings(newSettings) {
    updateState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...newSettings
      }
    }));
    showToast('บันทึกการตั้งค่าเรียบร้อย');
  }

  // Reset Data
  function handleResetData() {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะรีเซ็ตข้อมูลความคืบหน้าทั้งหมด?')) {
      const resetState = {
        members: JSON.parse(JSON.stringify(INITIAL_MEMBERS)),
        settings: state.settings
      };
      updateState(resetState);
      setIsSettingsOpen(false);
      showToast('รีเซ็ตข้อมูลทั้งหมดเรียบร้อย');
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top duration-200">
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md text-xs font-mono font-bold ${
            toast.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
              : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
          }`}>
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
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

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {/* Navigation & Live Sync Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          {/* Tab Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-dark-900 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeTab === 'roadmap'
                  ? 'bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/30 shadow-[0_0_15px_-3px_rgba(0,242,254,0.2)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>20-Day Roadmap</span>
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeTab === 'catalog'
                  ? 'bg-indigo-500/10 text-indigo-300 font-bold border border-indigo-500/30 shadow-[0_0_15px_-3px_rgba(99,102,241,0.2)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Full Video Catalog</span>
            </button>
          </div>

          {/* GitHub Sync Button & Link */}
          <div className="flex items-center gap-2">
            <button
              onClick={syncGitHubData}
              disabled={isSyncingGit}
              title="รีเฟรชไฟล์และ Commit ล่าสุดจาก GitHub"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-900 hover:bg-dark-850 border border-slate-800 text-slate-400 hover:text-cyan-300 text-xs font-mono transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingGit ? 'animate-spin text-cyan-400' : ''}`} />
              <span className="hidden sm:inline">ซิงค์ Git</span>
            </button>
            <a
              href={`https://github.com/${REPO_OWNER}/${REPO_NAME}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-900 hover:bg-dark-850 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono transition"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GitHub Repo</span>
            </a>
          </div>
        </div>

        {/* Hero Section: Team Battle Board */}
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

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-dark-950 py-4 text-center text-xs text-slate-400 font-mono">
        <p>C-Learn Training Tracker • สร้างวินัยเพื่อชัยชนะการแข่ง C++ วันที่ 27 🔥</p>
        <p className="mt-1 text-[11px] text-slate-400">
          ทีม: GUY • FAN • HAN | เนื้อหา: CEDT Computer Programming & Data Structures (อ.ณัฐที นิภานันท์)
        </p>
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
