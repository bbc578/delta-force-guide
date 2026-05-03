from pydantic import BaseModel
from typing import Optional, List


class MapSummary(BaseModel):
    id: int
    name: str
    description: str
    difficulty: int
    image_url: Optional[str] = None
    loot_count: int = 0


class LootLocation(BaseModel):
    id: int
    map_id: int
    name: str
    type: str
    rarity: str
    estimated_value: Optional[int] = None
    x: float
    y: float
    description: Optional[str] = None
    spawn_rate: Optional[float] = None


class MapDetail(BaseModel):
    id: int
    name: str
    description: str
    difficulty: int
    image_url: Optional[str] = None
    tips: Optional[str] = None
    width: int
    height: int
    loot_locations: List[LootLocation] = []


class Tip(BaseModel):
    id: int
    category: str
    title: str
    content: str
    difficulty_level: Optional[int] = None
