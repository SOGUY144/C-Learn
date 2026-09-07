import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Layers, 
  RefreshCw, 
  Github, 
  Check, 
  AlertCircle,
  Cloud
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
  toggleQuestInState,
  fetchCloudState,
  pushCloudState,
  subscribeCloudState
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
import { INITIAL_MEMBERS, DAYS_ROADMAP } from './data/curriculum';

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
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [toast, setToast] = useState(null);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function updateState(updater, syncToCloud = true) {
    setState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveState(next);
      if (syncToCloud && next.settings?.firebaseDatabaseUrl) {
        pushCloudState(next.settings.firebaseDatabaseUrl, next).catch(err => {
          console.warn('Cloud sync error:', err.message);
        });
      }
      return next;
    });
  }

  // Real-time Cloud Sync Subscription
  useEffect(() => {
    const dbUrl = state.settings?.firebaseDatabaseUrl;
    if (!dbUrl) {
      setIsCloudConnected(false);
      return;
    }

    let isMounted = true;

    // 1. Initial fetch from Cloud
    fetchCloudState(dbUrl)
      .then(cloudData => {
        if (!isMounted || !cloudData || !cloudData.members) return;
        setIsCloudConnected(true);
        setState(prev => {
          const merged = {
            ...prev,
            members: {
              ...prev.members,
              ...cloudData.members
            }
          };
          saveState(merged);
          return merged;
        });
      })
      .catch(err => {
        console.warn('Initial cloud sync error:', err.message);
        setIsCloudConnected(false);
      });

    // 2. Real-time listener via SSE
    const unsubscribe = subscribeCloudState(dbUrl, (cloudData) => {
      if (!isMounted || !cloudData || !cloudData.members) return;
      setIsCloudConnected(true);
      setState(prev => {
        const merged = {
          ...prev,
          members: {
            ...prev.members,
            ...cloudData.members
          }
        };
        saveState(merged);
        return merged;
      });
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [state.settings?.firebaseDatabaseUrl]);

  async function syncGitHubData() {
    setIsSyncingGit(true);
    const members = ['GUY', 'FAN', 'HAN'];
    const newGitData = {};
    let autoCompletedCount = 0;

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

    // Auto-detect Quests from GitHub files
    updateState(prev => {
      let stateChanged = false;
      const nextMembers = { ...prev.members };

      members.forEach(mKey => {
        const mFiles = newGitData[mKey]?.files || [];
        const currentM = nextMembers[mKey] || { ...INITIAL_MEMBERS[mKey] };
        const currentCompleted = { ...(currentM.completedQuests || {}) };

        DAYS_ROADMAP.forEach(d => {
          const dayPrefix = String(d.day).padStart(2, '0');
          // Match if member has pushed file starting with "01-" or "01"
          const hasFile = mFiles.some(f => {
            const lower = f.name.toLowerCase();
            return lower.startsWith(`${dayPrefix}-`) || lower.startsWith(`${dayPrefix}_`) || lower.includes(`${dayPrefix}`);
          });

          if (hasFile && !currentCompleted[d.day]) {
            currentCompleted[d.day] = true;
            stateChanged = true;
            autoCompletedCount++;
          }
        });

        if (stateChanged) {
          nextMembers[mKey] = {
            ...currentM,
            completedQuests: currentCompleted
          };
        }
      });

      if (stateChanged) {
        showToast(`ซิงค์ Git สำเร็จ: ตรวจพบและบันทึกการส่งงานอัตโนมัติ ${autoCompletedCount} งาน`);
        return { ...prev, members: nextMembers };
      }
      return prev;
    });

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
        showToast(`${memberId}: ดูคลิปเสร็จแล้ว`);
      } else {
        showToast(`${memberId}: ยกเลิกการติ๊กคลิป`);
      }
      return next;
    });
  }

  function handleToggleQuest(memberId, dayNum) {
    updateState(prev => {
      const next = toggleQuestInState(prev, memberId, dayNum);
      const isCompleted = next.members[memberId]?.completedQuests?.[dayNum];
      if (isCompleted) {
        showToast(`${memberId}: บันทึกส่งงานวันที่ ${dayNum} เรียบร้อย`);
      } else {
        showToast(`${memberId}: ยกเลิกสถานะส่งงานวันที่ ${dayNum}`);
      }
      return next;
    });
  }

  async function handleSendDiscord() {
    const webhookUrl = state.settings?.discordWebhook;
    if (!webhookUrl) {
      showToast('กรุณาตั้งค่า Discord Webhook URL ในหน้าต่างตั้งค่าก่อน', 'error');
      setIsSettingsOpen(true);
      return;
    }

    setIsSendingDiscord(true);
    try {
      const payload = buildDiscordReportPayload(state, gitData, activeDay);
      await sendDiscordWebhook(webhookUrl, payload);
      showToast('ส่งรายงานความคืบหน้าเข้า Discord สำเร็จ');
    } catch (err) {
      showToast(`ไม่สามารถส่งรายงานได้: ${err.message}`, 'error');
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
    showToast('บันทึกการตั้งค่าเรียบร้อย');
  }

  function handleResetData() {
    if (window.confirm('คุณต้องการรีเซ็ตข้อมูลความคืบหน้าทั้งหมดหรือไม่?')) {
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
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-2xl border text-xs font-mono backdrop-blur-xl ${
            toast.type === 'error'
              ? 'bg-[#150a0f]/95 border-rose-500/40 text-rose-300 shadow-[0_8px_32px_rgba(244,63,94,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]'
              : 'bg-[#0a0f1d]/95 border-emerald-500/40 text-slate-100 shadow-[0_8px_32px_rgba(16,185,129,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]'
          }`}>
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span className="font-medium">{toast.message}</span>
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
          <div className="inline-flex p-1 rounded-xl bg-black/40 border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] text-xs font-mono backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeTab === 'roadmap'
                  ? 'bg-indigo-600 border border-indigo-400 text-white font-medium shadow-[0_0_14px_rgba(99,102,241,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>ตารางฝึกซ้อม 20 วัน</span>
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeTab === 'catalog'
                  ? 'bg-indigo-600 border border-indigo-400 text-white font-medium shadow-[0_0_14px_rgba(99,102,241,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>คลังวิดีโอ (161 คลิป)</span>
            </button>
          </div>

          {/* GitHub & Cloud Sync Buttons */}
          <div className="flex items-center gap-2 font-mono text-xs">
            {isCloudConnected ? (
              <div 
                title={`เชื่อมต่อ Real-time Cloud สำเร็จ: ${state.settings?.firebaseDatabaseUrl}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Cloud สด</span>
              </div>
            ) : (
              <button
                onClick={() => setIsSettingsOpen(true)}
                title="ตั้งค่า Firebase Database เพื่อซิงค์สดแบบ Real-time ระหว่างเพื่อนในทีม"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/[0.15] text-slate-400 hover:text-slate-200 transition shadow-sm"
              >
                <Cloud className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">ต่อ Cloud ซิงค์สด</span>
              </button>
            )}

            <button
              onClick={syncGitHubData}
              disabled={isSyncingGit}
              title="รีเฟรชไฟล์ล่าสุดจาก GitHub และตรวจจับงานที่ส่งอัตโนมัติ"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/[0.15] text-slate-300 hover:text-white transition shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingGit ? 'animate-spin text-indigo-400' : ''}`} />
              <span className="hidden sm:inline">ซิงค์ Git</span>
            </button>
            <a
              href={`https://github.com/${REPO_OWNER}/${REPO_NAME}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/[0.15] text-slate-300 hover:text-white transition shadow-sm"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GitHub Repo</span>
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
      <footer className="w-full border-t border-white/[0.06] bg-[#05080e] py-5 text-center text-xs text-slate-500 font-mono">
        <p>C-Learn &bull; ระบบติดตามการฝึกซ้อมแข่ง C++ &bull; CEDT 2110-104 & 2110-328 &bull; เป้าหมาย 27 ก.ย.</p>
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
