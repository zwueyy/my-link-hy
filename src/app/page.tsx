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
import { Search, Plus, RotateCcw } from "lucide-react";

export default function ProfilePage() {
  const [links, setLinks] = useState<LinkItem[]>(INITIAL_LINKS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // 카테고리별 개수
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: links.length };
    links.forEach((link) => {
      if (link.category) {
        counts[link.category] = (counts[link.category] || 0) + 1;
      }
    });
    return counts;
  }, [links]);

  // 검색 및 필터링
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
    setToastMessage("새 링크가 등록되었어요 ✨");
  };

  return (
    <div className="mx-auto w-full max-w-[520px] px-4 py-4 sm:py-6 space-y-4">
      {/* 1. 프로필 히어로 카드 */}
      <ProfileHero
        profile={DEFAULT_PROFILE}
        onShowToast={(msg) => setToastMessage(msg)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* 2. 핵심 지표 요약 (Toss Stats Grid) */}
      <ProfileStats stats={DEFAULT_PROFILE.stats} />

      {/* 3. 링크 섹션 헤더 & 필터/검색 */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#191f28]">
              내 링크 모음
            </h2>
            <p className="text-xs text-[#6b7684]">
              자주 찾는 프로젝트와 포트폴리오예요
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="toss-press flex items-center gap-1 text-xs font-semibold text-[#3182f6] hover:underline"
          >
            <Plus className="h-4 w-4" />
            <span>새 링크 추가</span>
          </button>
        </div>

        {/* 검색 입력창 */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b95a1]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="궁금한 링크나 프로젝트를 검색해보세요"
            className="w-full rounded-2xl bg-white py-3 pl-10 pr-9 text-sm text-[#191f28] placeholder-[#b0b8c1] shadow-xs border border-black/[0.04] transition-all focus:outline-none focus:ring-2 focus:ring-[#3182f6]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-xs text-[#8b95a1] hover:text-[#191f28]"
            >
              ✕
            </button>
          )}
        </div>

        {/* 카테고리 칩 목록 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {DEFAULT_CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.id] || 0;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`toss-press flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  isSelected
                    ? "bg-[#191f28] text-white shadow-xs"
                    : "bg-white text-[#6b7684] hover:bg-[#e5e8eb] border border-black/[0.04]"
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isSelected ? "bg-white/20 text-white" : "bg-[#f2f4f6] text-[#8b95a1]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. 링크 리스트 목록 (Toss ListRows) */}
      <div className="space-y-2">
        {filteredLinks.length > 0 ? (
          filteredLinks.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onLinkClick={handleLinkClick}
              onShowToast={(msg) => setToastMessage(msg)}
            />
          ))
        ) : (
          <div className="rounded-3xl bg-white p-8 text-center shadow-xs border border-black/[0.04]">
            <p className="text-sm font-semibold text-[#191f28]">
              찾으시는 링크가 없어요
            </p>
            <p className="mt-1 text-xs text-[#8b95a1]">
              다른 단어로 검색해보거나 필터를 바꿔보세요.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="toss-press mt-4 inline-flex items-center gap-1 rounded-xl bg-[#f2f4f6] px-3.5 py-2 text-xs font-semibold text-[#4e5968] hover:bg-[#e5e8eb]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>검색 초기화하기</span>
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
