import { CircleMarker, Popup } from 'react-leaflet';
import type { LootLocation } from '../types';
import { LOOT_TYPES, RARITY_COLORS, RARITY_LABELS } from '../types';

interface Props {
  loot: LootLocation;
  position: [number, number];
}

export default function LootMarker({ loot, position }: Props) {
  const typeConfig = LOOT_TYPES.find((t) => t.key === loot.type);
  const color = typeConfig?.color || '#9ca3af';
  const rarityColor = RARITY_COLORS[loot.rarity] || '#9ca3af';
  const rarityLabel = RARITY_LABELS[loot.rarity] || loot.rarity;

  return (
    <CircleMarker
      center={position}
      radius={8}
      pathOptions={{
        color,
        fillColor: color,
        fillOpacity: 0.7,
        weight: 2,
      }}
    >
      <Popup>
        <div className="min-w-[180px]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">{typeConfig?.icon || '📦'}</span>
            <span className="font-bold text-sm">{loot.name}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
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
          <p className="text-xs text-gray-600 mb-1">{loot.description}</p>
          <div className="flex justify-between text-xs text-gray-500">
            <span>💰 {loot.estimated_value.toLocaleString()}</span>
            <span>🎯 {loot.spawn_rate}%</span>
          </div>
        </div>
      </Popup>
    </CircleMarker>
  );
}
