import { useEffect, useState } from 'react';
import { BookOpen, Loader2, Filter } from 'lucide-react';
import type { Tip } from '../types';
import { TIP_CATEGORIES, DIFFICULTY_LABELS } from '../types';
import { fetchTips } from '../api';
import TipCard from '../components/TipCard';

export default function Guides() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);

  useEffect(() => {
    fetchTips()
      .then(setTips)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = tips.filter((t) => {
    if (selectedCategory && t.category !== selectedCategory) return false;
    if (selectedDifficulty && t.difficulty_level !== selectedDifficulty) return false;
    return true;
  });

  return (
    <div className="animate-fade-in max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-accent)]/10 mb-4">
          <BookOpen className="w-7 h-7 text-[var(--color-accent)]" />
        </div>
        <h1 className="text-3xl font-black text-[var(--color-text-primary)]">新手攻略</h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">从基础到进阶的全面指南，助你快速上手</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--color-text-secondary)]" />
          <span className="text-sm text-[var(--color-text-secondary)]">筛选:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(TIP_CATEGORIES).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === key
                  ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] border border-[var(--color-accent)]/30'
                  : 'bg-[#242424] text-[var(--color-text-secondary)] border border-[#3a3a3a] hover:border-[var(--color-accent)]/20'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="h-px sm:h-auto sm:w-px bg-[#3a3a3a]" />
        <div className="flex flex-wrap gap-2">
          {Object.entries(DIFFICULTY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedDifficulty(selectedDifficulty === Number(key) ? null : Number(key))}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedDifficulty === Number(key)
                  ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] border border-[var(--color-accent)]/30'
                  : 'bg-[#242424] text-[var(--color-text-secondary)] border border-[#3a3a3a] hover:border-[var(--color-accent)]/20'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[var(--color-accent)] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-text-secondary)]">
          暂无符合条件的攻略
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((tip, i) => (
            <div key={tip.id} style={{ animationDelay: `${i * 50}ms` }} className="animate-fade-in">
              <TipCard tip={tip} />
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <p className="mt-8 text-center text-sm text-[var(--color-text-secondary)]">
          共 {filtered.length} 条攻略
        </p>
      )}
    </div>
  );
}
