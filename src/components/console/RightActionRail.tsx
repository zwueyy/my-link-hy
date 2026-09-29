import { LogIn, Mail, HelpCircle, Coffee, Gamepad2 } from "lucide-react";

interface RightActionRailProps {
  onOpenContact: () => void;
  onShowToast: (msg: string) => void;
}

export default function RightActionRail({
  onOpenContact,
  onShowToast,
}: RightActionRailProps) {
  return (
    <aside className="flex w-full flex-col gap-3 sm:w-[220px]">
      {/* 1. 카본 네이비 커맨드 액션 슬랩들 (button-secondary) */}
      <div className="flex flex-col gap-1.5">
        <button
          onClick={onOpenContact}
          className="bevel-chip group flex h-8 items-center justify-between bg-carbon-halftone px-3 text-[11px] font-bold uppercase tracking-[0.5px] text-white hover:bg-[#3d4f97]"
        >
          <div className="flex items-center gap-1.5">
            <Coffee className="h-3.5 w-3.5 text-[#ecab37]" />
            <span>COFFEE CHAT</span>
          </div>
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#f68d1f] text-[9px] font-black text-white">
            &gt;
          </span>
        </button>

        <button
          onClick={() => onShowToast("로그인 서비스는 준비 중입니다.")}
          className="bevel-chip group flex h-8 items-center justify-between bg-carbon-halftone px-3 text-[11px] font-bold uppercase tracking-[0.5px] text-white hover:bg-[#3d4f97]"
        >
          <div className="flex items-center gap-1.5">
            <LogIn className="h-3.5 w-3.5 text-[#9fbee7]" />
            <span>NSIDER LOG IN</span>
          </div>
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#f68d1f] text-[9px] font-black text-white">
            &gt;
          </span>
        </button>

        <button
          onClick={() => onShowToast("뉴스레터 구독이 완료되었습니다! ✉️")}
          className="bevel-chip group flex h-8 items-center justify-between bg-carbon-halftone px-3 text-[11px] font-bold uppercase tracking-[0.5px] text-white hover:bg-[#3d4f97]"
        >
          <div className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-[#ecab37]" />
            <span>NEWSLETTER</span>
          </div>
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#f68d1f] text-[9px] font-black text-white">
            &gt;
          </span>
        </button>

        <button
          onClick={() => onShowToast("기술 지원 및 도움말 페이지입니다.")}
          className="bevel-chip group flex h-8 items-center justify-between bg-carbon-halftone px-3 text-[11px] font-bold uppercase tracking-[0.5px] text-white hover:bg-[#3d4f97]"
        >
          <div className="flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-[#9fbee7]" />
            <span>HELP &amp; INFO</span>
          </div>
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#f68d1f] text-[9px] font-black text-white">
            &gt;
          </span>
        </button>
      </div>

      {/* 2. "WHAT IS" 인포 박스 (info-box) */}
      <div className="bevel-inset rounded-[2px] bg-white p-2.5">
        <div className="mb-2 -mx-2.5 -mt-2.5 border-b border-[#3d4f97] bg-[#ecab37] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.5px] text-[#21242e]">
          WHAT IS — MYLINK
        </div>
        <p className="text-[11px] leading-relaxed text-[#21242e]">
          The official central console hub for developer projects, portfolio links, and web experiments.
        </p>
        <div className="mt-2 text-right">
          <span className="cursor-pointer text-[10px] font-bold text-[#3d4f97] hover:underline">
            Read More &gt;&gt;
          </span>
        </div>
      </div>

      {/* 3. 사이드 프로모 카드 (promo-card) */}
      <div className="bevel-plate rounded-[2px] bg-[#acace7] p-2.5">
        <div className="flex items-center justify-between">
          <span className="text-boxart-sm text-[12px] tracking-tight">
            GAME BOY ADVANCE
          </span>
          <span className="rounded-full bg-[#e60012] px-1.5 py-0.2 font-mono text-[8px] font-black text-white">
            32-BIT
          </span>
        </div>
        <div className="my-2 flex h-20 items-center justify-center rounded-[2px] border border-[#3d4f97] bg-[#8ba1d4]">
          <div className="flex flex-col items-center">
            <Gamepad2 className="h-8 w-8 text-[#21242e]" />
            <span className="mt-1 font-mono text-[9px] font-black uppercase text-[#21242e]">
              AGB-001 HARDWARE
            </span>
          </div>
        </div>
        <p className="text-[10px] font-bold leading-tight text-[#21242e]">
          Take 32-bit console power on the go. Available at stores worldwide!
        </p>
      </div>

      {/* 4. ESRB 레이팅 신뢰 박스 */}
      <div className="bevel-inset flex items-center justify-between rounded-[2px] bg-[#dedede] p-2">
        <div className="flex items-center gap-1.5">
          <div className="flex h-7 w-7 items-center justify-center border-2 border-[#21242e] bg-white font-mono text-[14px] font-black text-[#21242e]">
            E
          </div>
          <div className="text-[9px] font-bold leading-tight text-[#21242e]">
            EVERYONE
            <br />
            <span className="text-[8px] text-[#60619c]">Comic Mischief</span>
          </div>
        </div>
        <div className="bevel-chip rounded-[2px] bg-[#ecab37] px-1.5 py-0.5 text-[8px] font-bold text-[#21242e]">
          ESRB
        </div>
      </div>
    </aside>
  );
}
