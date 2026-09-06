"use client";

import { useEffect } from "react";
import { TheoryStepData } from "@/types/lesson";

export default function TheoryCardStep({
  step,
  onPass,
}: {
  step: TheoryStepData;
  onPass: () => void;
}) {
  // A theory card has no exercise to fail — it "passes" as soon as it's read,
  // unlocking the shared Continue button below it.
  useEffect(() => {
    onPass();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4 rounded-2xl border-b-4 border-black/30 bg-quest-card p-5">
      <h3 className="text-lg font-extrabold text-quest-blue">{step.title}</h3>
      <p className="text-sm text-white/80">{step.explanation}</p>
      <pre className="overflow-x-auto rounded-xl bg-[#0d1417] p-3 font-mono text-sm text-green-300">
        {step.example}
      </pre>
    </div>
  );
}
