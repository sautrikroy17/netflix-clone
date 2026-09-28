# Netflixer — Cinema Streaming Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-netfixer.vercel.app-E50914?style=for-the-badge&logo=vercel&logoColor=white)](https://netfixer.vercel.app)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-SQLite%203-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-gray?style=for-the-badge)](LICENSE)

A high-performance, full-stack streaming web application inspired by Netflix. Built with a modular **Node.js / Express** backend, **SQLite** database persistence, and a modern, ultra-responsive vanilla CSS & JavaScript frontend.

---

## 🚀 Live Production

- **URL**: [https://netfixer.vercel.app](https://netfixer.vercel.app)
- **Demo Account**: `demo@netflix.com` / `NetflixDemo123!` *(or create any new profile instantly on `/signup`)*

---

## ✨ Key Features

- **🎬 Official Studio HD Trailers**:
  - Streams authentic, high-definition official studio trailers for every movie and series in the library.
  - Autonomous dynamic scraper integration: live searches resolve verified HD trailers on demand globally with zero black screens or dummy placeholders.

- **🍿 Netflix Fullscreen Cinema Player**:
  - Immersive cinema experience with custom Top Bar controls, verified Studio HD badges, and one-click external YouTube launcher.
  - Seamless navigation with intelligent overlay auto-hiding during playback (`idle` mode) and responsive WebKit/Safari & Chromium optimization.

- **🃏 Interactive Popout Hover Previews**:
  - Hovering any title triggers an expanded popout card with media artwork, maturity ratings, Dolby Vision audio/video badges, and quick-action buttons (Play, My List, Like/Dislike).

- **👥 Multi-Profile Management**:
  - Authentic "Who's Watching?" profile switcher supporting multiple custom avatars, kids-safe content filtering mode, and isolated per-profile watchlists.

- **🔍 Global Live Search & Filter**:
  - Fast, debounced search querying the local database as well as the global TMDB library simultaneously, with instant genre filtering and Top 10 chart tracking.

- **💾 Persistent Database Storage**:
  - Backed by SQLite (`better-sqlite3`) utilizing Write-Ahead Logging (`WAL`) for persistent user sessions, encrypted passwords (`bcrypt`), profile settings, and playback history.

---

## 📁 Repository Structure

```
netflixer/
├── backend/
│   ├── db.js             # SQLite connection, schema migrations & seeders
│   ├── movies.js         # Verified movie & series catalog with TMDb metadata
│   └── server.js         # Express REST API & autonomous trailer resolution engine
├── database/
│   └── .gitkeep          # Auto-generated database storage (binaries ignored)
├── frontend/
│   ├── assets/           # Netflix logo, avatars, audio & SVG icons
│   ├── css/              # Modular styling (browse.css, auth, cinema player)
│   ├── js/
│   │   └── app.js        # Vanilla JS Single Page Application (SPA router & player)
│   ├── favicon.ico       # Web & Apple touch icons
│   ├── index.html        # Main application root & cinema stage
│   └── manifest.json     # PWA / web application manifest
├── .gitignore            # Git exclusion rules (DB binaries, node_modules)
├── package.json          # Project manifest & runtime dependencies
├── README.md             # Project documentation
└── vercel.json           # Vercel Serverless deployment configuration
```

---

## 🛠️ Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- `npm` (included with Node.js)

### Installation & Local Run

```bash
# 1. Clone the repository
git clone https://github.com/sautrikroy17/netflixer.git
cd netflixer

# 2. Install dependencies
npm install

# 3. Launch the development server
npm start
```

The application will be live at `http://localhost:3000`.

---

## 🔌 API Reference

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/auth/login` | `POST` | Authenticate user & issue HTTP-only JWT |
| `/api/auth/register` | `POST` | Register a new user profile |
| `/api/movies` | `GET` | Retrieve the curated catalog with metadata |
| `/api/trailer/:id` | `GET` | Resolve official studio HD trailer key (accepts `?title=...`) |
| `/api/tmdb/search` | `GET` | Live global search across TMDb library (`?q=...`) |
| `/api/watchlist` | `GET` / `POST` | Fetch or add titles to user's personal list |
| `/api/playback/history` | `GET` / `POST` | Track and resume playback timestamps |

---

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).
