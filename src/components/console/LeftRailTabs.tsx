"use client";

interface LeftRailTabsProps {
  activeTab?: string;
  onTabClick?: (tab: string) => void;
}

export default function LeftRailTabs({
  activeTab = "TOP TEN",
  onTabClick,
}: LeftRailTabsProps) {
  const tabs = [
    { label: "TOP TEN", id: "top" },
    { label: "FEATURED", id: "featured" },
    { label: "PLAYER'S CHOICE", id: "choice" },
    { label: "ESRB RATINGS", id: "esrb" },
  ];

  return (
    <div className="hidden flex-col gap-2 pt-2 sm:flex">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabClick?.(tab.id)}
            className={`flex w-7 items-center justify-center rounded-l-[3px] border-b border-l border-t py-4 text-center transition-all ${
              isActive
                ? "border-[#3d4f97] bg-[#7a8aba] text-[#21242e]"
                : "border-[#3d4f97] bg-[#21242e] text-[#9fbee7] hover:bg-[#3d4f97] hover:text-white"
            }`}
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            <span className="font-sans text-[10px] font-bold tracking-[1px] uppercase">
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
