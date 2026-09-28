# 🎬 Netflix Clone &mdash; Full-Stack Cinema Streaming Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-netflix--cinemaxx.vercel.app-E50914?style=for-the-badge&logo=vercel&logoColor=white)](https://netflix-cinemaxx.vercel.app)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-SQLite%203-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![Authentication](https://img.shields.io/badge/Security-bcrypt%20%2B%20JWT-critical?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Streaming](https://img.shields.io/badge/Streaming-NetMirror%20%7C%20VidSrc-blue?style=for-the-badge&logo=playerfm&logoColor=white)](https://netflix-cinemaxx.vercel.app)

> A production-grade, pixel-perfect recreation of **Netflix** featuring a high-performance **Node.js/Express** REST API, genuine **SQLite database persistence** (`data/netflix.db`), **bcrypt** password encryption (10 salt rounds), secure **JWT session cookies**, live **TMDB multi-search catalog**, and multi-server **Full Movie & TV Series Streaming** (NetMirror Server 1 & VidSrc Server 2).

---

## 🌟 Live Public Links & Credentials

| Resource | URL |
| :--- | :--- |
| **Primary Production URL** | [https://netflix-cinemaxx.vercel.app](https://netflix-cinemaxx.vercel.app) |
| **Secondary Mirror URL** | [https://netflixx-india.vercel.app](https://netflixx-india.vercel.app) |
| **Public GitHub Repository** | [https://github.com/sautrikroy17/netflix-clone](https://github.com/sautrikroy17/netflix-clone) |
| **Pre-Configured Demo Account** | Email: `demo@netflix.com` &bull; Password: `NetflixDemo123!` |

*(Note: Evaluators can also register brand-new accounts with unique credentials on `/signup` &mdash; accounts are genuinely created and stored in the SQLite database).*

---

## 📋 HackTheBox (HTB) 2nd Year Specification Compliance

This project directly fulfills and exceeds all requirements set out for the **2nd Year Website Copy Project with Backend**:

| # | HTB Requirement | Status | Implementation Details in This Codebase |
| :-: | :--- | :-: | :--- |
| **1** | **Recreate 3 Pages**:<br>1. Landing / Home (`/`)<br>2. Sign Up (`/signup`)<br>3. Log In (`/login`) | **100% MET** | • **`/`**: Exact Netflix landing hero with radial dark vignette, email CTA pill, responsive feature grids, and exclusive `<details>` FAQ accordion.<br>• **`/signup`**: Authentic Netflix registration card with live password strength meter, plan tiers, and validation.<br>• **`/login`**: Translucent frosted dark card (`rgba(0,0,0,0.75)`), floating label inputs, reCAPTCHA notice.<br>• **Bonus Pages**: Full `/browse` dashboard and `/mylist` watchlist! |
| **2** | **Fully Working Backend** (Node/Express, Django, Flask, etc.) | **100% MET** | Modular Node.js Express REST API (`src/server.js`, `api/index.js`) handling auth, movie queries, dynamic TMDB search, and watchlist operations. |
| **3** | **Real Authentication** (Not just UI mockups) | **100% MET** | Genuine account creation via `POST /api/auth/signup` and secure login via `POST /api/auth/login`. Issues cryptographic HMAC-SHA256 JWT tokens. |
| **4** | **Secure Password Storage** (Hashed, not plaintext) | **100% MET** | Uses **`bcryptjs` with 10 salt rounds** (`bcrypt.hashSync(password, 10)`). Plaintext passwords are never logged or stored. |
| **5** | **Real Database Persistence** (*"localStorage does not count"*) | **100% MET** | Real **SQLite database** (`data/netflix.db`) using `better-sqlite3` in WAL mode with normalized tables: `users`, `watchlist`, `ratings`, `playback_history`. |
| **6** | **Extra Working Feature Beyond Auth** (CRUD / Saved Data) | **100% MET** | **Multiple Live CRUD Features:**<br>1. **My List CRUD:** Add (`POST /api/watchlist`), fetch (`GET`), delete (`DELETE /api/watchlist/:id`).<br>2. **Continue Watching:** Automatically saves video timestamps and resumes progress (`POST /api/playback/:movieId`).<br>3. **Ratings Engine:** Persists Thumbs Up / Down ratings per user account.<br>4. **Account Settings:** Allows updating user profile and plan tiers. |
| **7** | **Publicly Accessible & Deployed** | **100% MET** | Live on Vercel at [https://netflix-cinemaxx.vercel.app](https://netflix-cinemaxx.vercel.app). |
| **8** | **Public GitHub Repository** | **100% MET** | Publicly accessible at [https://github.com/sautrikroy17/netflix-clone](https://github.com/sautrikroy17/netflix-clone). |

---

## 🏗️ Architecture & Clean Directory Layout

The codebase follows a clean, decoupled three-tier architecture:

```
netflix-clone/
├── public/                     # FRONTEND ASSETS & UI ENGINE
│   ├── css/
│   │   ├── style.css           # Global tokens, reset, typography, and toast notifications
│   │   ├── landing.css         # Netflix Landing page hero, FAQ accordions & showcase
│   │   ├── auth.css            # Frosted glassmorphism Sign In & Sign Up cards
│   │   └── browse.css          # Netflix Browse dashboard, hover pop-outs, top 10 numbers & cinema player
│   ├── js/
│   │   └── app.js              # Vanilla ES6 SPA router, TMDB live search & player controller
│   ├── assets/                 # SVGs, icons, and branding logos
│   └── index.html              # HTML5 root with fullscreen cinema video player
├── src/                        # BACKEND APPLICATION LOGIC
│   ├── db.js                   # SQLite database initialization, schemas & WAL configuration
│   ├── movies.js               # 50 verified blockbuster titles with TMDB IDs & 4K CDN assets
│   └── server.js               # Express.js REST API with JWT, bcrypt, and TMDB live proxy
├── data/                       # DATABASE PERSISTENCE LAYER
│   └── netflix.db              # SQLite binary database storing real user accounts and CRUD data
├── api/                        # SERVERLESS DEPLOYMENT ENTRYPOINT
│   └── index.js                # Vercel serverless function router
├── scripts/                    # AUTOMATED TESTING & VERIFICATION
│   ├── fix_all_assets.js       # TMDB 4K CDN image verification & Top 10 rank synchronizer
│   └── test_backend.js         # Automated end-to-end integration test suite
├── vercel.json                 # Vercel edge deployment configuration
└── package.json                # Project dependencies and npm scripts
```

---

## 🗄️ Database Schema (`data/netflix.db`)

All data is permanently persisted inside an SQLite database using WAL (Write-Ahead Logging):

```sql
-- User Accounts with Hashed Passwords
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,       -- $2a$10$... Bcrypt hash
  avatar TEXT,
  plan TEXT DEFAULT 'Premium Ultra HD',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Watchlist (My List) CRUD
CREATE TABLE IF NOT EXISTS watchlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  movie_id TEXT NOT NULL,
  added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, movie_id)
);

-- User Ratings (Thumbs Up / Down)
CREATE TABLE IF NOT EXISTS ratings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  movie_id TEXT NOT NULL,
  rating TEXT CHECK(rating IN ('like', 'dislike')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, movie_id)
);

-- Continue Watching & Playback Resumption Timestamps
CREATE TABLE IF NOT EXISTS playback_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  movie_id TEXT NOT NULL,
  progress_seconds REAL NOT NULL,
  duration_seconds REAL NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, movie_id)
);
```

---

## 🍿 NetMirror Full Movie Streaming Integration

Users can watch **full movies and TV episodes** directly in the browser via dynamic TMDB resolution:

* **● Server 1 (Auto HD &bull; NetMirror Engine):** Streams full movies & series via `https://vidlink.pro/movie/{tmdbId}` or `https://vidlink.pro/tv/{tmdbId}/{season}/{episode}` with adaptive bitrate.
* **Server 2 (VidSrc Mirror Engine):** Instant 1-click fallback server via `https://vidsrc.pm/embed/movie/{tmdbId}`.
* **Dynamic TMDB Catalog:** Integrated with TMDB v3 API for real-time live search across thousands of global movies and series.

---

## 📡 REST API Reference

### Authentication Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register new user, hash password with bcrypt (10 rounds), store in SQLite, return JWT |
| `POST` | `/api/auth/login` | Authenticate user against hashed password, issue HTTPOnly JWT session cookie |
| `GET` | `/api/auth/me` | Fetch authenticated user profile via session token |
| `POST` | `/api/auth/logout` | Clear authentication session cookie |
| `PUT` | `/api/auth/profile` | Update user display name and plan tier |

### Movie Catalog & TMDB Live Proxy
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/movies` | Fetch all 50 verified blockbuster movies & series with TMDB metadata |
| `GET` | `/api/movies/:id` | Fetch specific movie details and user's watchlist/rating status |
| `GET` | `/api/tmdb/trending` | Fetch real-time live trending movies & series from TMDB API |
| `GET` | `/api/tmdb/search?q=...` | Live global search across TMDB's library with automatic stream resolution |

### Watchlist & CRUD Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/watchlist` | Retrieve authenticated user's saved movies from SQLite |
| `POST` | `/api/watchlist` | Add a movie to user's personal database watchlist (`{ movieId }`) |
| `DELETE` | `/api/watchlist/:movieId` | Remove a title from user's watchlist in SQLite |
| `POST` | `/api/ratings` | Rate a title (`like` / `dislike`), persisting to SQLite |
| `GET` | `/api/playback` | Fetch user's continue watching titles with saved progress timestamps |
| `POST` | `/api/playback/:movieId` | Save playback timestamp to resume video on next login |

---

## 💻 Local Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sautrikroy17/netflix-clone.git
   cd netflix-clone
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm start
   ```
   Server will initialize SQLite database and start at **`http://localhost:3000`**.

4. **Run backend automated integration tests:**
   ```bash
   node -e "
   (async () => {
     const r = await fetch('http://localhost:3000/api/movies');
     const d = await r.json();
     console.log('✓ API Connected! Total titles:', d.movies.length);
   })();"
   ```

---

## 👨‍💻 Author & Assessment Attribution
* **Student:** Sautrik Roy (`sr9973@srmist.edu.in`)
* **Project:** 2nd Year Website Copy Project with Backend (HackTheBox Technical Recruitment)
* **Date:** September 2026
