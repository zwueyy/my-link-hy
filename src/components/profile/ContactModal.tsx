"use client";

import { useState } from "react";
import { X, Send, Mail, Check, Sparkles } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
  onSuccess: (msg: string) => void;
}

export default function ContactModal({
  isOpen,
  onClose,
  email,
  onSuccess,
}: ContactModalProps) {
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !senderEmail || !message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess("소중한 메시지가 전송되었습니다! 확인 후 신속히 회신드리겠습니다. 💌");
      setSenderName("");
      setSenderEmail("");
      setMessage("");
      onClose();
    }, 600);
  };

  const handleCopyEmail = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 백드롭 */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* 모달 창 */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-2xl transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-900 sm:p-7">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                커피챗 & 협업 제안
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                프로젝트 협업, 사이드 프로젝트, 가벼운 커피챗 모두 환영합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 직접 이메일 복사 영역 */}
        {email && (
          <div className="mt-4 flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-2.5 text-xs dark:bg-zinc-800/60">
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
              <Mail className="h-4 w-4 text-zinc-400" />
              <span>직접 메일 보내기: <strong className="font-mono">{email}</strong></span>
            </div>
            <button
              onClick={handleCopyEmail}
              className="flex items-center gap-1 rounded-md px-2.5 py-1 font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/50"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-500" />
                  <span className="text-emerald-500">복사됨</span>
                </>
              ) : (
                <span>복사</span>
              )}
            </button>
          </div>
        )}

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              보내시는 분 성함 / 소속
            </label>
            <input
              type="text"
              required
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="예: 김토스 / 스타트업 대표"
              className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-800/80 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              회신받으실 이메일
            </label>
            <input
              type="email"
              required
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-800/80 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              제안 내용
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="제안하실 협업 주제나 나누고 싶은 이야기를 적어주세요."
              className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-800/80 dark:text-white"
            />
          </div>

          <div className="mt-5 flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isSubmitting ? "전송 중..." : "메시지 보내기"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
