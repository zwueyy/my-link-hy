"use client";

import { ProfileStat } from "@/types";
import { FolderGit2, MousePointerClick, Layers, Zap } from "lucide-react";

interface ProfileStatsProps {
  stats: ProfileStat[];
}

export default function ProfileStats({ stats }: ProfileStatsProps) {
  const getIcon = (name?: string) => {
    switch (name) {
      case "FolderGit2":
        return <FolderGit2 className="h-4 w-4 text-[#3182f6]" />;
      case "MousePointerClick":
        return <MousePointerClick className="h-4 w-4 text-[#20c997]" />;
      case "Layers":
        return <Layers className="h-4 w-4 text-[#6366f1]" />;
      case "Zap":
        return <Zap className="h-4 w-4 text-[#ff9f00]" />;
      default:
        return <Zap className="h-4 w-4 text-[#3182f6]" />;
    }
  };

  if (!stats || stats.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="flex flex-col justify-between rounded-2xl bg-white p-4 shadow-xs border border-black/[0.03] transition-transform hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8b95a1]">
              {stat.label}
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f2f4f6]">
              {getIcon(stat.iconName)}
            </div>
          </div>

          <div className="mt-2">
            <span className="tabular-nums text-xl font-bold tracking-tight text-[#191f28]">
              {stat.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
