# 🎬 Netflix Clone &mdash; Full-Stack Streaming Platform

A production-grade, pixel-perfect clone of **Netflix** built with a real **Node.js + Express** backend, persistent **SQLite** database, **bcrypt** password hashing, **JWT authentication**, and interactive **Watchlist CRUD**.

Designed for the **2nd Year Web Development Assessment &amp; Technical Recruitment**.

---

## 🌟 Live Demo & Deployment
- **Live Hosted Application (Frontend + Backend):** [https://netflix-clone-one-lemon-83.vercel.app](https://netflix-clone-one-lemon-83.vercel.app)
- **GitHub Public Repository:** [https://github.com/sautrikroy17/netflix-clone](https://github.com/sautrikroy17/netflix-clone)
- **Local Development Server:** `http://localhost:3000`
- **One-Click Demo Credentials:**
  - **Email:** `demo@netflix.com`
  - **Password:** `password123`

---

## 🎯 Mandatory Assignment Compliance

| Requirement | Implementation Details | Status |
| :--- | :--- | :---: |
| **1. Landing / Home Page** | Authentic Netflix landing experience with hero billboard, pricing subtitle, dynamic email onboarding, responsive feature showcase grids, and `<details name="faq">` exclusive FAQ accordion. | ✅ Complete |
| **2. Sign Up Page** | Multi-step registration flow (`/signup`), email/password validation, live password strength meter (Weak/Medium/Strong), plan selector (Mobile to Premium 4K), and auto-fill helper. | ✅ Complete |
| **3. Log In Page** | Glassmorphic dark card (`/login`) with floating labels, password visibility toggle, error handling, session remember toggle, and One-Click Evaluator demo login. | ✅ Complete |
| **4. Fully Working Backend** | REST API powered by **Node.js** and **Express.js**, serving auth, catalog, and watchlist endpoints. | ✅ Complete |
| **5. Password Security** | All passwords are salted and hashed using **`bcryptjs`** (10 salt rounds). **Zero plaintext passwords** stored. | ✅ Complete |
| **6. Real Database Persistence** | Powered by **SQLite** (`data/netflix.db`) using `better-sqlite3` in WAL mode. Persistent across restarts &mdash; **no `localStorage` tricks**. | ✅ Complete |
| **7. Extra Working Feature (CRUD)** | **"My List" / Watchlist Engine:** Full CRUD allowing authenticated users to add, read, delete, and rate titles directly to/from their SQLite database account. | ✅ Complete |

---

## 🛠️ Tech Stack & Architecture

- **Frontend:**
  - Semantic HTML5 with native overlays (`<dialog>` modal, `<details>` accordion).
  - Modern Vanilla CSS (CSS Custom Properties, Glassmorphism, Responsive Grid, Keyframe animations).
  - Vanilla JavaScript ES6+ (HTML5 History API client-side router, debounced search, state management).
- **Backend:**
  - **Runtime:** Node.js (v20+)
  - **Framework:** Express.js
  - **Authentication:** JSON Web Tokens (JWT) + HTTP-only secure session cookies
  - **Password Security:** `bcryptjs`
  - **Database:** SQLite (`better-sqlite3`)
- **Media & Streaming:**
  - High-definition cinematic posters and backdrops.
  - Interactive HTML5 video player modal with streaming video feeds and custom playback controls.

---

## 🚀 Key Features

### 1. Unauthenticated Landing Page (`/`)
- Cinematic hero with radial dark vignette and call to action.
- Email capture that seamlessly carries user input forward to the registration page.
- 4 Feature showcase sections (Enjoy on TV, Offline Downloads, Watch Everywhere, Kids Profiles).
- Interactive, accessible FAQ accordion.

### 2. Sign Up Page (`/signup`)
- Step-by-step account onboarding.
- Real-time password strength calculation.
- Plan tier selection (Mobile ₹149, Basic ₹199, Standard ₹499, Premium ₹649).
- Instant random test account generator for rapid testing.

### 3. Sign In Page (`/login`)
- Authentic Netflix translucent frosted card (`backdrop-filter: blur(16px)`).
- Floating label inputs that glide smoothly on focus.
- One-Click Demo button logging directly into seeded account `demo@netflix.com`.

### 4. Authenticated Browse Experience (`/browse`)
- **Billboard Spotlight:** Hero showcase featuring *Stranger Things* with Match %, age rating, audio specs, Play button, and List toggle.
- **Top 10 Ranked Row:** Large, iconic beveled number badges (1 through 10) overlaying posters.
- **Category Sliders:** Smooth horizontal carousels for Trending, Sci-Fi, Action, and Award-Winning Dramas.
- **Live Debounced Search:** Instant filtering across titles, genres, and cast members.

### 5. "My List" Database CRUD (`/mylist`)
- **Create:** Click `+ My List` on any card or billboard to persist it to SQLite (`POST /api/watchlist`).
- **Read:** Dedicated row and page displaying all user-saved movies (`GET /api/watchlist`).
- **Delete:** Click `✓ In My List` to remove it from database (`DELETE /api/watchlist/:id`).
- **Rate:** Thumbs Up / Down ratings saved to SQLite (`POST /api/ratings`).

### 6. Interactive Movie Details & Video Player (`<dialog>`)
- Built with HTML5 `<dialog>`.
- Displays synopsis, cast, creators, genres, audio specs, and "More Like This" recommendations.
- Integrated video player playing high-resolution trailer streams with custom controls.

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register new user, hash password with bcrypt, return JWT |
| `POST` | `/api/auth/login` | Authenticate user against hashed password, return JWT |
| `GET` | `/api/auth/me` | Fetch authenticated user profile via session token |
| `POST` | `/api/auth/logout` | Clear session cookie |

### Movies & Catalog
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/movies` | Fetch full catalog with user watchlist and rating flags |
| `GET` | `/api/movies/:id` | Fetch specific movie details |

### Watchlist (My List CRUD)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/watchlist` | Get authenticated user's watchlist from SQLite |
| `POST` | `/api/watchlist` | Add movie to authenticated user's watchlist in SQLite |
| `DELETE` | `/api/watchlist/:movieId` | Remove movie from authenticated user's watchlist in SQLite |
| `POST` | `/api/ratings` | Save/update movie rating (like/dislike) in SQLite |

---

## 💻 Local Setup & Installation

1. **Clone repository:**
   ```bash
   git clone https://github.com/sautrikroy17/netflix-clone.git
   cd netflix-clone
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the application:**
   ```bash
   npm start
   ```

4. **Open in browser:**
   ```text
   http://localhost:3000
   ```

---

## 🔒 Security Best Practices Implemented
- **Salted Password Hashing:** 10 rounds of bcrypt salts prevent rainbow table attacks.
- **Session Protection:** HTTP-only cookies prevent Cross-Site Scripting (XSS) token theft.
- **SQL Injection Prevention:** Prepared statements (`db.prepare(query).run(...)`) strictly separate query code from data.
- **Input Sanitization:** Email normalization and password complexity enforcement.

---

## 👤 Author
**Sautrik Roy**  
B.Tech Computer Science &amp; Engineering &bull; SRM Institute of Science and Technology  
- **GitHub:** [@sautrikroy17](https://github.com/sautrikroy17)  
- **Portfolio:** [sautrikroy.me](https://sautrikroy.me)
