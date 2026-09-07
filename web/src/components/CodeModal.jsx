import React, { useState, useEffect } from 'react';
import { X, Copy, Check, ExternalLink, Code2, FileCode } from 'lucide-react';
import { fetchFileContent } from '../services/github';

export default function CodeModal({ file, member, onClose }) {
  const [content, setContent] = useState('กำลังโหลดโค้ด...');
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
          setContent(`// ไม่สามารถโหลดโค้ดจาก GitHub ได้: ${err.message}`);
          setLoading(false);
        });
    } else {
      // Local fallback for demonstration / mock
      if (file.name === '01-GUY.cpp') {
        setContent(`#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

// C-Learn Training: Solution by GUY
int main() {
    // Fast I/O
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
        setContent(`// ไฟล์: ${member}/${file.name}\n// บันทึกและ push ขึ้น GitHub แล้ว`);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl bg-dark-900 border border-slate-700 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-dark-950">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-100 text-sm">{file.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-dark-850 text-cyan-300 border border-slate-800">
                  โฟลเดอร์ {member}/
                </span>
              </div>
              {file.size && (
                <span className="text-[10px] text-slate-400 font-mono">
                  ขนาด {file.size} bytes
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 border border-slate-800 text-slate-300 text-xs font-mono transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">คัดลอกแล้ว!</span>
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
                className="p-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 border border-slate-800 text-slate-400 hover:text-cyan-400 transition"
                title="ดูไฟล์บน GitHub"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 border border-slate-800 text-slate-400 hover:text-rose-400 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code Body with Line Numbers */}
        <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-200 bg-dark-950/60 leading-relaxed selection:bg-cyan-500/30">
          {loading ? (
            <div className="p-8 text-center text-slate-400 font-mono">กำลังโหลด...</div>
          ) : (
            <table className="w-full border-collapse">
              <tbody>
                {lines.map((line, idx) => (
                  <tr key={idx} className="hover:bg-dark-850/50 transition">
                    <td className="w-10 pr-4 text-right select-none text-slate-400 font-mono text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="whitespace-pre">
                      {line || '\n'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-slate-800/80 bg-dark-950 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>ภาษา: C++ (Standard C++17/20)</span>
          <span>{lines.length} บรรทัด</span>
        </div>
      </div>
    </div>
  );
}
