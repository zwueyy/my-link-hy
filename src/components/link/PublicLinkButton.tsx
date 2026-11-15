"use client";

import { useState } from "react";
import { doc, updateDoc, increment } from "firebase/firestore";
import { ExternalLink } from "lucide-react";
import { db } from "@/lib/firebase";

interface PublicLinkButtonProps {
  userId: string;
  linkId: string;
  url: string;
  title: string;
  description?: string;
  initialClickCount?: number;
}

// 공개 프로필의 링크 버튼: 클릭 시 새 탭으로 열고, 클릭 수를 서버에서 원자적으로 +1 (비로그인 포함)
export default function PublicLinkButton({
  userId,
  linkId,
  url,
  title,
  description,
  initialClickCount = 0,
}: PublicLinkButtonProps) {
  const [count, setCount] = useState(initialClickCount);

  const handleClick = async () => {
    setCount((c) => c + 1); // 낙관적 업데이트
    try {
      await updateDoc(doc(db, "users", userId, "links", linkId), {
        clickCount: increment(1),
      });
    } catch (err) {
      setCount((c) => Math.max(0, c - 1)); // 실패 시 롤백
      console.error("클릭 카운트 저장 실패:", err);
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="flex items-center justify-between rounded-xl border border-gray-200 px-5 py-4 transition hover:bg-gray-50"
    >
      <span>
        <span className="block font-medium">{title}</span>
        {description && (
          <span className="block text-sm text-gray-500">{description}</span>
        )}
        <span className="mt-1 block text-xs text-gray-400 tabular-nums">
          {count}회 방문
        </span>
      </span>
      <ExternalLink className="h-4 w-4 shrink-0 text-gray-400" />
    </a>
  );
}
