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
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all">
      <div className="flex items-center gap-2.5 rounded-2xl bg-[#191f28] px-4 py-3 text-sm font-medium text-white shadow-xl">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#20c997]" />
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-1 p-0.5 text-[#8b95a1] hover:text-white transition-colors"
          aria-label="닫기"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
