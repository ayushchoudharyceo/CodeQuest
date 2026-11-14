"use client";

import { useState } from "react";
import { Play, Terminal, CheckCircle2, AlertCircle, Loader2, Sparkles } from "lucide-react";
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
  const [output, setOutput] = useState("Click 'Run Code' to execute in Pyodide Wasm.");
  const [status, setStatus] = useState<"idle" | "running" | "pass" | "fail">("idle");

  async function handleRun() {
    setStatus("running");
    setOutput("Executing in WebAssembly sandbox…");
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
    <div className="space-y-5 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-[#141d2b] to-[#101722] p-6 shadow-xl glass-card">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 shadow-inner">
          <Terminal size={20} />
        </div>
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">
            Python Coding Lab
          </span>
          <h3 className="text-xl font-black text-white">{step.prompt}</h3>
        </div>
      </div>

      {/* Code Editor Container */}
      <CodeEditor value={code} onChange={setCode} />

      {/* Action Row */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handleRun}
          disabled={status === "running"}
          className="group flex items-center gap-2 rounded-2xl border-b-4 border-emerald-700 bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-2.5 font-black text-white shadow-lg shadow-emerald-950/40 transition hover:brightness-110 active:border-b-0 active:translate-y-1 disabled:opacity-50"
        >
          {status === "running" ? (
            <>
              <Loader2 size={18} className="animate-spin text-white" />
              <span>Running…</span>
            </>
          ) : (
            <>
              <Play size={17} className="fill-white transition-transform group-hover:scale-110" />
              <span>Run Code</span>
            </>
          )}
        </button>

        {status === "pass" && (
          <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-400">
            <CheckCircle2 size={18} />
            <span>Passed all assertions!</span>
          </div>
        )}
        {status === "fail" && (
          <div className="flex items-center gap-2 text-sm font-bold text-rose-400">
            <AlertCircle size={18} />
            <span>Assertions not met</span>
          </div>
        )}
      </div>

      {/* Terminal Output Console */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#070a0e] shadow-inner">
        <div className="flex items-center justify-between border-b border-white/5 bg-slate-900/80 px-4 py-2 text-xs">
          <div className="flex items-center gap-2">
            <Terminal size={13} className="text-slate-400" />
            <span className="font-mono text-[11px] font-bold text-slate-300">Terminal Output</span>
          </div>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
              status === "pass"
                ? "bg-emerald-500/20 text-emerald-300"
                : status === "fail"
                ? "bg-rose-500/20 text-rose-300"
                : status === "running"
                ? "bg-sky-500/20 text-sky-300"
                : "bg-white/5 text-slate-400"
            }`}
          >
            {status}
          </span>
        </div>
        <div
          className={`p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap ${
            status === "pass"
              ? "text-emerald-300"
              : status === "fail"
              ? "text-rose-300"
              : "text-slate-400"
          }`}
        >
          {output}
        </div>
      </div>
    </div>
  );
}
