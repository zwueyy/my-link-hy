"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileHero from "@/components/profile/ProfileHero";
import ProfileStats from "@/components/profile/ProfileStats";
import LinkCard from "@/components/link/LinkCard";
import ContactModal from "@/components/profile/ContactModal";
import AddLinkModal from "@/components/link/AddLinkModal";
import DeleteConfirmModal from "@/components/link/DeleteConfirmModal";
import Toast from "@/components/common/Toast";
import LandingPage from "@/components/landing/LandingPage";
import { DEFAULT_PROFILE, DEFAULT_CATEGORIES } from "@/constants";
import { LinkItem, UserProfile } from "@/types";
import {
  Search,
  Plus,
  RotateCcw,
  RotateCw,
  Loader2,
  LogIn,
  Download,
  ArrowLeft,
} from "lucide-react";
import { useLinks } from "@/hooks/useLinks";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "firebase/auth";

interface ProfileViewProps {
  user: User | null;
  paramUid: string | null;
  isDemo: boolean;
  isVisitingOther: boolean;
}

function ProfileView({
  user,
  paramUid,
  isDemo,
  isVisitingOther,
}: ProfileViewProps) {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();

  // 조회할 Firestore 대상 UID
  const targetUid = isDemo ? "anonymous" : paramUid || undefined;

  const {
    links,
    addLink,
    updateLink,
    removeLink,
    incrementClick,
    importSampleLinks,
    isLoading,
    isUpdating,
    isRefreshing,
    isPending,
    canEdit,
    refetch,
  } = useLinks(targetUid);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [deletingLink, setDeletingLink] = useState<LinkItem | null>(null);

  // 프로필 데이터 결정 (본인 프로필 / 데모 프로필 / 타인 공개 프로필)
  const profileData: UserProfile = useMemo(() => {
    if (isDemo) {
      return DEFAULT_PROFILE;
    }
    if (user && (!paramUid || paramUid === user.uid)) {
      return {
        ...DEFAULT_PROFILE,
        name: user.displayName || DEFAULT_PROFILE.name,
        handle: user.email ? `@${user.email.split("@")[0]}` : DEFAULT_PROFILE.handle,
        avatarUrl: user.photoURL || undefined,
        email: user.email || DEFAULT_PROFILE.email,
      };
    }
    if (paramUid) {
      return {
        ...DEFAULT_PROFILE,
        name: "크리에이터 프로필",
        handle: `@user_${paramUid.slice(0, 6)}`,
        bio: "마이링크에 등록된 소중한 링크 모음이에요 ✨",
        statusText: "방문을 환영합니다! 링크를 자유롭게 확인해보세요.",
      };
    }
    return DEFAULT_PROFILE;
  }, [user, paramUid, isDemo]);

  // 공유 링크 생성 (본인 페이지일 경우 ?uid={user.uid})
  const shareUrl = typeof window !== "undefined"
    ? user && canEdit
      ? `${window.location.origin}/?uid=${user.uid}`
      : window.location.href
    : undefined;

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

  // 새 링크 추가
  const handleAddLink = async (
    newLinkData: Omit<LinkItem, "id" | "createdAt" | "clickCount">
  ) => {
    if (!canEdit) {
      setToastMessage("링크를 등록하려면 먼저 Google 로그인이 필요해요 🔑");
      return;
    }
    try {
      await addLink(newLinkData);
      setToastMessage("새 링크가 등록되었어요 ✨");
    } catch (error: any) {
      console.error("Firestore 링크 추가 실패:", error);
      setToastMessage(error?.message || "링크 저장에 실패했어요. 다시 시도해주세요.");
      throw error;
    }
  };

  // 링크 수정 처리
  const handleUpdateLink = async (
    id: string,
    updates: { title: string; url: string }
  ) => {
    if (!canEdit) {
      setToastMessage("링크를 수정하려면 먼저 Google 로그인이 필요해요 🔑");
      return;
    }
    try {
      await updateLink(id, updates);
    } catch (error: any) {
      console.error("Firestore 링크 수정 실패:", error);
      setToastMessage(error?.message || "링크 수정에 실패했습니다.");
      throw error;
    }
  };

  // 링크 삭제 처리
  const handleDeleteLink = async () => {
    if (!deletingLink) return;
    if (!canEdit) {
      setToastMessage("링크를 삭제하려면 먼저 Google 로그인이 필요해요 🔑");
      return;
    }
    try {
      const targetTitle = deletingLink.title;
      await removeLink(deletingLink.id);
      setToastMessage(`"${targetTitle}" 링크가 삭제되었어요 🗑️`);
      setDeletingLink(null);
    } catch (error: any) {
      console.error("Firestore 링크 삭제 실패:", error);
      setToastMessage(error?.message || "링크 삭제에 실패했어요. 다시 시도해주세요.");
      throw error;
    }
  };

  // 동적 통계 지표 (총 링크 개수 실시간 반영)
  const dynamicStats = useMemo(() => {
    return profileData.stats.map((s) =>
      s.iconName === "FolderGit2"
        ? { ...s, value: `${links.length}개` }
        : s
    );
  }, [profileData.stats, links.length]);

  return (
    <div className="mx-auto w-full max-w-[520px] px-4 py-4 sm:py-6 space-y-4">
      {/* 0. 다른 사람의 페이지이거나 데모 페이지인 경우 상단 내비게이션 바 */}
      {isVisitingOther && (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 shadow-xs border border-[#e5e8eb]">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-[#3182f6]" />
              <p className="text-xs font-semibold text-[#191f28] truncate">
                {isDemo
                  ? "체험용 데모 페이지를 둘러보는 중이에요"
                  : `${profileData.name}님의 링크 서랍을 보고 있어요`}
              </p>
            </div>
            <p className="mt-0.5 text-[11px] text-[#8b95a1]">
              {user
                ? "언제든 내 링크 서랍으로 돌아갈 수 있어요."
                : "Google로 로그인하면 나만의 링크를 만들 수 있어요."}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => router.push("/")}
              className="toss-press inline-flex items-center gap-1 rounded-xl bg-[#f2f4f6] px-2.5 py-1.5 text-xs font-semibold text-[#4e5968] hover:bg-[#e5e8eb] transition-colors"
              title="메인 화면으로 이동"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{user ? "내 링크" : "메인으로"}</span>
            </button>

            {!user && (
              <button
                onClick={() => loginWithGoogle()}
                className="toss-press inline-flex items-center gap-1 rounded-xl bg-[#3182f6] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1b64da] transition-colors"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>시작하기</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 1. 프로필 히어로 카드 */}
      <ProfileHero
        profile={profileData}
        shareUrl={shareUrl}
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
                {canEdit ? "내 링크 모음" : `${profileData.name}님의 링크`}
              </h2>
              {isPending && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f3ff] px-2 py-0.5 text-[11px] font-semibold text-[#3182f6]">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>{isUpdating ? "업데이트 중" : "갱신 중"}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-[#6b7684]">
              {canEdit
                ? `${profileData.name}님의 소중한 링크 서랍이에요`
                : "자주 찾는 프로젝트와 포트폴리오예요"}
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

            {canEdit && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                disabled={isUpdating}
                className="toss-press flex items-center gap-1 text-xs font-semibold text-[#3182f6] hover:underline disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                <span>새 링크 추가</span>
              </button>
            )}
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

      {/* 4. 링크 리스트 목록 */}
      <div className="space-y-2">
        {(isRefreshing || isUpdating) && links.length > 0 && (
          <div className="flex items-center justify-center gap-2 rounded-2xl bg-[#e8f3ff] px-4 py-2.5 text-xs font-semibold text-[#3182f6] shadow-2xs transition-all">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>
              {isUpdating
                ? "변경사항을 Firestore에 반영하는 중이에요..."
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
                canEdit={canEdit}
                onLinkClick={handleLinkClick}
                onShowToast={(msg) => setToastMessage(msg)}
                onUpdate={handleUpdateLink}
                onDeleteClick={(targetLink) => setDeletingLink(targetLink)}
              />
            ))}
          </div>
        ) : links.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-xs border border-black/[0.04] space-y-3">
            <p className="text-sm font-semibold text-[#191f28]">
              아직 등록된 링크가 없어요
            </p>
            <p className="text-xs text-[#8b95a1]">
              {canEdit
                ? "새 링크 추가 버튼을 눌러 첫 번째 링크를 등록하거나, 기본 샘플 링크를 가져와보세요 ✨"
                : "등록된 링크가 아직 없어요. 새로운 링크가 추가되면 여기에 표시돼요."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {canEdit ? (
                <>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="toss-press inline-flex items-center gap-1.5 rounded-xl bg-[#3182f6] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1b64da] transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>새 링크 추가하기</span>
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await importSampleLinks();
                        setToastMessage("기본 샘플 링크 8개가 등록되었어요 ✨");
                      } catch (e: any) {
                        setToastMessage("샘플 링크 등록에 실패했습니다.");
                      }
                    }}
                    disabled={isUpdating}
                    className="toss-press inline-flex items-center gap-1.5 rounded-xl bg-[#f2f4f6] px-4 py-2.5 text-xs font-semibold text-[#4e5968] hover:bg-[#e5e8eb] transition-colors disabled:opacity-50"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>샘플 링크 가져오기</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => loginWithGoogle()}
                  className="toss-press inline-flex items-center gap-1.5 rounded-xl bg-[#3182f6] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1b64da] transition-colors"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Google로 나만의 링크 만들기</span>
                </button>
              )}
            </div>
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
        email={profileData.email}
        onSuccess={(msg) => setToastMessage(msg)}
      />

      <AddLinkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddLink}
      />

      <DeleteConfirmModal
        isOpen={!!deletingLink}
        linkTitle={deletingLink?.title || ""}
        onClose={() => setDeletingLink(null)}
        onConfirm={handleDeleteLink}
      />

      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
        duration={2500}
      />
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[520px] px-4 py-6 space-y-4">
      <div className="rounded-3xl bg-white p-6 shadow-xs border border-black/[0.04] animate-pulse space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="h-16 w-16 rounded-2xl bg-[#f2f4f6]" />
          <div className="space-y-2 flex-1">
            <div className="h-5 w-1/3 rounded-md bg-[#f2f4f6]" />
            <div className="h-3 w-1/2 rounded-md bg-[#f2f4f6]" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 rounded-2xl bg-white p-4 border border-black/[0.03] animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

function PageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  // URL 쿼리 파라미터 확인:
  // - uid: 다른 사람의 고유 ID 링크로 접속한 경우 (?uid=xyz)
  // - demo: 체험용 데모 페이지를 둘러보는 경우 (?demo=true)
  const paramUid = searchParams.get("uid") || searchParams.get("u");
  const isDemo = searchParams.get("demo") === "true";

  // 다른 사람의 페이지(또는 데모 페이지)에 접속 중인지 여부
  const isVisitingOther = Boolean((paramUid && paramUid !== user?.uid) || isDemo);

  // 1. 인증 상태 확인 중일 때 부드러운 스켈레톤 로더
  if (authLoading) {
    return <PageSkeleton />;
  }

  // 2. [핵심 조건]
  // 로그인을 하지 않았고(!user), 다른 사람의 페이지에 접속하지 않았다면(!isVisitingOther)
  // -> 서비스 메인 랜딩 페이지(LandingPage)를 노출!
  if (!user && !isVisitingOther) {
    return <LandingPage />;
  }

  // 3. 로그인 상태이거나 타인의 페이지에 접속한 경우 -> 프로필 화면 렌더링
  return (
    <ProfileView
      user={user}
      paramUid={paramUid}
      isDemo={isDemo}
      isVisitingOther={isVisitingOther}
    />
  );
}

export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent />
    </Suspense>
  );
}
