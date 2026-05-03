import axios from 'axios';
import type { MapData, LootLocation, Tip } from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

export const fetchMaps = async (): Promise<MapData[]> => {
  const { data } = await api.get('/maps');
  return data;
};

export const fetchMapById = async (id: number): Promise<MapData> => {
  const { data } = await api.get(`/maps/${id}`);
  return data;
};

export const fetchLootLocations = async (mapId: number, type?: string): Promise<LootLocation[]> => {
  const params: Record<string, string | number> = { map_id: mapId };
  if (type) params.type = type;
  const { data } = await api.get('/loot', { params });
  return data;
};

export const fetchLootTypes = async (): Promise<string[]> => {
  const { data } = await api.get('/loot/types');
  return data;
};

export const fetchTips = async (category?: string): Promise<Tip[]> => {
  const params: Record<string, string> = {};
  if (category) params.category = category;
  const { data } = await api.get('/tips', { params });
  return data;
};
