const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'netflix.db');
const db = new Database(dbPath);

// Enable WAL mode for high concurrency & performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    plan TEXT DEFAULT 'Premium Ultra HD',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS watchlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id TEXT NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, movie_id)
  );

  CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id TEXT NOT NULL,
    rating TEXT NOT NULL CHECK(rating IN ('like', 'dislike')),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, movie_id)
  );
`);

// Seed default demo user if not present
const checkDemo = db.prepare('SELECT id FROM users WHERE email = ?').get('demo@netflix.com');
if (!checkDemo) {
  const hash = bcrypt.hashSync('password123', 10);
  const info = db.prepare(`
    INSERT INTO users (name, email, password_hash, avatar, plan)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    'Sautrik Roy',
    'demo@netflix.com',
    hash,
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    'Premium Ultra HD'
  );

  const demoUserId = info.lastInsertRowid;
  // Seed demo user's watchlist with popular items
  const addWatchlist = db.prepare('INSERT OR IGNORE INTO watchlist (user_id, movie_id) VALUES (?, ?)');
  addWatchlist.run(demoUserId, 'stranger-things');
  addWatchlist.run(demoUserId, 'interstellar');
  addWatchlist.run(demoUserId, 'cyberpunk-edgerunners');

  // Seed demo ratings
  const addRating = db.prepare('INSERT OR IGNORE INTO ratings (user_id, movie_id, rating) VALUES (?, ?, ?)');
  addRating.run(demoUserId, 'stranger-things', 'like');
  addRating.run(demoUserId, 'cyberpunk-edgerunners', 'like');

  console.log('✅ Demo user seeded: demo@netflix.com (Password: password123)');
}

module.exports = db;
