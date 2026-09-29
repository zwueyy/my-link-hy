"use client";

import { useState } from "react";
import { X, Mail } from "lucide-react";

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
      onSuccess("메시지가 잘 전달되었어요! 빠르게 답장드릴게요 💌");
      setSenderName("");
      setSenderEmail("");
      setMessage("");
      onClose();
    }, 500);
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
      {/* Scrim Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Toss Dialog Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-xl transition-all">
        <div className="flex items-center justify-between pb-3">
          <div>
            <h2 className="text-lg font-bold text-[#191f28]">
              커피챗 제안하기
            </h2>
            <p className="mt-0.5 text-xs text-[#6b7684]">
              궁금한 점이나 함께하고 싶은 프로젝트가 있다면 편하게 남겨주세요.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-[#8b95a1] hover:bg-[#f2f4f6] hover:text-[#4e5968] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 직접 이메일 복사 */}
        {email && (
          <div className="my-3 flex items-center justify-between rounded-xl bg-[#f2f4f6] p-3 text-xs">
            <div className="flex items-center gap-2 text-[#4e5968]">
              <Mail className="h-4 w-4 text-[#3182f6]" />
              <span>직접 메일 보내기: <strong className="font-mono text-[#191f28]">{email}</strong></span>
            </div>
            <button
              onClick={handleCopyEmail}
              className="font-medium text-[#3182f6] hover:underline"
            >
              {copied ? "복사됨" : "복사"}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-3 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#4e5968]">
              이름 또는 회사명
            </label>
            <input
              type="text"
              required
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="예: 김토스 / 스타트업"
              className="w-full rounded-xl bg-[#f2f4f6] px-3.5 py-3 text-sm text-[#191f28] placeholder-[#b0b8c1] transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3182f6]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#4e5968]">
              답변받으실 이메일
            </label>
            <input
              type="email"
              required
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full rounded-xl bg-[#f2f4f6] px-3.5 py-3 text-sm text-[#191f28] placeholder-[#b0b8c1] transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3182f6]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#4e5968]">
              제안 내용
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="나누고 싶은 이야기나 협업 주제를 편하게 적어주세요."
              className="w-full resize-none rounded-xl bg-[#f2f4f6] px-3.5 py-3 text-sm text-[#191f28] placeholder-[#b0b8c1] transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3182f6]"
            />
          </div>

          <div className="mt-5 flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="toss-press flex-1 rounded-xl bg-[#f2f4f6] py-3.5 text-sm font-semibold text-[#6b7684] hover:bg-[#e5e8eb]"
            >
              닫기
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="toss-press flex-[2] rounded-xl bg-[#3182f6] py-3.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#1b64da] disabled:opacity-50"
            >
              {isSubmitting ? "전송하는 중..." : "메시지 보내기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
