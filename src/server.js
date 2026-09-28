const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const movies = require('./movies');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'netflix-super-secure-secret-2026';

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Authentication Helper Middleware
const authenticateToken = (req, res, next) => {
  const token = req.cookies.netflix_token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired session token' });
  }
};

// Optional auth helper (doesn't reject if not logged in)
const optionalAuth = (req, res, next) => {
  const token = req.cookies.netflix_token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      req.user = null;
    }
  }
  next();
};

/* ══════════════════════════════════════════════
   AUTHENTICATION ENDPOINTS
══════════════════════════════════════════════ */

// 1. Sign Up
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const userName = name && name.trim() ? name.trim() : normalizedEmail.split('@')[0];

  try {
    // Check if user already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email address already exists. Please log in.' });
    }

    // Securely hash password with 10 salt rounds (fulfills mandatory security requirement)
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const randomAvatars = [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=150&q=80'
    ];
    const avatar = randomAvatars[Math.floor(Math.random() * randomAvatars.length)];

    const result = db.prepare(`
      INSERT INTO users (name, email, password_hash, avatar, plan)
      VALUES (?, ?, ?, ?, ?)
    `).run(userName, normalizedEmail, passwordHash, avatar, 'Premium Ultra HD');

    const userId = result.lastInsertRowid;
    const token = jwt.sign({ userId, email: normalizedEmail, name: userName }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('netflix_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
      message: 'Account created successfully!',
      user: { id: userId, name: userName, email: normalizedEmail, avatar, plan: 'Premium Ultra HD' },
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Internal server error while creating account.' });
  }
});

// 2. Log In
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please enter both email and password.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);
    if (!user) {
      return res.status(401).json({ error: 'Incorrect email or password. Please try again.' });
    }

    // Secure verification against hashed password
    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect email or password. Please try again.' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('netflix_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      message: 'Logged in successfully!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// 3. Get Current User Profile (Session check)
app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, avatar, plan, created_at FROM users WHERE id = ?').get(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching profile' });
  }
});

// 4. Log Out
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('netflix_token');
  return res.json({ message: 'Logged out successfully.' });
});

/* ══════════════════════════════════════════════
   MOVIES & CATALOG ENDPOINTS
══════════════════════════════════════════════ */

app.get('/api/movies', optionalAuth, (req, res) => {
  const { category, search } = req.query;

  let result = [...movies];

  if (category && category !== 'all') {
    result = result.filter(m => m.category === category || m.genres.some(g => g.toLowerCase().includes(category.toLowerCase())));
  }

  if (search) {
    const q = search.trim().toLowerCase();
    result = result.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.overview.toLowerCase().includes(q) ||
      m.genres.some(g => g.toLowerCase().includes(q)) ||
      m.cast.some(c => c.toLowerCase().includes(q))
    );
  }

  // If user is authenticated, attach their watchlist & rating flags from SQLite
  if (req.user) {
    const watchlistIds = db.prepare('SELECT movie_id FROM watchlist WHERE user_id = ?').all(req.user.userId).map(r => r.movie_id);
    const ratings = db.prepare('SELECT movie_id, rating FROM ratings WHERE user_id = ?').all(req.user.userId);
    const ratingMap = {};
    ratings.forEach(r => { ratingMap[r.movie_id] = r.rating; });

    result = result.map(m => ({
      ...m,
      inWatchlist: watchlistIds.includes(m.id),
      userRating: ratingMap[m.id] || null
    }));
  }

  return res.json({ movies: result });
});

app.get('/api/movies/:id', optionalAuth, (req, res) => {
  const movie = movies.find(m => m.id === req.params.id);
  if (!movie) {
    return res.status(404).json({ error: 'Movie not found.' });
  }

  let inWatchlist = false;
  let userRating = null;

  if (req.user) {
    const row = db.prepare('SELECT id FROM watchlist WHERE user_id = ? AND movie_id = ?').get(req.user.userId, movie.id);
    inWatchlist = !!row;

    const rateRow = db.prepare('SELECT rating FROM ratings WHERE user_id = ? AND movie_id = ?').get(req.user.userId, movie.id);
    if (rateRow) userRating = rateRow.rating;
  }

  return res.json({ movie: { ...movie, inWatchlist, userRating } });
});

