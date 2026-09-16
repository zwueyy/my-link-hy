import { LinkItem } from "@/types";

export const SITE_CONFIG = {
  name: "마이링크 (MyLink)",
  description: "나만의 중요한 링크들을 한곳에서 깔끔하게 관리하고 공유하세요.",
  url: "http://localhost:3000",
};

export const DEFAULT_CATEGORIES = [
  { id: "all", name: "전체", slug: "all" },
  { id: "work", name: "업무/학습", slug: "work" },
  { id: "social", name: "소셜/SNS", slug: "social" },
  { id: "tool", name: "도구/서비스", slug: "tool" },
  { id: "etc", name: "기타", slug: "etc" },
];

export const INITIAL_LINKS: LinkItem[] = [
  {
    id: "1",
    title: "GitHub 저장소",
    url: "https://github.com",
    description: "코드 및 프로젝트 관리",
    category: "work",
    isPublic: true,
    createdAt: new Date().toISOString(),
    clickCount: 12,
  },
  {
    id: "2",
    title: "Notion 워크스페이스",
    url: "https://notion.so",
    description: "개인 노트 및 문서 정리",
    category: "work",
    isPublic: true,
    createdAt: new Date().toISOString(),
    clickCount: 8,
  },
  {
    id: "3",
    title: "Next.js 공식 문서",
    url: "https://nextjs.org/docs",
    description: "Next.js 프레임워크 학습 자료",
    category: "tool",
    isPublic: true,
    createdAt: new Date().toISOString(),
    clickCount: 25,
  },
];
