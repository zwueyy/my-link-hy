"use client";

import { useState } from "react";
import { LinkItem } from "@/types";
import {
  ExternalLink,
  Sparkles,
  FileText,
  BookOpen,
  Globe,
  Coffee,
  Copy,
  Check,
  MousePointerClick,
  Pin,
} from "lucide-react";
import { GithubIcon } from "@/components/common/BrandIcons";

interface LinkCardProps {
  link: LinkItem;
  onLinkClick?: (id: string) => void;
  onShowToast?: (msg: string) => void;
}

export default function LinkCard({
  link,
  onLinkClick,
  onShowToast,
}: LinkCardProps) {
  const [copied, setCopied] = useState(false);

  const getLinkIcon = () => {
    switch (link.icon) {
      case "sparkles":
        return <Sparkles className="h-5 w-5 text-indigo-500" />;
      case "github":
        return <GithubIcon className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />;
      case "fileText":
        return <FileText className="h-5 w-5 text-amber-500" />;
      case "bookOpen":
        return <BookOpen className="h-5 w-5 text-emerald-500" />;
      case "globe":
        return <Globe className="h-5 w-5 text-blue-500" />;
      case "coffee":
        return <Coffee className="h-5 w-5 text-rose-500" />;
      default:
        return <Globe className="h-5 w-5 text-blue-500" />;
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    onShowToast?.("링크 주소가 복사되었습니다! 🔗");
    setTimeout(() => setCopied(false), 2000);
  };

  const domain = link.url.replace(/^https?:\/\//, "").split("/")[0];

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onLinkClick?.(link.id)}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        link.featured
          ? "border-blue-500/40 bg-gradient-to-b from-blue-50/50 via-white to-white p-5 shadow-md shadow-blue-500/5 dark:from-blue-950/20 dark:via-zinc-900 dark:to-zinc-900 dark:border-blue-400/40 dark:shadow-blue-950/20"
          : "border-zinc-200/80 bg-white/90 p-5 shadow-xs backdrop-blur-md hover:border-blue-400 dark:border-zinc-800/80 dark:bg-zinc-900/90 dark:hover:border-blue-500 dark:hover:shadow-black/40"
      }`}
    >
      {/* Featured 상단 하이라이트 바 */}
      {link.featured && (
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
      )}

      <div>
        {/* 상단 뱃지 및 액션 */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {/* 아이콘 아바타 */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100/90 shadow-xs transition-transform duration-300 group-hover:scale-110 dark:bg-zinc-800/90">
              {getLinkIcon()}
            </div>

            {/* 뱃지들 */}
            <div className="flex flex-wrap items-center gap-1.5">
              {link.badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    link.badge.includes("대표")
                      ? "bg-blue-600 text-white shadow-xs"
                      : link.badge.includes("인기")
                      ? "bg-rose-500 text-white shadow-xs"
                      : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  }`}
                >
                  {link.badge}
                </span>
              )}
              {link.featured && (
                <span className="flex items-center gap-0.5 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                  <Pin className="h-2.5 w-2.5" />
                  고정
                </span>
              )}
            </div>
          </div>

          {/* 복사 버튼 & 외부 이동 아이콘 */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="rounded-lg p-1.5 text-zinc-400 opacity-70 transition-all hover:bg-zinc-100 hover:text-zinc-700 hover:opacity-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              title="URL 복사"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
            <div className="rounded-lg p-1.5 text-zinc-400 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              <ExternalLink className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* 타이틀 및 설명 */}
        <div className="mt-3.5">
          <h3 className="text-base font-bold text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            {link.title}
          </h3>
          {link.description && (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              {link.description}
            </p>
          )}
        </div>
      </div>

      {/* 하단 메타 정보 (도메인 & 클릭 수) */}
      <div className="mt-4 flex items-center justify-between border-t border-zinc-100/90 pt-3 text-[11px] text-zinc-400 dark:border-zinc-800/90">
        <span className="font-mono text-zinc-500 dark:text-zinc-400">
          {domain}
        </span>
        {typeof link.clickCount === "number" && (
          <span className="inline-flex items-center gap-1 font-medium text-zinc-400 dark:text-zinc-500">
            <MousePointerClick className="h-3 w-3" />
            {link.clickCount.toLocaleString()}회 클릭
          </span>
        )}
      </div>
    </a>
  );
}
