"use client";

import { useState } from "react";
import { PredictStepData } from "@/types/lesson";

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
    <div className="space-y-4 rounded-2xl border-b-4 border-black/30 bg-quest-card p-5">
      <p className="text-sm text-white/80">{step.prompt}</p>
      <pre className="overflow-x-auto rounded-xl bg-[#0d1417] p-3 font-mono text-sm text-green-300">
        {step.code}
      </pre>
      <div className="space-y-2">
        {step.choices.map((choice, i) => {
          const isSelected = selected === i;
          const showCorrect = checked && i === step.correctIndex;
          const showWrong = checked && isSelected && i !== step.correctIndex;
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full rounded-xl border-b-4 px-4 py-2 text-left font-mono text-sm active:border-b-0 active:translate-y-1 ${
                showCorrect
                  ? "border-quest-greenDark bg-quest-green"
                  : showWrong
                  ? "border-red-800 bg-quest-red/80"
                  : "border-black/30 bg-white/10 hover:bg-white/20"
              }`}
            >
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}
