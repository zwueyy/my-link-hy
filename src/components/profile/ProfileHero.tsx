"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  Share2,
  MapPin,
  Mail,
  Sparkles,
  ExternalLink,
  BookOpen,
  MessageSquareQuote,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterXIcon } from "@/components/common/BrandIcons";
import { UserProfile } from "@/types";

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
        onShowToast("프로필 주소가 클립보드에 복사되었습니다! 🎉");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      onShowToast("URL을 복사하지 못했습니다.");
    }
  };

  const handleCopyEmail = async () => {
    if (!profile.email) return;
    try {
      await navigator.clipboard.writeText(profile.email);
      onShowToast("이메일 주소가 복사되었습니다! ✉️");
    } catch {
      onShowToast("이메일을 복사하지 못했습니다.");
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "github":
        return <GithubIcon className="h-4 w-4" />;
      case "linkedin":
        return <LinkedinIcon className="h-4 w-4" />;
      case "twitter":
        return <TwitterXIcon className="h-4 w-4" />;
      case "blog":
        return <BookOpen className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/80 shadow-xl shadow-zinc-200/40 backdrop-blur-xl transition-all duration-300 dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:shadow-black/40">
      {/* 장식용 커버 배너 (Artistic Gradient Banner) */}
      <div className="relative h-36 w-full overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-500 sm:h-44">
        {/* 장식용 빛망울/그리드 오버레이 */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.2),transparent_70%)]" />
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-2xl" />
        <div className="absolute left-1/3 -bottom-10 h-36 w-36 rounded-full bg-fuchsia-400/20 blur-2xl" />

        {/* 상단 우측 빠른 공유 버튼 */}
        <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
          <button
            onClick={handleCopyProfileUrl}
            className="flex items-center gap-1.5 rounded-full border border-white/25 bg-black/25 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-black/40 active:scale-95"
            title="프로필 링크 복사"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-300" />
                <span>복사 완료</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                <span>공유하기</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 프로필 정보 컨텐츠 */}
      <div className="relative px-6 pb-7 pt-0 text-center sm:px-8">
        {/* 아바타 영역 (배너에 걸쳐 올라오는 형태) */}
        <div className="relative -mt-16 mb-4 inline-block sm:-mt-20">
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-3xl font-extrabold text-white shadow-2xl ring-4 ring-white transition-transform duration-300 hover:scale-105 sm:h-32 sm:w-32 sm:text-4xl dark:ring-zinc-900">
            <span className="drop-shadow-md">{profile.name[0]}</span>

            {/* 빛 반사 하이라이트 */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-white/10 to-white/30" />
          </div>

          {/* 활동 가능 상태 인디케이터 (Pulsing badge) */}
          {profile.isAvailableForWork && (
            <div
              className="group absolute bottom-1 right-1 flex items-center gap-1.5 rounded-full border-2 border-white bg-emerald-500 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-md dark:border-zinc-900"
              title={profile.statusText || "열려있는 상태"}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
              </span>
              <span className="hidden sm:inline">Active</span>
            </div>
          )}
        </div>

        {/* 이름 & 핸들 & 직무 */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
              {profile.name}
            </h1>
            {/* 공식 인증 마크 */}
            <span
              className="inline-flex items-center justify-center rounded-full bg-blue-500 p-1 text-white shadow-xs"
              title="인증된 프로필"
            >
              <Check className="h-3 w-3 stroke-[3]" />
            </span>
          </div>

          <p className="font-mono text-xs font-medium text-zinc-400 dark:text-zinc-500">
            {profile.handle}
          </p>

          <div className="pt-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 border border-blue-500/20 dark:from-blue-500/20 dark:to-indigo-500/20 dark:text-blue-400 dark:border-blue-400/30">
              <Sparkles className="h-3 w-3" />
              {profile.role}
            </span>
          </div>
        </div>

        {/* 상태 메시지 배너 */}
        {profile.statusText && (
          <div className="mx-auto mt-4 max-w-md rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-2 text-xs font-medium text-blue-700 shadow-xs dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-300">
            {profile.statusText}
          </div>
        )}

        {/* 소개글 */}
        <p className="mx-auto mt-4 max-w-lg whitespace-pre-line text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-300">
          {profile.bio}
        </p>

        {/* 메타 정보: 위치 & 이메일 */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          {profile.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-zinc-400" />
              {profile.location}
            </span>
          )}
          {profile.email && (
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-1 text-zinc-500 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
              title="이메일 주소 복사하기"
            >
              <Mail className="h-3.5 w-3.5 text-zinc-400" />
              <span>{profile.email}</span>
              <Copy className="h-3 w-3 opacity-60 hover:opacity-100" />
            </button>
          )}
        </div>

        {/* 소셜 채널 빠른 링크 바 */}
        {profile.socials && profile.socials.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {profile.socials.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50/80 text-zinc-600 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-white hover:text-blue-600 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-400 dark:hover:border-blue-400 dark:hover:bg-zinc-800 dark:hover:text-blue-400"
                title={social.label}
              >
                {getSocialIcon(social.platform)}
              </a>
            ))}

            {onOpenContact && (
              <button
                onClick={onOpenContact}
                className="group flex h-9 items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50/80 px-3 text-xs font-semibold text-zinc-700 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-white hover:text-blue-600 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:border-blue-400 dark:hover:bg-zinc-800 dark:hover:text-blue-400"
              >
                <MessageSquareQuote className="h-3.5 w-3.5 text-blue-500" />
                <span>커피챗 제안</span>
              </button>
            )}
          </div>
        )}

        {/* 관심사 및 기술 태그 */}
        {profile.tags && profile.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap justify-center gap-1.5">
            {profile.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-zinc-200/60 bg-zinc-100/80 px-3 py-1 text-xs font-medium text-zinc-600 transition-colors hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-400 dark:hover:border-blue-800 dark:hover:text-blue-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
