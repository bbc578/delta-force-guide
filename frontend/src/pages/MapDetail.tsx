import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { ArrowLeft, Loader2, Info } from 'lucide-react';
import type { MapData, LootLocation } from '../types';
import { DIFFICULTY_LABELS, MAP_DIFFICULTY_COLORS } from '../types';
import { fetchMapById } from '../api';
import LootMarker from '../components/LootMarker';
import FilterSidebar from '../components/FilterSidebar';
import 'leaflet/dist/leaflet.css';

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100);
  }, [map]);
  return null;
}

// Each map gets a base location, loot x,y (0-1000) are offsets in degrees
const MAP_CENTERS: Record<number, [number, number]> = {
  1: [35.0, 105.0],
  2: [38.0, 110.0],
  3: [32.0, 118.0],
  4: [30.0, 120.0],
  5: [28.0, 115.0],
};

function coordToLatLng(x: number, y: number, mapId: number): [number, number] {
  const base = MAP_CENTERS[mapId] || [35.0, 105.0];
  // x -> lng offset, y -> lat offset (invert y so 0 is bottom)
  return [base[0] + (1000 - y) * 0.005, base[1] + x * 0.005];
}

export default function MapDetail() {
  const { id } = useParams<{ id: string }>();
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [lootLocations, setLootLocations] = useState<LootLocation[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const mapId = Number(id);

  useEffect(() => {
    if (!mapId) return;
    setLoading(true);
    setError(null);
    fetchMapById(mapId)
      .then((map) => {
        setMapData(map);
        setLootLocations(map.loot_locations || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [mapId]);

  const handleToggleFilter = useCallback((type: string) => {
    setActiveFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }, []);

  const handleClearFilters = useCallback(() => setActiveFilters([]), []);

  const filteredLoot =
    activeFilters.length === 0
      ? lootLocations
      : lootLocations.filter((l) => activeFilters.includes(l.type));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-[var(--color-accent)] animate-spin" />
      </div>
    );
  }

  if (error || !mapData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-[var(--color-text-secondary)]">加载失败: {error || '地图未找到'}</p>
        <Link to="/" className="text-[var(--color-accent)] hover:underline">返回首页</Link>
      </div>
    );
  }

  const center = MAP_CENTERS[mapId] || [35.0, 105.0];

  return (
    <div className="animate-fade-in">
      <div className="bg-[#242424] border-b border-[#3a3a3a]">
        <div className="max-w-full mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回
            </Link>
            <div className="h-4 w-px bg-[#3a3a3a]" />
            <h1 className="text-lg font-bold text-[var(--color-text-primary)]">{mapData.name}</h1>
            <span
              className="px-2 py-0.5 rounded text-xs font-bold text-white"
              style={{ backgroundColor: MAP_DIFFICULTY_COLORS[mapData.difficulty] }}
            >
              {DIFFICULTY_LABELS[mapData.difficulty]}
            </span>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="ml-auto md:hidden px-3 py-1.5 rounded-lg text-sm bg-[#2a2a2a] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[#3a3a3a]"
            >
              {sidebarOpen ? '隐藏筛选' : '显示筛选'}
            </button>
          </div>
        </div>
      </div>

      {mapData.tips && (
        <div className="bg-[#1a2a0a] border-b border-[#3a3a3a] px-4 sm:px-6 py-3">
          <div className="flex items-start gap-2 max-w-full">
            <Info className="w-4 h-4 text-[var(--color-accent)] mt-0.5 flex-shrink-0" />
            <p className="text-sm text-[var(--color-text-secondary)]">{mapData.tips}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row h-[calc(100vh-120px)]">
        {sidebarOpen && (
          <div className="w-full md:w-72 lg:w-80 flex-shrink-0 p-4 overflow-y-auto bg-[var(--color-bg-primary)] border-r border-[#3a3a3a]">
            <FilterSidebar
              activeFilters={activeFilters}
              onToggleFilter={handleToggleFilter}
              onClearFilters={handleClearFilters}
              lootCount={filteredLoot.length}
              lootLocations={lootLocations}
            />
          </div>
        )}

        <div className="flex-1 relative">
          <MapContainer
            center={center}
            zoom={10}
            className="w-full h-full"
            zoomControl={true}
          >
            <MapResizer />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredLoot.map((loot) => {
              const pos = coordToLatLng(loot.x, loot.y, mapId);
              return <LootMarker key={loot.id} loot={loot} position={pos} />;
            })}
          </MapContainer>

          <div className="absolute bottom-4 right-4 z-[1000] bg-[#242424]/95 backdrop-blur-sm rounded-lg border border-[#3a3a3a] px-4 py-3">
            <p className="text-xs font-bold text-[var(--color-text-primary)] mb-2">
              物资点位: {filteredLoot.length}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">点击标记查看详情</p>
          </div>
        </div>
      </div>
    </div>
  );
}
