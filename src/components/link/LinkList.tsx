"use client";

import { useState } from "react";
import { LinkItem } from "@/types";
import { DEFAULT_CATEGORIES } from "@/constants";
import LinkCard from "./LinkCard";

interface LinkListProps {
  initialLinks: LinkItem[];
}

export default function LinkList({ initialLinks }: LinkListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredLinks = initialLinks.filter((link) => {
    const matchesCategory =
      selectedCategory === "all" || link.category === selectedCategory;
    const matchesSearch =
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (link.description &&
        link.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      link.url.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full space-y-6">
      {/* 검색 & 카테고리 필터 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* 카테고리 탭 */}
        <div className="flex flex-wrap gap-2">
          {DEFAULT_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* 검색 입력창 */}
        <div className="relative">
          <input
            type="text"
            placeholder="링크 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 sm:w-60"
          />
        </div>
      </div>

      {/* 링크 목록 그리드 */}
      {filteredLinks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLinks.map((link) => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-300 py-12 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            조건에 맞는 링크가 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}