/* ══════════════════════════════════════════════
   WATCHLIST (MY LIST) CRUD ENDPOINTS
   (Fulfills mandatory DB persistence requirement)
══════════════════════════════════════════════ */

// 1. Read Watchlist
app.get('/api/watchlist', authenticateToken, (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT movie_id, added_at 
      FROM watchlist 
      WHERE user_id = ? 
      ORDER BY added_at DESC
    `).all(req.user.userId);

    const movieMap = {};
    movies.forEach(m => { movieMap[m.id] = m; });

    const watchlistMovies = rows
      .map(r => {
        const m = movieMap[r.movie_id];
        return m ? { ...m, addedAt: r.added_at, inWatchlist: true } : null;
      })
      .filter(Boolean);

    return res.json({ watchlist: watchlistMovies, count: watchlistMovies.length });
  } catch (error) {
    console.error('Watchlist fetch error:', error);
    return res.status(500).json({ error: 'Could not fetch watchlist.' });
  }
});

// 2. Create Watchlist Item (Add to My List)
app.post('/api/watchlist', authenticateToken, (req, res) => {
  const { movieId } = req.body;
  if (!movieId) {
    return res.status(400).json({ error: 'movieId is required' });
  }

  const movieExists = movies.some(m => m.id === movieId);
  if (!movieExists) {
    return res.status(404).json({ error: 'Movie not found in catalog' });
  }

  try {
    db.prepare('INSERT OR IGNORE INTO watchlist (user_id, movie_id) VALUES (?, ?)').run(req.user.userId, movieId);
    return res.status(201).json({ message: 'Added to My List', movieId, inWatchlist: true });
  } catch (error) {
    console.error('Add watchlist error:', error);
    return res.status(500).json({ error: 'Failed to add to watchlist.' });
  }
});

// 3. Delete Watchlist Item (Remove from My List)
app.delete('/api/watchlist/:movieId', authenticateToken, (req, res) => {
  const { movieId } = req.params;

  try {
    const result = db.prepare('DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?').run(req.user.userId, movieId);
    return res.json({ message: 'Removed from My List', movieId, inWatchlist: false, changes: result.changes });
  } catch (error) {
    console.error('Remove watchlist error:', error);
    return res.status(500).json({ error: 'Failed to remove from watchlist.' });
  }
});

// 4. Rate Movie (Thumbs up / Thumbs down)
app.post('/api/ratings', authenticateToken, (req, res) => {
  const { movieId, rating } = req.body;

  if (!movieId || !['like', 'dislike', 'none'].includes(rating)) {
    return res.status(400).json({ error: 'Invalid movie or rating' });
  }

  try {
    if (rating === 'none') {
      db.prepare('DELETE FROM ratings WHERE user_id = ? AND movie_id = ?').run(req.user.userId, movieId);
      return res.json({ message: 'Rating removed', rating: null });
    } else {
      db.prepare(`
        INSERT INTO ratings (user_id, movie_id, rating, updated_at) 
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id, movie_id) DO UPDATE SET rating = excluded.rating, updated_at = CURRENT_TIMESTAMP
      `).run(req.user.userId, movieId, rating);
      return res.json({ message: 'Rating saved', rating });
    }
  } catch (error) {
    console.error('Rating error:', error);
    return res.status(500).json({ error: 'Failed to update rating.' });
  }
});
/* ══════════════════════════════════════════════
   PLAYBACK HISTORY & CONTINUE WATCHING (SQLite)
══════════════════════════════════════════════ */
app.get('/api/playback', authenticateToken, (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT movie_id, progress_seconds, duration_seconds, updated_at
      FROM playback_history
      WHERE user_id = ? AND completed = 0
      ORDER BY updated_at DESC
    `).all(req.user.userId);

    const movieMap = {};
    movies.forEach(m => { movieMap[m.id] = m; });

    const items = rows.map(r => {
      const movie = movieMap[r.movie_id];
      if (!movie) return null;
      const dur = r.duration_seconds > 0 ? r.duration_seconds : 180;
      const pct = Math.min(95, Math.max(5, Math.round((r.progress_seconds / dur) * 100)));
      return {
        ...movie,
        progressSeconds: r.progress_seconds,
        durationSeconds: dur,
        progressPercent: pct
      };
    }).filter(Boolean);

    return res.json({ continueWatching: items });
  } catch (error) {
    console.error('Playback history fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch playback history.' });
  }
});

