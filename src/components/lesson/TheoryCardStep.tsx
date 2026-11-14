"use client";

import { useEffect, useState } from "react";
import { BookOpen, Copy, Check, Sparkles } from "lucide-react";
import { TheoryStepData } from "@/types/lesson";

export default function TheoryCardStep({
  step,
  onPass,
}: {
  step: TheoryStepData;
  onPass: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    onPass();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function copyCode() {
    navigator.clipboard.writeText(step.example);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-5 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-[#141d2b] to-[#101722] p-6 shadow-xl glass-card">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-400 shadow-inner">
          <BookOpen size={20} />
        </div>
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-400">
            Theory & Concept
          </span>
          <h3 className="text-xl font-black text-white">{step.title}</h3>
        </div>
      </div>

      <div className="rounded-2xl border border-sky-500/20 bg-sky-950/20 p-4 text-sm leading-relaxed text-slate-200">
        <p>{step.explanation}</p>
      </div>

      {/* Code window chrome */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#090d13] shadow-inner">
        <div className="flex items-center justify-between border-b border-white/5 bg-slate-900/80 px-4 py-2 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-rose-500/80" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 font-mono text-[11px] text-slate-400">example.py</span>
          </div>
          <button
            onClick={copyCode}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            {copied ? (
              <>
                <Check size={12} className="text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-emerald-300">
          <code>{step.example}</code>
        </pre>
      </div>
    </div>
  );
}
