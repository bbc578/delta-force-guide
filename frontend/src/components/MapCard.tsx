import { Link } from 'react-router-dom';
import { MapPin, Crosshair, Flag, LogOut } from 'lucide-react';
import type { MapData } from '../types';
import { MAP_DIFFICULTY_COLORS, DIFFICULTY_LABELS } from '../types';

export default function MapCard({ map }: { map: MapData }) {
  const diffColor = MAP_DIFFICULTY_COLORS[map.difficulty] || '#9ca3af';
  const diffLabel = DIFFICULTY_LABELS[map.difficulty] || '未知';

  return (
    <Link
      to={`/maps/${map.id}`}
      className="group block bg-[#242424] rounded-xl border border-[#3a3a3a] overflow-hidden hover:border-[var(--color-accent)]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--color-accent)]/10 hover:-translate-y-1"
    >
      <div className="relative h-48 bg-gradient-to-br from-[#2a3a1a] to-[#1a2a0a] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <MapPin className="w-16 h-16 text-[var(--color-olive-light)] opacity-30 group-hover:scale-110 transition-transform duration-300" />
        </div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(74,93,35,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(74,93,35,0.3) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: diffColor }}>
            {diffLabel}
          </span>
        </div>
        <div className="absolute inset-0 bg-[var(--color-accent)]/0 group-hover:bg-[var(--color-accent)]/10 transition-all duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[var(--color-accent)] font-bold text-lg flex items-center gap-2">
            查看详情 <Crosshair className="w-5 h-5" />
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
          {map.name}
        </h3>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)] line-clamp-2">
          {map.description}
        </p>
        <div className="mt-4 flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
          <span className="flex items-center gap-1">
            <Crosshair className="w-3.5 h-3.5" />
            {map.loot_count ?? '?'} 物资
          </span>
          <span className="flex items-center gap-1">
            <Flag className="w-3.5 h-3.5" />
            {map.spawn_count ?? '?'} 出生
          </span>
          <span className="flex items-center gap-1">
            <LogOut className="w-3.5 h-3.5" />
            {map.extract_count ?? '?'} 撤离
          </span>
        </div>
      </div>
    </Link>
  );
}
