from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from database import init_db, get_db

app = FastAPI(title="三角洲行动新手攻略 API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    init_db()


# --- Maps ---
@app.get("/api/maps")
def list_maps():
    conn = get_db()
    rows = conn.execute("""
        SELECT m.*, COUNT(DISTINCT l.id) as loot_count,
               COUNT(DISTINCT s.id) as spawn_count,
               COUNT(DISTINCT e.id) as extract_count
        FROM maps m
        LEFT JOIN loot_locations l ON m.id = l.map_id
        LEFT JOIN spawn_points s ON m.id = s.map_id
        LEFT JOIN extraction_points e ON m.id = e.map_id
        GROUP BY m.id ORDER BY m.id
    """).fetchall()
    conn.close()
    return [dict(r) for r in rows]


@app.get("/api/maps/{map_id}")
def get_map(map_id: int):
    conn = get_db()
    row = conn.execute("SELECT * FROM maps WHERE id = ?", (map_id,)).fetchone()
    if not row:
        conn.close()
        return {"error": "Map not found"}
    map_data = dict(row)
    loot = conn.execute("SELECT * FROM loot_locations WHERE map_id = ?", (map_id,)).fetchall()
    map_data["loot_locations"] = [dict(r) for r in loot]
    spawns = conn.execute("SELECT * FROM spawn_points WHERE map_id = ?", (map_id,)).fetchall()
    map_data["spawn_points"] = [dict(s) for s in spawns]
    extracts = conn.execute("SELECT * FROM extraction_points WHERE map_id = ?", (map_id,)).fetchall()
    map_data["extraction_points"] = [dict(e) for e in extracts]
    conn.close()
    return map_data


# --- Loot ---
@app.get("/api/loot")
def get_loot(map_id: Optional[int] = Query(None), type: Optional[str] = Query(None)):
    conn = get_db()
    query = "SELECT * FROM loot_locations WHERE 1=1"
    params = []
    if map_id:
        query += " AND map_id = ?"
        params.append(map_id)
    if type:
        query += " AND type = ?"
        params.append(type)
    query += " ORDER BY estimated_value DESC"
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return [dict(r) for r in rows]


@app.get("/api/loot/types")
def get_loot_types():
    conn = get_db()
    rows = conn.execute("SELECT DISTINCT type FROM loot_locations ORDER BY type").fetchall()
    conn.close()
    return [r["type"] for r in rows]


# --- Tips ---
@app.get("/api/tips")
def get_tips(category: Optional[str] = Query(None), difficulty: Optional[int] = Query(None)):
    conn = get_db()
    query = "SELECT * FROM tips WHERE 1=1"
    params = []
    if category:
        query += " AND category = ?"
        params.append(category)
    if difficulty:
        query += " AND difficulty_level = ?"
        params.append(difficulty)
    query += " ORDER BY difficulty_level, id"
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return [dict(r) for r in rows]


@app.get("/api/tips/categories")
def get_tip_categories():
    conn = get_db()
    rows = conn.execute("SELECT DISTINCT category FROM tips ORDER BY category").fetchall()
    conn.close()
    return [r["category"] for r in rows]


# --- Spawn Points ---
@app.get("/api/spawns")
def get_spawns(map_id: Optional[int] = Query(None)):
    conn = get_db()
    query = "SELECT * FROM spawn_points WHERE 1=1"
    params = []
    if map_id:
        query += " AND map_id = ?"
        params.append(map_id)
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return [dict(r) for r in rows]


# --- Extraction Points ---
@app.get("/api/extractions")
def get_extractions(map_id: Optional[int] = Query(None)):
    conn = get_db()
    query = "SELECT * FROM extraction_points WHERE 1=1"
    params = []
    if map_id:
        query += " AND map_id = ?"
        params.append(map_id)
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return [dict(r) for r in rows]


# --- Routes ---
@app.get("/api/routes")
def get_routes(map_id: Optional[int] = Query(None), difficulty: Optional[int] = Query(None)):
    conn = get_db()
    query = """
        SELECT r.*, sp.name as spawn_name, sp.x as spawn_x, sp.y as spawn_y
        FROM routes r
        LEFT JOIN spawn_points sp ON r.spawn_point_id = sp.id
        WHERE 1=1
    """
    params = []
    if map_id:
        query += " AND r.map_id = ?"
        params.append(map_id)
    if difficulty:
        query += " AND r.difficulty = ?"
        params.append(difficulty)
    query += " ORDER BY r.difficulty, r.estimated_value DESC"
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return [dict(r) for r in rows]


@app.get("/api/routes/{route_id}")
def get_route_detail(route_id: int):
    conn = get_db()
    route = conn.execute("""
        SELECT r.*, sp.name as spawn_name, sp.x as spawn_x, sp.y as spawn_y
        FROM routes r
        LEFT JOIN spawn_points sp ON r.spawn_point_id = sp.id
        WHERE r.id = ?
    """, (route_id,)).fetchone()
    if not route:
        conn.close()
        return {"error": "Route not found"}
    route_data = dict(route)
    waypoints = conn.execute(
        "SELECT * FROM route_waypoints WHERE route_id = ? ORDER BY order_index",
        (route_id,)
    ).fetchall()
    route_data["waypoints"] = [dict(w) for w in waypoints]
    conn.close()
    return route_data


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
