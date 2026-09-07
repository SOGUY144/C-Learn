import React, { useState } from 'react';
import { X, Settings, Send, Calendar, Save, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { sendDiscordWebhook, buildDiscordReportPayload } from '../services/discord';

export default function SettingsModal({
  settings = {},
  state,
  onSaveSettings,
  onResetData,
  onClose
}) {
  const [webhookUrl, setWebhookUrl] = useState(settings.discordWebhook || '');
  const [contestDate, setContestDate] = useState(settings.targetContestDate || '2026-09-27T09:00:00');
  const [testStatus, setTestStatus] = useState(null); // { type: 'success' | 'error', message: string }
  const [isTesting, setIsTesting] = useState(false);

  async function handleTestWebhook() {
    if (!webhookUrl) {
      setTestStatus({ type: 'error', message: 'กรุณาระบุ Discord Webhook URL ก่อนทดสอบ' });
      return;
    }

    setIsTesting(true);
    setTestStatus(null);
    try {
      const payload = buildDiscordReportPayload(state, {}, 1);
      payload.embeds[0].title = '🧪 [C-Learn Test] ทดสอบการเชื่อมต่อ Discord Webhook สำเร็จ!';
      await sendDiscordWebhook(webhookUrl, payload);
      setTestStatus({ type: 'success', message: 'ส่งข้อความทดสอบเข้า Discord สำเร็จแล้ว! 🎉' });
    } catch (err) {
      setTestStatus({ type: 'error', message: `ส่งไม่สำเร็จ: ${err.message}` });
    } finally {
      setIsTesting(false);
    }
  }

  function handleSave() {
    onSaveSettings({
      discordWebhook: webhookUrl.trim(),
      targetContestDate: contestDate
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-dark-900 border border-slate-700 shadow-2xl overflow-hidden p-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400">
            <Settings className="w-5 h-5" />
            <h3 className="font-bold font-mono text-base text-slate-100">ตั้งค่าระบบ (Settings)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-dark-850 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 my-5 text-xs font-mono">
          
          {/* Discord Webhook */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-indigo-400" />
              <span>Discord Webhook URL:</span>
            </label>
            <input
              type="text"
              placeholder="https://discord.com/api/webhooks/..."
              value={webhookUrl}
              onChange={e => setWebhookUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[10px] text-slate-400">
                รับการแจ้งเตือนและส่งรายงานความคืบหน้ารายวันเข้าห้อง Discord
              </span>
              <button
                type="button"
                onClick={handleTestWebhook}
                disabled={isTesting || !webhookUrl}
                className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 transition text-[11px] disabled:opacity-40"
              >
                {isTesting ? 'กำลังส่ง...' : 'ทดสอบส่ง'}
              </button>
            </div>

            {testStatus && (
              <div className={`mt-2 p-2 rounded-lg border flex items-center gap-1.5 text-[11px] ${
                testStatus.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                {testStatus.type === 'success' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                )}
                <span>{testStatus.message}</span>
              </div>
            )}
          </div>

          {/* Contest Date */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>วันแข่งขัน (Contest Target Date):</span>
            </label>
            <input
              type="datetime-local"
              value={contestDate}
              onChange={e => setContestDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          {/* Reset Data */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-slate-300 font-semibold block">รีเซ็ตข้อมูลทั้งหมด</span>
              <span className="text-[10px] text-slate-400">ล้าง Checklist และเริ่มบันทึกใหม่</span>
            </div>
            <button
              onClick={onResetData}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 transition text-[11px]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>รีเซ็ตข้อมูล</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 border border-slate-800 text-slate-300 text-xs font-mono transition"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-dark-950 font-bold text-xs font-mono transition shadow-[0_0_15px_rgba(0,242,254,0.3)]"
          >
            <Save className="w-3.5 h-3.5" />
            <span>บันทึกการตั้งค่า</span>
          </button>
        </div>

      </div>
    </div>
  );
}
