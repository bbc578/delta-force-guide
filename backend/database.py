import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "delta_force.db")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS maps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            difficulty INTEGER DEFAULT 1,
            image_url TEXT,
            tips TEXT,
            width INTEGER DEFAULT 1000,
            height INTEGER DEFAULT 1000
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS loot_locations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            map_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            rarity TEXT NOT NULL,
            estimated_value INTEGER,
            x REAL NOT NULL,
            y REAL NOT NULL,
            description TEXT,
            spawn_rate REAL,
            FOREIGN KEY (map_id) REFERENCES maps(id)
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS tips (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            difficulty_level INTEGER
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS spawn_points (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            map_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            x REAL NOT NULL,
            y REAL NOT NULL,
            description TEXT,
            FOREIGN KEY (map_id) REFERENCES maps(id)
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS extraction_points (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            map_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            x REAL NOT NULL,
            y REAL NOT NULL,
            type TEXT DEFAULT 'fixed',
            description TEXT,
            FOREIGN KEY (map_id) REFERENCES maps(id)
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS routes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            map_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            difficulty INTEGER DEFAULT 1,
            risk_level TEXT DEFAULT 'low',
            estimated_value INTEGER,
            spawn_point_id INTEGER,
            FOREIGN KEY (map_id) REFERENCES maps(id),
            FOREIGN KEY (spawn_point_id) REFERENCES spawn_points(id)
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS route_waypoints (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            route_id INTEGER NOT NULL,
            order_index INTEGER NOT NULL,
            x REAL NOT NULL,
            y REAL NOT NULL,
            label TEXT,
            FOREIGN KEY (route_id) REFERENCES routes(id)
        )
    """)
    conn.commit()
    conn.close()
