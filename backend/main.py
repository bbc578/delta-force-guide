from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from database import init_db, get_db

app = FastAPI(title="三角洲行动新手攻略 API", version="1.0.0")

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
        SELECT m.*, COUNT(l.id) as loot_count
        FROM maps m LEFT JOIN loot_locations l ON m.id = l.map_id
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
    loot = conn.execute(
        "SELECT * FROM loot_locations WHERE map_id = ?", (map_id,)
    ).fetchall()
    map_data["loot_locations"] = [dict(r) for r in loot]
    conn.close()
    return map_data


# --- Loot ---
@app.get("/api/loot")
def get_loot(
    map_id: Optional[int] = Query(None),
    type: Optional[str] = Query(None),
):
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
def get_tips(
    category: Optional[str] = Query(None),
    difficulty: Optional[int] = Query(None),
):
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
