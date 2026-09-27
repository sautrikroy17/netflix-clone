/* ══════════════════════════════════════════════════════════════
   NETFLIX FULL-STACK CLIENT APPLICATION
   State Management, Client-Side Router, Auth & CRUD Operations
══════════════════════════════════════════════════════════════ */

class NetflixApp {
  constructor() {
    this.currentUser = null;
    this.movies = [];
    this.watchlist = [];
    this.ratings = {};
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.selectedMovie = null;

    this.init();
  }

  async init() {
    this.setupRouter();
    await this.checkAuthSession();
    await this.fetchMovies();
    this.renderCurrentRoute();
    this.setupGlobalEvents();
  }

  /* ══════════════════════════════════════════════
     ROUTER (HTML5 History API)
  ══════════════════════════════════════════════ */
  setupRouter() {
    window.addEventListener('popstate', () => {
      this.renderCurrentRoute();
    });

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-route]');
      if (link) {
        e.preventDefault();
        const route = link.getAttribute('data-route') || link.getAttribute('href');
        this.navigate(route);
      }
    });
  }

  navigate(route) {
    if (window.location.pathname !== route) {
      window.history.pushState({}, '', route);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.renderCurrentRoute();
  }

  renderCurrentRoute() {
    const path = window.location.pathname;
    const appEl = document.getElementById('app-root');

    // Route guards & View Renderers
    if (path === '/login') {
      if (this.currentUser) return this.navigate('/browse');
      appEl.innerHTML = this.renderLoginPage();
      this.attachLoginEvents();
    } else if (path === '/signup') {
      if (this.currentUser) return this.navigate('/browse');
      appEl.innerHTML = this.renderSignupPage();
      this.attachSignupEvents();
    } else if (path === '/browse' || path === '/mylist' || (path === '/' && this.currentUser)) {
      if (!this.currentUser) return this.navigate('/login');
      if (path === '/mylist') this.activeCategory = 'mylist';
      appEl.innerHTML = this.renderBrowseDashboard();
      this.attachBrowseEvents();
    } else {
      // Default to Landing Page for unauthenticated visitors
      if (this.currentUser) return this.navigate('/browse');
      appEl.innerHTML = this.renderLandingPage();
      this.attachLandingEvents();
    }
  }

  /* ══════════════════════════════════════════════
     API SERVICE & AUTHENTICATION
  ══════════════════════════════════════════════ */
  async checkAuthSession() {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        this.currentUser = data.user;
        await this.fetchWatchlist();
      } else {
        this.currentUser = null;
      }
    } catch (e) {
      this.currentUser = null;
    }
  }

  async fetchMovies() {
    try {
      const res = await fetch('/api/movies');
      const data = await res.json();
      this.movies = data.movies || [];
    } catch (e) {
      console.error('Error fetching catalog:', e);
    }
  }

  async fetchWatchlist() {
    if (!this.currentUser) return;
    try {
      const res = await fetch('/api/watchlist');
      if (res.ok) {
        const data = await res.json();
        this.watchlist = data.watchlist || [];
      }
    } catch (e) {
      console.error('Error fetching watchlist:', e);
    }
  }

  async handleSignup(name, email, password) {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');

      this.currentUser = data.user;
      this.showToast(`Welcome to Netflix, ${data.user.name}!`, 'success');
      await this.fetchMovies();
      await this.fetchWatchlist();
      this.navigate('/browse');
    } catch (err) {
      this.showAuthError(err.message);
    }
  }

  async handleLogin(email, password) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      this.currentUser = data.user;
      this.showToast(`Welcome back, ${data.user.name}!`, 'success');
      await this.fetchMovies();
      await this.fetchWatchlist();
      this.navigate('/browse');
    } catch (err) {
      this.showAuthError(err.message);
    }
  }

  async handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    this.currentUser = null;
    this.watchlist = [];
    this.showToast('You have been logged out.', 'info');
    this.navigate('/login');
  }

  /* ══════════════════════════════════════════════
     WATCHLIST CRUD (Persisted in SQLite)
  ══════════════════════════════════════════════ */
  async toggleWatchlist(movieId) {
    if (!this.currentUser) {
      this.showToast('Please sign in to add to My List', 'error');
      return this.navigate('/login');
    }

    const isInList = this.watchlist.some(m => m.id === movieId);
    const movie = this.movies.find(m => m.id === movieId);

    try {
      if (isInList) {
        // DELETE from DB
        const res = await fetch(`/api/watchlist/${movieId}`, { method: 'DELETE' });
        if (res.ok) {
          this.watchlist = this.watchlist.filter(m => m.id !== movieId);
          this.showToast(`Removed "${movie ? movie.title : 'item'}" from My List`, 'info');
        }
      } else {
        // POST to DB
        const res = await fetch('/api/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ movieId })
        });
        if (res.ok) {
          if (movie) this.watchlist.unshift({ ...movie, inWatchlist: true });
          this.showToast(`Added "${movie ? movie.title : 'item'}" to My List!`, 'success');
        }
      }

      this.updateWatchlistButtons(movieId);
      if (this.activeCategory === 'mylist') {
        this.renderCurrentRoute();
      }
    } catch (err) {
      this.showToast('Failed to update My List. Try again.', 'error');
    }
  }

  updateWatchlistButtons(movieId) {
    const isInList = this.watchlist.some(m => m.id === movieId);
    const btns = document.querySelectorAll(`[data-watchlist-id="${movieId}"]`);
    btns.forEach(btn => {
      if (btn.classList.contains('btn-billboard-list')) {
        btn.innerHTML = isInList 
          ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> In My List`
          : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> My List`;
        btn.classList.toggle('in-list', isInList);
      } else {
        btn.innerHTML = isInList ? `✓` : `+`;
        btn.classList.toggle('active', isInList);
        btn.title = isInList ? 'Remove from My List' : 'Add to My List';
      }
    });
  }

  async rateMovie(movieId, rating) {
    if (!this.currentUser) return this.navigate('/login');
    const current = this.ratings[movieId];
    const newRating = current === rating ? 'none' : rating;

    try {
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId, rating: newRating })
      });
      if (res.ok) {
        if (newRating === 'none') {
          delete this.ratings[movieId];
        } else {
          this.ratings[movieId] = newRating;
        }
        this.showToast(newRating === 'like' ? 'I like this' : (newRating === 'dislike' ? 'Not for me' : 'Rating cleared'), 'info');
      }
    } catch (e) {}
  }

  /* ══════════════════════════════════════════════
     VIEW RENDERERS
  ══════════════════════════════════════════════ */

  // 1. Landing Page (Unauthenticated)
  renderLandingPage() {
    return `
      <!-- Landing Header -->
      <header class="netflix-header">
        <div class="header-left">
          <div class="netflix-logo" data-route="/">NETFLIX</div>
        </div>
        <div class="header-right">
          <button class="btn-primary-red" data-route="/login">Sign In</button>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="landing-hero">
        <div class="landing-hero-content">
          <h1 class="landing-title">Unlimited movies, TV shows and more</h1>
          <p class="landing-subtitle">Starts at ₹149. Cancel anytime.</p>
          <p class="landing-text">Ready to watch? Enter your email to create or restart your membership.</p>
          
          <form class="cta-email-form" id="landing-cta-form">
            <div class="cta-input-wrapper">
              <input type="email" id="landing-email-input" class="cta-input" placeholder=" " required autocomplete="email" inputmode="email">
              <label for="landing-email-input" class="cta-label">Email address</label>
            </div>
            <button type="submit" class="btn-get-started">
              Get Started
              <svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
            </button>
          </form>
        </div>
      </section>

      <!-- Feature 1: Enjoy on TV -->
      <section class="feature-section">
        <div class="feature-container">
          <div class="feature-text">
            <h2 class="feature-title">Enjoy on your TV</h2>
            <p class="feature-desc">Watch on smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players and more.</p>
          </div>
          <div class="feature-media">
            <div class="feature-tv-card">
              <img src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=700&q=80" alt="Smart TV streaming">
            </div>
          </div>
        </div>
      </section>

      <!-- Feature 2: Download Shows -->
      <section class="feature-section">
        <div class="feature-container reversed">
          <div class="feature-text">
            <h2 class="feature-title">Download your shows to watch offline</h2>
            <p class="feature-desc">Save your favourites easily and always have something to watch anywhere you go.</p>
          </div>
          <div class="feature-media">
            <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=700&q=80" alt="Mobile offline viewing">
          </div>
        </div>
      </section>

      <!-- Feature 3: Watch Everywhere -->
      <section class="feature-section">
        <div class="feature-container">
          <div class="feature-text">
            <h2 class="feature-title">Watch everywhere</h2>
            <p class="feature-desc">Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.</p>
          </div>
          <div class="feature-media">
            <img src="https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=700&q=80" alt="Multi device streaming">
          </div>
        </div>
      </section>

      <!-- Feature 4: Kids Profiles -->
      <section class="feature-section">
        <div class="feature-container reversed">
          <div class="feature-text">
            <h2 class="feature-title">Create profiles for kids</h2>
            <p class="feature-desc">Send children on adventures with their favourite characters in a space made just for them — free with your membership.</p>
          </div>
          <div class="feature-media">
            <img src="https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?auto=format&fit=crop&w=700&q=80" alt="Kids entertainment">
          </div>
        </div>
      </section>

      <!-- FAQ Section (Native details name="faq" exclusive accordion) -->
      <section class="faq-section">
        <h2 class="faq-heading">Frequently Asked Questions</h2>
        <div class="faq-list">
          <details class="faq-item" name="faq">
            <summary class="faq-question">
              <span>What is Netflix?</span>
              <span class="faq-icon">+</span>
            </summary>
            <div class="faq-answer">
              Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries and more on thousands of internet-connected devices. You can watch as much as you want, whenever you want, without a single advert – all for one low monthly price.
            </div>
          </details>

          <details class="faq-item" name="faq">
            <summary class="faq-question">
              <span>How much does Netflix cost?</span>
              <span class="faq-icon">+</span>
            </summary>
            <div class="faq-answer">
              Watch Netflix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from ₹149 to ₹649 a month. No extra costs, no contracts.
            </div>
          </details>

          <details class="faq-item" name="faq">
            <summary class="faq-question">
              <span>Where can I watch?</span>
              <span class="faq-icon">+</span>
            </summary>
            <div class="faq-answer">
              Watch anywhere, anytime. Sign in with your Netflix account to watch instantly on the web at netflix.com from your personal computer or on any internet-connected device that offers the Netflix app.
            </div>
          </details>

          <details class="faq-item" name="faq">
            <summary class="faq-question">
              <span>How do I cancel?</span>
              <span class="faq-icon">+</span>
            </summary>
            <div class="faq-answer">
              Netflix is flexible. There are no annoying contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime.
            </div>
          </details>

          <details class="faq-item" name="faq">
            <summary class="faq-question">
              <span>What can I watch on Netflix?</span>
              <span class="faq-icon">+</span>
            </summary>
            <div class="faq-answer">
              Netflix has an extensive library of feature films, documentaries, TV shows, anime, award-winning Netflix originals, and more. Watch as much as you want, anytime you want.
            </div>
          </details>
        </div>

        <form class="cta-email-form" id="landing-bottom-cta">
          <div class="cta-input-wrapper">
            <input type="email" id="landing-email-bottom" class="cta-input" placeholder=" " required autocomplete="email">
            <label for="landing-email-bottom" class="cta-label">Email address</label>
          </div>
          <button type="submit" class="btn-get-started">
            Get Started
            <svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
          </button>
        </form>
      </section>

      <!-- Footer -->
      <footer class="landing-footer">
        <div class="footer-top">Questions? Call <a href="tel:0008009191694">000-800-919-1694</a></div>
        <ul class="footer-links-grid">
          <li><a href="#faq">FAQ</a></li>
          <li><a href="#">Help Centre</a></li>
          <li><a href="#">Account</a></li>
          <li><a href="#">Media Centre</a></li>
          <li><a href="#">Investor Relations</a></li>
          <li><a href="#">Jobs</a></li>
          <li><a href="#">Ways to Watch</a></li>
          <li><a href="#">Terms of Use</a></li>
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Corporate Information</a></li>
          <li><a href="#">Speed Test</a></li>
          <li><a href="#">Only on Netflix</a></li>
        </ul>
        <p class="footer-country">Netflix India &bull; Engineering Prototype</p>
      </footer>
    `;
  }

  // 2. Sign Up Page
  renderSignupPage() {
    const prefilledEmail = sessionStorage.getItem('netflix_signup_email') || '';

    return `
      <div class="auth-wrapper">
        <header class="auth-header">
          <div class="netflix-logo" data-route="/">NETFLIX</div>
          <button class="btn-primary-red" data-route="/login">Sign In</button>
        </header>

        <main class="auth-card-container">
          <div class="auth-card">
            <span class="auth-step-badge">STEP 1 OF 2</span>
            <h1 class="auth-title">Create a password to start your membership</h1>
            <p class="auth-subtitle">Just a few more steps and you're done! We hate paperwork, too.</p>

            <div id="auth-error-banner" class="auth-error-banner">
              <span id="auth-error-text"></span>
            </div>

            <form id="signup-form">
              <div class="form-group">
                <input type="text" id="signup-name" class="form-control" placeholder=" " required autocomplete="name">
                <label for="signup-name" class="form-label">Full Name</label>
              </div>

              <div class="form-group">
                <input type="email" id="signup-email" class="form-control" placeholder=" " value="${prefilledEmail}" required autocomplete="email" inputmode="email">
                <label for="signup-email" class="form-label">Email address</label>
              </div>

              <div class="form-group">
                <input type="password" id="signup-password" class="form-control" placeholder=" " required minlength="6" autocomplete="new-password">
                <label for="signup-password" class="form-label">Add a password (min 6 characters)</label>
                <button type="button" class="password-toggle-btn" id="signup-password-toggle">SHOW</button>
              </div>

              <!-- Password Strength Meter -->
              <div class="password-strength-container" id="password-strength-container">
                <div class="password-strength-bar">
                  <div class="password-strength-fill" id="password-strength-fill"></div>
                </div>
                <div class="password-strength-text">
                  <span>Strength</span>
                  <span id="password-strength-label">Weak</span>
                </div>
              </div>

              <!-- Choose Plan -->
              <label style="font-size:0.85rem; color:#aaa; margin-bottom:8px; display:block;">Select your streaming plan:</label>
              <div class="plans-grid">
                <div class="plan-card" data-plan="Mobile">
                  <div class="plan-name">Mobile</div>
                  <div class="plan-price">₹149</div>
                  <div class="plan-res">480p</div>
                </div>
                <div class="plan-card" data-plan="Basic">
                  <div class="plan-name">Basic</div>
                  <div class="plan-price">₹199</div>
                  <div class="plan-res">720p HD</div>
                </div>
                <div class="plan-card" data-plan="Standard">
                  <div class="plan-name">Standard</div>
                  <div class="plan-price">₹499</div>
                  <div class="plan-res">1080p FHD</div>
                </div>
                <div class="plan-card active" data-plan="Premium">
                  <div class="plan-name">Premium</div>
                  <div class="plan-price">₹649</div>
                  <div class="plan-res">4K + HDR</div>
                </div>
              </div>

              <button type="submit" class="btn-auth-submit" id="btn-submit-signup">
                Next &mdash; Start Membership
              </button>
            </form>

            <div class="auth-divider"><span>OR</span></div>

            <button type="button" class="btn-demo-login" id="btn-quick-signup">
              ⚡ Quick Auto-Fill Test Account
            </button>

            <div class="auth-switch-text">
              Already have an account? <a href="/login" class="auth-switch-link" data-route="/login">Sign in now</a>.
            </div>
            <p class="auth-captcha-text">
              This page is protected by Google reCAPTCHA to ensure you're not a bot.
            </p>
          </div>
        </main>

        <footer class="landing-footer" style="padding-top:20px;">
          <p class="footer-country">Questions? Contact Support &bull; Netflix System</p>
        </footer>
      </div>
    `;
  }

  // 3. Log In Page
  renderLoginPage() {
    return `
      <div class="auth-wrapper">
        <header class="auth-header">
          <div class="netflix-logo" data-route="/">NETFLIX</div>
        </header>

        <main class="auth-card-container">
          <div class="auth-card">
            <h1 class="auth-title">Sign In</h1>

            <div id="auth-error-banner" class="auth-error-banner">
              <span id="auth-error-text"></span>
            </div>

            <form id="login-form">
              <div class="form-group">
                <input type="email" id="login-email" class="form-control" placeholder=" " required autocomplete="email" inputmode="email">
                <label for="login-email" class="form-label">Email or mobile number</label>
              </div>

              <div class="form-group">
                <input type="password" id="login-password" class="form-control" placeholder=" " required autocomplete="current-password">
                <label for="login-password" class="form-label">Password</label>
                <button type="button" class="password-toggle-btn" id="login-password-toggle">SHOW</button>
              </div>

              <button type="submit" class="btn-auth-submit" id="btn-submit-login">
                Sign In
              </button>
            </form>

            <div class="auth-divider"><span>OR</span></div>

            <!-- Instant One-Click Demo Login -->
            <button type="button" class="btn-demo-login" id="btn-quick-demo">
              🚀 One-Click Demo Evaluator Login (demo@netflix.com)
            </button>

            <div class="form-helper-row">
              <label class="remember-checkbox">
                <input type="checkbox" checked>
                <span>Remember me</span>
              </label>
              <a href="#" class="help-link">Need help?</a>
            </div>

            <div class="auth-switch-text">
              New to Netflix? <a href="/signup" class="auth-switch-link" data-route="/signup">Sign up now</a>.
            </div>
            <p class="auth-captcha-text">
              This page is protected by Google reCAPTCHA to ensure you're not a bot. Learn more.
            </p>
          </div>
        </main>

        <footer class="landing-footer" style="padding-top:20px;">
          <p class="footer-country">Questions? Contact Support &bull; Netflix System</p>
        </footer>
      </div>
    `;
  }

  // 4. Authenticated Browse Dashboard (The Living Netflix Experience)
  renderBrowseDashboard() {
    const featured = this.movies[0] || {};
    const isInWatchlist = this.watchlist.some(m => m.id === featured.id);

    // Filter movies based on category and search
    let displayedMovies = [...this.movies];

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      displayedMovies = displayedMovies.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.overview.toLowerCase().includes(q) ||
        m.genres.some(g => g.toLowerCase().includes(q))
      );
    }

    const trending = displayedMovies.filter(m => m.category === 'trending');
    const top10 = displayedMovies.filter(m => m.top10Rank).sort((a, b) => a.top10Rank - b.top10Rank);
    const scifi = displayedMovies.filter(m => m.genres.includes('Sci-Fi') || m.category === 'scifi');
    const action = displayedMovies.filter(m => m.genres.includes('Action') || m.category === 'action');
    const drama = displayedMovies.filter(m => m.genres.includes('Drama') || m.category === 'drama');

    return `
      <div class="browse-container">
        <!-- Netflix Main Header -->
        <header class="netflix-header" id="browse-header">
          <div class="header-left">
            <div class="netflix-logo" data-route="/browse">NETFLIX</div>
            <ul class="nav-links">
              <li class="nav-item ${this.activeCategory === 'all' && !this.searchQuery ? 'active' : ''}"><a data-category="all" data-route="/browse">Home</a></li>
              <li class="nav-item ${this.activeCategory === 'tv' ? 'active' : ''}"><a data-category="tv">TV Shows</a></li>
              <li class="nav-item ${this.activeCategory === 'movies' ? 'active' : ''}"><a data-category="movies">Movies</a></li>
              <li class="nav-item ${this.activeCategory === 'trending' ? 'active' : ''}"><a data-category="trending">New & Popular</a></li>
              <li class="nav-item ${this.activeCategory === 'mylist' ? 'active' : ''}"><a data-category="mylist" data-route="/mylist">My List (${this.watchlist.length})</a></li>
            </ul>
          </div>

          <div class="header-right">
            <!-- Search Bar -->
            <div class="search-container" id="search-container">
              <button class="search-toggle-btn" id="search-toggle" title="Search movies">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>
              <input type="text" id="search-input" class="search-input-box" placeholder="Titles, people, genres..." value="${this.searchQuery}">
            </div>

            <!-- User Menu -->
            <div class="user-profile-menu" id="user-menu-trigger">
              <img src="${this.currentUser.avatar}" alt="${this.currentUser.name}" class="user-avatar-img">
              <div class="profile-caret"></div>
              
              <div class="profile-dropdown" id="user-dropdown">
                <div class="profile-dropdown-user">
                  <div class="profile-user-name">${this.currentUser.name}</div>
                  <div class="profile-user-plan">${this.currentUser.plan}</div>
                </div>
                <a href="/mylist" data-route="/mylist">📋 My List (${this.watchlist.length})</a>
                <button type="button" id="btn-logout">🚪 Sign Out of Netflix</button>
              </div>
            </div>
          </div>
        </header>

        <!-- Search Results View (If active search) -->
        ${this.searchQuery ? `
          <div style="padding: 120px 4% 40px;">
            <h2 style="font-size: 1.5rem; margin-bottom: 20px;">Search results for "${this.searchQuery}" (${displayedMovies.length} found)</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px;">
              ${displayedMovies.map(m => this.renderMovieCard(m)).join('')}
            </div>
          </div>
        ` : `
          <!-- Hero Billboard Spotlight (If Home) -->
          ${this.activeCategory !== 'mylist' && featured.id ? `
            <section class="billboard" style="background-image: url('${featured.backdrop}')">
              <div class="billboard-vignette"></div>
              <div class="billboard-content">
                <div class="billboard-badge">
                  <span class="billboard-badge-icon">N</span>
                  <span>SERIES &bull; #1 IN TV SHOWS TODAY</span>
                </div>
                <h1 class="billboard-title">${featured.title}</h1>
                <div class="billboard-meta">
                  <span class="match-score">${featured.matchScore}% Match</span>
                  <span class="age-badge">${featured.ageRating}</span>
                  <span class="quality-badge">${featured.quality}</span>
                  <span style="color:#bbb;">${featured.duration}</span>
                </div>
                <p class="billboard-desc">${featured.overview}</p>
                <div class="billboard-actions">
                  <button class="btn-billboard-play" data-play-id="${featured.id}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    Play
                  </button>
                  <button class="btn-billboard-info" data-info-id="${featured.id}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    More Info
                  </button>
                  <button class="btn-billboard-list ${isInWatchlist ? 'in-list' : ''}" data-watchlist-id="${featured.id}">
                    ${isInWatchlist 
                      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> In My List`
                      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> My List`}
                  </button>
                </div>
              </div>
            </section>
          ` : ''}

          <!-- Category Carousels Container -->
          <main class="rows-container" style="${this.activeCategory === 'mylist' ? 'padding-top:100px;' : ''}">
            
            <!-- 1. My List Row (Persisted in SQLite database) -->
            ${this.watchlist.length > 0 ? `
              <div class="category-row">
                <div class="category-header">
                  <h2 class="category-title">
                    <span>My List &bull; Saved to Database</span>
                    <span style="font-size:0.8rem; font-weight:normal; color:#888;">(${this.watchlist.length} items)</span>
                  </h2>
                </div>
                <div class="movie-slider">
                  ${this.watchlist.map(m => this.renderMovieCard(m)).join('')}
                </div>
              </div>
            ` : (this.activeCategory === 'mylist' ? `
              <div style="padding: 40px 4%; text-align:center;">
                <h2 style="font-size:1.8rem; margin-bottom:12px;">Your list is currently empty</h2>
                <p style="color:#aaa; margin-bottom:24px;">Explore our trending titles and click "+ My List" to save movies and shows directly to your personal database.</p>
                <button class="btn-primary-red" data-category="all" data-route="/browse">Explore Catalog</button>
              </div>
            ` : '')}

            ${this.activeCategory !== 'mylist' ? `
              <!-- 2. Trending Now Row -->
              <div class="category-row">
                <div class="category-header">
                  <h2 class="category-title">Trending Now</h2>
                </div>
                <div class="movie-slider">
                  ${trending.map(m => this.renderMovieCard(m)).join('')}
                </div>
              </div>

              <!-- 3. Top 10 in India Today Row -->
              <div class="category-row">
                <div class="category-header">
                  <h2 class="category-title">Top 10 Movies & TV Shows Today</h2>
                </div>
                <div class="movie-slider">
                  ${top10.map(m => this.renderTop10Card(m)).join('')}
                </div>
              </div>

              <!-- 4. Sci-Fi & Cyberpunk Row -->
              <div class="category-row">
                <div class="category-header">
                  <h2 class="category-title">Mind-Bending &amp; Sci-Fi</h2>
                </div>
                <div class="movie-slider">
                  ${scifi.map(m => this.renderMovieCard(m)).join('')}
                </div>
              </div>

              <!-- 5. Action & High Stakes Row -->
              <div class="category-row">
                <div class="category-header">
                  <h2 class="category-title">Action &amp; Thrillers</h2>
                </div>
                <div class="movie-slider">
                  ${action.map(m => this.renderMovieCard(m)).join('')}
                </div>
              </div>

              <!-- 6. Critically Acclaimed Dramas Row -->
              <div class="category-row">
                <div class="category-header">
                  <h2 class="category-title">Critically Acclaimed Dramas</h2>
                </div>
                <div class="movie-slider">
                  ${drama.map(m => this.renderMovieCard(m)).join('')}
                </div>
              </div>
            ` : ''}

          </main>
        `}

        <!-- Interactive Movie Detail & Video Player Modal Dialog (<dialog>) -->
        <dialog id="movie-detail-dialog"></dialog>
      </div>
    `;
  }

  // Render individual movie card
  renderMovieCard(movie) {
    const isInList = this.watchlist.some(m => m.id === movie.id);
    const rating = this.ratings[movie.id];

    return `
      <div class="movie-card" data-movie-id="${movie.id}">
        <img src="${movie.backdrop}" alt="${movie.title}" loading="lazy">
        <div class="movie-card-overlay">
          <div class="movie-card-title">${movie.title}</div>
          <div class="movie-card-actions">
            <button class="card-btn card-btn-play" data-play-id="${movie.id}" title="Play preview">▶</button>
            <button class="card-btn ${isInList ? 'active' : ''}" data-watchlist-id="${movie.id}" title="${isInList ? 'Remove from My List' : 'Add to My List'}">
              ${isInList ? '✓' : '+'}
            </button>
            <button class="card-btn ${rating === 'like' ? 'active' : ''}" data-rate-id="${movie.id}" data-rating="like" title="I like this">👍</button>
            <button class="card-btn" data-info-id="${movie.id}" style="margin-left:auto;" title="More Info">⌄</button>
          </div>
          <div class="movie-card-info">
            <span class="match-score">${movie.matchScore}% Match</span>
            <span class="age-badge">${movie.ageRating}</span>
            <span style="color:#aaa;">${movie.duration}</span>
          </div>
          <div class="movie-card-genres">${movie.genres.join(' &bull; ')}</div>
        </div>
      </div>
    `;
  }

  // Render Top 10 Ranked Card
  renderTop10Card(movie) {
    return `
      <div class="top10-card" data-info-id="${movie.id}">
        <div class="top10-rank">${movie.top10Rank}</div>
        <div class="top10-poster">
          <img src="${movie.poster}" alt="${movie.title}" loading="lazy">
        </div>
      </div>
    `;
  }

  /* ══════════════════════════════════════════════
     EVENT ATTACHMENTS
  ══════════════════════════════════════════════ */
  attachLandingEvents() {
    const handleCta = (e, inputId) => {
      e.preventDefault();
      const val = document.getElementById(inputId).value;
      if (val) {
        sessionStorage.setItem('netflix_signup_email', val);
      }
      this.navigate('/signup');
    };

    const form1 = document.getElementById('landing-cta-form');
    if (form1) form1.addEventListener('submit', (e) => handleCta(e, 'landing-email-input'));

    const form2 = document.getElementById('landing-bottom-cta');
    if (form2) form2.addEventListener('submit', (e) => handleCta(e, 'landing-email-bottom'));
  }

  attachLoginEvents() {
    const form = document.getElementById('login-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const btn = document.getElementById('btn-submit-login');
        btn.disabled = true;
        btn.innerText = 'Signing In...';
        await this.handleLogin(email, password);
        btn.disabled = false;
        btn.innerText = 'Sign In';
      });
    }

    // One-Click Demo Evaluator Login
    const demoBtn = document.getElementById('btn-quick-demo');
    if (demoBtn) {
      demoBtn.addEventListener('click', async () => {
        document.getElementById('login-email').value = 'demo@netflix.com';
        document.getElementById('login-password').value = 'password123';
        demoBtn.disabled = true;
        demoBtn.innerText = 'Logging into Demo...';
        await this.handleLogin('demo@netflix.com', 'password123');
      });
    }

    // Password Toggle
    const toggleBtn = document.getElementById('login-password-toggle');
    const pwdInput = document.getElementById('login-password');
    if (toggleBtn && pwdInput) {
      toggleBtn.addEventListener('click', () => {
        const isPwd = pwdInput.type === 'password';
        pwdInput.type = isPwd ? 'text' : 'password';
        toggleBtn.innerText = isPwd ? 'HIDE' : 'SHOW';
      });
    }
  }

  attachSignupEvents() {
    const form = document.getElementById('signup-form');
    const pwdInput = document.getElementById('signup-password');
    const strengthBar = document.getElementById('password-strength-fill');
    const strengthLabel = document.getElementById('password-strength-label');
    const strengthContainer = document.getElementById('password-strength-container');

    // Live Password Strength Meter
    if (pwdInput && strengthBar) {
      pwdInput.addEventListener('input', () => {
        const val = pwdInput.value;
        if (!val) {
          strengthContainer.style.display = 'none';
          return;
        }
        strengthContainer.style.display = 'block';

        let score = 0;
        if (val.length >= 6) score++;
        if (val.length >= 10) score++;
        if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;

        if (score <= 1) {
          strengthBar.style.width = '33%';
          strengthBar.style.backgroundColor = '#e50914';
          strengthLabel.innerText = 'Weak';
          strengthLabel.style.color = '#e50914';
        } else if (score === 2) {
          strengthBar.style.width = '66%';
          strengthBar.style.backgroundColor = '#ffa00a';
          strengthLabel.innerText = 'Medium';
          strengthLabel.style.color = '#ffa00a';
        } else {
          strengthBar.style.width = '100%';
          strengthBar.style.backgroundColor = '#46d369';
          strengthLabel.innerText = 'Strong';
          strengthLabel.style.color = '#46d369';
        }
      });
    }

    // Plan Selection
    const planCards = document.querySelectorAll('.plan-card');
    planCards.forEach(card => {
      card.addEventListener('click', () => {
        planCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const btn = document.getElementById('btn-submit-signup');
        btn.disabled = true;
        btn.innerText = 'Creating Account...';
        await this.handleSignup(name, email, password);
        btn.disabled = false;
        btn.innerText = 'Next — Start Membership';
      });
    }

    // Quick Auto-Fill Test Account
    const quickBtn = document.getElementById('btn-quick-signup');
    if (quickBtn) {
      quickBtn.addEventListener('click', () => {
        const rand = Math.floor(1000 + Math.random() * 9000);
        document.getElementById('signup-name').value = 'SRM Evaluator';
        document.getElementById('signup-email').value = `evaluator_${rand}@netflix.com`;
        document.getElementById('signup-password').value = 'securepass2026';
        if (pwdInput) pwdInput.dispatchEvent(new Event('input'));
      });
    }

    // Password Toggle
    const toggleBtn = document.getElementById('signup-password-toggle');
    if (toggleBtn && pwdInput) {
      toggleBtn.addEventListener('click', () => {
        const isPwd = pwdInput.type === 'password';
        pwdInput.type = isPwd ? 'text' : 'password';
        toggleBtn.innerText = isPwd ? 'HIDE' : 'SHOW';
      });
    }
  }

  attachBrowseEvents() {
    // Header scroll background toggle
    const header = document.getElementById('browse-header');
    window.addEventListener('scroll', () => {
      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 50);
      }
    });

    // Profile Dropdown Toggle
    const profileTrigger = document.getElementById('user-menu-trigger');
    const profileDropdown = document.getElementById('user-dropdown');
    if (profileTrigger && profileDropdown) {
      profileTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('open');
      });
      document.addEventListener('click', () => {
        profileDropdown.classList.remove('open');
      });
    }

    // Logout
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleLogout();
      });
    }

    // Search Toggle & Input (Debounced)
    const searchContainer = document.getElementById('search-container');
    const searchToggle = document.getElementById('search-toggle');
    const searchInput = document.getElementById('search-input');

    if (searchToggle && searchContainer && searchInput) {
      searchToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        searchContainer.classList.toggle('active');
        if (searchContainer.classList.contains('active')) {
          searchInput.focus();
        }
      });

      let debounceTimeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          this.searchQuery = e.target.value.trim();
          this.renderCurrentRoute();
        }, 250);
      });
    }

    // Category Nav Item Clicks
    const navCategoryLinks = document.querySelectorAll('[data-category]');
    navCategoryLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = link.getAttribute('data-category');
        this.activeCategory = cat;
        this.searchQuery = '';
        this.renderCurrentRoute();
      });
    });
  }

  setupGlobalEvents() {
    // Delegate clicks for Play, Info, Watchlist, Ratings across cards and billboards
    document.addEventListener('click', (e) => {
      // 1. Play Button
      const playBtn = e.target.closest('[data-play-id]');
      if (playBtn) {
        e.stopPropagation();
        const id = playBtn.getAttribute('data-play-id');
        this.openMovieModal(id, true);
        return;
      }

      // 2. Info Button
      const infoBtn = e.target.closest('[data-info-id]');
      if (infoBtn) {
        e.stopPropagation();
        const id = infoBtn.getAttribute('data-info-id');
        this.openMovieModal(id, false);
        return;
      }

      // 3. Watchlist Toggle Button (CRUD)
      const listBtn = e.target.closest('[data-watchlist-id]');
      if (listBtn) {
        e.stopPropagation();
        const id = listBtn.getAttribute('data-watchlist-id');
        this.toggleWatchlist(id);
        return;
      }

      // 4. Rate Button
      const rateBtn = e.target.closest('[data-rate-id]');
      if (rateBtn) {
        e.stopPropagation();
        const id = rateBtn.getAttribute('data-rate-id');
        const rating = rateBtn.getAttribute('data-rating');
        this.rateMovie(id, rating);
        return;
      }
    });
  }

  /* ══════════════════════════════════════════════
     INTERACTIVE DETAIL MODAL & VIDEO PLAYER (<dialog>)
  ══════════════════════════════════════════════ */
  openMovieModal(movieId, autoPlay = false) {
    const movie = this.movies.find(m => m.id === movieId);
    if (!movie) return;

    this.selectedMovie = movie;
    const dialog = document.getElementById('movie-detail-dialog');
    if (!dialog) return;

    const isInList = this.watchlist.some(m => m.id === movie.id);
    const similar = this.movies.filter(m => m.id !== movie.id && m.genres.some(g => movie.genres.includes(g))).slice(0, 3);

    dialog.innerHTML = `
      <div class="modal-header-hero" style="background-image: url('${movie.backdrop}')">
        <div class="modal-hero-vignette"></div>
        <button class="modal-close-btn" id="modal-close-btn" aria-label="Close dialog">✕</button>

        <!-- Video Player Overlay (Revealed on Play) -->
        <div class="modal-video-container" id="modal-video-container">
          <button class="modal-video-close" id="modal-video-close" title="Exit player">✕</button>
          <video id="modal-active-video" controls poster="${movie.backdrop}">
            <source src="${movie.videoUrl}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>

        <div class="modal-hero-content">
          <h2 class="modal-title">${movie.title}</h2>
          <div class="modal-actions">
            <button class="btn-billboard-play" id="modal-play-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              ${autoPlay ? 'Restart' : 'Play'}
            </button>
            <button class="btn-billboard-list ${isInList ? 'in-list' : ''}" data-watchlist-id="${movie.id}">
              ${isInList 
                ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> In My List`
                : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> My List`}
            </button>
          </div>
        </div>
      </div>

      <div class="modal-body">
        <div class="modal-left">
          <div class="modal-meta-row">
            <span class="match-score">${movie.matchScore}% Match</span>
            <span class="age-badge">${movie.ageRating}</span>
            <span style="color:#aaa;">${movie.duration}</span>
            <span class="quality-badge">${movie.quality}</span>
            <span class="quality-badge" style="border-color:#555;">${movie.audio || '5.1'}</span>
          </div>
          <p class="modal-synopsis">${movie.overview}</p>
        </div>

        <div class="modal-right">
          <div class="modal-detail-item">
            <b>Cast:</b> <span>${movie.cast.join(', ')}</span>
          </div>
          <div class="modal-detail-item">
            <b>Genres:</b> <span>${movie.genres.join(', ')}</span>
          </div>
          <div class="modal-detail-item">
            <b>Creator:</b> <span>${movie.creator || 'Netflix Studios'}</span>
          </div>
        </div>
      </div>

      <!-- More Like This Grid -->
      <div style="padding: 0 35px 35px;">
        <h3 style="font-size:1.3rem; margin-bottom:16px;">More Like This</h3>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:14px;">
          ${similar.map(s => `
            <div class="movie-card" data-info-id="${s.id}" style="aspect-ratio:16/9;">
              <img src="${s.backdrop}" alt="${s.title}" loading="lazy">
              <div class="movie-card-overlay">
                <div class="movie-card-title">${s.title}</div>
                <div class="movie-card-info">
                  <span class="match-score">${s.matchScore}%</span>
                  <span class="age-badge">${s.ageRating}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    dialog.showModal();

    // Close Button
    const closeBtn = document.getElementById('modal-close-btn');
    closeBtn.addEventListener('click', () => {
      this.stopModalVideo();
      dialog.close();
    });

    // Close on backdrop click
    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height
        && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!isInDialog) {
        this.stopModalVideo();
        dialog.close();
      }
    });

    // Video Player Trigger
    const playBtn = document.getElementById('modal-play-btn');
    const videoContainer = document.getElementById('modal-video-container');
    const video = document.getElementById('modal-active-video');
    const videoClose = document.getElementById('modal-video-close');

    const startPlay = () => {
      videoContainer.style.display = 'block';
      video.play().catch(e => console.log('Autoplay prevented', e));
    };

    playBtn.addEventListener('click', startPlay);
    videoClose.addEventListener('click', () => {
      video.pause();
      videoContainer.style.display = 'none';
    });

    if (autoPlay) {
      setTimeout(startPlay, 100);
    }
  }

  stopModalVideo() {
    const video = document.getElementById('modal-active-video');
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }

  /* ══════════════════════════════════════════════
     UI NOTIFICATIONS & HELPERS
  ══════════════════════════════════════════════ */
  showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✓' : (type === 'error' ? '⚠' : 'ℹ')}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOutToast 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  showAuthError(msg) {
    const banner = document.getElementById('auth-error-banner');
    const text = document.getElementById('auth-error-text');
    if (banner && text) {
      text.innerText = msg;
      banner.style.display = 'flex';
    }
  }
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new NetflixApp();
});
