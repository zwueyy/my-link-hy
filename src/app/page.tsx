"use client";

import { useState, useMemo } from "react";
import ProfileHero from "@/components/profile/ProfileHero";
import ProfileStats from "@/components/profile/ProfileStats";
import LinkCard from "@/components/link/LinkCard";
import ContactModal from "@/components/profile/ContactModal";
import AddLinkModal from "@/components/link/AddLinkModal";
import Toast from "@/components/common/Toast";
import { DEFAULT_PROFILE, DEFAULT_CATEGORIES } from "@/constants";
import { LinkItem } from "@/types";
import { Search, Plus, RotateCcw, RotateCw, Loader2 } from "lucide-react";
import { useLinks } from "@/hooks/useLinks";

export default function ProfilePage() {
  const {
    links,
    addLink,
    incrementClick,
    isLoading,
    isUpdating,
    isRefreshing,
    isPending,
    refetch,
  } = useLinks();
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
    incrementClick(id);
  };

  // 새 링크 추가 (Firestore users/anonymous/links에 저장)
  const handleAddLink = async (
    newLinkData: Omit<LinkItem, "id" | "createdAt" | "clickCount">
  ) => {
    try {
      await addLink(newLinkData);
      setToastMessage("새 링크가 등록되었어요 ✨");
    } catch (error) {
      console.error("Firestore 링크 추가 실패:", error);
      setToastMessage("링크 저장에 실패했어요. 다시 시도해주세요.");
      throw error;
    }
  };

  // 동적 통계 지표 (총 링크 개수 실시간 반영)
  const dynamicStats = useMemo(() => {
    return DEFAULT_PROFILE.stats.map((s) =>
      s.iconName === "FolderGit2"
        ? { ...s, value: `${links.length}개` }
        : s
    );
  }, [links.length]);

  return (
    <div className="mx-auto w-full max-w-[520px] px-4 py-4 sm:py-6 space-y-4">
      {/* 1. 프로필 히어로 카드 */}
      <ProfileHero
        profile={DEFAULT_PROFILE}
        onShowToast={(msg) => setToastMessage(msg)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* 2. 핵심 지표 요약 (Toss Stats Grid) */}
      <ProfileStats stats={dynamicStats} />

      {/* 3. 링크 섹션 헤더 & 필터/검색 */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-[#191f28]">
                내 링크 모음
              </h2>
              {isPending && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f3ff] px-2 py-0.5 text-[11px] font-semibold text-[#3182f6]">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>{isUpdating ? "업데이트 중" : "갱신 중"}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-[#6b7684]">
              자주 찾는 프로젝트와 포트폴리오예요
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              disabled={isPending}
              className="toss-press flex items-center gap-1 rounded-xl bg-[#f2f4f6] px-2.5 py-1.5 text-xs font-semibold text-[#6b7684] hover:bg-[#e5e8eb] hover:text-[#191f28] disabled:opacity-50 transition-colors"
              title="최신 링크 목록 새로고침"
            >
              <RotateCw className={`h-3.5 w-3.5 ${isPending ? "animate-spin text-[#3182f6]" : ""}`} />
              <span className="hidden sm:inline">새로고침</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              disabled={isUpdating}
              className="toss-press flex items-center gap-1 text-xs font-semibold text-[#3182f6] hover:underline disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              <span>새 링크 추가</span>
            </button>
          </div>
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
        {/* 업데이트/갱신 도중 상단 인디케이터 배너 */}
        {(isRefreshing || isUpdating) && links.length > 0 && (
          <div className="flex items-center justify-center gap-2 rounded-2xl bg-[#e8f3ff] px-4 py-2.5 text-xs font-semibold text-[#3182f6] shadow-2xs transition-all">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>
              {isUpdating
                ? "새 링크를 저장하고 목록을 갱신하는 중이에요..."
                : "최신 링크 목록을 불러오는 중이에요..."}
            </span>
          </div>
        )}

        {isLoading && links.length === 0 ? (
          <div className="space-y-2.5">
            <div className="flex items-center justify-center gap-2 py-3 text-xs font-medium text-[#8b95a1]">
              <Loader2 className="h-4 w-4 animate-spin text-[#3182f6]" />
              <span>Firestore에서 링크를 불러오는 중이에요...</span>
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3.5 rounded-3xl bg-white p-4 shadow-xs border border-black/[0.04] animate-pulse"
              >
                <div className="h-10 w-10 rounded-2xl bg-[#f2f4f6]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded-md bg-[#f2f4f6]" />
                  <div className="h-3 w-1/2 rounded-md bg-[#f2f4f6]" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredLinks.length > 0 ? (
          <div className={`space-y-2 transition-opacity ${isPending ? "opacity-70 pointer-events-none" : "opacity-100"}`}>
            {filteredLinks.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                onLinkClick={handleLinkClick}
                onShowToast={(msg) => setToastMessage(msg)}
              />
            ))}
          </div>
        ) : links.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-xs border border-black/[0.04]">
            <p className="text-sm font-semibold text-[#191f28]">
              아직 등록된 링크가 없어요
            </p>
            <p className="mt-1 text-xs text-[#8b95a1]">
              새 링크 추가 버튼을 눌러 첫 번째 링크를 등록해보세요 ✨
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="toss-press mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#3182f6] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1b64da] transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>새 링크 추가하기</span>
            </button>
          </div>
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
