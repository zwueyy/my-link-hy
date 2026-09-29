import { SITE_CONFIG } from "@/constants";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#e5e8eb] bg-[#f2f4f6] py-8 text-center text-xs text-[#8b95a1]">
      <div className="mx-auto flex max-w-[520px] flex-col items-center justify-center gap-1.5 px-4">
        <p className="font-medium text-[#6b7684]">
          {SITE_CONFIG.name}와 함께 링크를 편리하게 관리하고 있어요
        </p>
        <p className="text-[11px] text-[#b0b8c1]">
          © {new Date().getFullYear()} {SITE_CONFIG.name}. Toss Design System Style.
        </p>
        <div className="mt-2 flex items-center gap-3 text-[11px] text-[#8b95a1]">
          <span className="cursor-pointer hover:text-[#4e5968] hover:underline">
            이용약관
          </span>
          <span>•</span>
          <span className="cursor-pointer hover:text-[#4e5968] hover:underline">
            개인정보처리방침
          </span>
          <span>•</span>
          <span className="cursor-pointer hover:text-[#4e5968] hover:underline">
            문의하기
          </span>
        </div>
      </div>
    </footer>
  );
}
