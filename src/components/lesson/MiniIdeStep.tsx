"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import { pythonRunner, isStdoutAssertion, checkStdoutAssertion } from "@/lib/runPython";
import { MiniIdeStepData } from "@/types/lesson";

export default function MiniIdeStep({
  step,
  onPass,
  onFail = () => {},
}: {
  step: MiniIdeStepData;
  onPass: () => void;
  onFail?: () => void;
}) {
  const [code, setCode] = useState(step.starterCode);
  const [output, setOutput] = useState("Press Run to execute your code.");
  const [status, setStatus] = useState<"idle" | "pass" | "fail">("idle");

  async function handleRun() {
    setOutput("Running…");
    const stdoutAssertion = isStdoutAssertion(step.assertion);
    const result = await pythonRunner.runCode(code, {
      stdin: step.stdin,
      assertion: stdoutAssertion ? undefined : step.assertion,
    });

    if (result.stderr) {
      setStatus("fail");
      setOutput(result.stderr);
      onFail();
      return;
    }

    let pass: boolean;
    let displayOutput: string;

    if (stdoutAssertion) {
      pass = checkStdoutAssertion(step.assertion, result.stdout);
      displayOutput = result.stdout || "(no output)";
    } else if (result.assertionError) {
      pass = false;
      displayOutput = "This checkpoint's auto-grader isn't wired up in the browser demo yet.";
    } else {
      pass = result.assertionResult === true;
      displayOutput =
        result.stdout ||
        (pass
          ? "✅ Variable values match what's expected."
          : "Code ran, but the expected variable values weren't found.");
    }

    setStatus(pass ? "pass" : "fail");
    setOutput(displayOutput);
    if (pass) onPass();
    else onFail();
  }

  return (
    <div className="space-y-4 rounded-2xl border-b-4 border-black/30 bg-quest-card p-5">
      <p className="text-sm text-white/80">{step.prompt}</p>
      <CodeEditor value={code} onChange={setCode} />
      <button
        onClick={handleRun}
        className="flex items-center gap-2 rounded-2xl border-b-4 border-quest-greenDark bg-quest-green px-5 py-2 font-extrabold active:border-b-0 active:translate-y-1"
      >
        <Play size={18} /> Run
      </button>
      <div
        className={`rounded-xl p-3 font-mono text-sm whitespace-pre-wrap ${
          status === "pass"
            ? "bg-green-950 text-green-300"
            : status === "fail"
            ? "bg-red-950 text-red-300"
            : "bg-[#0d1417] text-white/70"
        }`}
      >
        {output}
      </div>
    </div>
  );
}
