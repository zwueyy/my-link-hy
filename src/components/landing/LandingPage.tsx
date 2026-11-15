"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleIcon } from "@/components/common/BrandIcons";
import { Sparkles, Loader2 } from "lucide-react";

export default function LandingPage() {
  const { loginWithGoogle } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    try {
      setIsLoggingIn(true);
      await loginWithGoogle();
    } catch (err: any) {
      if (err?.code !== "auth/popup-closed-by-user") {
        console.error("Google 로그인 실패:", err);
        const code = err?.code || "";
        let msg = "로그인 중 오류가 발생했습니다.";
        if (code === "auth/api-key-not-valid" || code === "auth/invalid-api-key") {
          msg = "Firebase API 키가 유효하지 않습니다.\n.env.local 파일에 실제 Firebase 프로젝트 키를 입력했는지 확인해주세요.";
        } else if (code === "auth/operation-not-allowed") {
          msg = "Firebase Console에서 'Google' 로그인 공급업체가 활성화되지 않았습니다.\nAuthentication > Sign-in method에서 Google 로그인을 활성화해주세요.";
        } else if (code === "auth/unauthorized-domain") {
          msg = "현재 접속 도메인(localhost 등)이 Firebase 승인된 도메인에 등록되어 있지 않습니다.\nFirebase Console > Authentication > Settings > 승인된 도메인을 확인해주세요.";
        } else if (code === "auth/popup-blocked") {
          msg = "브라우저에서 팝업이 차단되었습니다. 팝업 차단을 해제하고 다시 시도해주세요.";
        } else if (err?.message) {
          msg = `로그인 오류 (${code || "알 수 없음"}):\n${err.message}`;
        }
        alert(msg);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-14rem)] w-full max-w-[520px] flex-col items-center justify-center px-4 py-8">
      <div className="w-full rounded-3xl bg-white p-8 sm:p-10 text-center shadow-xs border border-black/[0.04] space-y-6">
        {/* 상단 뱃지 */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f3ff] px-3.5 py-1 text-xs font-semibold text-[#3182f6]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>나만의 스마트 링크 서랍, 마이링크</span>
        </div>

        {/* 메인 타이틀 & 소개 문구 */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#191f28] leading-[1.35]">
            흩어져 있는 내 모든 링크를<br />
            <span className="text-[#3182f6]">단 하나의 프로필</span>로 모아보세요
          </h1>
          <p className="text-sm text-[#6b7684] leading-relaxed max-w-[360px] mx-auto">
            인스타그램, 포트폴리오, 블로그, 연락처까지.<br />
            Google 계정으로 간편하게 시작하고 나만의 링크 페이지를 완성해보세요.
          </p>
        </div>

        {/* Google 로그인 버튼 (Primary CTA) */}
        <div className="pt-2">
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="toss-press w-full flex items-center justify-center gap-2.5 rounded-2xl bg-[#3182f6] py-3.5 text-sm font-bold text-white shadow-xs hover:bg-[#1b64da] transition-all disabled:opacity-60"
          >
            {isLoggingIn ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon className="h-4 w-4" />
            )}
            <span>Google로 시작하기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
