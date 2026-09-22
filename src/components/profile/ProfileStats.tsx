"use client";

import { ProfileStat } from "@/types";
import { FolderGit2, MousePointerClick, Layers, Zap, Trophy, Award } from "lucide-react";

interface ProfileStatsProps {
  stats: ProfileStat[];
}

export default function ProfileStats({ stats }: ProfileStatsProps) {
  const getIcon = (name?: string) => {
    switch (name) {
      case "FolderGit2":
        return <FolderGit2 className="h-4 w-4 text-violet-500" />;
      case "MousePointerClick":
        return <MousePointerClick className="h-4 w-4 text-blue-500" />;
      case "Layers":
        return <Layers className="h-4 w-4 text-emerald-500" />;
      case "Zap":
        return <Zap className="h-4 w-4 text-amber-500" />;
      case "Trophy":
        return <Trophy className="h-4 w-4 text-amber-500" />;
      default:
        return <Award className="h-4 w-4 text-blue-500" />;
    }
  };

  if (!stats || stats.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="group relative flex flex-col items-center justify-center rounded-2xl border border-zinc-200/80 bg-white/70 p-3.5 text-center shadow-xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:bg-white hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/70 dark:hover:border-blue-500 dark:hover:bg-zinc-900"
        >
          <div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100/80 transition-transform group-hover:scale-110 dark:bg-zinc-800/80">
            {getIcon(stat.iconName)}
          </div>
          <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">
            {stat.value}
          </span>
          <span className="mt-0.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
