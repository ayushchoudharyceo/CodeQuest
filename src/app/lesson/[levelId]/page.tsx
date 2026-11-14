"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { ArrowLeft, ArrowRight, Lightbulb, PartyPopper } from "lucide-react";
import StatusHUD from "@/components/StatusHUD";
import ProgressBar from "@/components/lesson/ProgressBar";
import TheoryCardStep from "@/components/lesson/TheoryCardStep";
import FillBlankStep from "@/components/lesson/FillBlankStep";
import PredictOutputStep from "@/components/lesson/PredictOutputStep";
import SpotTheBugStep from "@/components/lesson/SpotTheBugStep";
import MiniIdeStep from "@/components/lesson/MiniIdeStep";
import SignInModal from "@/components/modals/SignInModal";
import { getLevelById, getNextLevel } from "@/lib/levels";
import { getStepsForLevel } from "@/lib/lessonSteps";
import { useLessonStore } from "@/store/useLessonStore";
import { useGameStore } from "@/store/useGameStore";
import { useUserStore } from "@/store/useUserStore";

// Learners get a delayed signup prompt after finishing this level, so their
// streak/XP is already banked before they're ever asked to create an account.
const SIGN_IN_PROMPT_LEVEL_ID = "PY-03";

export default function LessonPage() {
  const params = useParams<{ levelId: string }>();
  const router = useRouter();
  const level = getLevelById(params.levelId);

  const { levelId: sessionLevelId, steps, currentStepIndex, passedSteps, startLesson, markCurrentStepPassed, goToNextStep } =
    useLessonStore();

  const [attempts, setAttempts] = useState(0);
  const [hintOpen, setHintOpen] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [pendingSignIn, setPendingSignIn] = useState(false);
  const [pendingNav, setPendingNav] = useState<(() => void) | null>(null);

  const completeLevel = useGameStore((s) => s.completeLevel);
  const useHint = useGameStore((s) => s.useHint);
  const hintsUsed = useGameStore((s) => s.hintsUsed[params.levelId]);
  const isSignedIn = useUserStore((s) => s.isSignedIn);
  const hasSeenSignInPrompt = useUserStore((s) => s.hasSeenSignInPrompt);
  const markSignInPromptSeen = useUserStore((s) => s.markSignInPromptSeen);

  useEffect(() => {
    if (!level) return;
    startLesson(level.id, getStepsForLevel(level));
    setAttempts(0);
    setHintOpen(false);
    setShowCompleteModal(false);
    setPendingSignIn(false);
    setPendingNav(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.levelId]);

  if (!level) {
    return <div className="p-6">Level not found.</div>;
  }

  // The lesson store updates a render after startLesson fires; render a
  // lightweight placeholder for that one frame instead of indexing into
  // steps built for whatever level was previously open.
  if (sessionLevelId !== level.id) {
    return (
      <main>
        <StatusHUD />
        <div className="p-6 text-white/50">Loading lesson…</div>
      </main>
    );
  }

  const nextLevel = getNextLevel(level.id);
  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const canContinue = passedSteps[currentStepIndex];

  function handleContinue() {
    if (!isLastStep) {
      goToNextStep();
      return;
    }

    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    completeLevel(level!.id, level!.xp, attempts > 0 || !!hintsUsed);
    setShowCompleteModal(true);

    if (level!.id === SIGN_IN_PROMPT_LEVEL_ID && !isSignedIn && !hasSeenSignInPrompt) {
      setPendingSignIn(true);
    }
  }

  // Routes "Next Lesson" / "Back to Skill Tree" through the sign-in prompt
  // first (once, on the designated level) instead of navigating immediately.
  function proceedTo(action: () => void) {
    if (pendingSignIn) {
      markSignInPromptSeen();
      setShowCompleteModal(false);
      setPendingNav(() => action);
      return;
    }
    action();
  }

  function handleSignInModalClose() {
    setPendingSignIn(false);
    if (pendingNav) {
      pendingNav();
      setPendingNav(null);
    }
  }

  return (
    <main className="min-h-screen pb-24">
      <StatusHUD />
      <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => router.push("/")}
            className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white hover:border-white/20 active:scale-95"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
            <span>Skill Tree</span>
          </button>

          <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
            {level.id}
          </span>
        </div>

        {/* Progress Bar */}
        {steps.length > 1 && (
          <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-3 shadow-sm">
            <ProgressBar total={steps.length} currentIndex={currentStepIndex} passedSteps={passedSteps} />
          </div>
        )}

        {/* Level Breadcrumb & Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-sky-400">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
              {level.tier}
            </span>
            <span className="text-xs font-medium text-slate-400">· {level.concept}</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            {level.title}
          </h1>
        </div>

        {/* Active Step Content */}
        <div key={`${level.id}-${currentStepIndex}`} className="transition-all duration-300">
          {currentStep.kind === "theory" && (
            <TheoryCardStep step={currentStep} onPass={markCurrentStepPassed} />
          )}
          {currentStep.kind === "fill_blank" && (
            <FillBlankStep
              step={currentStep}
              onPass={markCurrentStepPassed}
              onFail={() => setAttempts((a) => a + 1)}
            />
          )}
          {currentStep.kind === "predict" && (
            <PredictOutputStep
              step={currentStep}
              onPass={markCurrentStepPassed}
              onFail={() => setAttempts((a) => a + 1)}
            />
          )}
          {currentStep.kind === "spot_bug" && (
            <SpotTheBugStep
              step={currentStep}
              onPass={markCurrentStepPassed}
              onFail={() => setAttempts((a) => a + 1)}
            />
          )}
          {currentStep.kind === "mini_ide" && (
            <MiniIdeStep
              step={currentStep}
              onPass={markCurrentStepPassed}
              onFail={() => setAttempts((a) => a + 1)}
            />
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            onClick={() => {
              setHintOpen((v) => !v);
              useHint(level.id);
            }}
            className="flex items-center gap-2 rounded-2xl border-b-4 border-amber-600 bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-md shadow-amber-950/40 transition hover:brightness-110 active:border-b-0 active:translate-y-1"
          >
            <Lightbulb size={16} />
            <span>Hint</span>
          </button>

          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className="flex items-center gap-2 rounded-2xl border-b-4 border-emerald-700 bg-gradient-to-r from-emerald-500 to-green-600 px-7 py-3 text-sm font-black text-white shadow-lg shadow-emerald-950/40 transition hover:brightness-110 disabled:opacity-30 disabled:pointer-events-none active:border-b-0 active:translate-y-1"
          >
            <span>{isLastStep ? "Complete Lesson" : "Continue"}</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Hint Revelation Card */}
        {hintOpen && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-950/30 p-4 text-sm text-amber-200">
            <Lightbulb size={18} className="mt-0.5 shrink-0 text-amber-400" />
            <div>
              <span className="font-bold">Coach Tip: </span>
              <span>Focus on mastering <strong className="text-white">{level.concept}</strong>. Re-check the expected output or syntax syntax rule shown in the theory tab.</span>
            </div>
          </div>
        )}
      </div>

      {/* Celebratory Completion Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-[#16222f] to-[#0c131b] p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/30">
              <PartyPopper size={32} />
            </div>

            <h2 className="mt-4 text-2xl font-black text-white">Lesson Mastered!</h2>
            <p className="mt-1 text-sm text-slate-300">
              &ldquo;{level.title}&rdquo; completed
            </p>

            {/* Rewards Card */}
            <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-white/5 bg-slate-900/60 p-3">
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-400">XP Gained</span>
                <span className="text-lg font-black text-sky-400">+{level.xp} XP</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-400">Coins</span>
                <span className="text-lg font-black text-amber-400">
                  +{hintsUsed || attempts > 0 ? "10" : "20"} 🪙
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              {nextLevel ? (
                <button
                  onClick={() => proceedTo(() => router.push(`/lesson/${nextLevel.id}`))}
                  className="flex items-center justify-center gap-2 rounded-2xl border-b-4 border-emerald-700 bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-3 font-black text-white shadow-lg shadow-emerald-950 transition hover:brightness-110 active:border-b-0 active:translate-y-1"
                >
                  <span>Next Lesson</span>
                  <ArrowRight size={18} />
                </button>
              ) : (
                <p className="text-sm font-bold text-amber-400">
                  You&apos;ve completed every level in CodeQuest!
                </p>
              )}
              <button
                onClick={() => proceedTo(() => router.push("/"))}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white active:scale-95"
              >
                Back to Skill Tree
              </button>
            </div>
          </div>
        </div>
      )}

      <SignInModal open={pendingSignIn && !showCompleteModal} onClose={handleSignInModalClose} />
    </main>
  );
}
