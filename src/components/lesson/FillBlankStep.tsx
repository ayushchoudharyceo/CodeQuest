"use client";

import { useMemo, useState } from "react";
import { Puzzle, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { FillBlankStepData } from "@/types/lesson";

/**
 * Token-bank fill-in-the-blank: the student only ever taps tokens to fill or
 * clear slots — there is no text input, so there is nothing to backspace.
 */
export default function FillBlankStep({
  step,
  onPass,
  onFail = () => {},
}: {
  step: FillBlankStepData;
  onPass: () => void;
  onFail?: () => void;
}) {
  const [filled, setFilled] = useState<(string | null)[]>(step.blanks.map(() => null));
  const [activeSlot, setActiveSlot] = useState<number | null>(0);
  const [checked, setChecked] = useState<"idle" | "correct" | "incorrect">("idle");

  const bank = useMemo(() => {
    const remaining = [...step.options];
    filled.forEach((token) => {
      if (!token) return;
      const idx = remaining.indexOf(token);
      if (idx !== -1) remaining.splice(idx, 1);
    });
    return remaining;
  }, [filled, step.options]);

  function pickToken(token: string) {
    if (checked === "correct") return;
    let targetIndex = activeSlot;
    if (targetIndex === null || filled[targetIndex] !== null) {
      targetIndex = filled.findIndex((v) => v === null);
    }
    if (targetIndex === -1) return;

    const next = [...filled];
    next[targetIndex] = token;
    setFilled(next);
    setChecked("idle");
    const nextEmpty = next.findIndex((v) => v === null);
    setActiveSlot(nextEmpty === -1 ? null : nextEmpty);
  }

  function clearSlot(index: number) {
    if (checked === "correct") return;
    const next = [...filled];
    next[index] = null;
    setFilled(next);
    setActiveSlot(index);
    setChecked("idle");
  }

  function handleCheck() {
    const pass = step.blanks.every((expected, i) => filled[i] === expected);
    setChecked(pass ? "correct" : "incorrect");
    if (pass) onPass();
    else onFail();
  }

  let blankCursor = -1;

  return (
    <div className="space-y-6 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-[#141d2b] to-[#101722] p-6 shadow-xl glass-card">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 shadow-inner">
          <Puzzle size={20} />
        </div>
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
            Token Puzzle
          </span>
          <h3 className="text-xl font-black text-white">{step.prompt}</h3>
        </div>
      </div>

      {/* Code with Interactive Blank Slots */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#090d13] p-5 shadow-inner">
        <div className="whitespace-pre-wrap font-mono text-base leading-loose text-slate-200">
          {step.template.split(/(\{\{\}\})/g).map((part, i) => {
            if (part !== "{{}}") return <span key={i} className="text-emerald-300 font-medium">{part}</span>;

            blankCursor += 1;
            const slotIndex = blankCursor;
            const value = filled[slotIndex];
            const isActive = activeSlot === slotIndex;

            return (
              <button
                key={i}
                onClick={() => (value ? clearSlot(slotIndex) : setActiveSlot(slotIndex))}
                title={value ? "Click to remove token" : "Active slot — choose a token below"}
                className={`mx-1.5 inline-flex min-h-[2.25rem] min-w-[5rem] items-center justify-center rounded-xl border-2 px-3 py-1 text-center font-mono text-sm font-bold transition-all ${
                  value
                    ? "border-emerald-500/60 bg-emerald-950/40 text-emerald-300 shadow-sm shadow-emerald-500/20 hover:border-rose-500/60 hover:text-rose-300 hover:bg-rose-950/20"
                    : isActive
                    ? "border-amber-400 bg-amber-400/10 text-amber-200 ring-2 ring-amber-400/30 animate-pulse"
                    : "border-dashed border-slate-600 bg-slate-800/40 text-slate-500 hover:border-slate-400"
                }`}
              >
                {value ?? "___"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Token Bank */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Available Tokens
        </span>
        <div className="flex flex-wrap gap-2.5 min-h-[3rem] p-1">
          {bank.length === 0 ? (
            <span className="text-xs italic text-slate-500">All tokens placed in slots. Check your answer below!</span>
          ) : (
            bank.map((token, i) => (
              <button
                key={`${token}-${i}`}
                onClick={() => pickToken(token)}
                className="group flex items-center gap-1.5 rounded-xl border-b-4 border-sky-700 bg-gradient-to-b from-sky-500 to-sky-600 px-4 py-2 font-mono text-sm font-extrabold text-white shadow-md shadow-sky-950 transition hover:brightness-110 active:border-b-0 active:translate-y-1"
              >
                <span>{token}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Action & Feedback */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/5 pt-4">
        {checked !== "correct" ? (
          <button
            onClick={handleCheck}
            disabled={filled.some((v) => v === null)}
            className="flex items-center justify-center gap-2 rounded-2xl border-b-4 border-emerald-700 bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-2.5 font-black text-white shadow-md shadow-emerald-950 transition hover:brightness-110 disabled:opacity-40 disabled:pointer-events-none active:border-b-0 active:translate-y-1"
          >
            <Sparkles size={16} /> Check Answer
          </button>
        ) : (
          <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-400">
            <CheckCircle2 size={18} />
            <span>Perfect! Ready to continue.</span>
          </div>
        )}

        {checked === "incorrect" && (
          <div className="flex items-center gap-2 text-sm font-bold text-rose-400">
            <AlertCircle size={18} />
            <span>Not quite right. Click a slot to clear it and try again.</span>
          </div>
        )}
      </div>
    </div>
  );
}
