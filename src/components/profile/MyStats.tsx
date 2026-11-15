"use client";

import { useMemo } from "react";
import { LinkItem } from "@/types";

// 마이페이지 통계: 총 클릭 수 + 링크별 클릭 수(많은 순)
export default function MyStats({ links }: { links: LinkItem[] }) {
  const sorted = useMemo(
    () =>
      [...links].sort((a, b) => (b.clickCount ?? 0) - (a.clickCount ?? 0)),
    [links]
  );
  const total = useMemo(
    () => links.reduce((sum, l) => sum + (l.clickCount ?? 0), 0),
    [links]
  );

  return (
    <section className="space-y-2">
      <h2 className="px-1 text-lg font-bold text-[#191f28]">통계</h2>

      <div className="rounded-3xl bg-white p-5">
        <p className="text-xs font-semibold text-[#6b7684]">총 클릭 수</p>
        <p className="mt-1 text-3xl font-bold text-[#191f28] tabular-nums">
          {total.toLocaleString()}
          <span className="ml-1 text-base font-semibold text-[#8b95a1]">회</span>
        </p>
      </div>

      <div className="rounded-3xl bg-white p-5">
        <p className="text-xs font-semibold text-[#6b7684]">링크별 클릭 수</p>
        {sorted.length === 0 ? (
          <p className="mt-3 text-xs text-[#8b95a1]">등록된 링크가 없어요.</p>
        ) : (
          <ul className="mt-3 divide-y divide-[#f2f4f6]">
            {sorted.map((link, i) => (
              <li
                key={link.id}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="w-4 shrink-0 text-xs font-semibold text-[#8b95a1] tabular-nums">
                    {i + 1}
                  </span>
                  <span className="truncate text-sm font-medium text-[#191f28]">
                    {link.title}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-semibold text-[#3182f6] tabular-nums">
                  {(link.clickCount ?? 0).toLocaleString()}회
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
