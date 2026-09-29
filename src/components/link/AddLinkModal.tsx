"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { DEFAULT_CATEGORIES } from "@/constants";
import { LinkItem } from "@/types";

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newLink: Omit<LinkItem, "id" | "createdAt" | "clickCount">) => void;
}

export default function AddLinkModal({
  isOpen,
  onClose,
  onAdd,
}: AddLinkModalProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("project");
  const [badge, setBadge] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
    }

    onAdd({
      title: title.trim(),
      url: formattedUrl,
      description: description.trim() || undefined,
      category,
      badge: badge.trim() || undefined,
      isPublic: true,
      icon: category === "work" ? "fileText" : category === "social" ? "bookOpen" : "globe",
    });

    setTitle("");
    setUrl("");
    setDescription("");
    setBadge("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Scrim Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Toss Dialog Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-xl transition-all">
        <div className="flex items-center justify-between pb-3">
          <div>
            <h2 className="text-lg font-bold text-[#191f28]">
              새 링크 등록하기
            </h2>
            <p className="mt-0.5 text-xs text-[#6b7684]">
              서랍에 추가할 링크 정보를 입력해주세요.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-[#8b95a1] hover:bg-[#f2f4f6] hover:text-[#4e5968] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-3 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#4e5968]">
              링크 제목 *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 2026 포트폴리오 웹사이트"
              className="w-full rounded-xl bg-[#f2f4f6] px-3.5 py-3 text-sm text-[#191f28] placeholder-[#b0b8c1] transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3182f6]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#4e5968]">
              링크 주소 (URL) *
            </label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl bg-[#f2f4f6] px-3.5 py-3 text-sm text-[#191f28] placeholder-[#b0b8c1] transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3182f6]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#4e5968]">
              간단한 설명 (선택)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="링크에 대한 한 줄 소개를 적어주세요"
              className="w-full rounded-xl bg-[#f2f4f6] px-3.5 py-3 text-sm text-[#191f28] placeholder-[#b0b8c1] transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3182f6]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#4e5968]">
                카테고리
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl bg-[#f2f4f6] px-3 py-3 text-xs font-medium text-[#191f28] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3182f6]"
              >
                {DEFAULT_CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#4e5968]">
                뱃지 라벨 (선택)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="예: NEW, 추천"
                className="w-full rounded-xl bg-[#f2f4f6] px-3 py-3 text-xs text-[#191f28] placeholder-[#b0b8c1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3182f6]"
              />
            </div>
          </div>

          <div className="mt-5 flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="toss-press flex-1 rounded-xl bg-[#f2f4f6] py-3.5 text-sm font-semibold text-[#6b7684] hover:bg-[#e5e8eb]"
            >
              취소
            </button>
            <button
              type="submit"
              className="toss-press flex-[2] rounded-xl bg-[#3182f6] py-3.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#1b64da]"
            >
              등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
