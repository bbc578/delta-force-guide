import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Info, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import type { MapData, LootLocation, SpawnPoint, ExtractionPoint, Route, RouteDetail } from '../types';
import { LOOT_TYPES, RARITY_COLORS, RARITY_LABELS, DIFFICULTY_LABELS, MAP_DIFFICULTY_COLORS } from '../types';
import { fetchMapById, fetchRoutes, fetchRouteDetail } from '../api';
import LootMarker from '../components/LootMarker';
import SpawnMarker from '../components/SpawnMarker';
import ExtractionMarker from '../components/ExtractionMarker';
import RouteOverlay from '../components/RouteOverlay';
import RouteSelector from '../components/RouteSelector';
import FilterSidebar from '../components/FilterSidebar';

export default function MapDetail() {
  const { id } = useParams<{ id: string }>();
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [lootLocations, setLootLocations] = useState<LootLocation[]>([]);
  const [spawnPoints, setSpawnPoints] = useState<SpawnPoint[]>([]);
  const [extractionPoints, setExtractionPoints] = useState<ExtractionPoint[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [activeRouteDetail, setActiveRouteDetail] = useState<RouteDetail | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedLoot, setSelectedLoot] = useState<LootLocation | null>(null);
  const [showSpawns, setShowSpawns] = useState(true);
  const [showExtractions, setShowExtractions] = useState(true);
  const [zoom, setZoom] = useState(1);
  const mapRef = useRef<HTMLDivElement>(null);

  const mapId = Number(id);

  useEffect(() => {
    if (!mapId) return;
    setLoading(true);
    setError(null);
    setSelectedLoot(null);
    setActiveRouteDetail(null);

    Promise.all([
      fetchMapById(mapId),
      fetchRoutes(mapId),
    ])
      .then(([map, routeList]) => {
        setMapData(map);
        setLootLocations(map.loot_locations || []);
        setSpawnPoints(map.spawn_points || []);
        setExtractionPoints(map.extraction_points || []);
        setRoutes(routeList);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [mapId]);

  const handleSelectRoute = useCallback(async (routeId: number | null) => {
    if (!routeId) {
      setActiveRouteDetail(null);
      return;
    }
    try {
      const detail = await fetchRouteDetail(routeId);
      setActiveRouteDetail(detail);
    } catch (err) {
      console.error('Failed to load route detail:', err);
    }
  }, []);

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

  // Map zone labels
  const MAP_ZONES: Record<number, { name: string; x: number; y: number }[]> = {
    1: [
      { name: '行政东楼', x: 25, y: 25 }, { name: '行政西楼', x: 75, y: 25 },
      { name: '水坝主体', x: 50, y: 50 }, { name: '河道', x: 50, y: 80 },
      { name: '服务器机房', x: 35, y: 40 }, { name: '瞭望塔', x: 85, y: 15 },
    ],
    2: [
      { name: '坠机之地', x: 40, y: 30 }, { name: '运输机', x: 45, y: 35 },
      { name: '皇后酒店', x: 60, y: 65 }, { name: '营地', x: 25, y: 45 },
      { name: '溪谷', x: 70, y: 50 }, { name: '山区', x: 15, y: 15 },
    ],
    3: [
      { name: '博物馆', x: 50, y: 40 }, { name: '银行', x: 30, y: 65 },
      { name: '警察局', x: 45, y: 30 }, { name: '医院', x: 25, y: 50 },
      { name: '当铺', x: 75, y: 55 }, { name: '港口', x: 15, y: 50 },
    ],
    4: [
      { name: '中控楼', x: 55, y: 45 }, { name: '黑室', x: 30, y: 30 },
      { name: '蓝室', x: 70, y: 65 }, { name: '离心机室', x: 55, y: 25 },
      { name: '发射区', x: 85, y: 15 }, { name: '仓库区', x: 10, y: 50 },
    ],
    5: [
      { name: '核心区', x: 50, y: 50 }, { name: '行政区', x: 30, y: 35 },
      { name: '牢房区', x: 65, y: 65 }, { name: '港口', x: 85, y: 70 },
      { name: '哨塔', x: 15, y: 15 }, { name: '外场', x: 50, y: 10 },
    ],
  };

  const zones = MAP_ZONES[mapId] || [];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-[#242424] border-b border-[#3a3a3a]">
        <div className="max-w-full mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
              <ArrowLeft className="w-4 h-4" /> 返回
            </Link>
            <div className="h-4 w-px bg-[#3a3a3a]" />
            <h1 className="text-lg font-bold text-[var(--color-text-primary)]">{mapData.name}</h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold text-white" style={{ backgroundColor: MAP_DIFFICULTY_COLORS[mapData.difficulty] }}>
              {DIFFICULTY_LABELS[mapData.difficulty]}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={() => setShowSpawns(!showSpawns)} className={`px-2 py-1 rounded text-xs border ${showSpawns ? 'bg-[#22c55e22] border-[#22c55e44] text-[#22c55e]' : 'bg-[#2a2a2a] border-[#3a3a3a] text-[var(--color-text-secondary)]'}`}>
                出生点
              </button>
              <button onClick={() => setShowExtractions(!showExtractions)} className={`px-2 py-1 rounded text-xs border ${showExtractions ? 'bg-[#ef444422] border-[#ef444444] text-[#ef4444]' : 'bg-[#2a2a2a] border-[#3a3a3a] text-[var(--color-text-secondary)]'}`}>
                撤离点
              </button>
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden px-3 py-1.5 rounded-lg text-sm bg-[#2a2a2a] text-[var(--color-text-secondary)] border border-[#3a3a3a]">
                {sidebarOpen ? '隐藏' : '显示'}
              </button>
            </div>
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
            <RouteSelector
              routes={routes}
              selectedRouteId={activeRouteDetail?.id ?? null}
              onSelectRoute={handleSelectRoute}
            />
            <FilterSidebar
              activeFilters={activeFilters}
              onToggleFilter={handleToggleFilter}
              onClearFilters={handleClearFilters}
              lootCount={filteredLoot.length}
              lootLocations={lootLocations}
            />
          </div>
        )}

        <div className="flex-1 relative overflow-hidden bg-[#0d1117]">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button onClick={() => setZoom((z) => Math.min(z + 0.2, 2))} className="w-8 h-8 rounded bg-[#242424] border border-[#3a3a3a] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={() => setZoom((z) => Math.max(z - 0.2, 0.6))} className="w-8 h-8 rounded bg-[#242424] border border-[#3a3a3a] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
              <ZoomOut className="w-4 h-4" />
            </button>
            <button onClick={() => setZoom(1)} className="w-8 h-8 rounded bg-[#242424] border border-[#3a3a3a] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute bottom-4 right-4 z-10 bg-[#242424]/95 backdrop-blur-sm rounded-lg border border-[#3a3a3a] px-4 py-3">
            <div className="space-y-1 text-[10px]">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#22c55e] clip-path-triangle" /> <span className="text-[var(--color-text-secondary)]">出生点</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#ef4444] rotate-45" /> <span className="text-[var(--color-text-secondary)]">撤离点</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#d4a017]" /> <span className="text-[var(--color-text-secondary)]">物资点</span></div>
            </div>
          </div>

          <div ref={mapRef} className="w-full h-full relative" style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.2s' }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(74,93,35,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(74,93,35,0.3) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

            {zones.map((zone) => (
              <div key={zone.name} className="absolute pointer-events-none select-none" style={{ left: `${zone.x}%`, top: `${zone.y}%`, transform: 'translate(-50%, -50%)' }}>
                <span className="text-[var(--color-text-secondary)] text-xs font-medium opacity-60 bg-[#0d1117]/80 px-2 py-1 rounded">{zone.name}</span>
              </div>
            ))}

            {/* SVG layer for routes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              {activeRouteDetail && (
                <RouteOverlay route={activeRouteDetail} isActive={true} onClick={() => {}} />
              )}
            </svg>

            {/* Spawn points */}
            {showSpawns && spawnPoints.map((spawn) => (
              <SpawnMarker key={spawn.id} spawn={spawn} isHighlighted={activeRouteDetail?.spawn_point_id === spawn.id} />
            ))}

            {/* Extraction points */}
            {showExtractions && extractionPoints.map((extract) => (
              <ExtractionMarker key={extract.id} extraction={extract} />
            ))}

            {/* Loot markers */}
            {filteredLoot.map((loot) => (
              <LootMarker key={loot.id} loot={loot} isSelected={selectedLoot?.id === loot.id} onClick={() => setSelectedLoot(selectedLoot?.id === loot.id ? null : loot)} />
            ))}
          </div>

          {selectedLoot && (
            <div className="absolute bottom-4 left-4 z-10 bg-[#242424]/95 backdrop-blur-sm rounded-lg border border-[#3a3a3a] p-4 max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{LOOT_TYPES.find((t) => t.key === selectedLoot.type)?.icon || '📦'}</span>
                <span className="font-bold text-[var(--color-text-primary)]">{selectedLoot.name}</span>
              </div>
              <div className="flex gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-xs font-bold text-white" style={{ backgroundColor: LOOT_TYPES.find((t) => t.key === selectedLoot.type)?.color || '#9ca3af' }}>{selectedLoot.type}</span>
                <span className="px-2 py-0.5 rounded text-xs font-bold text-white" style={{ backgroundColor: RARITY_COLORS[selectedLoot.rarity] || '#9ca3af' }}>{RARITY_LABELS[selectedLoot.rarity] || selectedLoot.rarity}</span>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] mb-2">{selectedLoot.description}</p>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-accent)]">💰 {selectedLoot.estimated_value.toLocaleString()}</span>
                <span className="text-[var(--color-text-secondary)]">🎯 {selectedLoot.spawn_rate}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
