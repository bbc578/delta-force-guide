import type { Tip } from '../types';
import { TIP_CATEGORIES, DIFFICULTY_LABELS } from '../types';
import { Shield } from 'lucide-react';

const DIFFICULTY_COLORS: Record<number, string> = {
  1: '#22c55e',
  2: '#84cc16',
  3: '#f59e0b',
  4: '#f97316',
  5: '#ef4444',
};

export default function TipCard({ tip }: { tip: Tip }) {
  const diffColor = DIFFICULTY_COLORS[tip.difficulty_level] || '#9ca3af';
  const diffLabel = DIFFICULTY_LABELS[tip.difficulty_level] || '未知';

  return (
    <div className="bg-[#242424] rounded-xl border border-[#3a3a3a] p-5 hover:border-[var(--color-accent)]/30 transition-all duration-300 group">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--color-accent)]/20 transition-colors">
          <Shield className="w-5 h-5 text-[var(--color-accent)]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#3a3a3a] text-[var(--color-text-secondary)]">
              {TIP_CATEGORIES[tip.category] || tip.category}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
              style={{ backgroundColor: diffColor }}
            >
              {diffLabel}
            </span>
          </div>
          <h3 className="font-bold text-[var(--color-text-primary)] mt-2 group-hover:text-[var(--color-accent)] transition-colors">
            {tip.title}
          </h3>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">
            {tip.content}
          </p>
        </div>
      </div>
    </div>
  );
}
