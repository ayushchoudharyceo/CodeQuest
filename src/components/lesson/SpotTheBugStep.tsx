"use client";

import { useState } from "react";
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
    <div className="space-y-4 rounded-2xl border-b-4 border-black/30 bg-quest-card p-5">
      <p className="text-sm text-white/80">{step.prompt}</p>
      <div className="overflow-x-auto rounded-xl bg-[#0d1417] p-2 font-mono text-sm">
        {lines.map((line, i) => {
          const lineNumber = i + 1;
          const isSelected = selectedLine === lineNumber;
          return (
            <button
              key={i}
              onClick={() => handleSelect(lineNumber)}
              className={`block w-full rounded px-2 py-1 text-left text-green-300 ${
                isSelected && checked === "correct"
                  ? "bg-quest-green/60"
                  : isSelected && checked === "incorrect"
                  ? "bg-quest-red/60"
                  : "hover:bg-white/10"
              }`}
            >
              <span className="mr-3 select-none text-white/30">{lineNumber}</span>
              {line}
            </button>
          );
        })}
      </div>
      {checked === "correct" && (
        <p className="text-sm text-white/70">
          Fixed version: <code className="text-quest-green">{step.fixedLine}</code>
        </p>
      )}
      {checked === "incorrect" && (
        <p className="text-sm font-bold text-quest-red">Not that line — look again.</p>
      )}
    </div>
  );
}
