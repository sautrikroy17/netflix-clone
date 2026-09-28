const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const dbDir = process.env.VERCEL ? '/tmp' : path.join(__dirname, '..', 'database');
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
    avatar TEXT DEFAULT '/assets/avatars/avatar-red.svg',
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

  CREATE TABLE IF NOT EXISTS playback_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id TEXT NOT NULL,
    progress_seconds REAL NOT NULL DEFAULT 0,
    duration_seconds REAL NOT NULL DEFAULT 0,
    completed INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, movie_id)
  );

  CREATE TABLE IF NOT EXISTS user_preferences (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    audio_language TEXT DEFAULT 'en-orig',
    subtitle_language TEXT DEFAULT 'en',
    playback_speed REAL DEFAULT 1.0,
    video_quality TEXT DEFAULT 'auto',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    avatar TEXT NOT NULL,
    is_kids INTEGER DEFAULT 0,
    favorite_genres TEXT DEFAULT '["Trending","Action","Sci-Fi"]',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    movie_id TEXT,
    issue_type TEXT NOT NULL,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Safe migrations to add profile_id column if not exists
try {
  db.exec("ALTER TABLE watchlist ADD COLUMN profile_id INTEGER REFERENCES profiles(id) ON DELETE CASCADE");
} catch (e) {}
try {
  db.exec("ALTER TABLE ratings ADD COLUMN profile_id INTEGER REFERENCES profiles(id) ON DELETE CASCADE");
} catch (e) {}
try {
  db.exec("ALTER TABLE playback_history ADD COLUMN profile_id INTEGER REFERENCES profiles(id) ON DELETE CASCADE");
} catch (e) {}
try {
  db.exec("ALTER TABLE user_preferences ADD COLUMN video_quality TEXT DEFAULT 'auto'");
} catch (e) {}

// Seed default demo user if not present
const checkDemo = db.prepare('SELECT id FROM users WHERE email = ?').get('demo@netflix.com');
let demoUserId;

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

  demoUserId = info.lastInsertRowid;

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
} else {
  demoUserId = checkDemo.id;
}

// Seed demo playback history & preferences
const checkPlayback = db.prepare('SELECT id FROM playback_history WHERE user_id = ?').get(demoUserId);
if (!checkPlayback) {
  const addPlayback = db.prepare(`
    INSERT OR REPLACE INTO playback_history (user_id, movie_id, progress_seconds, duration_seconds, completed)
    VALUES (?, ?, ?, ?, ?)
  `);
  addPlayback.run(demoUserId, 'stranger-things', 52, 183, 0);
  addPlayback.run(demoUserId, 'squid-game', 85, 183, 0);
  addPlayback.run(demoUserId, 'interstellar', 34, 183, 0);

  const addPref = db.prepare(`
    INSERT OR REPLACE INTO user_preferences (user_id, audio_language, subtitle_language, playback_speed)
    VALUES (?, ?, ?, ?)
  `);
  addPref.run(demoUserId, 'hi-dub', 'en', 1.0);
}

// Seed demo profiles if none exist
const checkProfiles = db.prepare('SELECT id FROM profiles WHERE user_id = ?').all(demoUserId);
if (!checkProfiles || checkProfiles.length === 0) {
  const addProfile = db.prepare(`
    INSERT INTO profiles (user_id, name, avatar, is_kids, favorite_genres)
    VALUES (?, ?, ?, ?, ?)
  `);

  addProfile.run(
    demoUserId,
    'Sautrik',
    '/assets/avatars/avatar-red.svg',
    0,
    JSON.stringify(['Trending', 'Action', 'Sci-Fi', 'Indian Mega Blockbusters'])
  );

  addProfile.run(
    demoUserId,
    'Kids',
    '/assets/avatars/avatar-kids.svg',
    1,
    JSON.stringify(['Animation', 'Family', 'Anime', 'Adventure'])
  );

  addProfile.run(
    demoUserId,
    'Cinema Buff',
    '/assets/avatars/avatar-blue.svg',
    0,
    JSON.stringify(['Crime Thriller', 'Mind-Bending', 'Period Piece', 'Drama'])
  );

  console.log('✅ Default profiles seeded for demo user: Sautrik, Kids, Cinema Buff');
}

module.exports = db;
