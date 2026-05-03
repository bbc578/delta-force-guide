import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Crosshair, Map, BookOpen, ChevronRight, Zap, Target, Shield } from 'lucide-react';
import type { MapData } from '../types';
import { fetchMaps } from '../api';
import MapCard from '../components/MapCard';

export default function Home() {
  const [maps, setMaps] = useState<MapData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaps()
      .then(setMaps)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a0a] via-[var(--color-bg-primary)] to-[#1a1a2a]" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(74,93,35,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(74,93,35,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 mb-6">
                <Zap className="w-4 h-4 text-[var(--color-accent)]" />
                <span className="text-sm text-[var(--color-accent)] font-medium">新手必备攻略</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black leading-tight">
                <span className="text-[var(--color-accent)]">三角洲行动</span>
                <br />
                <span className="text-[var(--color-text-primary)]">新兵指南</span>
              </h1>
              <p className="mt-6 text-lg text-[var(--color-text-secondary)] max-w-lg leading-relaxed">
                掌握每张地图的高价值物资点位，学习实战技巧，快速成长为精英战士。
                从搜刮路线到战术策略，助你在战场上无往不利。
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to="/maps"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-accent)] text-[#1a1a1a] font-bold hover:bg-[var(--color-accent)]/90 transition-all animate-pulse-glow"
                >
                  <Map className="w-5 h-5" />
                  浏览地图
                </Link>
                <Link
                  to="/guides"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-[#3a3a3a] text-[var(--color-text-primary)] font-bold hover:bg-[#242424] hover:border-[var(--color-accent)]/30 transition-all"
                >
                  <BookOpen className="w-5 h-5" />
                  查看攻略
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute inset-0 bg-[var(--color-olive)]/20 rounded-full blur-3xl" />
                <div className="relative w-full h-full flex items-center justify-center">
                  <Crosshair className="w-48 h-48 md:w-64 md:h-64 text-[var(--color-accent)] opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Map, title: '交互式地图', desc: '标注高价值物资点位，支持筛选和搜索', color: '#22c55e' },
            { icon: Target, title: '详细攻略', desc: '从新手到高手的全面进阶指南', color: '#3b82f6' },
            { icon: Shield, title: '实战技巧', desc: '经过验证的生存与战斗策略', color: '#d4a017' },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-[#242424] rounded-xl border border-[#3a3a3a] p-6 hover:border-[var(--color-accent)]/30 transition-all duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: `${feature.color}15` }}
              >
                <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
              </div>
              <h3 className="font-bold text-lg text-[var(--color-text-primary)]">{feature.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Maps section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">地图一览</h2>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">选择地图查看详细物资分布</p>
          </div>
          <Link
            to="/maps"
            className="hidden sm:flex items-center gap-1 text-sm text-[var(--color-accent)] hover:underline"
          >
            查看全部 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#242424] rounded-xl border border-[#3a3a3a] h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {maps.map((map) => (
              <MapCard key={map.id} map={map} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
