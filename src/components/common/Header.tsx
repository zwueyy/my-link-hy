"use client";

import Link from "next/link";
import { SITE_CONFIG } from "@/constants";
import { Plus } from "lucide-react";

interface HeaderProps {
  onOpenAddLink?: () => void;
}

export default function Header({ onOpenAddLink }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e5e8eb] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[520px] items-center justify-between px-4">
        {/* 로고 & 타이틀 */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3182f6] text-white font-bold text-sm shadow-xs transition-transform group-hover:scale-105">
            M
          </div>
          <span className="text-base font-bold tracking-tight text-[#191f28]">
            {SITE_CONFIG.name}
          </span>
        </Link>

        {/* 우측 액션: 링크 추가 버튼 */}
        <div className="flex items-center gap-2">
          {onOpenAddLink && (
            <button
              onClick={onOpenAddLink}
              className="toss-press flex items-center gap-1 rounded-full bg-[#3182f6] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#1b64da]"
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>링크 추가</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
