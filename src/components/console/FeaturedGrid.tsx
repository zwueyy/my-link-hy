"use client";

interface FeaturedGridProps {
  onTileClick?: (url: string) => void;
}

export default function FeaturedGrid({ onTileClick }: FeaturedGridProps) {
  const tiles = [
    {
      title: "POKÉMON CENTER",
      url: "https://pokemon.com",
      caption: "www.pokemon.com",
      color: "bg-[#e60012]",
      badge: "GBC / GBA",
      icon: "⚡️",
    },
    {
      title: "ZELDA ORACLE SAGA",
      url: "https://zelda.com",
      caption: "www.zelda.com",
      color: "bg-[#206479]",
      badge: "SEASONS & AGES",
      icon: "🗡️",
    },
    {
      title: "SUPER MARIO WORLD",
      url: "https://nintendo.com",
      caption: "www.mario.com",
      color: "bg-[#3d4f97]",
      badge: "SUPER ADVANCE",
      icon: "🍄",
    },
    {
      title: "METROID FUSION",
      url: "https://metroid.com",
      caption: "www.metroid.com",
      color: "bg-[#60619c]",
      badge: "GBA EXCLUSIVE",
      icon: "👾",
    },
  ];

  return (
    <div className="bevel-plate overflow-hidden rounded-[2px] bg-[#7a8aba]">
      {/* 패널 헤더 (section-label-bar) */}
      <div className="flex items-center justify-between border-b border-[#3d4f97] bg-[#8ba1d4] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.5px] text-[#21242e]">
        <div className="flex items-center gap-1.5">
          <span>≡</span>
          <span>FEATURED HARDWARE &amp; SITES</span>
        </div>
        <span className="font-mono text-[9px] text-[#21242e]/70">2001 NETWORK</span>
      </div>

      {/* 2x2 그리드 */}
      <div className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-2">
        {tiles.map((tile) => (
          <a
            key={tile.title}
            href={tile.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onTileClick?.(tile.url)}
            className="bevel-inset group flex flex-col justify-between rounded-[2px] bg-white p-2 transition hover:bg-[#dedede]"
          >
            <div className="flex items-center justify-between">
              <span className="font-sans text-[10px] font-black text-[#21242e] group-hover:text-[#e60012]">
                {tile.title}
              </span>
              <span className="text-sm">{tile.icon}</span>
            </div>

            {/* 미니 썸네일 박스 (~95x50px) */}
            <div
              className={`my-1.5 flex h-12 w-full items-center justify-center rounded-[2px] border border-[#21242e] ${tile.color} text-white shadow-inner`}
            >
              <span className="font-mono text-[9px] font-black tracking-widest">
                {tile.badge}
              </span>
            </div>

            <div className="flex items-center justify-between font-mono text-[9px] text-[#60619c]">
              <span>{tile.caption}</span>
              <span className="font-bold text-[#f68d1f] group-hover:translate-x-0.5">
                &gt;
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
