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
    <main>
      <StatusHUD />
      <div className="mx-auto max-w-3xl space-y-4 p-4">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1 text-sm text-white/70 hover:text-white"
        >
          <ArrowLeft size={16} /> Skill Tree
        </button>

        {steps.length > 1 && (
          <ProgressBar total={steps.length} currentIndex={currentStepIndex} passedSteps={passedSteps} />
        )}

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-quest-blue">
            {level.tier} · {level.concept}
          </p>
          <h1 className="mt-1 text-xl font-extrabold">{level.title}</h1>
        </div>

        <div key={`${level.id}-${currentStepIndex}`}>
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

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => {
              setHintOpen((v) => !v);
              useHint(level.id);
            }}
            className="flex items-center gap-2 rounded-2xl border-b-4 border-yellow-700 bg-quest-yellow px-4 py-2 font-bold text-black active:border-b-0 active:translate-y-1"
          >
            <Lightbulb size={18} /> Hint
          </button>

          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className="flex items-center gap-2 rounded-2xl border-b-4 border-quest-greenDark bg-quest-green px-6 py-2 font-extrabold disabled:opacity-30 active:border-b-0 active:translate-y-1"
          >
            {isLastStep ? "Finish" : "Continue"} <ArrowRight size={18} />
          </button>
        </div>

        {hintOpen && (
          <div className="rounded-2xl bg-black/30 p-3 text-sm text-white/80">
            Focus on: <span className="font-bold">{level.concept}</span>.
          </div>
        )}
      </div>

      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-2xl border-b-4 border-quest-greenDark bg-quest-card p-6 text-center">
            <PartyPopper className="mx-auto text-quest-yellow" size={40} />
            <h2 className="mt-3 text-xl font-extrabold">Level Complete!</h2>
            <p className="mt-1 text-sm text-white/70">
              +{level.xp} XP earned for &ldquo;{level.title}&rdquo;
            </p>

            <div className="mt-5 flex flex-col gap-3">
              {nextLevel ? (
                <button
                  onClick={() => proceedTo(() => router.push(`/lesson/${nextLevel.id}`))}
                  className="flex items-center justify-center gap-2 rounded-2xl border-b-4 border-quest-greenDark bg-quest-green px-5 py-2 font-extrabold active:border-b-0 active:translate-y-1"
                >
                  Next Lesson <ArrowRight size={18} />
                </button>
              ) : (
                <p className="text-sm font-bold text-quest-yellow">
                  You&apos;ve completed every level. Amazing work!
                </p>
              )}
              <button
                onClick={() => proceedTo(() => router.push("/"))}
                className="rounded-2xl border-b-4 border-black/30 bg-white/10 px-5 py-2 font-bold text-white/80 active:border-b-0 active:translate-y-1"
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
