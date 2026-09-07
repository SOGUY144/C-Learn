import React, { useState, useEffect } from 'react';
import { X, Copy, Check, ExternalLink, FileCode } from 'lucide-react';
import { fetchFileContent } from '../services/github';

export default function CodeModal({ file, member, onClose }) {
  const [content, setContent] = useState('Loading code...');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!file) return;

    setLoading(true);
    if (file.download_url) {
      fetchFileContent(file.download_url)
        .then(code => {
          setContent(code);
          setLoading(false);
        })
        .catch(err => {
          setContent(`// Failed to fetch from GitHub: ${err.message}`);
          setLoading(false);
        });
    } else {
      if (file.name === '01-GUY.cpp') {
        setContent(`#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

// C-Learn Training: Solution by GUY
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int a, b;
    if (cin >> a >> b) {
        cout << "Sum: " << (a + b) << "\\n";
        cout << "Diff: " << (a - b) << "\\n";
        cout << "Product: " << (1LL * a * b) << "\\n";
    }

    return 0;
}`);
      } else {
        setContent(`// File: ${member}/${file.name}\n// Solution source`);
      }
      setLoading(false);
    }
  }, [file, member]);

  function handleCopy() {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!file) return null;

  const lines = content.split('\n');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="linear-card relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden !bg-[#0a0e1a]/95"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-black/40">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <FileCode className="w-4 h-4" />
            </div>
            <span className="font-mono font-semibold text-slate-200 text-xs tracking-tight">{file.name}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-slate-400">
              /{member}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white transition shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">คัดลอกแล้ว</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>คัดลอกโค้ด</span>
                </>
              )}
            </button>

            {file.html_url && (
              <a
                href={file.html_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white transition shadow-sm"
                title="เปิดดูใน GitHub"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            )}

            <button
              onClick={onClose}
              title="ปิด"
              className="p-1.5 rounded-xl bg-black/40 hover:bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-white transition ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-300 bg-black/50 leading-relaxed">
          {loading ? (
            <div className="p-12 text-center text-slate-500 font-mono">กำลังดึงโค้ดจาก GitHub...</div>
          ) : (
            <table className="w-full border-collapse">
              <tbody>
                {lines.map((line, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                    <td className="w-10 pr-4 text-right select-none text-slate-600 font-mono text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="whitespace-pre text-slate-200">
                      {line || '\n'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-white/[0.06] bg-black/40 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>ภาษา C++ (C++17 / C++20)</span>
          <span>{lines.length} บรรทัด</span>
        </div>
      </div>
    </div>
  );
}
