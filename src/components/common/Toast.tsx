"use client";

import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

interface ToastProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, onClose, duration = 2500 }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-bounce-short">
      <div className="flex items-center gap-2.5 rounded-full border border-zinc-200/80 bg-white/95 px-4 py-2.5 text-xs font-semibold text-zinc-900 shadow-xl shadow-black/10 backdrop-blur-md dark:border-zinc-700/80 dark:bg-zinc-900/95 dark:text-zinc-100">
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-1 rounded-full p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          aria-label="닫기"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
