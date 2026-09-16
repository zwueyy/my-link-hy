import { SITE_CONFIG } from "@/constants";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50 py-8 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
      <div className="mx-auto max-w-5xl px-4">
        <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</p>
        <p className="mt-1">바이브 코딩 Next.js 프로젝트 템플릿</p>
      </div>
    </footer>
  );
}
