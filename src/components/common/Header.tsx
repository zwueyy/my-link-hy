import Link from "next/link";
import { SITE_CONFIG } from "@/constants";
import { Sparkles } from "lucide-react";
import { GithubIcon } from "@/components/common/BrandIcons";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/75 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/75">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-bold text-lg tracking-tight text-zinc-900 dark:text-white"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-base font-black text-white shadow-md shadow-blue-500/20 transition-transform duration-200 group-hover:scale-105">
            M
          </span>
          <div className="flex items-center gap-1.5">
            <span>{SITE_CONFIG.name}</span>
            <span className="hidden rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600 sm:inline-block dark:bg-blue-950/50 dark:text-blue-400">
              v2.0
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-xs transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <GithubIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
            <Sparkles className="h-3 w-3" />
            <span>My Profile</span>
          </span>
        </nav>
      </div>
    </header>
  );
}
