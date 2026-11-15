"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/constants";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleIcon } from "@/components/common/BrandIcons";
import { LogOut, Loader2, Plus, User as UserIcon } from "lucide-react";

interface HeaderProps {
  onOpenAddLink?: () => void;
}

export default function Header({ onOpenAddLink }: HeaderProps) {
  const { user, loading, loginWithGoogle, logout } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    try {
      setIsLoggingIn(true);
      await loginWithGoogle();
    } catch (err: any) {
      if (err?.code !== "auth/popup-closed-by-user") {
        console.error("Google 로그인 에러:", err);
        alert("로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (err) {
      console.error("로그아웃 에러:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // 표시할 사용자 이름 (displayName 우선, 없으면 email 앞부분, 기본 '사용자')
  const displayName =
    user?.displayName ||
    (user?.email ? user.email.split("@")[0] : "사용자");

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

        {/* 우측 인증 및 액션 영역 */}
        <div className="flex items-center gap-2">
          {/* 로그인 상태이고 onOpenAddLink 콜백이 제공된 경우 링크 추가 버튼 표시 */}
          {user && onOpenAddLink && (
            <button
              onClick={onOpenAddLink}
              className="toss-press flex items-center gap-1 rounded-full bg-[#3182f6] px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#1b64da]"
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">링크 추가</span>
            </button>
          )}

          {/* 인증 상태에 따른 버튼/정보 렌더링 */}
          {loading ? (
            <div className="h-8 w-24 rounded-full bg-[#f2f4f6] animate-pulse" />
          ) : user ? (
            /* 로그인 상태: 사용자 이름 표시 & 로그아웃 버튼 */
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-1.5 max-w-[110px] sm:max-w-[140px]"
                title={`${displayName} (${user.email || ""})`}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={displayName}
                    className="h-6 w-6 rounded-full object-cover border border-black/10 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8f3ff] text-[11px] font-bold text-[#3182f6]">
                    <UserIcon className="h-3.5 w-3.5" />
                  </div>
                )}
                <span className="truncate text-xs font-semibold text-[#191f28]">
                  {displayName}
                </span>
              </div>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="toss-press flex items-center gap-1 rounded-full bg-[#f2f4f6] px-2.5 py-1.5 text-xs font-medium text-[#6b7684] hover:bg-[#e5e8eb] hover:text-[#191f28] transition-colors disabled:opacity-50"
                title="로그아웃"
              >
                {isLoggingOut ? (
                  <Loader2 className="h-3 w-3 animate-spin text-[#6b7684]" />
                ) : (
                  <LogOut className="h-3 w-3" />
                )}
                <span>로그아웃</span>
              </button>
            </div>
          ) : (
            /* 로그아웃 상태: Google로 로그인 버튼 */
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="toss-press flex items-center gap-1.5 rounded-full border border-[#e5e8eb] bg-white px-3 py-1.5 text-xs font-semibold text-[#333d4b] shadow-2xs hover:bg-[#f9fafb] hover:border-[#d1d6db] transition-all disabled:opacity-50"
              title="Google 계정으로 로그인"
            >
              {isLoggingIn ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#3182f6]" />
              ) : (
                <GoogleIcon className="h-3.5 w-3.5 shrink-0" />
              )}
              <span>Google로 로그인</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
