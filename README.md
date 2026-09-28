# Netflix Streaming Platform

A production-grade, full-stack streaming platform inspired by Netflix. Built with a modular **Node.js/Express** backend, **SQLite** database persistence, and a modern, high-performance vanilla frontend.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-netfixer--stream.vercel.app-E50914?style=flat-square&logo=vercel&logoColor=white)](https://netfixer-stream.vercel.app)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-SQLite%203-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-gray?style=flat-square)](LICENSE)

---

## 🚀 Live Demo

- **Production URL**: [netfixer-stream.vercel.app](https://netfixer-stream.vercel.app)
- **Mirror URL**: [netflixx-player.vercel.app](https://netflixx-player.vercel.app)
- **Demo Account**: `demo@netflix.com` / `NetflixDemo123!` *(or register a new account on `/signup`)*

---

## ✨ Features

- **Authentic Netflix Interface**: Faithful reproduction of the Netflix landing page, auth flow, and browse experience with responsive layouts, sticky subnav with genre filtering, and top 10 charts.
- **Interactive Previews**: Hover over any title to auto-play a muted trailer preview with audio toggle, quick action buttons, maturity rating, and genre tags.
- **Cinema Video Player**: Custom fullscreen player with multi-source streaming, video quality selector (Auto, 4K UHD, 1080p, 720p, 480p), instant subtitle toggle `[CC]` with close option, and keyboard shortcuts.
- **Multi-Profile System**: Dedicated "Who's Watching?" profile picker, kids profile mode (with automatic content filtering), and per-profile watchlists and continue-watching timestamps.
- **Search & Discovery**: Live catalog search powered by TMDB integration, genre filters, and personalized recommendation feeds.
- **Secure Authentication**: User registration and login using `bcrypt` password hashing and HTTP-only JWT sessions.

---

## 📁 Project Structure

```
netflix-clone/
├── api/            # Serverless deployment gateway
├── data/           # SQLite database persistence
├── public/         # Frontend client (HTML, CSS, JS, Assets)
├── src/            # Backend server, REST API & database models
├── vercel.json     # Deployment configuration
└── package.json    # Project dependencies and scripts
```

---

## 🛠️ Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sautrikroy17/netflix-clone.git
cd netflix-clone

# 2. Install dependencies
npm install

# 3. Start the application
npm start
```

The application will be running locally at `http://localhost:3000`.

---

## ⚙️ Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System), JavaScript (ES6+ SPA Router)
- **Backend**: Node.js, Express.js
- **Database**: SQLite3 (`better-sqlite3` with Write-Ahead Logging)
- **Authentication**: JSON Web Tokens (JWT), bcrypt password hashing
- **Deployment**: Vercel
