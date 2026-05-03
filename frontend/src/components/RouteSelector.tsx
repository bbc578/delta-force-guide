import type { Route } from '../types';
import { RISK_COLORS, RISK_LABELS, DIFFICULTY_LABELS } from '../types';
import { Route as RouteIcon, ChevronRight } from 'lucide-react';

interface Props {
  routes: Route[];
  selectedRouteId: number | null;
  onSelectRoute: (id: number | null) => void;
}

export default function RouteSelector({ routes, selectedRouteId, onSelectRoute }: Props) {
  if (routes.length === 0) return null;

  return (
    <div className="bg-[#242424] rounded-xl border border-[#3a3a3a] p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <RouteIcon className="w-4 h-4 text-[var(--color-accent)]" />
        <h3 className="text-sm font-bold text-[var(--color-text-primary)]">推荐路线</h3>
      </div>
      <div className="space-y-2">
        {routes.map((route) => {
          const isSelected = selectedRouteId === route.id;
          const riskColor = RISK_COLORS[route.risk_level] || '#9ca3af';
          const riskLabel = RISK_LABELS[route.risk_level] || route.risk_level;
          const diffLabel = DIFFICULTY_LABELS[route.difficulty] || '未知';

          return (
            <button
              key={route.id}
              onClick={() => onSelectRoute(isSelected ? null : route.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                isSelected
                  ? 'bg-[#3a3a3a] border border-[var(--color-accent)]/30'
                  : 'bg-[#2a2a2a] border border-transparent hover:bg-[#3a3a3a]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-[var(--color-text-primary)] text-xs">
                  {route.name}
                </span>
                <ChevronRight className={`w-3 h-3 text-[var(--color-text-secondary)] transition-transform ${isSelected ? 'rotate-90' : ''}`} />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
                  style={{ backgroundColor: riskColor }}
                >
                  {riskLabel}
                </span>
                <span className="text-[10px] text-[var(--color-text-secondary)]">
                  {diffLabel}
                </span>
                <span className="text-[10px] text-[#d4a017]">
                  💰 {(route.estimated_value / 10000).toFixed(1)}万
                </span>
              </div>
              {isSelected && (
                <p className="text-[11px] text-[var(--color-text-secondary)] mt-2 leading-relaxed">
                  {route.description}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
