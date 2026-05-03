import type { LootLocation } from '../types';
import { LOOT_TYPES, RARITY_COLORS, RARITY_LABELS } from '../types';

interface Props {
  loot: LootLocation;
  isSelected: boolean;
  onClick: () => void;
}

export default function LootMarker({ loot, isSelected, onClick }: Props) {
  const typeConfig = LOOT_TYPES.find((t) => t.key === loot.type);
  const color = typeConfig?.color || '#9ca3af';
  const icon = typeConfig?.icon || '📦';
  const rarityColor = RARITY_COLORS[loot.rarity] || '#9ca3af';
  const rarityLabel = RARITY_LABELS[loot.rarity] || loot.rarity;

  // Higher spawn rate = larger marker
  const size = loot.spawn_rate >= 70 ? 14 : loot.spawn_rate >= 40 ? 12 : 10;

  return (
    <div
      className="absolute cursor-pointer transition-all duration-200 hover:scale-125 group"
      style={{
        left: `${loot.x}%`,
        top: `${loot.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: isSelected ? 20 : 10,
      }}
      onClick={onClick}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full blur-sm opacity-50"
        style={{
          width: size + 8,
          height: size + 8,
          backgroundColor: color,
          marginLeft: -4,
          marginTop: -4,
        }}
      />
      {/* Marker dot */}
      <div
        className="relative rounded-full border-2 transition-all duration-200"
        style={{
          width: size,
          height: size,
          backgroundColor: isSelected ? color : `${color}99`,
          borderColor: color,
          boxShadow: isSelected ? `0 0 12px ${color}` : 'none',
        }}
      />
      {/* Hover tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
        <div className="bg-[#242424] border border-[#3a3a3a] rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">{icon}</span>
            <span className="text-xs font-bold text-[var(--color-text-primary)]">{loot.name}</span>
          </div>
          <div className="flex gap-1">
            <span
              className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
              style={{ backgroundColor: color }}
            >
              {loot.type}
            </span>
            <span
              className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
              style={{ backgroundColor: rarityColor }}
            >
              {rarityLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
