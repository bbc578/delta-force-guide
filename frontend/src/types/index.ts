export interface MapData {
  id: number;
  name: string;
  description: string;
  difficulty: number;
  image_url: string;
  tips: string;
  width: number;
  height: number;
  loot_count?: number;
  spawn_count?: number;
  extract_count?: number;
  loot_locations?: LootLocation[];
  spawn_points?: SpawnPoint[];
  extraction_points?: ExtractionPoint[];
}

export interface LootLocation {
  id: number;
  map_id: number;
  name: string;
  type: string;
  rarity: string;
  estimated_value: number;
  x: number;
  y: number;
  description: string;
  spawn_rate: number;
}

export type LootType = '武器' | '弹药' | '医疗' | '钥匙' | '电子' | '贵重物品';

export interface LootTypeConfig {
  key: string;
  label: string;
  color: string;
  icon: string;
}

export const LOOT_TYPES: LootTypeConfig[] = [
  { key: '武器', label: '武器', color: '#ef4444', icon: '🔫' },
  { key: '弹药', label: '弹药', color: '#f59e0b', icon: '🎯' },
  { key: '医疗', label: '医疗', color: '#22c55e', icon: '💊' },
  { key: '钥匙', label: '钥匙', color: '#3b82f6', icon: '🔑' },
  { key: '电子', label: '电子', color: '#8b5cf6', icon: '💻' },
  { key: '贵重物品', label: '贵重物品', color: '#d4a017', icon: '💎' },
];

export const RARITY_COLORS: Record<string, string> = {
  '普通': '#9ca3af',
  '稀有': '#3b82f6',
  '史诗': '#8b5cf6',
  '传说': '#d4a017',
};

export const RARITY_LABELS: Record<string, string> = {
  '普通': '普通',
  '稀有': '稀有',
  '史诗': '史诗',
  '传说': '传说',
};

export interface Tip {
  id: number;
  title: string;
  content: string;
  category: string;
  difficulty_level: number;
}

export interface SpawnPoint {
  id: number;
  map_id: number;
  name: string;
  x: number;
  y: number;
  description: string;
}

export interface ExtractionPoint {
  id: number;
  map_id: number;
  name: string;
  x: number;
  y: number;
  type: string;
  description: string;
}

export interface Route {
  id: number;
  map_id: number;
  name: string;
  description: string;
  difficulty: number;
  risk_level: string;
  estimated_value: number;
  spawn_point_id: number;
  spawn_name?: string;
  spawn_x?: number;
  spawn_y?: number;
}

export interface RouteWaypoint {
  id: number;
  route_id: number;
  order_index: number;
  x: number;
  y: number;
  label: string;
}

export interface RouteDetail extends Route {
  waypoints: RouteWaypoint[];
}

export const TIP_CATEGORIES: Record<string, string> = {
  '移动': '🏃 移动技巧',
  '战斗': '⚔️ 战斗技巧',
  '搜刮': '🎒 搜刮技巧',
  '意识': '🧠 意识培养',
  '装备': '🛡️ 装备选择',
  '策略': '🗺️ 战略战术',
};

export const DIFFICULTY_LABELS: Record<number, string> = {
  1: '新手',
  2: '入门',
  3: '进阶',
  4: '高级',
  5: '专家',
};

export const MAP_DIFFICULTY_COLORS: Record<number, string> = {
  1: '#22c55e',
  2: '#84cc16',
  3: '#f59e0b',
  4: '#f97316',
  5: '#ef4444',
};

export const RISK_COLORS: Record<string, string> = {
  'low': '#22c55e',
  'medium': '#f59e0b',
  'high': '#ef4444',
  'very_high': '#dc2626',
};

export const RISK_LABELS: Record<string, string> = {
  'low': '低风险',
  'medium': '中风险',
  'high': '高风险',
  'very_high': '极高风险',
};
