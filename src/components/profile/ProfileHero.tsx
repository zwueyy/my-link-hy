"use client";

import { useState } from "react";
import { UserProfile } from "@/types";
import {
  Share2,
  Check,
  Mail,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterXIcon } from "@/components/common/BrandIcons";

interface ProfileHeroProps {
  profile: UserProfile;
  onShowToast: (msg: string) => void;
  onOpenContact?: () => void;
}

export default function ProfileHero({
  profile,
  onShowToast,
  onOpenContact,
}: ProfileHeroProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyProfileUrl = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        onShowToast("프로필 주소가 복사되었어요 🔗");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      onShowToast("주소를 복사하지 못했어요");
    }
  };

  const handleCopyEmail = async () => {
    if (!profile.email) return;
    try {
      await navigator.clipboard.writeText(profile.email);
      onShowToast("이메일 주소가 복사되었어요 ✉️");
    } catch {
      onShowToast("이메일을 복사하지 못했어요");
    }
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-xs border border-black/[0.04] transition-all">
      {/* 상단 프로필 헤더: 아바타 & 기본 정보 */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3.5">
          {/* 아바타 (Toss Soft Avatar) */}
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3182f6] to-[#1b64da] text-2xl font-bold text-white shadow-xs">
            {profile.name[0]}
            {/* 액티브 상태 점 */}
            {profile.isAvailableForWork && (
              <span
                className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-xs"
                title="지금 대화할 수 있어요"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-[#20c997]" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-bold tracking-tight text-[#191f28]">
                {profile.name}
              </h1>
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#3182f6] text-[10px] text-white">
                ✓
              </span>
            </div>
            <p className="text-xs font-medium text-[#3182f6]">
              {profile.role}
            </p>
            <p className="mt-0.5 font-mono text-[11px] text-[#8b95a1]">
              {profile.handle}
            </p>
          </div>
        </div>

        {/* 공유하기 버튼 */}
        <button
          onClick={handleCopyProfileUrl}
          className="toss-press flex h-9 w-9 items-center justify-center rounded-full bg-[#f2f4f6] text-[#4e5968] hover:bg-[#e5e8eb] transition-colors"
          title="프로필 링크 복사하기"
        >
          {copied ? (
            <Check className="h-4 w-4 text-[#3182f6]" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* 실시간 상태 배너 (해요체) */}
      {profile.statusText && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#e8f3ff] px-3.5 py-2.5 text-xs font-semibold text-[#1b64da]">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#3182f6]" />
          <span>{profile.statusText}</span>
        </div>
      )}

      {/* 소개글 (해요체) */}
      <p className="mt-3.5 whitespace-pre-line text-sm leading-relaxed text-[#4e5968]">
        {profile.bio}
      </p>

      {/* 태그 칩들 */}
      {profile.tags && profile.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {profile.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#f2f4f6] px-2.5 py-1 text-xs font-medium text-[#4e5968]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 구분선 */}
      <div className="my-4 h-px w-full bg-[#f2f4f6]" />

      {/* 소셜 채널 및 연락처 버튼 */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {profile.socials.map((s) => (
            <a
              key={s.platform}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="toss-press flex h-9 w-9 items-center justify-center rounded-xl bg-[#f2f4f6] text-[#4e5968] hover:bg-[#e5e8eb] transition-colors"
              title={s.label}
            >
              {s.platform === "github" && <GithubIcon className="h-4 w-4" />}
              {s.platform === "linkedin" && <LinkedinIcon className="h-4 w-4" />}
              {s.platform === "twitter" && <TwitterXIcon className="h-4 w-4" />}
              {s.platform === "email" && <Mail className="h-4 w-4" />}
            </a>
          ))}
          {profile.email && (
            <button
              onClick={handleCopyEmail}
              className="toss-press flex h-9 items-center gap-1 rounded-xl bg-[#f2f4f6] px-2.5 text-xs font-medium text-[#4e5968] hover:bg-[#e5e8eb] transition-colors"
              title="이메일 복사"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>이메일</span>
            </button>
          )}
        </div>

        {/* Toss Blue Primary Action Button */}
        {onOpenContact && (
          <button
            onClick={onOpenContact}
            className="toss-press flex h-10 items-center gap-1.5 rounded-xl bg-[#3182f6] px-4 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#1b64da]"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>커피챗 제안하기</span>
          </button>
        )}
      </div>
    </div>
  );
}
