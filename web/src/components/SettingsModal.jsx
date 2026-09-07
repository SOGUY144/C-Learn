import React, { useState } from 'react';
import { X, Settings, Trash2, Check, AlertCircle, Save } from 'lucide-react';
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
  const [testStatus, setTestStatus] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  async function handleTestWebhook() {
    if (!webhookUrl) {
      setTestStatus({ type: 'error', message: 'กรุณากรอก Discord Webhook URL ก่อนทดสอบ' });
      return;
    }

    setIsTesting(true);
    setTestStatus(null);
    try {
      const payload = buildDiscordReportPayload(state, {}, 1);
      payload.embeds[0].title = '[C-Learn] ทดสอบการเชื่อมต่อ Discord Webhook';
      await sendDiscordWebhook(webhookUrl, payload);
      setTestStatus({ type: 'success', message: 'ส่งข้อความทดสอบเข้า Discord สำเร็จ' });
    } catch (err) {
      setTestStatus({ type: 'error', message: `ไม่สามารถส่งได้: ${err.message}` });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="linear-card relative w-full max-w-md rounded-2xl shadow-2xl p-6 !bg-[#0a0e1a]/95"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Settings className="w-4 h-4" />
            </div>
            <h3 className="font-mono font-semibold text-sm text-slate-100 tracking-tight">การตั้งค่าระบบ</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-white/[0.08] text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 my-5 text-xs font-mono">
          
          {/* Discord Webhook */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Discord Webhook URL
            </label>
            <input
              type="text"
              placeholder="https://discord.com/api/webhooks/..."
              value={webhookUrl}
              onChange={e => setWebhookUrl(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition shadow-inner"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-slate-400">
                สำหรับส่งสรุปรายงานประจำวันเข้า Discord ของทีม
              </span>
              <button
                type="button"
                onClick={handleTestWebhook}
                disabled={isTesting || !webhookUrl}
                className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white text-[11px] disabled:opacity-40 transition shadow-sm"
              >
                {isTesting ? 'กำลังทดสอบ...' : 'ทดสอบส่ง'}
              </button>
            </div>

            {testStatus && (
              <div className={`mt-2 p-2.5 rounded-xl border flex items-center gap-2 text-[11px] ${
                testStatus.type === 'success' 
                  ? 'bg-emerald-500/[0.08] border-emerald-500/30 text-emerald-300' 
                  : 'bg-rose-500/[0.08] border-rose-500/30 text-rose-300'
              }`}>
                {testStatus.type === 'success' ? (
                  <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                )}
                <span>{testStatus.message}</span>
              </div>
            )}
          </div>

          {/* Contest Date */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              วันและเวลาเป้าหมายการแข่งขัน
            </label>
            <input
              type="datetime-local"
              value={contestDate}
              onChange={e => setContestDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-slate-200 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition shadow-inner"
            />
          </div>

          {/* Reset Data */}
          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="text-slate-300 font-medium block text-xs">ล้างข้อมูลความคืบหน้า</span>
              <span className="text-[10px] text-slate-500">รีเซ็ตสถานะการติ๊กงานในเครื่องนี้ทั้งหมด</span>
            </div>
            <button
              onClick={onResetData}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-black/30 hover:bg-rose-500/10 border border-white/[0.06] hover:border-rose-500/30 text-slate-400 hover:text-rose-300 transition text-[11px]"
            >
              <Trash2 className="w-3 h-3" />
              <span>รีเซ็ตข้อมูล</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/[0.08] font-mono text-xs">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-black/40 hover:bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white transition shadow-sm"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 border border-indigo-400 text-white font-medium transition shadow-[0_0_14px_rgba(99,102,241,0.35)]"
          >
            <Save className="w-3.5 h-3.5" />
            <span>บันทึกการตั้งค่า</span>
          </button>
        </div>

      </div>
    </div>
  );
}
