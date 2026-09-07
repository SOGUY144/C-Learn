import React, { useState } from 'react';
import { X, Settings, Send, Calendar, Save, Trash2, Check, AlertCircle } from 'lucide-react';
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
      setTestStatus({ type: 'error', message: 'Enter Discord Webhook URL first.' });
      return;
    }

    setIsTesting(true);
    setTestStatus(null);
    try {
      const payload = buildDiscordReportPayload(state, {}, 1);
      payload.embeds[0].title = '[C-Learn] Discord Webhook Test';
      await sendDiscordWebhook(webhookUrl, payload);
      setTestStatus({ type: 'success', message: 'Test message sent successfully.' });
    } catch (err) {
      setTestStatus({ type: 'error', message: `Failed to send: ${err.message}` });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-md rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl p-5"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-zinc-400" />
            <h3 className="font-mono font-semibold text-sm text-zinc-100">Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 my-4 text-xs font-mono">
          
          {/* Discord Webhook */}
          <div>
            <label className="block text-zinc-300 font-medium mb-1">
              Discord Webhook URL
            </label>
            <input
              type="text"
              placeholder="https://discord.com/api/webhooks/..."
              value={webhookUrl}
              onChange={e => setWebhookUrl(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-zinc-950/60 border border-zinc-800 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition"
            />
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[10px] text-zinc-500">
                Daily reports sent to your team channel.
              </span>
              <button
                type="button"
                onClick={handleTestWebhook}
                disabled={isTesting || !webhookUrl}
                className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-zinc-300 text-[11px] disabled:opacity-40"
              >
                {isTesting ? 'Testing...' : 'Test'}
              </button>
            </div>

            {testStatus && (
              <div className={`mt-2 p-2 rounded border flex items-center gap-1.5 text-[11px] ${
                testStatus.type === 'success' 
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300' 
                  : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
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
            <label className="block text-zinc-300 font-medium mb-1">
              Target Contest Date
            </label>
            <input
              type="datetime-local"
              value={contestDate}
              onChange={e => setContestDate(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-zinc-950/60 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-zinc-600 transition"
            />
          </div>

          {/* Reset Data */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-zinc-300 font-medium block text-xs">Reset All Data</span>
              <span className="text-[10px] text-zinc-500">Clear local checklist state.</span>
            </div>
            <button
              onClick={onResetData}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 hover:bg-rose-950/50 border border-zinc-800 hover:border-rose-900 text-zinc-400 hover:text-rose-300 transition text-[11px]"
            >
              <Trash2 className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800 font-mono text-xs">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>

      </div>
    </div>
  );
}
