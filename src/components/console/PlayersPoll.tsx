"use client";

import { useState } from "react";

interface PlayersPollProps {
  onVoteSubmit?: (option: string) => void;
}

export default function PlayersPoll({ onVoteSubmit }: PlayersPollProps) {
  const [selectedOption, setSelectedOption] = useState<string>("nextjs");
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  const options = [
    { id: "nextjs", label: "Next.js 16 App Router & Turbopack" },
    { id: "gameboy", label: "Retro GBA 32-bit Classic Games" },
    { id: "tailwind", label: "Tailwind CSS & Y2K Bevel Hardware Chrome" },
    { id: "coffee", label: "1:1 Coffee Chat & Collaboration" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasVoted(true);
    onVoteSubmit?.(selectedOption);
  };

  return (
    <div className="bevel-plate overflow-hidden rounded-[2px] bg-[#8ba1d4]">
      {/* 패널 헤더 (section-label-bar) */}
      <div className="flex items-center justify-between border-b border-[#3d4f97] bg-[#7a8aba] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.5px] text-[#21242e]">
        <div className="flex items-center gap-1.5">
          <span>≡</span>
          <span>PLAYER&apos;S POLL</span>
        </div>
        <span className="text-[9px] text-[#21242e]/70">QUESTION OF THE WEEK</span>
      </div>

      <div className="p-3">
        <p className="text-[12px] font-bold text-[#21242e]">
          Which upcoming tech stack are you most excited to explore this season?
        </p>

        {hasVoted ? (
          <div className="mt-3 rounded-[2px] border border-[#3d4f97] bg-white p-3 text-center">
            <p className="text-[11px] font-black text-[#e60012]">
              THANK YOU FOR VOTING!
            </p>
            <p className="mt-1 text-[10px] text-[#60619c]">
              Poll results will be published in next week&apos;s Nsider report.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-2.5 space-y-1.5">
            {options.map((opt) => (
              <label
                key={opt.id}
                className="flex cursor-pointer items-center gap-2 rounded-[2px] p-1 text-[11px] text-[#21242e] hover:bg-white/30"
              >
                <input
                  type="radio"
                  name="poll"
                  value={opt.id}
                  checked={selectedOption === opt.id}
                  onChange={() => setSelectedOption(opt.id)}
                  className="h-3.5 w-3.5 accent-[#f68d1f]"
                />
                <span className="font-medium">{opt.label}</span>
              </label>
            ))}

            <div className="mt-3 flex items-center justify-between pt-1">
              <span className="cursor-pointer text-[10px] font-bold text-[#3d4f97] hover:underline">
                View Past Results
              </span>
              <button
                type="submit"
                className="bevel-chip flex h-6 items-center rounded-[2px] bg-[#f68d1f] px-4 text-[11px] font-bold uppercase tracking-[0.5px] text-white hover:bg-[#e48600] active:translate-y-px"
              >
                SUBMIT VOTE
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
