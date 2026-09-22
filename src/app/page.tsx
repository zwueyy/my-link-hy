"use client";

import { useState, useMemo } from "react";
import ProfileHero from "@/components/profile/ProfileHero";
import ProfileStats from "@/components/profile/ProfileStats";
import LinkCard from "@/components/link/LinkCard";
import ContactModal from "@/components/profile/ContactModal";
import AddLinkModal from "@/components/link/AddLinkModal";
import Toast from "@/components/common/Toast";
import { DEFAULT_PROFILE, INITIAL_LINKS, DEFAULT_CATEGORIES } from "@/constants";
import { LinkItem } from "@/types";
import { Search, Plus, SlidersHorizontal, RotateCcw } from "lucide-react";

export default function ProfilePage() {
  const [links, setLinks] = useState<LinkItem[]>(INITIAL_LINKS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // 카테고리별 링크 수 계산
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: links.length };
    links.forEach((link) => {
      if (link.category) {
        counts[link.category] = (counts[link.category] || 0) + 1;
      }
    });
    return counts;
  }, [links]);

  // 검색 및 카테고리 필터링
  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      const matchesCategory =
        selectedCategory === "all" || link.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        link.title.toLowerCase().includes(q) ||
        (link.description && link.description.toLowerCase().includes(q)) ||
        link.url.toLowerCase().includes(q) ||
        (link.badge && link.badge.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [links, selectedCategory, searchQuery]);

  // 링크 클릭 시 카운트 증가
  const handleLinkClick = (id: string) => {
    setLinks((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, clickCount: (item.clickCount || 0) + 1 }
          : item
      )
    );
  };

  // 새 링크 추가
  const handleAddLink = (
    newLinkData: Omit<LinkItem, "id" | "createdAt" | "clickCount">
  ) => {
    const newLink: LinkItem = {
      ...newLinkData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      clickCount: 0,
    };
    setLinks((prev) => [newLink, ...prev]);
    setToastMessage("새로운 링크가 성공적으로 추가되었습니다! ✨");
  };

  return (
    <div className="relative min-h-[calc(100vh-140px)] w-full overflow-hidden px-4 py-8 sm:py-12">
      {/* 앰비언트 글로우 배경 효과 (Ambient Light Spheres) */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[450px] w-[650px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-blue-500/15 via-indigo-500/15 to-purple-500/15 blur-3xl dark:from-blue-600/10 dark:via-indigo-600/10 dark:to-purple-600/10" />
      <div className="pointer-events-none absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-500/5" />
      <div className="pointer-events-none absolute bottom-20 -left-24 h-80 w-80 rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-600/5" />

      {/* 메인 컨테이너 (최대 너비 720px로 모바일과 데스크톱 모두에서 이상적인 비율) */}
      <div className="relative mx-auto w-full max-w-2xl space-y-6 sm:space-y-8">
        {/* 1. 프로필 히어로 카드 (아바타, 배너, 바이오, 소셜) */}
        <ProfileHero
          profile={DEFAULT_PROFILE}
          onShowToast={(msg) => setToastMessage(msg)}
          onOpenContact={() => setIsContactOpen(true)}
        />

        {/* 2. 주요 하이라이트 지표 (Bento Stats) */}
        <ProfileStats stats={DEFAULT_PROFILE.stats} />

        {/* 3. 링크 섹션 헤더 & 필터 / 검색 */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
                <span>큐레이션 링크</span>
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                  {links.length}
                </span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                포트폴리오, 이력서, 기술 블로그 및 추천 리소스
              </p>
            </div>

            {/* 링크 직접 추가 버튼 */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 active:scale-95 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>새 링크 추가</span>
            </button>
          </div>

          {/* 검색창 & 카테고리 필터 탭 */}
          <div className="space-y-3 rounded-2xl border border-zinc-200/80 bg-white/60 p-3 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/60">
            {/* 검색창 */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="관심있는 프로젝트나 링크 검색..."
                className="w-full rounded-xl border border-zinc-200/90 bg-white py-2 pl-9 pr-8 text-xs text-zinc-900 placeholder-zinc-400 transition-colors focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-white dark:focus:border-blue-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  ✕
                </button>
              )}
            </div>

            {/* 카테고리 탭 목록 */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="mr-1 hidden items-center gap-1 text-[11px] font-semibold text-zinc-400 sm:flex">
                <SlidersHorizontal className="h-3 w-3" />
                분류:
              </span>
              {DEFAULT_CATEGORIES.map((cat) => {
                const count = categoryCounts[cat.id] || 0;
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-zinc-100/90 text-zinc-600 hover:bg-zinc-200/80 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                        isSelected
                          ? "bg-white/25 text-white"
                          : "bg-zinc-200/80 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. 링크 카드 목록 */}
        {filteredLinks.length > 0 ? (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {filteredLinks.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                onLinkClick={handleLinkClick}
                onShowToast={(msg) => setToastMessage(msg)}
              />
            ))}
          </div>
        ) : (
          /* 검색 결과 없을 때 */
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300/80 bg-white/40 py-12 text-center backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/40">
            <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
              일치하는 링크를 찾지 못했습니다.
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              다른 검색어를 입력하시거나 카테고리 필터를 변경해 보세요.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              <RotateCcw className="h-3 w-3" />
              <span>검색 초기화</span>
            </button>
          </div>
        )}
      </div>

      {/* 모달 및 토스트 컴포넌트 */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        email={DEFAULT_PROFILE.email}
        onSuccess={(msg) => setToastMessage(msg)}
      />

      <AddLinkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddLink}
      />

      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
        duration={2500}
      />
    </div>
  );
}
