"use client";

import { FormEvent, useState } from "react";
import Modal from "./Modal";
import { useUserStore } from "@/store/useUserStore";

export default function SignInModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const signInWithGoogle = useUserStore((s) => s.signInWithGoogle);
  const signInWithEmail = useUserStore((s) => s.signInWithEmail);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");

  function handleGoogle() {
    // Mocked: no Google OAuth client ID / backend session exchange exists in
    // this frontend-only demo — a real integration would replace this with
    // Google Identity Services and a server-side token exchange.
    signInWithGoogle("Guest Coder", "guest.coder@gmail.com");
    onClose();
  }

  function handleEmailSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    signInWithEmail(email.trim());
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Save your progress">
      <p className="text-sm text-white/70">
        Sign in to keep your streak, coins, and XP safe across devices.
      </p>

      <div className="mt-5 space-y-3">
        <button
          onClick={handleGoogle}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border-b-4 border-gray-300 bg-white px-4 py-3 font-bold text-gray-800 active:border-b-0 active:translate-y-1"
        >
          <GoogleBadge /> Continue with Google
        </button>

        {!showEmailForm ? (
          <button
            onClick={() => setShowEmailForm(true)}
            className="w-full rounded-2xl border-b-4 border-black/30 bg-white/10 px-4 py-3 font-bold text-white/80 active:border-b-0 active:translate-y-1"
          >
            Continue with email
          </button>
        ) : (
          <form onSubmit={handleEmailSubmit} className="space-y-2">
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border-b-4 border-black/30 bg-[#0d1417] px-4 py-3 text-white outline-none focus:border-quest-blue"
            />
            <button
              type="submit"
              className="w-full rounded-2xl border-b-4 border-quest-greenDark bg-quest-green px-4 py-3 font-extrabold active:border-b-0 active:translate-y-1"
            >
              Continue
            </button>
          </form>
        )}
      </div>

      <button
        onClick={onClose}
        className="mt-4 w-full text-center text-xs text-white/50 hover:text-white/80"
      >
        Maybe later — keep playing as guest
      </button>
    </Modal>
  );
}

/** Original 4-quadrant badge evoking Google's brand colors — not a reproduction of their logo. */
function GoogleBadge() {
  return (
    <span
      className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-black text-white"
      style={{
        background:
          "conic-gradient(#4285F4 0deg 90deg, #34A853 90deg 180deg, #FBBC05 180deg 270deg, #EA4335 270deg 360deg)",
      }}
    >
      G
    </span>
  );
}
