"use client";

import { useState } from "react";
import { LinkItem } from "@/types";
import {
  ChevronRight,
  Sparkles,
  BookOpen,
  Globe,
  Copy,
  Check,
  FileText,
  Coffee,
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

  const getCategoryIcon = () => {
    switch (link.category) {
      case "project":
        return <Sparkles className="h-5 w-5 text-[#3182f6]" />;
      case "work":
        return link.icon === "github" ? (
          <GithubIcon className="h-5 w-5 text-[#191f28]" />
        ) : (
          <FileText className="h-5 w-5 text-[#3182f6]" />
        );
      case "social":
        return <BookOpen className="h-5 w-5 text-[#20c997]" />;
      case "tool":
        return <Globe className="h-5 w-5 text-[#ff9f00]" />;
      default:
        return <Coffee className="h-5 w-5 text-[#f04452]" />;
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    onShowToast?.("링크 주소가 복사되었어요 🔗");
    setTimeout(() => setCopied(false), 2000);
  };

  const domain = link.url.replace(/^https?:\/\//, "").split("/")[0];

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onLinkClick?.(link.id)}
      className="toss-press group flex items-center justify-between rounded-2xl bg-white p-4 shadow-xs border border-black/[0.03] transition-all hover:bg-[#fafbfc]"
    >
      {/* 좌측: 44px 아이콘 + 텍스트 스택 */}
      <div className="flex items-center gap-3.5 min-w-0">
        {/* 44px TDS Soft Icon Container */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f2f4f6] transition-colors group-hover:bg-[#e8f3ff]">
          {getCategoryIcon()}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-sm font-semibold text-[#191f28] group-hover:text-[#3182f6] transition-colors truncate">
              {link.title}
            </h3>

            {link.badge && (
              <span className="rounded-full bg-[#e8f3ff] px-2 py-0.5 text-[10px] font-semibold text-[#3182f6]">
                {link.badge}
              </span>
            )}
            {link.featured && (
              <span className="rounded-full bg-[#fff0f2] px-2 py-0.5 text-[10px] font-semibold text-[#f04452]">
                추천
              </span>
            )}
          </div>

          {link.description && (
            <p className="mt-0.5 text-xs text-[#6b7684] line-clamp-1">
              {link.description}
            </p>
          )}

          <p className="mt-1 font-mono text-[11px] text-[#8b95a1]">
            {domain} • <span className="tabular-nums">{link.clickCount || 0}회 방문</span>
          </p>
        </div>
      </div>

      {/* 우측: 복사 버튼 & 쉐브론 */}
      <div className="flex items-center gap-1 shrink-0 pl-2">
        <button
          onClick={handleCopy}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#8b95a1] hover:bg-[#f2f4f6] hover:text-[#4e5968] transition-colors"
          title="링크 복사"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-[#3182f6]" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>

        <div className="flex h-8 w-8 items-center justify-center text-[#b0b8c1] group-hover:text-[#3182f6] group-hover:translate-x-0.5 transition-all">
          <ChevronRight className="h-4 w-4 stroke-[2.5]" />
        </div>
      </div>
    </a>
  );
}
