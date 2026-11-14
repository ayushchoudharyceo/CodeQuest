"use client";

import { useState } from "react";
import { Bug, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import { SpotBugStepData } from "@/types/lesson";

export default function SpotTheBugStep({
  step,
  onPass,
  onFail = () => {},
}: {
  step: SpotBugStepData;
  onPass: () => void;
  onFail?: () => void;
}) {
  const lines = step.buggyCode.split("\n");
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [checked, setChecked] = useState<"idle" | "correct" | "incorrect">("idle");

  function handleSelect(lineNumber: number) {
    if (checked === "correct") return;
    setSelectedLine(lineNumber);
    const pass = lineNumber === step.bugLine;
    setChecked(pass ? "correct" : "incorrect");
    if (pass) onPass();
    else onFail();
  }

  return (
    <div className="space-y-6 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-[#141d2b] to-[#101722] p-6 shadow-xl glass-card">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 shadow-inner">
          <Bug size={20} />
        </div>
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-400">
            Bug Hunter
          </span>
          <h3 className="text-xl font-black text-white">{step.prompt}</h3>
        </div>
      </div>

      {/* Interactive Code Line Inspector */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#090d13] shadow-inner">
        <div className="flex items-center justify-between border-b border-white/5 bg-slate-900/80 px-4 py-2 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-rose-500/80" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 font-mono text-[11px] text-slate-400">inspect_code.py</span>
          </div>
          <span className="text-[11px] font-medium text-slate-500">Click the erroneous line</span>
        </div>

        <div className="p-3 font-mono text-sm">
          {lines.map((line, i) => {
            const lineNumber = i + 1;
            const isSelected = selectedLine === lineNumber;
            const isBuggy = checked === "correct" && lineNumber === step.bugLine;

            return (
              <button
                key={i}
                onClick={() => handleSelect(lineNumber)}
                className={`group flex w-full items-center rounded-xl px-3 py-2 text-left font-mono transition-colors ${
                  isSelected && checked === "correct"
                    ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/50"
                    : isSelected && checked === "incorrect"
                    ? "bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/50"
                    : "text-slate-300 hover:bg-slate-800/60"
                }`}
              >
                <span className="mr-4 inline-block w-6 select-none text-right text-xs font-bold text-slate-600 group-hover:text-slate-400">
                  {lineNumber}
                </span>
                <span className="flex-1 font-medium">{line}</span>
                {isSelected && checked === "correct" && (
                  <CheckCircle2 size={16} className="text-emerald-400" />
                )}
                {isSelected && checked === "incorrect" && (
                  <AlertTriangle size={16} className="text-rose-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanatory Resolution */}
      {checked === "correct" && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-sm">
          <Sparkles size={18} className="mt-0.5 text-emerald-400 shrink-0" />
          <div className="space-y-1">
            <span className="font-extrabold text-emerald-400">Bug identified!</span>
            <p className="text-slate-300">
              The corrected line is:{" "}
              <code className="rounded bg-black/40 px-2 py-0.5 font-mono text-emerald-300">
                {step.fixedLine}
              </code>
            </p>
          </div>
        </div>
      )}

      {checked === "incorrect" && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-950/20 p-4 text-sm font-bold text-rose-400">
          <AlertTriangle size={18} />
          <span>That line is valid syntax. Examine the string quotes and variable names carefully!</span>
        </div>
      )}
    </div>
  );
}
