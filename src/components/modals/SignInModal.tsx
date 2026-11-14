"use client";

import { FormEvent, useState } from "react";
import { Mail, ArrowRight, ShieldCheck } from "lucide-react";
import Modal from "./Modal";
import { useUserStore } from "@/store/useUserStore";

export default function SignInModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const signInWithGoogle = useUserStore((s) => s.signInWithGoogle);
  const signInWithEmail = useUserStore((s) => s.signInWithEmail);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");

  function handleGoogle() {
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
    <Modal open={open} onClose={onClose} title="Save Your Progress" maxWidth="max-w-sm">
      <div className="flex items-center gap-2 rounded-2xl border border-sky-500/20 bg-sky-950/20 p-3 text-xs text-sky-300">
        <ShieldCheck size={18} className="shrink-0 text-sky-400" />
        <span>Sync your streak, coins, XP, and wardrobe unlocked items safely.</span>
      </div>

      <div className="mt-5 space-y-3">
        <button
          onClick={handleGoogle}
          className="group flex w-full items-center justify-center gap-3 rounded-2xl border-b-4 border-slate-300 bg-white px-4 py-3 font-bold text-slate-800 shadow-md transition hover:bg-slate-50 active:border-b-0 active:translate-y-1"
        >
          <GoogleBadge />
          <span>Continue with Google</span>
        </button>

        {!showEmailForm ? (
          <button
            onClick={() => setShowEmailForm(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800 hover:text-white active:scale-95"
          >
            <Mail size={16} />
            <span>Continue with Email</span>
          </button>
        ) : (
          <form onSubmit={handleEmailSubmit} className="space-y-2.5 pt-1">
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-2xl border border-white/10 bg-[#090d13] px-4 py-3 font-mono text-sm text-white outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            />
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-b-4 border-emerald-700 bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-3 font-black text-white shadow-lg shadow-emerald-950 transition hover:brightness-110 active:border-b-0 active:translate-y-1"
            >
              <span>Continue</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>

      <button
        onClick={onClose}
        className="mt-5 w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-300 transition"
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
