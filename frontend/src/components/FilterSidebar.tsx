import { LOOT_TYPES, RARITY_LABELS, RARITY_COLORS } from '../types';
import type { LootLocation } from '../types';
import { Filter, RotateCcw, Layers } from 'lucide-react';

interface Props {
  activeFilters: string[];
  onToggleFilter: (type: string) => void;
  onClearFilters: () => void;
  lootCount: number;
  lootLocations: LootLocation[];
}

export default function FilterSidebar({ activeFilters, onToggleFilter, onClearFilters, lootCount, lootLocations }: Props) {
  const totalValue = lootLocations
    .filter((l) => activeFilters.length === 0 || activeFilters.includes(l.type))
    .reduce((sum, l) => sum + l.estimated_value, 0);

  return (
    <div className="bg-[#242424] rounded-xl border border-[#3a3a3a] p-5 animate-slide-in">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Filter className="w-5 h-5 text-[var(--color-accent)]" />
        <h3 className="font-bold text-[var(--color-text-primary)]">筛选分类</h3>
      </div>

      {/* Loot type filters */}
      <div className="space-y-2 mb-6">
        {LOOT_TYPES.map((type) => {
          const isActive = activeFilters.includes(type.key);
          const count = lootLocations.filter((l) => l.type === type.key).length;
          return (
            <button
              key={type.key}
              onClick={() => onToggleFilter(type.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-[#3a3a3a] border border-[var(--color-accent)]/30'
                  : 'bg-[#2a2a2a] border border-transparent hover:bg-[#3a3a3a]'
              }`}
            >
              <span className="text-lg">{type.icon}</span>
              <span className="flex-1 text-left font-medium text-[var(--color-text-primary)]">
                {type.label}
              </span>
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: type.color }}
              />
              <span className="text-xs text-[var(--color-text-secondary)]">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Clear filters */}
      {activeFilters.length > 0 && (
        <button
          onClick={onClearFilters}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[#2a2a2a] transition-all border border-[#3a3a3a]"
        >
          <RotateCcw className="w-4 h-4" />
          清除筛选
        </button>
      )}

      {/* Stats */}
      <div className="mt-6 pt-5 border-t border-[#3a3a3a]">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-4 h-4 text-[var(--color-accent)]" />
          <h4 className="text-sm font-bold text-[var(--color-text-primary)]">统计信息</h4>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-text-secondary)]">显示物资点</span>
            <span className="font-bold text-[var(--color-text-primary)]">{lootCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-text-secondary)]">总价值</span>
            <span className="font-bold text-[var(--color-accent)]">¥{totalValue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-5 border-t border-[#3a3a3a]">
        <h4 className="text-sm font-bold text-[var(--color-text-primary)] mb-3">稀有度图例</h4>
        <div className="space-y-2">
          {Object.entries(RARITY_LABELS).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2 text-xs">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: RARITY_COLORS[key] }}
              />
              <span className="text-[var(--color-text-secondary)]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
