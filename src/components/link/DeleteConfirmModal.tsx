"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  linkTitle: string;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export default function DeleteConfirmModal({
  isOpen,
  linkTitle,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 (딤 처리 및 블러) */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={isDeleting ? undefined : onClose}
      />

      {/* 모달 본문 */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-6 shadow-xl transition-all">
        {/* 상단 닫기 버튼 */}
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="absolute right-4 top-4 rounded-full p-1 text-[#8b95a1] hover:bg-[#f2f4f6] hover:text-[#4e5968] transition-colors disabled:opacity-40"
        >
          <X className="h-5 w-5" />
        </button>

        {/* 경고 아이콘 */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0f2] text-[#f04452]">
          <AlertTriangle className="h-6 w-6 stroke-[2.2]" />
        </div>

        {/* 요구사항 텍스트 */}
        <div className="space-y-2">
          {/* 제목 */}
          <h2 className="text-lg font-bold text-[#191f28]">
            정말 삭제하시겠습니까?
          </h2>

          {/* 내용 */}
          <p className="text-sm text-[#4e5968] break-words">
            <span className="font-semibold text-[#191f28]">"{linkTitle}"</span> 링크가 삭제됩니다
          </p>

          {/* 경고 */}
          <div className="rounded-xl bg-[#fff0f2] px-3 py-2 text-xs font-medium text-[#f04452]">
            이 작업은 되돌릴 수 없습니다
          </div>
        </div>

        {/* 액션 버튼 (취소 / 삭제하기) */}
        <div className="mt-6 flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="toss-press flex-1 rounded-xl bg-[#f2f4f6] py-3 text-sm font-semibold text-[#6b7684] hover:bg-[#e5e8eb] transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="toss-press flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#f04452] py-3 text-sm font-semibold text-white shadow-xs hover:bg-[#d63845] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{isDeleting ? "삭제 중..." : "삭제하기"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
