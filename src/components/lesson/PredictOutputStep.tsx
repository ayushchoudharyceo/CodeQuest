"use client";

import { useState } from "react";
import { HelpCircle, CheckCircle2, XCircle } from "lucide-react";
import { PredictStepData } from "@/types/lesson";

const LETTERS = ["A", "B", "C", "D"];

export default function PredictOutputStep({
  step,
  onPass,
  onFail = () => {},
}: {
  step: PredictStepData;
  onPass: () => void;
  onFail?: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  function handleSelect(i: number) {
    if (checked && selected === step.correctIndex) return;
    setSelected(i);
    setChecked(true);
    if (i === step.correctIndex) onPass();
    else onFail();
  }

  return (
    <div className="space-y-6 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-[#141d2b] to-[#101722] p-6 shadow-xl glass-card">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400 shadow-inner">
          <HelpCircle size={20} />
        </div>
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-400">
            Prediction Challenge
          </span>
          <h3 className="text-xl font-black text-white">{step.prompt}</h3>
        </div>
      </div>

      {/* Code window chrome */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#090d13] shadow-inner">
        <div className="flex items-center gap-1.5 border-b border-white/5 bg-slate-900/80 px-4 py-2 text-xs">
          <div className="h-3 w-3 rounded-full bg-rose-500/80" />
          <div className="h-3 w-3 rounded-full bg-amber-500/80" />
          <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 font-mono text-[11px] text-slate-400">snippet.py</span>
        </div>
        <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-emerald-300">
          <code>{step.code}</code>
        </pre>
      </div>

      {/* Multiple Choice Cards */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Select Expected Output
        </span>
        <div className="grid grid-cols-1 gap-2.5">
          {step.choices.map((choice, i) => {
            const isSelected = selected === i;
            const showCorrect = checked && i === step.correctIndex;
            const showWrong = checked && isSelected && i !== step.correctIndex;

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={`group flex items-center justify-between rounded-2xl border-2 p-3.5 text-left font-mono text-sm transition-all duration-150 ${
                  showCorrect
                    ? "border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-glow-green"
                    : showWrong
                    ? "border-rose-500 bg-rose-950/40 text-rose-300"
                    : isSelected
                    ? "border-sky-500 bg-sky-950/30 text-white"
                    : "border-white/5 bg-slate-800/40 text-slate-200 hover:border-white/20 hover:bg-slate-800/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs font-black ${
                      showCorrect
                        ? "bg-emerald-500 text-slate-950"
                        : showWrong
                        ? "bg-rose-500 text-white"
                        : "bg-white/10 text-slate-400 group-hover:text-white"
                    }`}
                  >
                    {LETTERS[i] || i + 1}
                  </span>
                  <span className="font-semibold">{choice}</span>
                </div>

                {showCorrect && <CheckCircle2 size={18} className="text-emerald-400" />}
                {showWrong && <XCircle size={18} className="text-rose-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
