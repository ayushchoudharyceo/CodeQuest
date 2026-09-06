"use client";

import { useMemo, useState } from "react";
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
    <div className="space-y-4 rounded-2xl border-b-4 border-black/30 bg-quest-card p-5">
      <p className="text-sm text-white/80">{step.prompt}</p>

      <div className="whitespace-pre-wrap rounded-xl bg-[#0d1417] p-4 font-mono text-sm leading-loose text-green-300">
        {step.template.split(/(\{\{\}\})/g).map((part, i) => {
          if (part !== "{{}}") return <span key={i}>{part}</span>;

          blankCursor += 1;
          const slotIndex = blankCursor;
          const value = filled[slotIndex];
          return (
            <button
              key={i}
              onClick={() => (value ? clearSlot(slotIndex) : setActiveSlot(slotIndex))}
              title={value ? "Tap to clear" : "Tap a token below to fill this slot"}
              className={`mx-1 inline-block min-w-[4rem] rounded border-b-2 bg-slate-800 px-2 text-center text-emerald-300 outline-none ${
                activeSlot === slotIndex ? "border-quest-yellow" : "border-emerald-400"
              }`}
            >
              {value ?? " "}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {bank.map((token, i) => (
          <button
            key={`${token}-${i}`}
            onClick={() => pickToken(token)}
            className="rounded-xl border-b-4 border-quest-blueDark bg-quest-blue px-4 py-2 font-mono font-bold active:border-b-0 active:translate-y-1"
          >
            {token}
          </button>
        ))}
      </div>

      {checked !== "correct" && (
        <button
          onClick={handleCheck}
          disabled={filled.some((v) => v === null)}
          className="rounded-2xl border-b-4 border-quest-greenDark bg-quest-green px-5 py-2 font-extrabold disabled:opacity-40 active:border-b-0 active:translate-y-1"
        >
          Check
        </button>
      )}
      {checked === "incorrect" && (
        <p className="text-sm font-bold text-quest-red">
          Not quite — tap a filled slot to clear it and try again.
        </p>
      )}
      {checked === "correct" && <p className="text-sm font-bold text-quest-green">✅ Correct!</p>}
    </div>
  );
}
