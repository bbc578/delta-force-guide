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
    conn.commit()
    conn.close()