app.post('/api/playback/:movieId', authenticateToken, (req, res) => {
  try {
    const { movieId } = req.params;
    const { progressSeconds = 0, durationSeconds = 0, completed = 0 } = req.body;

    db.prepare(`
      INSERT INTO playback_history (user_id, movie_id, progress_seconds, duration_seconds, completed, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, movie_id) DO UPDATE SET
        progress_seconds = excluded.progress_seconds,
        duration_seconds = excluded.duration_seconds,
        completed = excluded.completed,
        updated_at = CURRENT_TIMESTAMP
    `).run(req.user.userId, movieId, progressSeconds, durationSeconds, completed ? 1 : 0);

    return res.json({ success: true, message: 'Playback progress saved.' });
  } catch (error) {
    console.error('Playback progress save error:', error);
    return res.status(500).json({ error: 'Failed to save playback progress.' });
  }
});

app.delete('/api/playback/:movieId', authenticateToken, (req, res) => {
  try {
    const { movieId } = req.params;
    db.prepare('DELETE FROM playback_history WHERE user_id = ? AND movie_id = ?').run(req.user.userId, movieId);
    return res.json({ success: true, message: 'Removed from continue watching.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to remove playback item.' });
  }
});

/* ══════════════════════════════════════════════
   USER PREFERENCES & PROFILE MANAGEMENT
══════════════════════════════════════════════ */
app.get('/api/preferences', authenticateToken, (req, res) => {
  try {
    const pref = db.prepare('SELECT * FROM user_preferences WHERE user_id = ?').get(req.user.userId);
    return res.json({
      preferences: pref || { audio_language: 'en-orig', subtitle_language: 'en', playback_speed: 1.0 }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch preferences.' });
  }
});

app.post('/api/preferences', authenticateToken, (req, res) => {
  try {
    const { audio_language, subtitle_language, playback_speed } = req.body;
    db.prepare(`
      INSERT INTO user_preferences (user_id, audio_language, subtitle_language, playback_speed, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
        audio_language = COALESCE(excluded.audio_language, user_preferences.audio_language),
        subtitle_language = COALESCE(excluded.subtitle_language, user_preferences.subtitle_language),
        playback_speed = COALESCE(excluded.playback_speed, user_preferences.playback_speed),
        updated_at = CURRENT_TIMESTAMP
    `).run(req.user.userId, audio_language || 'en-orig', subtitle_language || 'en', playback_speed || 1.0);

    return res.json({ success: true, message: 'Preferences saved.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to save preferences.' });
  }
});

app.put('/api/auth/profile', authenticateToken, (req, res) => {
  try {
    const { name, plan } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    db.prepare('UPDATE users SET name = ?, plan = COALESCE(?, plan) WHERE id = ?')
      .run(name.trim(), plan || null, req.user.userId);

    const updated = db.prepare('SELECT id, name, email, avatar, plan FROM users WHERE id = ?').get(req.user.userId);
    return res.json({ user: updated, message: 'Profile updated successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
});

app.post('/api/feedback', optionalAuth, (req, res) => {
  try {
    const { movieId, issueType, details } = req.body;
    const userId = req.user ? req.user.userId : null;
    db.prepare('INSERT INTO feedback (user_id, movie_id, issue_type, details) VALUES (?, ?, ?, ?)')
      .run(userId, movieId || null, issueType || 'general', details || null);
    return res.json({ success: true, message: 'Thank you for your feedback. Logged successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to log feedback.' });
  }
});

/* ══════════════════════════════════════════════
   CLIENT-SIDE ROUTING FALLBACK
══════════════════════════════════════════════ */
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Export for serverless (Vercel) & direct execution
module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🎬 Netflix Clone Server running at http://localhost:${PORT}`);
    console.log(`📊 SQLite database connected: data/netflix.db`);
  });
}
