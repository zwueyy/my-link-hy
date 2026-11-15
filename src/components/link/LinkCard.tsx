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
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { GithubIcon } from "@/components/common/BrandIcons";

interface LinkCardProps {
  link: LinkItem;
  canEdit?: boolean;
  onLinkClick?: (id: string) => void;
  onShowToast?: (msg: string) => void;
  onUpdate?: (
    id: string,
    updates: { title: string; url: string }
  ) => Promise<void> | void;
  onDeleteClick?: (link: LinkItem) => void;
}

export default function LinkCard({
  link,
  canEdit = true,
  onLinkClick,
  onShowToast,
  onUpdate,
  onDeleteClick,
}: LinkCardProps) {
  const [copied, setCopied] = useState(false);

  // 인라인 수정 상태 관리
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(link.title);
  const [editUrl, setEditUrl] = useState(link.url);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getCategoryIcon = () => {
    if (link.icon === "github") {
      return <GithubIcon className="h-5 w-5 text-[#191f28]" />;
    }
    if (link.icon === "instagram") {
      return <Sparkles className="h-5 w-5 text-[#e1306c]" />;
    }
    if (link.icon === "youtube") {
      return <Sparkles className="h-5 w-5 text-[#ff0000]" />;
    }

    switch (link.category) {
      case "portfolio":
        return <Sparkles className="h-5 w-5 text-[#3182f6]" />;
      case "channel":
        return <BookOpen className="h-5 w-5 text-[#e1306c]" />;
      case "project":
        return <FileText className="h-5 w-5 text-[#20c997]" />;
      case "contact":
        return <Coffee className="h-5 w-5 text-[#ff9f00]" />;
      case "work":
        return <FileText className="h-5 w-5 text-[#3182f6]" />;
      case "social":
        return <BookOpen className="h-5 w-5 text-[#20c997]" />;
      case "tool":
        return <Globe className="h-5 w-5 text-[#ff9f00]" />;
      default:
        return <Sparkles className="h-5 w-5 text-[#3182f6]" />;
    }
  };

  // 링크 복사 핸들러
  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    onShowToast?.("링크 주소가 복사되었어요 🔗");
    setTimeout(() => setCopied(false), 2000);
  };

  // 수정 시작: 기존 값을 입력 칸에 채우고 편집 모드 활성화
  const handleStartEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditTitle(link.title);
    setEditUrl(link.url);
    setErrorMessage(null);
    setIsEditing(true);
  };

  // 수정 취소: 기존 값으로 복구 및 편집 모드 종료
  const handleCancelEdit = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setEditTitle(link.title);
    setEditUrl(link.url);
    setErrorMessage(null);
    setIsEditing(false);
  };

  // 수정 저장: 빈칸 검증 + Firestore updateDoc
  const handleSave = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const trimmedTitle = editTitle.trim();
    const trimmedUrl = editUrl.trim();

    // 1. 빈칸 검증
    if (!trimmedTitle || !trimmedUrl) {
      setErrorMessage("제목과 주소를 모두 입력해주세요.");
      onShowToast?.("제목과 주소를 모두 입력해주세요.");
      return;
    }

    // URL 프로토콜 보정
    let formattedUrl = trimmedUrl;
    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://")
    ) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      setIsSaving(true);
      setErrorMessage(null);

      // Firestore updateDoc 호출
      if (onUpdate) {
        await onUpdate(link.id, {
          title: trimmedTitle,
          url: formattedUrl,
        });
      }

      setIsEditing(false);
      onShowToast?.("링크가 수정되었어요 ✨");
    } catch (err: any) {
      console.error("링크 수정 실패:", err);
      setErrorMessage(err?.message || "링크 수정에 실패했습니다.");
      onShowToast?.("링크 수정에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  // 삭제 버튼 클릭 핸들러
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDeleteClick?.(link);
  };

  const domain = link.url.replace(/^https?:\/\//, "").split("/")[0];

  // 인라인 수정 모드일 때의 UI
  if (isEditing) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-sm border-2 border-[#3182f6]/40 transition-all">
        <form onSubmit={handleSave} className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#e8f3ff] text-[#3182f6]">
              <Pencil className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-bold text-[#191f28]">
              링크 수정하기
            </span>
          </div>

          <div className="space-y-2">
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-[#4e5968]">
                제목 *
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => {
                  setEditTitle(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                disabled={isSaving}
                placeholder="링크 제목을 입력하세요"
                className="w-full rounded-xl bg-[#f2f4f6] px-3.5 py-2 text-sm font-medium text-[#191f28] placeholder-[#b0b8c1] transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3182f6]"
                autoFocus
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-[#4e5968]">
                주소 (URL) *
              </label>
              <input
                type="text"
                value={editUrl}
                onChange={(e) => {
                  setEditUrl(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                disabled={isSaving}
                placeholder="https://..."
                className="w-full rounded-xl bg-[#f2f4f6] px-3.5 py-2 text-xs font-mono text-[#191f28] placeholder-[#b0b8c1] transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3182f6]"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#f04452]">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 저장 / 취소 버튼 */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={isSaving}
              className="toss-press rounded-xl bg-[#f2f4f6] px-3.5 py-2 text-xs font-semibold text-[#6b7684] hover:bg-[#e5e8eb] transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="toss-press flex items-center gap-1.5 rounded-xl bg-[#3182f6] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#1b64da] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{isSaving ? "저장 중..." : "저장"}</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  // 일반 보기 모드일 때의 UI
  return (
    <div className="toss-press group flex items-center justify-between rounded-2xl bg-white p-4 shadow-xs border border-black/[0.03] transition-all hover:bg-[#fafbfc]">
      {/* 좌측: 클릭 시 링크 이동 영역 */}
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onLinkClick?.(link.id)}
        className="flex flex-1 items-center gap-3.5 min-w-0"
      >
        {/* 44px TDS Soft Icon Container */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f2f4f6] transition-colors group-hover:bg-[#e8f3ff]">
          {getCategoryIcon()}
        </div>

        <div className="min-w-0 flex-1">
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
      </a>

      {/* 우측: 수정, 삭제, 복사 버튼 & 쉐브론 */}
      <div className="flex items-center gap-0.5 shrink-0 pl-2">
        {/* 수정 및 삭제 버튼은 편집 권한(로그인)이 있을 때만 노출 */}
        {canEdit && (
          <>
            {/* 수정 버튼 */}
            <button
              onClick={handleStartEdit}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#8b95a1] hover:bg-[#e8f3ff] hover:text-[#3182f6] transition-colors"
              title="링크 수정"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>

            {/* 삭제 버튼 */}
            <button
              onClick={handleDeleteClick}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#8b95a1] hover:bg-[#fff0f2] hover:text-[#f04452] transition-colors"
              title="링크 삭제"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        )}

        {/* 링크 복사 버튼 */}
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

        {/* 바로가기 화살표 */}
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onLinkClick?.(link.id)}
          className="flex h-8 w-8 items-center justify-center text-[#b0b8c1] group-hover:text-[#3182f6] group-hover:translate-x-0.5 transition-all"
          title="링크 열기"
        >
          <ChevronRight className="h-4 w-4 stroke-[2.5]" />
        </a>
      </div>
    </div>
  );
}
