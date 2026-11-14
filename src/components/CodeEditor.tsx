"use client";

import { useMemo, KeyboardEvent } from "react";
import { Terminal, FileCode } from "lucide-react";

export default function CodeEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const lineCount = useMemo(() => {
    return Math.max(value.split("\n").length, 6);
  }, [value]);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newValue = value.substring(0, start) + "    " + value.substring(end);
      onChange(newValue);

      // Re-position cursor after the inserted 4 spaces
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#090d13] shadow-xl">
      {/* Editor Tab Bar */}
      <div className="flex items-center justify-between border-b border-white/5 bg-slate-900/90 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <div className="h-3 w-3 rounded-full bg-rose-500/80" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-slate-800/80 px-2.5 py-1 text-xs font-bold text-sky-400">
            <FileCode size={14} />
            <span>main.py</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
          <Terminal size={12} />
          <span>Python 3.11 · Pyodide</span>
        </div>
      </div>

      {/* Editor Body with Line Numbers */}
      <div className="flex bg-[#070a0e] font-mono text-sm">
        {/* Line Numbers */}
        <div className="select-none py-3 pl-3 pr-2 text-right font-mono text-xs font-semibold text-slate-600 bg-[#070a0e] border-r border-white/5">
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="h-44 w-full resize-none bg-transparent p-3 font-mono text-sm leading-6 text-emerald-300 outline-none placeholder:text-slate-600 focus:bg-white/[0.01]"
          placeholder="# Write your Python code here"
        />
      </div>
    </div>
  );
}
