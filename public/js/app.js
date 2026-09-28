/* ══════════════════════════════════════════════════════════════
   NETFLIX FULL-STACK CLIENT APPLICATION
   State Management, Client-Side Router, Auth & Cinema Player
══════════════════════════════════════════════════════════════ */

class NetflixApp {
  constructor() {
    this.currentUser = null;
    this.movies = [];
    this.watchlist = [];
    this.continueWatching = [];
    this.ratings = {};
    this.activeCategory = 'all';
    this.activeLanguageFilter = 'all';
    this.searchQuery = '';
    this.selectedMovie = null;
    this.activeCinemaMovie = null;
    this.activeEpisodeIndex = 0;
    this.currentSubTrack = 'en';
    this.currentAudioTrack = 'en-orig';
    this.isMuted = false;
    this.idleTimer = null;
    this.speeds = [1, 1.25, 1.5, 0.75];
    this.speedIndex = 0;
    this.currentLang = 'en';
    this.playbackThrottleTimer = null;
    this.preferences = { audio_language: 'en-orig', subtitle_language: 'en', playback_speed: 1.0 };

    this.init();
  }

  async init() {
    this.setupRouter();
    await this.checkAuthSession();
    await this.fetchMovies();
    this.setupCinemaPlayer();
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
      const el = e.target.closest('[data-route]');
      if (el) {
        e.preventDefault();
        const route = el.getAttribute('data-route') || el.getAttribute('href');
        if (route) {
          this.navigate(route);
        }
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
        await this.fetchContinueWatching();
        await this.fetchPreferences();
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

  async fetchContinueWatching() {
    if (!this.currentUser) return;
    try {
      const res = await fetch('/api/playback');
      if (res.ok) {
        const data = await res.json();
        this.continueWatching = data.continueWatching || [];
      }
    } catch (e) {
      console.error('Error fetching playback history:', e);
    }
  }

  async fetchPreferences() {
    if (!this.currentUser) return;
    try {
      const res = await fetch('/api/preferences');
      if (res.ok) {
        const data = await res.json();
        if (data.preferences) {
          this.preferences = data.preferences;
          this.currentAudioTrack = data.preferences.audio_language || 'en-orig';
          this.currentSubTrack = data.preferences.subtitle_language || 'en';
        }
      }
    } catch (e) {
      console.error('Error fetching preferences:', e);
    }
  }

  async savePreferences(prefs) {
    if (!this.currentUser) return;
    try {
      await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs)
      });
      Object.assign(this.preferences, prefs);
    } catch (e) {}
  }

  async recordPlaybackProgress(movieId, progressSecs, durationSecs, completed = 0) {
    if (!this.currentUser || !movieId) return;
    try {
      await fetch(`/api/playback/${movieId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          progressSeconds: Math.floor(progressSecs),
          durationSeconds: Math.floor(durationSecs),
          completed
        })
      });
    } catch (e) {}
  }

  async removeContinueWatching(movieId) {
    if (!this.currentUser) return;
    try {
      const res = await fetch(`/api/playback/${movieId}`, { method: 'DELETE' });
      if (res.ok) {
        this.continueWatching = this.continueWatching.filter(m => m.id !== movieId);
        const card = document.querySelector(`[data-continue-card-id="${movieId}"]`);
        if (card) {
          card.style.transform = 'scale(0.8)';
          card.style.opacity = '0';
          setTimeout(() => {
            card.remove();
            if (this.continueWatching.length === 0) {
              const row = document.getElementById('continue-watching-row');
              if (row) row.remove();
            }
          }, 200);
        }
        this.showToast('Removed from Continue Watching', 'info');
      }
    } catch (e) {
      this.showToast('Failed to remove item', 'error');
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
      await this.fetchWatchlist();
      await this.fetchContinueWatching();
      await this.fetchPreferences();
      this.showToast(`Welcome to Netflix, ${data.user.name}!`, 'success');
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
      await this.fetchWatchlist();
      await this.fetchContinueWatching();
      await this.fetchPreferences();
      this.showToast(`Welcome back, ${data.user.name}`, 'success');
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
    this.showToast('You have been signed out.', 'info');
    this.navigate('/');
  }

  /* ══════════════════════════════════════════════
     WATCHLIST CRUD (SQLite Backend)
  ══════════════════════════════════════════════ */
  async toggleWatchlist(movieId) {
    if (!this.currentUser) return this.navigate('/login');

    const inList = this.watchlist.some(m => m.id === movieId);
    const movie = this.movies.find(m => m.id === movieId);

    try {
      if (inList) {
        const res = await fetch(`/api/watchlist/${movieId}`, { method: 'DELETE' });
        if (res.ok) {
          this.watchlist = this.watchlist.filter(m => m.id !== movieId);
          this.showToast(`Removed "${movie?.title || 'Title'}" from My List`, 'info');
        }
      } else {
        const res = await fetch('/api/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ movieId })
        });
        if (res.ok) {
          if (movie) this.watchlist.push(movie);
          this.showToast(`Added "${movie?.title || 'Title'}" to My List`, 'success');
        }
      }
      this.updateWatchlistBadges();
      if (this.activeCategory === 'mylist') {
        this.renderCurrentRoute();
      }
    } catch (err) {
      this.showToast('Failed to update watchlist', 'error');
    }
  }

  updateWatchlistBadges() {
    document.querySelectorAll('[data-watchlist-id]').forEach(btn => {
      const id = btn.getAttribute('data-watchlist-id');
      const isIn = this.watchlist.some(m => m.id === id);
      if (btn.classList.contains('btn-billboard-list')) {
        btn.innerHTML = isIn 
          ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> In My List`
          : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> My List`;
        btn.classList.toggle('in-list', isIn);
      } else if (btn.classList.contains('card-btn-list')) {
        btn.innerHTML = isIn ? '✓' : '+';
        btn.setAttribute('title', isIn ? 'Remove from My List' : 'Add to My List');
        btn.classList.toggle('in-list', isIn);
      }
    });
  }

  async rateMovie(movieId, rating) {
    if (!this.currentUser) return this.navigate('/login');
    const current = this.ratings[movieId];
    const newRating = current === rating ? 'none' : rating;

    try {
      const res = await fetch(`/api/ratings/${movieId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: newRating })
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

  // 1. Authentic Netflix Landing Page (Unauthenticated)
  renderLandingPage() {
    const isHi = this.currentLang === 'hi';
    const t = isHi ? {
      title: 'अनलिमिटेड फिल्में, टीवी शो और बहुत कुछ',
      subtitle: 'मात्र ₹149 से शुरू। कभी भी रद्द करें।',
      text: 'देखने के लिए तैयार हैं? अपनी सदस्यता बनाने या पुनः आरंभ करने के लिए अपना ईमेल दर्ज करें।',
      emailLabel: 'ईमेल पता',
      getStarted: 'शुरू करें',
      signIn: 'साइन इन',
      trendingNow: 'अभी ट्रेंडिंग में',
      trendingOpt1: 'भारत • फिल्में और शो',
      trendingOpt2: 'ग्लोबल • टॉप 10',
      moreReasons: 'शामिल होने के और कारण',
      reason1Title: 'अपने टीवी पर आनंद लें',
      reason1Desc: 'स्मार्ट टीवी, प्लेस्टेशन, एक्सबॉक्स, क्रोमकास्ट, ऐप्पल टीवी, ब्लू-रे प्लेयर और अधिक पर देखें।',
      reason2Title: 'ऑफ़लाइन देखने के लिए शो डाउनलोड करें',
      reason2Desc: 'अपने पसंदीदा आसानी से सहेजें और कहीं भी कभी भी देखें।',
      reason3Title: 'हर जगह देखें',
      reason3Desc: 'बिना अतिरिक्त शुल्क के अपने फ़ोन, टैबलेट, लैपटॉप और टीवी पर असीमित फिल्में और टीवी शो स्ट्रीम करें।',
      reason4Title: 'बच्चों के लिए प्रोफ़ाइल बनाएं',
      reason4Desc: 'बच्चों को उनके पसंदीदा किरदारों के साथ रोमांचक सफर पर भेजें — सदस्यता के साथ बिल्कुल मुफ्त।',
      faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
      q1: 'नेटफ्लिक्स क्या है?',
      a1: 'नेटफ्लिक्स एक स्ट्रीमिंग सेवा है जो हजारों इंटरनेट से जुड़े उपकरणों पर पुरस्कार विजेता टीवी शो, फिल्में, एनीमे, वृत्तचित्र और बहुत कुछ प्रदान करती है। आप बिना किसी विज्ञापन के जितना चाहें, जब चाहें देख सकते हैं।',
      q2: 'नेटफ्लिक्स की कीमत कितनी है?',
      a2: 'एक निश्चित मासिक शुल्क पर अपने स्मार्टफोन, टैबलेट, स्मार्ट टीवी, लैपटॉप या स्ट्रीमिंग डिवाइस पर नेटफ्लिक्स देखें। योजनाएं ₹149 से ₹649 प्रति माह तक हैं। कोई अतिरिक्त लागत नहीं, कोई अनुबंध नहीं।',
      q3: 'मैं कहां देख सकता हूं?',
      a3: 'कहीं भी, कभी भी देखें। अपने पर्सनल कंप्यूटर से netflix.com पर या नेटफ्लिक्स ऐप पेश करने वाले किसी भी इंटरनेट से जुड़े डिवाइस पर तुरंत देखने के लिए साइन इन करें।',
      q4: 'मैं कैसे रद्द करूं?',
      a4: 'नेटफ्लिक्स लचीला है। कोई कष्टप्रद अनुबंध नहीं है और कोई प्रतिबद्धता नहीं है। आप दो क्लिक में अपना खाता ऑनलाइन रद्द कर सकते हैं। कोई रद्दीकरण शुल्क नहीं है।',
      q5: 'मैं नेटफ्लिक्स पर क्या देख सकता हूं?',
      a5: 'नेटफ्लिक्स के पास फीचर फिल्मों, वृत्तचित्रों, टीवी शो, एनीमे, पुरस्कार विजेता नेटफ्लिक्स मूल और अधिक का एक व्यापक संग्रह है। जितना चाहें, कभी भी देखें।'
    } : {
      title: 'Unlimited movies, TV shows and more',
      subtitle: 'Starts at ₹149. Cancel at any time.',
      text: 'Ready to watch? Enter your email to create or restart your membership.',
      emailLabel: 'Email address',
      getStarted: 'Get Started',
      signIn: 'Sign In',
      trendingNow: 'Trending Now',
      trendingOpt1: 'India • Movies & Shows',
      trendingOpt2: 'Global • Top 10',
      moreReasons: 'More Reasons to Join',
      reason1Title: 'Enjoy on your TV',
      reason1Desc: 'Watch on smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players and more.',
      reason2Title: 'Download shows to watch offline',
      reason2Desc: 'Save your favourites easily and always have something to watch anywhere you go.',
      reason3Title: 'Watch everywhere',
      reason3Desc: 'Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV without paying more.',
      reason4Title: 'Create profiles for kids',
      reason4Desc: 'Send children on adventures with their favourite characters in a space made just for them — free with membership.',
      faqTitle: 'Frequently Asked Questions',
      q1: 'What is Netflix?',
      a1: 'Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries and more on thousands of internet-connected devices. You can watch as much as you want, whenever you want, without a single advert – all for one low monthly price.',
      q2: 'How much does Netflix cost?',
      a2: 'Watch Netflix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from ₹149 to ₹649 a month. No extra costs, no contracts.',
      q3: 'Where can I watch?',
      a3: 'Watch anywhere, anytime. Sign in with your Netflix account to watch instantly on the web at netflix.com from your personal computer or on any internet-connected device that offers the Netflix app.',
      q4: 'How do I cancel?',
      a4: 'Netflix is flexible. There are no annoying contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime.',
      q5: 'What can I watch on Netflix?',
      a5: 'Netflix has an extensive library of feature films, documentaries, TV shows, anime, award-winning Netflix originals, and more. Watch as much as you want, anytime you want.'
    };

    const top10 = this.movies.slice(0, 10);

    return `
      <!-- Official Netflix Header -->
      <header class="netflix-header">
        <div class="header-left">
          <a href="/" data-route="/" class="netflix-brand-link">
            <img src="/assets/netflix-logo.svg" alt="Netflix" class="netflix-brand-logo" />
          </a>
        </div>
        <div class="header-right">
          <div class="lang-picker-wrapper">
            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
            <select class="lang-picker" id="landing-lang-picker">
              <option value="en" ${!isHi ? 'selected' : ''}>English</option>
              <option value="hi" ${isHi ? 'selected' : ''}>हिन्दी</option>
            </select>
          </div>
          <a href="/login" data-route="/login" class="btn-primary-red" id="landing-signin-btn">${t.signIn}</a>
        </div>
      </header>

      <!-- Hero Section (Dark poster wall with gradient vignette) -->
      <section class="landing-hero">
        <div class="landing-hero-content">
          <h1 class="landing-title">${t.title}</h1>
          <p class="landing-subtitle">${t.subtitle}</p>
          <p class="landing-text">${t.text}</p>
          
          <form class="cta-email-form" id="landing-cta-form">
            <div class="cta-input-wrapper">
              <input type="email" id="landing-email-input" class="cta-input" placeholder=" " required autocomplete="email" inputmode="email">
              <label for="landing-email-input" class="cta-label">${t.emailLabel}</label>
            </div>
            <button type="submit" class="btn-get-started">
              ${t.getStarted}
              <svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
            </button>
          </form>
        </div>
      </section>

      <!-- Netflix Iconic Curved Red Glow Separator -->
      <div class="landing-curve-wrapper">
        <div class="landing-curve"></div>
      </div>

      <!-- Trending Now Section on Landing Page -->
      <section class="landing-trending-section">
        <div class="trending-header">
          <h2 class="trending-heading">${t.trendingNow}</h2>
          <div class="trending-filters">
            <select class="trending-select" id="landing-filter-select">
              <option value="india">${t.trendingOpt1}</option>
              <option value="global">${t.trendingOpt2}</option>
            </select>
          </div>
        </div>

        <div class="landing-top10-container">
          ${top10.map((m, idx) => `
            <div class="landing-top10-item" data-landing-play-id="${m.id}" title="Watch ${m.title} in HD">
              <span class="landing-rank-number">${idx + 1}</span>
              <div class="landing-top10-poster-wrap">
                <img src="${m.poster}" alt="${m.title}" class="landing-top10-poster" loading="lazy">
                <div class="landing-poster-overlay">
                  <span class="landing-play-pill">▶ Play Trailer</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- More Reasons to Join 4-Card Showcase -->
      <section class="reasons-section">
        <h2 class="reasons-title">${t.moreReasons}</h2>
        <div class="reasons-grid">
          <div class="reason-card">
            <h3 class="reason-card-title">${t.reason1Title}</h3>
            <p class="reason-card-desc">${t.reason1Desc}</p>
            <svg class="reason-icon" viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/></svg>
          </div>
          <div class="reason-card">
            <h3 class="reason-card-title">${t.reason2Title}</h3>
            <p class="reason-card-desc">${t.reason2Desc}</p>
            <svg class="reason-icon" viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>
          </div>
          <div class="reason-card">
            <h3 class="reason-card-title">${t.reason3Title}</h3>
            <p class="reason-card-desc">${t.reason3Desc}</p>
            <svg class="reason-icon" viewBox="0 0 24 24"><path d="M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z"/></svg>
          </div>
          <div class="reason-card">
            <h3 class="reason-card-title">${t.reason4Title}</h3>
            <p class="reason-card-desc">${t.reason4Desc}</p>
            <svg class="reason-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c.83 0 1.5-.67 1.5-1.5S7.83 8 7 8s-1.5.67-1.5 1.5S6.17 11 7 11zm10 0c.83 0 1.5-.67 1.5-1.5S17.83 8 17 8s-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>
          </div>
        </div>
      </section>

      <!-- Frequently Asked Questions -->
      <section class="faq-section">
        <h2 class="faq-heading">${t.faqTitle}</h2>
        <div class="faq-list">
          <details class="faq-item" name="faq">
            <summary class="faq-question">
              <span>${t.q1}</span>
              <span class="faq-icon">+</span>
            </summary>
            <div class="faq-answer">${t.a1}</div>
          </details>

          <details class="faq-item" name="faq">
            <summary class="faq-question">
              <span>${t.q2}</span>
              <span class="faq-icon">+</span>
            </summary>
            <div class="faq-answer">${t.a2}</div>
          </details>

          <details class="faq-item" name="faq">
            <summary class="faq-question">
              <span>${t.q3}</span>
              <span class="faq-icon">+</span>
            </summary>
            <div class="faq-answer">${t.a3}</div>
          </details>

          <details class="faq-item" name="faq">
            <summary class="faq-question">
              <span>${t.q4}</span>
              <span class="faq-icon">+</span>
            </summary>
            <div class="faq-answer">${t.a4}</div>
          </details>

          <details class="faq-item" name="faq">
            <summary class="faq-question">
              <span>${t.q5}</span>
              <span class="faq-icon">+</span>
            </summary>
            <div class="faq-answer">${t.a5}</div>
          </details>
        </div>

        <form class="cta-email-form" id="landing-bottom-cta">
          <div class="cta-input-wrapper">
            <input type="email" id="landing-email-bottom" class="cta-input" placeholder=" " required autocomplete="email">
            <label for="landing-email-bottom" class="cta-label">${t.emailLabel}</label>
          </div>
          <button type="submit" class="btn-get-started">
            ${t.getStarted}
            <svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
          </button>
        </form>
      </section>

      <!-- Official Netflix Footer -->
      <footer class="landing-footer">
        <div class="footer-top">Questions? Call <a href="tel:0008009191694">000-800-919-1694</a></div>
        <ul class="footer-links-grid">
          <li><a href="#">FAQ</a></li>
          <li><a href="#">Help Centre</a></li>
          <li><a href="#">Account</a></li>
          <li><a href="#">Media Centre</a></li>
          <li><a href="#">Investor Relations</a></li>
          <li><a href="#">Jobs</a></li>
          <li><a href="#">Ways to Watch</a></li>
          <li><a href="#">Terms of Use</a></li>
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Cookie Preferences</a></li>
          <li><a href="#">Corporate Information</a></li>
          <li><a href="#">Contact Us</a></li>
          <li><a href="#">Speed Test</a></li>
          <li><a href="#">Legal Notices</a></li>
          <li><a href="#">Only on Netflix</a></li>
        </ul>
        <div class="footer-lang-container">
          <div class="lang-picker-wrapper">
            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
            <select class="lang-picker">
              <option value="en" ${!isHi ? 'selected' : ''}>English</option>
              <option value="hi" ${isHi ? 'selected' : ''}>हिन्दी</option>
            </select>
          </div>
        </div>
        <div class="footer-country">Netflix India</div>
      </footer>
    `;
  }

  attachLandingEvents() {
    const handleCta = (e, inputId) => {
      e.preventDefault();
      const input = document.getElementById(inputId);
      const email = input ? input.value.trim() : '';
      if (email) {
        sessionStorage.setItem('prefill_email', email);
      }
      this.navigate('/signup');
    };

    const topForm = document.getElementById('landing-cta-form');
    if (topForm) topForm.addEventListener('submit', (e) => handleCta(e, 'landing-email-input'));

    const btmForm = document.getElementById('landing-bottom-cta');
    if (btmForm) btmForm.addEventListener('submit', (e) => handleCta(e, 'landing-email-bottom'));

    // Language switchers
    document.querySelectorAll('.lang-picker').forEach(picker => {
      picker.addEventListener('change', (e) => {
        this.currentLang = e.target.value;
        this.renderCurrentRoute();
      });
    });

    // Landing Sign In button direct listener
    const signInBtn = document.getElementById('landing-signin-btn');
    if (signInBtn) {
      signInBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigate('/login');
      });
    }

    // Landing Page Top 10 Click -> Play in Cinema Player
    document.querySelectorAll('[data-landing-play-id]').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-landing-play-id');
        this.openCinemaPlayer(id);
      });
    });
  }

  // 2. Sign In Page
  renderLoginPage() {
    return `
      <div class="auth-wrapper">
        <header class="auth-header">
          <a href="/" data-route="/" class="netflix-brand-link">
            <img src="/assets/netflix-logo.svg" alt="Netflix" class="netflix-brand-logo" />
          </a>
        </header>

        <main class="auth-card-container">
          <div class="auth-card">
            <h1 class="auth-title">Sign In</h1>

            <div class="auth-error-banner" id="auth-error-banner">
              <span id="auth-error-text">Incorrect password or email.</span>
            </div>

            <form class="auth-form" id="login-form">
              <div class="form-group">
                <input type="email" id="login-email" class="form-control" placeholder=" " required autocomplete="email">
                <label for="login-email" class="form-label">Email or mobile number</label>
              </div>

              <div class="form-group">
                <input type="password" id="login-password" class="form-control" placeholder=" " required autocomplete="current-password">
                <label for="login-password" class="form-label">Password</label>
              </div>

              <button type="submit" class="btn-auth-submit" id="btn-login-submit">Sign In</button>

              <div class="auth-divider"><span>OR</span></div>

              <button type="button" class="btn-demo-login" id="btn-quick-demo">
                ⚡ Use One-Click Demo Account (Instant Access)
              </button>

              <div class="form-helper-row">
                <label class="remember-checkbox">
                  <input type="checkbox" checked>
                  <span>Remember me</span>
                </label>
                <a href="#" class="help-link" id="link-forgot-pw">Need help?</a>
              </div>
            </form>

            <div class="auth-switch-text">
              New to Netflix? <a href="/signup" data-route="/signup" class="auth-switch-link">Sign up now</a>.
            </div>

            <div class="auth-captcha-text">
              This page is protected by Google reCAPTCHA to ensure you're not a bot.
            </div>
          </div>
        </main>

        <footer class="landing-footer" style="background: rgba(0,0,0,0.85); border-top: 1px solid #333;">
          <div class="footer-top">Questions? Call <a href="tel:0008009191694">000-800-919-1694</a></div>
          <ul class="footer-links-grid">
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Help Centre</a></li>
            <li><a href="#">Terms of Use</a></li>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Cookie Preferences</a></li>
            <li><a href="#">Corporate Information</a></li>
          </ul>
        </footer>
      </div>
    `;
  }

  attachLoginEvents() {
    const form = document.getElementById('login-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const pass = document.getElementById('login-password').value;
        this.handleLogin(email, pass);
      });
    }

    const demoBtn = document.getElementById('btn-quick-demo');
    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
        document.getElementById('login-email').value = 'demo@netflix.com';
        document.getElementById('login-password').value = 'password123';
        this.handleLogin('demo@netflix.com', 'password123');
      });
    }

    const forgotPw = document.getElementById('link-forgot-pw');
    if (forgotPw) {
      forgotPw.addEventListener('click', (e) => {
        e.preventDefault();
        this.showToast('Demo Credentials: demo@netflix.com / password123', 'info');
      });
    }
  }

  // 3. Sign Up Page
  renderSignupPage() {
    const prefillEmail = sessionStorage.getItem('prefill_email') || '';

    return `
      <div class="auth-wrapper">
        <header class="auth-header">
          <a href="/" data-route="/" class="netflix-brand-link">
            <img src="/assets/netflix-logo.svg" alt="Netflix" class="netflix-brand-logo" />
          </a>
          <a href="/login" data-route="/login" class="btn-primary-red">Sign In</a>
        </header>

        <main class="auth-card-container">
          <div class="auth-card">
            <div class="signup-step-header">
              <span class="auth-step-badge">STEP 1 OF 3</span>
              <h1 class="auth-title" style="margin-top:8px;">Create a password to start your membership</h1>
              <p style="color:#bbb; font-size:0.95rem; margin-bottom:20px;">Just a few more steps and you're done! We hate paperwork, too.</p>
            </div>

            <div class="auth-error-banner" id="auth-error-banner">
              <span id="auth-error-text"></span>
            </div>

            <form class="auth-form" id="signup-form">
              <div class="form-group">
                <input type="text" id="signup-name" class="form-control" placeholder=" " required autocomplete="name">
                <label for="signup-name" class="form-label">Your Name</label>
              </div>

              <div class="form-group">
                <input type="email" id="signup-email" class="form-control" placeholder=" " value="${prefillEmail}" required autocomplete="email">
                <label for="signup-email" class="form-label">Email address</label>
              </div>

              <div class="form-group">
                <input type="password" id="signup-password" class="form-control" placeholder=" " required minlength="6" autocomplete="new-password">
                <label for="signup-password" class="form-label">Add a password (min 6 chars)</label>
              </div>

              <!-- Password Strength Meter -->
              <div class="password-strength-container" style="display:block;">
                <div class="password-strength-bar">
                  <div class="password-strength-fill" id="pw-strength-fill"></div>
                </div>
                <div class="password-strength-text" id="pw-strength-text">Password strength</div>
              </div>

              <button type="submit" class="btn-auth-submit" id="btn-signup-submit" style="margin-top:20px;">Next &bull; Start Membership</button>
            </form>

            <div class="auth-switch-text" style="margin-top:24px;">
              Already have an account? <a href="/login" data-route="/login" class="auth-switch-link">Sign in</a>.
            </div>
          </div>
        </main>

        <footer class="landing-footer" style="background: rgba(0,0,0,0.85); border-top: 1px solid #333;">
          <div class="footer-top">Questions? Call 000-800-919-1694</div>
          <ul class="footer-links-grid">
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Help Centre</a></li>
            <li><a href="#">Terms of Use</a></li>
            <li><a href="#">Privacy</a></li>
          </ul>
        </footer>
      </div>
    `;
  }

  attachSignupEvents() {
    const form = document.getElementById('signup-form');
    const pwInput = document.getElementById('signup-password');
    const bar = document.getElementById('pw-strength-fill');
    const text = document.getElementById('pw-strength-text');

    if (pwInput && bar && text) {
      pwInput.addEventListener('input', () => {
        const val = pwInput.value;
        let score = 0;
        if (val.length >= 6) score += 25;
        if (val.length >= 10) score += 25;
        if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score += 25;
        if (/[0-9]/.test(val) || /[^A-Za-z0-9]/.test(val)) score += 25;

        bar.style.width = score + '%';
        if (score <= 25) {
          bar.style.backgroundColor = '#e50914';
          text.textContent = 'Weak';
          text.style.color = '#e50914';
        } else if (score <= 50) {
          bar.style.backgroundColor = '#ffa00a';
          text.textContent = 'Fair';
          text.style.color = '#ffa00a';
        } else if (score <= 75) {
          bar.style.backgroundColor = '#2ecc71';
          text.textContent = 'Good';
          text.style.color = '#2ecc71';
        } else {
          bar.style.backgroundColor = '#00d2d3';
          text.textContent = 'Strong & Secure';
          text.style.color = '#00d2d3';
        }
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const pass = document.getElementById('signup-password').value;
        this.handleSignup(name, email, pass);
      });
    }
  }

  // 4. Authenticated Browse Dashboard
  renderBrowseDashboard() {
    const featured = this.movies[0] || {};
    const isInWatchlist = this.watchlist.some(m => m.id === featured.id);

    let displayedMovies = [...this.movies];
    if (this.activeCategory === 'tv') displayedMovies = displayedMovies.filter(m => m.type === 'TV Series');
    if (this.activeCategory === 'movies') displayedMovies = displayedMovies.filter(m => m.type === 'Movie');
    if (this.activeCategory === 'mylist') displayedMovies = this.watchlist;
    if (this.activeCategory === 'trending') displayedMovies = this.movies.filter(m => m.category === 'trending' || m.top10Rank);
    if (this.activeCategory === 'languages') {
      if (this.activeLanguageFilter === 'hi') {
        displayedMovies = this.movies.filter(m => m.subtitles?.hi || m.title.includes('Sacred') || m.title.includes('Delhi') || m.id === 'stranger-things' || m.id === 'squid-game');
      } else if (this.activeLanguageFilter === 'es') {
        displayedMovies = this.movies.filter(m => m.id === 'money-heist' || m.genres.includes('Spanish Drama'));
      } else if (this.activeLanguageFilter === 'ta' || this.activeLanguageFilter === 'te') {
        displayedMovies = this.movies.filter(m => m.category === 'action' || m.category === 'trending');
      } else if (this.activeLanguageFilter === 'en') {
        displayedMovies = this.movies.filter(m => m.subtitles?.en);
      }
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      displayedMovies = this.movies.filter(m => 
        m.title.toLowerCase().includes(q) ||
        m.genres.some(g => g.toLowerCase().includes(q)) ||
        m.cast.some(c => c.toLowerCase().includes(q))
      );
    }

    const trending = this.movies.filter(m => m.category === 'trending' || m.top10Rank);
    const top10 = this.movies.filter(m => m.top10Rank).sort((a, b) => a.top10Rank - b.top10Rank).slice(0, 10);
    const indianHits = this.movies.filter(m => ['rrr', 'leo', 'jawan', 'animal', 'kalki-2898-ad', 'kgf-chapter-2', 'salaar', 'baahubali-2', 'dangal', 'three-idiots', 'vikram', 'kantara', 'pushpa-the-rise', 'dunki'].includes(m.id));
    const scifi = this.movies.filter(m => m.genres.some(g => g.toLowerCase().includes('sci-fi') || g.toLowerCase().includes('cyberpunk') || g.toLowerCase().includes('multiverse')));
    const action = this.movies.filter(m => m.genres.some(g => g.toLowerCase().includes('action') || g.toLowerCase().includes('thriller')));
    const drama = this.movies.filter(m => m.genres.some(g => g.toLowerCase().includes('drama') || g.toLowerCase().includes('crime') || g.toLowerCase().includes('biography')));
    const anime = this.movies.filter(m => m.genres.some(g => g.toLowerCase().includes('anime') || g.toLowerCase().includes('animation')));

    return `
      <div class="browse-container">
        <!-- Netflix Browse Header -->
        <header class="netflix-header" id="browse-header">
          <div class="header-left">
            <a href="/browse" data-route="/browse" class="netflix-brand-link">
              <img src="/assets/netflix-logo.svg" alt="Netflix" class="netflix-brand-logo" />
            </a>
            <ul class="nav-links">
              <li class="nav-item ${this.activeCategory === 'all' && !this.searchQuery ? 'active' : ''}">
                <a href="/browse" data-category="all">Home</a>
              </li>
              <li class="nav-item ${this.activeCategory === 'tv' ? 'active' : ''}">
                <a href="/browse" data-category="tv">TV Shows</a>
              </li>
              <li class="nav-item ${this.activeCategory === 'movies' ? 'active' : ''}">
                <a href="/browse" data-category="movies">Movies</a>
              </li>
              <li class="nav-item ${this.activeCategory === 'trending' ? 'active' : ''}">
                <a href="/browse" data-category="trending">New & Popular</a>
              </li>
              <li class="nav-item ${this.activeCategory === 'mylist' ? 'active' : ''}">
                <a href="/mylist" data-category="mylist">My List (${this.watchlist.length})</a>
              </li>
              <li class="nav-item ${this.activeCategory === 'languages' ? 'active' : ''}">
                <a href="/browse" data-category="languages">Browse by Languages</a>
              </li>
            </ul>
          </div>

          <div class="header-right">
            <!-- Expandable Search Bar -->
            <div class="search-box ${this.searchQuery ? 'active' : ''}" id="search-box">
              <button class="search-icon-btn" id="search-toggle-btn" aria-label="Search">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>
              <input type="text" id="search-input" class="search-input" placeholder="Titles, people, genres" value="${this.searchQuery}">
              ${this.searchQuery ? `<button class="search-clear-btn" id="search-clear-btn">✕</button>` : ''}
            </div>

            <!-- Notification Bell -->
            <div class="notification-wrapper" id="notification-wrapper">
              <button class="notification-btn" id="notification-btn" aria-label="Notifications" title="Notifications">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                <span class="notification-badge">3</span>
              </button>
              <div class="notification-dropdown" id="notification-dropdown">
                <div class="notification-header">
                  <span>Notifications</span>
                  <span style="font-size:0.75rem; color:var(--netflix-red); font-weight:normal;">3 New</span>
                </div>
                <div class="notification-list">
                  <div class="notification-item" data-play-id="stranger-things">
                    <img src="https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg" class="notification-thumb" alt="Stranger Things">
                    <div class="notification-content">
                      <div class="notification-title">Stranger Things Season 5: Official Teaser is here</div>
                      <div class="notification-time">Just now &bull; Watch in 4K UHD</div>
                    </div>
                  </div>
                  <div class="notification-item" data-play-id="interstellar">
                    <img src="https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg" class="notification-thumb" alt="Interstellar">
                    <div class="notification-content">
                      <div class="notification-title">New Arrival: Interstellar with Dolby Atmos</div>
                      <div class="notification-time">1 hour ago &bull; Sci-Fi Blockbuster</div>
                    </div>
                  </div>
                  <div class="notification-item" data-play-id="cyberpunk-edgerunners">
                    <img src="https://image.tmdb.org/t/p/w1280/7GrDe84Q1Vd88g4A1Pq3gZJ3rF9.jpg" class="notification-thumb" alt="Cyberpunk">
                    <div class="notification-content">
                      <div class="notification-title">Recommended for You: Cyberpunk Edgerunners</div>
                      <div class="notification-time">Yesterday &bull; 99% Match</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Profile Menu Dropdown -->
            <div class="profile-menu-wrapper" id="profile-menu-wrapper">
              <div class="profile-avatar-btn">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80" alt="Profile Avatar" class="profile-img">
                <span class="profile-caret">▼</span>
              </div>
              <div class="profile-dropdown-menu" id="profile-dropdown">
                <div class="profile-user-info">
                  <div class="profile-user-name" id="dropdown-user-name">${this.currentUser.name}</div>
                  <div class="profile-user-plan" id="dropdown-user-plan">${this.currentUser.plan} &bull; 4K UHD</div>
                </div>
                <a href="/mylist" data-route="/mylist">📋 My List (${this.watchlist.length})</a>
                <button type="button" id="btn-open-account">⚙️ Account Settings</button>
                <button type="button" id="btn-logout">🚪 Sign Out of Netflix</button>
              </div>
            </div>
          </div>
        </header>

        <!-- Search Results View -->
        ${this.searchQuery ? `
          <div style="padding: 120px 4% 40px;">
            <h2 style="font-size: 1.5rem; margin-bottom: 20px;">Search results for "${this.searchQuery}" (${displayedMovies.length} found)</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px;">
              ${displayedMovies.map(m => this.renderMovieCard(m)).join('')}
            </div>
          </div>
        ` : `
          <!-- Hero Billboard Spotlight -->
          ${this.activeCategory !== 'mylist' && this.activeCategory !== 'languages' && featured.id ? `
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
                  <span class="quality-badge" style="border-color:#555;">${featured.audio || 'Dolby Atmos'}</span>
                  <span style="color:#bbb;">${featured.duration}</span>
                </div>
                <p class="billboard-desc">${featured.overview}</p>
                <div class="billboard-actions">
                  <button class="btn-billboard-play" data-play-id="${featured.id}">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    Play
                  </button>
                  <button class="btn-billboard-info" data-info-id="${featured.id}">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
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
          <main class="rows-container" style="${this.activeCategory === 'mylist' || this.activeCategory === 'languages' ? 'padding-top:100px;' : ''}">

            <!-- Browse by Languages Filter Bar -->
            ${this.activeCategory === 'languages' ? `
              <div style="padding: 20px 4% 10px;">
                <h2 style="font-size: 1.8rem; margin-bottom: 16px;">Browse by Original Audio & Subtitles</h2>
                <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom: 24px;">
                  <button class="lang-filter-pill ${this.activeLanguageFilter === 'all' ? 'active' : ''}" data-lang-filter="all">All Languages</button>
                  <button class="lang-filter-pill ${this.activeLanguageFilter === 'hi' ? 'active' : ''}" data-lang-filter="hi">हिन्दी (Hindi Audio/Dubbed)</button>
                  <button class="lang-filter-pill ${this.activeLanguageFilter === 'en' ? 'active' : ''}" data-lang-filter="en">English (Original Audio)</button>
                  <button class="lang-filter-pill ${this.activeLanguageFilter === 'es' ? 'active' : ''}" data-lang-filter="es">Español (Spanish)</button>
                  <button class="lang-filter-pill ${this.activeLanguageFilter === 'ta' ? 'active' : ''}" data-lang-filter="ta">தமிழ் (Tamil Dubbed)</button>
                  <button class="lang-filter-pill ${this.activeLanguageFilter === 'te' ? 'active' : ''}" data-lang-filter="te">తెలుగు (Telugu Dubbed)</button>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px;">
                  ${displayedMovies.map(m => this.renderMovieCard(m)).join('')}
                </div>
              </div>
            ` : ''}
            
            <!-- 0. Continue Watching Row (Direct from SQLite database) -->
            ${this.continueWatching.length > 0 && this.activeCategory !== 'mylist' && this.activeCategory !== 'languages' ? `
              <div class="category-row" id="continue-watching-row">
                <div class="category-header">
                  <h2 class="category-title">
                    <span>Continue Watching for ${this.currentUser.name}</span>
                    <span style="font-size:0.8rem; font-weight:normal; color:#888;">(Resumes at saved timestamp)</span>
                  </h2>
                </div>
                <div class="movie-slider">
                  ${this.continueWatching.map(m => this.renderContinueWatchingCard(m)).join('')}
                </div>
              </div>
            ` : ''}

            <!-- 1. My List Row (Persisted in SQLite database) -->
            ${this.watchlist.length > 0 && this.activeCategory !== 'languages' ? `
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

            ${this.activeCategory === 'tv' || this.activeCategory === 'movies' ? `
              <div style="padding: 20px 4% 30px;">
                <h2 style="font-size: 1.8rem; margin-bottom: 20px; font-weight: 700;">
                  ${this.activeCategory === 'tv' ? '📺 TV Shows & Global Series' : '🎬 Hollywood & Indian Blockbuster Movies'}
                  <span style="font-size: 0.9rem; font-weight: normal; color: #888;">(${displayedMovies.length} titles)</span>
                </h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px;">
                  ${displayedMovies.map(m => this.renderMovieCard(m)).join('')}
                </div>
              </div>
            ` : (this.activeCategory !== 'mylist' && this.activeCategory !== 'languages' ? `
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
                  <h2 class="category-title">Top 10 in India Today</h2>
                </div>
                <div class="movie-slider">
                  ${top10.map(m => this.renderTop10Card(m)).join('')}
                </div>
              </div>

              <!-- 4. Indian Mega Blockbusters -->
              <div class="category-row">
                <div class="category-header">
                  <h2 class="category-title">Indian Mega Blockbusters & Cinema</h2>
                </div>
                <div class="movie-slider">
                  ${indianHits.map(m => this.renderMovieCard(m)).join('')}
                </div>
              </div>

              <!-- 5. Sci-Fi & Mind-Bending Row -->
              <div class="category-row">
                <div class="category-header">
                  <h2 class="category-title">Blockbuster Sci-Fi & Mind-Bending</h2>
                </div>
                <div class="movie-slider">
                  ${scifi.map(m => this.renderMovieCard(m)).join('')}
                </div>
              </div>

              <!-- 6. Action & Adrenaline Thrillers Row -->
              <div class="category-row">
                <div class="category-header">
                  <h2 class="category-title">Action & Adrenaline Thrillers</h2>
                </div>
                <div class="movie-slider">
                  ${action.map(m => this.renderMovieCard(m)).join('')}
                </div>
              </div>

              <!-- 7. Critically Acclaimed Dramas & Masterpieces -->
              <div class="category-row">
                <div class="category-header">
                  <h2 class="category-title">Critically Acclaimed Dramas & Masterpieces</h2>
                </div>
                <div class="movie-slider">
                  ${drama.map(m => this.renderMovieCard(m)).join('')}
                </div>
              </div>

              <!-- 8. Anime & Animation -->
              <div class="category-row">
                <div class="category-header">
                  <h2 class="category-title">Anime & Animation</h2>
                </div>
                <div class="movie-slider">
                  ${anime.map(m => this.renderMovieCard(m)).join('')}
                </div>
              </div>
            ` : '')}

          </main>
        `}

        <!-- Interactive Movie Detail Modal Dialog (<dialog>) -->
        <dialog class="movie-modal" id="movie-detail-dialog"></dialog>
      </div>
    `;
  }

  renderContinueWatchingCard(movie) {
    const dur = movie.durationSeconds || 180;
    const prog = movie.progressSeconds || 0;
    const remaining = Math.max(1, Math.round((dur - prog) / 60));
    const pct = movie.progressPercent || Math.min(95, Math.max(5, Math.round((prog / dur) * 100)));

    return `
      <div class="continue-card" data-continue-card-id="${movie.id}">
        <div class="continue-media-wrap" data-continue-play-id="${movie.id}" data-continue-start="${prog}">
          <img src="${movie.backdrop}" alt="${movie.title}" class="continue-img" loading="lazy">
          <div class="continue-play-overlay">
            <div class="continue-play-bubble">▶</div>
          </div>
          <button class="continue-remove-btn" data-remove-continue-id="${movie.id}" title="Remove from Continue Watching">✕</button>
        </div>
        <div class="continue-progress-bar-bg">
          <div class="continue-progress-bar-fill" style="width: ${pct}%"></div>
        </div>
        <div class="continue-info-bar">
          <span class="continue-title">${movie.title}</span>
          <span class="continue-badge">${remaining}m left</span>
        </div>
      </div>
    `;
  }

  renderMovieCard(movie) {
    const isInList = this.watchlist.some(m => m.id === movie.id);
    const userRating = this.ratings[movie.id] || 'none';

    return `
      <div class="movie-card" data-card-id="${movie.id}">
        <img src="${movie.backdrop}" alt="${movie.title}" loading="lazy" class="movie-card-thumb">
        <div class="movie-card-hover-box">
          <div class="hover-media-preview" style="background-image:url('${movie.backdrop}')"></div>
          <div class="hover-content">
            <div class="hover-actions-row">
              <div class="hover-left-btns">
                <button class="card-btn card-btn-play" data-play-id="${movie.id}" title="Play in HD with Audio">▶</button>
                <button class="card-btn card-btn-list ${isInList ? 'in-list' : ''}" data-watchlist-id="${movie.id}" title="${isInList ? 'Remove from My List' : 'Add to My List'}">
                  ${isInList ? '✓' : '+'}
                </button>
                <button class="card-btn card-btn-thumb ${userRating === 'like' ? 'rated' : ''}" data-rating-id="${movie.id}" data-rating-val="like" title="I like this">👍</button>
              </div>
              <button class="card-btn card-btn-info" data-info-id="${movie.id}" title="Episode info & more">⌄</button>
            </div>
            <div class="hover-meta-row">
              <span class="match-score">${movie.matchScore}% Match</span>
              <span class="age-badge">${movie.ageRating}</span>
              <span class="quality-badge">${movie.quality}</span>
            </div>
            <div class="hover-genres">${movie.genres.slice(0, 3).join(' • ')}</div>
          </div>
        </div>
      </div>
    `;
  }

  renderTop10Card(movie) {
    const isInList = this.watchlist.some(m => m.id === movie.id);

    return `
      <div class="top10-card" data-card-id="${movie.id}">
        <div class="top10-number">${movie.top10Rank || 1}</div>
        <div class="top10-poster-wrap">
          <img src="${movie.poster}" alt="${movie.title}" loading="lazy" class="top10-poster">
          <div class="top10-overlay-actions">
            <button class="card-btn card-btn-play" data-play-id="${movie.id}" title="Play preview">▶</button>
            <button class="card-btn card-btn-list ${isInList ? 'in-list' : ''}" data-watchlist-id="${movie.id}">
              ${isInList ? '✓' : '+'}
            </button>
            <button class="card-btn card-btn-info" data-info-id="${movie.id}">⌄</button>
          </div>
        </div>
      </div>
    `;
  }

  getEpisodesForMovie(movie) {
    if (movie.episodes && movie.episodes.length) return movie.episodes;
    return [
      {
        episodeNum: 1,
        title: 'Chapter One: The Awakening',
        duration: '48m',
        thumb: movie.backdrop,
        synopsis: `An unexpected revelation thrusts the main characters into uncharted and perilous territory as mysterious events unfold.`
      },
      {
        episodeNum: 2,
        title: 'Chapter Two: Into the Unknown',
        duration: '52m',
        thumb: movie.poster,
        synopsis: 'As clues emerge, tensions escalate between factions while secret motives are laid bare and danger draws nearer.'
      },
      {
        episodeNum: 3,
        title: 'Chapter Three: The Point of No Return',
        duration: '50m',
        thumb: movie.backdrop,
        synopsis: 'A high-stakes confrontation leads to unexpected alliances and a devastating discovery that changes everything.'
      },
      {
        episodeNum: 4,
        title: 'Chapter Four: The Reckoning',
        duration: '58m',
        thumb: movie.backdrop,
        synopsis: 'Everything hangs in the balance as final moves are made in a relentless, thrilling battle against time.'
      }
    ];
  }

  attachBrowseEvents() {
    // Header scroll background change
    const header = document.getElementById('browse-header');
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      });
    }

    // Category Tabs
    document.querySelectorAll('[data-category]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = btn.getAttribute('data-category');
        this.activeCategory = cat;
        this.searchQuery = '';
        this.renderCurrentRoute();
      });
    });

    // Language Filter Pills (on Browse by Languages view)
    document.querySelectorAll('[data-lang-filter]').forEach(pill => {
      pill.addEventListener('click', () => {
        this.activeLanguageFilter = pill.getAttribute('data-lang-filter');
        this.renderCurrentRoute();
      });
    });

    // Expandable Search Bar
    const searchToggle = document.getElementById('search-toggle-btn');
    const searchBox = document.getElementById('search-box');
    const searchInput = document.getElementById('search-input');
    const searchClear = document.getElementById('search-clear-btn');

    if (searchToggle && searchBox && searchInput) {
      searchToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        searchBox.classList.toggle('active');
        if (searchBox.classList.contains('active')) {
          searchInput.focus();
        }
      });

      let searchDebounce;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchDebounce);
        const val = e.target.value;
        const cursorPos = e.target.selectionStart;
        this.searchQuery = val;
        searchDebounce = setTimeout(async () => {
          this.renderCurrentRoute();
          const refreshedInput = document.getElementById('search-input');
          const refreshedBox = document.getElementById('search-box');
          if (refreshedBox) refreshedBox.classList.add('active');
          if (refreshedInput) {
            refreshedInput.focus();
            try { refreshedInput.setSelectionRange(cursorPos, cursorPos); } catch(err) {}
          }

          // Live TMDB Global Search in Background
          if (val.trim().length >= 2) {
            try {
              const res = await fetch(`/api/tmdb/search?q=${encodeURIComponent(val.trim())}`);
              if (res.ok) {
                const data = await res.json();
                if (data.results && data.results.length) {
                  const existingIds = new Set(this.movies.map(m => m.id));
                  let added = false;
                  data.results.forEach(tmdbMovie => {
                    if (!existingIds.has(tmdbMovie.id)) {
                      this.movies.push(tmdbMovie);
                      existingIds.add(tmdbMovie.id);
                      added = true;
                    }
                  });
                  if (added && this.searchQuery === val) {
                    this.renderCurrentRoute();
                    const refInp = document.getElementById('search-input');
                    const refBox = document.getElementById('search-box');
                    if (refBox) refBox.classList.add('active');
                    if (refInp) {
                      refInp.focus();
                      try { refInp.setSelectionRange(cursorPos, cursorPos); } catch(err) {}
                    }
                  }
                }
              }
            } catch (err) {}
          }
        }, 120);
      });

      if (searchClear) {
        searchClear.addEventListener('click', (e) => {
          e.stopPropagation();
          this.searchQuery = '';
          this.renderCurrentRoute();
          const refreshedInput = document.getElementById('search-input');
          if (refreshedInput) refreshedInput.focus();
        });
      }

      document.addEventListener('click', (e) => {
        const sb = document.getElementById('search-box');
        if (sb && !e.target.closest('#search-box') && !this.searchQuery) {
          sb.classList.remove('active');
        }
      });
    }

    // Notification Dropdown Toggle
    const notifBtn = document.getElementById('notification-btn');
    const notifMenu = document.getElementById('notification-dropdown');
    if (notifBtn && notifMenu) {
      notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifMenu.classList.toggle('show');
        const profMenu = document.getElementById('profile-dropdown');
        if (profMenu) profMenu.classList.remove('show');
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('#notification-wrapper')) {
          notifMenu.classList.remove('show');
        }
      });
    }

    // Profile Dropdown Toggle & Hover
    const profileWrap = document.getElementById('profile-menu-wrapper');
    const profileMenu = document.getElementById('profile-dropdown');
    const avatarBtn = profileWrap ? profileWrap.querySelector('.profile-avatar-btn') : null;

    if (avatarBtn && profileMenu) {
      avatarBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const willShow = !profileMenu.classList.contains('show');
        if (willShow) {
          profileMenu.classList.add('show');
          profileWrap.classList.add('open');
          if (notifMenu) notifMenu.classList.remove('show');
        } else {
          profileMenu.classList.remove('show');
          profileWrap.classList.remove('open');
        }
      });
    }

    if (profileMenu) {
      // Prevent internal clicks from triggering outside click listeners
      profileMenu.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (profileMenu && !e.target.closest('#profile-menu-wrapper')) {
        profileMenu.classList.remove('show');
        if (profileWrap) profileWrap.classList.remove('open');
      }
    });

    // Smooth Desktop Hover Interaction
    if (profileWrap && profileMenu) {
      let profileHoverTimer;
      profileWrap.addEventListener('mouseenter', () => {
        clearTimeout(profileHoverTimer);
        profileMenu.classList.add('show');
        profileWrap.classList.add('open');
      });

      profileWrap.addEventListener('mouseleave', () => {
        profileHoverTimer = setTimeout(() => {
          profileMenu.classList.remove('show');
          profileWrap.classList.remove('open');
        }, 300);
      });
    }

    // Account Settings Modal Dialog
    const accountBtn = document.getElementById('btn-open-account');
    const accountDialog = document.getElementById('account-settings-dialog');
    const accountForm = document.getElementById('account-settings-form');
    const accountClose = document.getElementById('account-modal-close');
    const accountCancel = document.getElementById('account-cancel-btn');
    const nameInput = document.getElementById('account-name-input');
    const emailDisplay = document.getElementById('account-email-display');
    const planSelect = document.getElementById('account-plan-select');

    if (accountBtn && accountDialog) {
      accountBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (profileMenu) profileMenu.classList.remove('show');
        if (profileWrap) profileWrap.classList.remove('open');
        if (nameInput) nameInput.value = this.currentUser.name || '';
        if (emailDisplay) emailDisplay.value = this.currentUser.email || '';
        if (planSelect && this.currentUser.plan) {
          Array.from(planSelect.options).forEach(opt => {
            if (opt.value.includes(this.currentUser.plan) || opt.text.includes(this.currentUser.plan)) {
              opt.selected = true;
            }
          });
        }
        accountDialog.showModal();
      });

      const closeAccountModal = () => accountDialog.close();
      if (accountClose) accountClose.addEventListener('click', closeAccountModal);
      if (accountCancel) accountCancel.addEventListener('click', closeAccountModal);

      if (accountForm) {
        accountForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const newName = nameInput.value.trim();
          const newPlan = planSelect.value;
          try {
            const res = await fetch('/api/auth/profile', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: newName, plan: newPlan })
            });
            if (res.ok) {
              const data = await res.json();
              this.currentUser.name = data.user.name;
              this.currentUser.plan = data.user.plan;
              const nameEl = document.getElementById('dropdown-user-name');
              const planEl = document.getElementById('dropdown-user-plan');
              if (nameEl) nameEl.textContent = this.currentUser.name;
              if (planEl) planEl.textContent = `${this.currentUser.plan} • 4K UHD`;
              accountDialog.close();
              this.showToast('Account profile updated successfully!', 'success');
            } else {
              this.showToast('Failed to update profile.', 'error');
            }
          } catch (err) {
            this.showToast('Error saving profile changes.', 'error');
          }
        });
      }
    }

    // Logout
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (profileMenu) profileMenu.classList.remove('show');
        if (profileWrap) profileWrap.classList.remove('open');
        this.handleLogout();
      });
    }
  }

  /* ══════════════════════════════════════════════
     FULLSCREEN CINEMA PLAYER SETUP & LOGIC
  ══════════════════════════════════════════════ */
  setupCinemaPlayer() {
    this.cinemaPlayer = document.getElementById('netflix-cinema-player');
    this.cinemaVideo = document.getElementById('cinema-video');
    this.cinemaSubtitles = document.getElementById('cinema-subtitles');
    this.cinemaOsdPill = document.getElementById('cinema-osd-pill');
    this.cinemaOsdText = document.getElementById('cinema-osd-text');
    this.cinemaPlayBtn = document.getElementById('cinema-play-btn');
    this.cinemaPlayIcon = document.getElementById('cinema-play-icon');
    this.cinemaScrubberWrapper = document.getElementById('cinema-scrubber-wrapper');
    this.cinemaScrubberProgress = document.getElementById('cinema-scrubber-progress');
    this.cinemaScrubberBuffered = document.getElementById('cinema-scrubber-buffered');
    this.cinemaTimeDisplay = document.getElementById('cinema-time-display');
    this.cinemaVolumeSlider = document.getElementById('cinema-volume-slider');
    this.cinemaVolumeBtn = document.getElementById('cinema-volume-btn');
    this.cinemaVolumeIcon = document.getElementById('cinema-volume-icon');
    this.cinemaAudioBtn = document.getElementById('cinema-audio-btn');
    this.cinemaAudioMenu = document.getElementById('cinema-audio-menu');
    this.cinemaSpeedBtn = document.getElementById('cinema-speed-btn');
    this.cinemaBackBtn = document.getElementById('cinema-back-btn');
    this.cinemaForwardBtn = document.getElementById('cinema-forward-btn');
    this.cinemaRewindBtn = document.getElementById('cinema-rewind-btn');
    this.cinemaFullscreenBtn = document.getElementById('cinema-fullscreen-btn');
    this.cinemaNextBtn = document.getElementById('cinema-next-btn');
    this.cinemaEpisodesBtn = document.getElementById('cinema-episodes-btn');
    this.cinemaEpisodesDrawer = document.getElementById('cinema-episodes-drawer');
    this.cinemaEpisodesList = document.getElementById('cinema-episodes-list');
    this.cinemaEpisodesClose = document.getElementById('episodes-drawer-close');
    this.cinemaFlagBtn = document.getElementById('cinema-flag-btn');
    this.cinemaIssueDialog = document.getElementById('cinema-issue-dialog');
    this.cinemaIssueForm = document.getElementById('issue-modal-form');
    this.cinemaIssueClose = document.getElementById('issue-modal-close');
    this.cinemaIssueCancel = document.getElementById('issue-cancel-btn');

    this.cinemaEmbedFrame = document.getElementById('cinema-embed-frame');
    this.activeStreamSource = 'netmirror';
    this.activeSeason = 1;
    this.activeEpisode = 1;

    if (!this.cinemaPlayer || !this.cinemaVideo) return;

    // Stream switcher buttons (NetMirror, VidSrc, Cinema 4K)
    document.querySelectorAll('.stream-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        const src = pill.getAttribute('data-source');
        this.switchStreamSource(src);
      });
    });

    // Video play/pause events
    this.cinemaPlayBtn.addEventListener('click', () => this.toggleCinemaPlay());
    this.cinemaVideo.addEventListener('click', () => this.toggleCinemaPlay());

    // Back button
    this.cinemaBackBtn.addEventListener('click', () => this.closeCinemaPlayer());

    // Episodes Drawer Toggle
    if (this.cinemaEpisodesBtn && this.cinemaEpisodesDrawer) {
      this.cinemaEpisodesBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.cinemaEpisodesDrawer.classList.toggle('open');
      });
      if (this.cinemaEpisodesClose) {
        this.cinemaEpisodesClose.addEventListener('click', () => {
          this.cinemaEpisodesDrawer.classList.remove('open');
        });
      }
    }

    // Report Issue Dialog
    if (this.cinemaFlagBtn && this.cinemaIssueDialog) {
      this.cinemaFlagBtn.addEventListener('click', () => {
        this.cinemaVideo.pause();
        this.cinemaIssueDialog.showModal();
      });

      const closeIssue = () => this.cinemaIssueDialog.close();
      if (this.cinemaIssueClose) this.cinemaIssueClose.addEventListener('click', closeIssue);
      if (this.cinemaIssueCancel) this.cinemaIssueCancel.addEventListener('click', closeIssue);

      if (this.cinemaIssueForm) {
        this.cinemaIssueForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const issueType = this.cinemaIssueForm.querySelector('input[name="issueType"]:checked')?.value || 'general';
          const details = document.getElementById('issue-details-input')?.value || '';
          try {
            await fetch('/api/feedback', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                movieId: this.activeCinemaMovie?.id,
                issueType,
                details
              })
            });
            this.cinemaIssueDialog.close();
            this.showToast('Issue reported. Our video engineering team is reviewing it.', 'success');
            this.cinemaVideo.play().catch(() => {});
          } catch (err) {
            this.cinemaIssueDialog.close();
          }
        });
      }
    }

    // Rewind & Fast Forward (10s)
    this.cinemaRewindBtn.addEventListener('click', () => {
      this.cinemaVideo.currentTime = Math.max(0, this.cinemaVideo.currentTime - 10);
      this.showCinemaOsd('↺ 10s', 'Rewind 10 seconds');
    });

    this.cinemaForwardBtn.addEventListener('click', () => {
      this.cinemaVideo.currentTime = Math.min(this.cinemaVideo.duration || 0, this.cinemaVideo.currentTime + 10);
      this.showCinemaOsd('↻ 10s', 'Forward 10 seconds');
    });

    // Volume Slider & Mute
    this.cinemaVolumeSlider.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value);
      this.cinemaVideo.volume = vol;
      this.cinemaVideo.muted = vol === 0;
      this.updateCinemaVolumeUI();
    });

    this.cinemaVolumeBtn.addEventListener('click', () => {
      this.cinemaVideo.muted = !this.cinemaVideo.muted;
      this.updateCinemaVolumeUI();
      this.showCinemaOsd(this.cinemaVideo.muted ? '🔇' : '🔊', this.cinemaVideo.muted ? 'Muted' : 'Volume ' + Math.round(this.cinemaVideo.volume * 100) + '%');
    });

    // Scrubber seeking
    this.cinemaScrubberWrapper.addEventListener('click', (e) => {
      const rect = this.cinemaScrubberWrapper.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      if (this.cinemaVideo.duration) {
        this.cinemaVideo.currentTime = pos * this.cinemaVideo.duration;
      }
    });

    // Time update & subtitles
    this.cinemaVideo.addEventListener('timeupdate', () => {
      this.updateCinemaTimeline();
      this.updateCinemaSubtitles();
    });

    // Playback Speed
    this.cinemaSpeedBtn.addEventListener('click', () => {
      this.speedIndex = (this.speedIndex + 1) % this.speeds.length;
      const speed = this.speeds[this.speedIndex];
      this.cinemaVideo.playbackRate = speed;
      this.cinemaSpeedBtn.textContent = speed + 'x';
      this.showCinemaOsd('⚡', `Playback Speed: ${speed}x`);
      this.savePreferences({ playback_speed: speed });
    });

    // Next Episode
    this.cinemaNextBtn.addEventListener('click', () => {
      if (!this.movies || !this.movies.length) return;
      const currentIndex = this.movies.findIndex(m => m.id === (this.activeCinemaMovie?.id));
      const nextMovie = this.movies[(currentIndex + 1) % this.movies.length];
      this.openCinemaPlayer(nextMovie.id);
      this.showCinemaOsd('⏭', `Playing: ${nextMovie.title}`);
    });

    // Fullscreen Toggle
    this.cinemaFullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        this.cinemaPlayer.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // Audio & Subtitles Menu Toggle
    this.cinemaAudioBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.cinemaAudioMenu.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.cinema-audio-btn-wrapper')) {
        this.cinemaAudioMenu.classList.remove('open');
      }
    });

    // Audio Options Click
    document.querySelectorAll('#cinema-audio-options .cinema-option-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('#cinema-audio-options .cinema-option-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        const track = item.getAttribute('data-audio-track');
        this.currentAudioTrack = track;
        const trackName = item.textContent.replace('✓', '').trim();
        this.showCinemaOsd('🌐', `Audio: ${trackName}`);
        this.savePreferences({ audio_language: track });
        
        // Auto-switch subtitle language for dub immersion
        if (track === 'hi-dub' && this.currentSubTrack !== 'off') {
          this.setSubtitleTrack('hi');
        } else if (track === 'en-orig' && this.currentSubTrack !== 'off') {
          this.setSubtitleTrack('en');
        }
      });
    });

    // Subtitles Options Click
    document.querySelectorAll('#cinema-subtitles-options .cinema-option-item').forEach(item => {
      item.addEventListener('click', () => {
        const track = item.getAttribute('data-sub-track');
        this.setSubtitleTrack(track);
        const trackName = item.textContent.replace('✓', '').trim();
        this.showCinemaOsd('💬', `Subtitles: ${trackName}`);
        this.savePreferences({ subtitle_language: track });
      });
    });

    // Idle mouse auto-hiding
    this.cinemaPlayer.addEventListener('mousemove', () => {
      this.cinemaPlayer.classList.remove('idle');
      clearTimeout(this.idleTimer);
      this.idleTimer = setTimeout(() => {
        if (!this.cinemaVideo.paused) {
          this.cinemaPlayer.classList.add('idle');
          this.cinemaAudioMenu.classList.remove('open');
        }
      }, 3500);
    });

    // Global Player Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (!this.cinemaPlayer.classList.contains('active')) return;
      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        this.toggleCinemaPlay();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.cinemaVideo.currentTime = Math.max(0, this.cinemaVideo.currentTime - 10);
        this.showCinemaOsd('↺ 10s', 'Rewind 10s');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.cinemaVideo.currentTime = Math.min(this.cinemaVideo.duration || 0, this.cinemaVideo.currentTime + 10);
        this.showCinemaOsd('↻ 10s', 'Forward 10s');
      } else if (e.key === 'f') {
        e.preventDefault();
        this.cinemaFullscreenBtn.click();
      } else if (e.key === 'm') {
        e.preventDefault();
        this.cinemaVolumeBtn.click();
      } else if (e.key === 'e') {
        e.preventDefault();
        if (this.cinemaEpisodesBtn) this.cinemaEpisodesBtn.click();
      } else if (e.key === 'Escape') {
        if (this.cinemaEpisodesDrawer?.classList.contains('open')) {
          this.cinemaEpisodesDrawer.classList.remove('open');
        } else {
          this.closeCinemaPlayer();
        }
      }
    });
  }

  openCinemaPlayer(movieId, startSecs = 0, episodeNum = null) {
    const movie = this.movies.find(m => m.id === movieId);
    if (!movie || !this.cinemaPlayer) return;

    this.activeCinemaMovie = movie;
    const episodes = this.getEpisodesForMovie(movie);
    this.activeEpisodeIndex = 0;
    if (episodeNum) {
      const idx = episodes.findIndex(e => e.episodeNum === episodeNum);
      if (idx !== -1) this.activeEpisodeIndex = idx;
    }
    const currentEp = episodes[this.activeEpisodeIndex];

    // Update metadata
    document.getElementById('cinema-title').textContent = movie.title;
    document.getElementById('cinema-episode-badge').textContent = movie.type === 'TV Series' 
      ? `S1:E${currentEp.episodeNum} "${currentEp.title}"`
      : movie.duration;

    // Show or hide episodes button
    if (this.cinemaEpisodesBtn) {
      this.cinemaEpisodesBtn.style.display = movie.type === 'TV Series' ? 'inline-flex' : 'none';
    }

    // Populate Episodes Drawer
    if (this.cinemaEpisodesList) {
      this.cinemaEpisodesList.innerHTML = episodes.map((ep, idx) => `
        <div class="episode-item ${idx === this.activeEpisodeIndex ? 'active' : ''}" data-play-ep-num="${ep.episodeNum}">
          <div class="episode-thumb-wrap">
            <img src="${ep.thumb || movie.backdrop}" alt="${ep.title}" class="episode-thumb" loading="lazy">
            <div class="episode-thumb-play">▶</div>
          </div>
          <div class="episode-info">
            <div class="episode-title-row">
              <span class="episode-num-title">${ep.episodeNum}. ${ep.title}</span>
              <span class="episode-duration">${ep.duration}</span>
            </div>
            <p class="episode-desc">${ep.synopsis}</p>
          </div>
        </div>
      `).join('');

      const titleEl = document.getElementById('episodes-drawer-title');
      const seasonEl = document.getElementById('episodes-drawer-season');
      if (titleEl) titleEl.textContent = movie.title;
      if (seasonEl) seasonEl.textContent = `Season 1 (${episodes.length} Episodes)`;

      this.cinemaEpisodesList.querySelectorAll('[data-play-ep-num]').forEach(item => {
        item.addEventListener('click', () => {
          const epNum = parseInt(item.getAttribute('data-play-ep-num'), 10);
          if (this.cinemaEpisodesDrawer) this.cinemaEpisodesDrawer.classList.remove('open');
          this.playEpisode(epNum);
        });
      });
    }

    // Load stream and seek position with automatic backup fallback
    this.cinemaVideo.src = movie.videoUrl;
    this.cinemaVideo.poster = movie.backdrop;
    this.cinemaVideo.onerror = () => {
      if (movie.backupVideoUrl && !this.cinemaVideo.src.includes(movie.backupVideoUrl)) {
        console.warn('Primary stream failed, switching to backup HD stream:', movie.backupVideoUrl);
        this.cinemaVideo.src = movie.backupVideoUrl;
        this.cinemaVideo.play().catch(() => {});
      }
    };
    this.cinemaVideo.currentTime = startSecs || 0;
    this.cinemaVideo.volume = 0.85;
    this.cinemaVideo.muted = false;
    this.cinemaVolumeSlider.value = 0.85;
    this.updateCinemaVolumeUI();

    const ytLink = document.getElementById('cinema-yt-link');
    if (ytLink) {
      if (movie.youtubeTrailerId) {
        ytLink.href = `https://www.youtube.com/watch?v=${movie.youtubeTrailerId}`;
        ytLink.style.display = 'inline-flex';
      } else {
        ytLink.style.display = 'none';
      }
    }

    // Show player
    this.cinemaPlayer.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Activate selected stream source (NetMirror full movie/show, Server 2, or Cinema 4K Lab)
    this.switchStreamSource(this.activeStreamSource || 'netmirror');

    // Progress throttling: saves to SQLite database every 4 seconds
    clearInterval(this.playbackThrottleTimer);
    this.playbackThrottleTimer = setInterval(() => {
      if (this.activeStreamSource === 'cinema' && !this.cinemaVideo.paused && this.cinemaVideo.duration > 0) {
        const ct = this.cinemaVideo.currentTime;
        const dur = this.cinemaVideo.duration;
        const isCompleted = ct >= dur * 0.95 ? 1 : 0;
        this.recordPlaybackProgress(movie.id, ct, dur, isCompleted);
      } else if (this.activeStreamSource !== 'cinema' && this.activeCinemaMovie) {
        this.recordPlaybackProgress(movie.id, 120, 3600, 0);
      }
    }, 4000);

    this.setSubtitleTrack(this.preferences.subtitle_language || 'en');
  }

  switchStreamSource(source) {
    this.activeStreamSource = source;

    // Update pill active classes
    document.querySelectorAll('.stream-pill').forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('data-source') === source);
    });

    if (!this.activeCinemaMovie) return;
    const movie = this.activeCinemaMovie;
    const tmdbId = movie.tmdbId || 66732;
    const isTV = movie.type === 'TV Series';
    const season = this.activeSeason || 1;
    const episode = this.activeEpisode || 1;

    if (source === 'netmirror') {
      this.cinemaPlayer.classList.add('embed-active');
      this.cinemaVideo.pause();
      this.cinemaVideo.style.display = 'none';
      if (this.cinemaEmbedFrame) {
        this.cinemaEmbedFrame.style.display = 'block';
        if (isTV) {
          this.cinemaEmbedFrame.src = `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}?autoplay=true`;
        } else {
          this.cinemaEmbedFrame.src = `https://vidlink.pro/movie/${tmdbId}?autoplay=true`;
        }
      }
      this.showCinemaOsd('🎬', `Streaming Full ${isTV ? 'Episode' : 'Movie'}: ${movie.title} (NetMirror HD)`);
    } else if (source === 'vidsrc') {
      this.cinemaPlayer.classList.add('embed-active');
      this.cinemaVideo.pause();
      this.cinemaVideo.style.display = 'none';
      if (this.cinemaEmbedFrame) {
        this.cinemaEmbedFrame.style.display = 'block';
        if (isTV) {
          this.cinemaEmbedFrame.src = `https://vidsrc.pm/embed/tv/${tmdbId}/${season}/${episode}`;
        } else {
          this.cinemaEmbedFrame.src = `https://vidsrc.pm/embed/movie/${tmdbId}`;
        }
      }
      this.showCinemaOsd('⚡', `Server 2 (VidSrc VIP): ${movie.title}`);
    } else if (source === 'cinema') {
      this.cinemaPlayer.classList.remove('embed-active');
      if (this.cinemaEmbedFrame) {
        this.cinemaEmbedFrame.style.display = 'none';
        this.cinemaEmbedFrame.src = '';
      }
      this.cinemaVideo.style.display = 'block';
      this.cinemaVideo.play().catch(() => {});
      this.showCinemaOsd('🔥', `Cinema 4K Lab: ${movie.title} (Dolby Atmos & Subtitles)`);
    }
  }

  playEpisode(epNum) {
    if (!this.activeCinemaMovie) return;
    this.activeEpisode = epNum;
    const episodes = this.getEpisodesForMovie(this.activeCinemaMovie);
    const epIdx = episodes.findIndex(e => e.episodeNum === epNum);
    if (epIdx !== -1) {
      this.activeEpisodeIndex = epIdx;
      const ep = episodes[epIdx];
      const badge = document.getElementById('cinema-episode-badge');
      if (badge) badge.textContent = `S1:E${ep.episodeNum} "${ep.title}"`;
    }

    if (this.cinemaEpisodesList) {
      this.cinemaEpisodesList.querySelectorAll('.episode-item').forEach((item, idx) => {
        item.classList.toggle('active', idx === epIdx);
      });
    }

    if (this.activeStreamSource === 'netmirror' || this.activeStreamSource === 'vidsrc') {
      this.switchStreamSource(this.activeStreamSource);
    } else {
      this.cinemaVideo.currentTime = 0;
      this.cinemaVideo.play().catch(() => {});
      this.showCinemaOsd('▶', `Playing Episode ${epNum}`);
    }
  }

  closeCinemaPlayer() {
    if (!this.cinemaPlayer) return;
    clearInterval(this.playbackThrottleTimer);
    if (this.activeCinemaMovie) {
      if (this.activeStreamSource === 'cinema' && this.cinemaVideo.duration > 0) {
        const ct = this.cinemaVideo.currentTime;
        const dur = this.cinemaVideo.duration;
        const isCompleted = ct >= dur * 0.95 ? 1 : 0;
        this.recordPlaybackProgress(this.activeCinemaMovie.id, ct, dur, isCompleted);
      } else {
        this.recordPlaybackProgress(this.activeCinemaMovie.id, 120, 3600, 0);
      }
      this.fetchContinueWatching();
    }
    if (this.cinemaEmbedFrame) {
      this.cinemaEmbedFrame.src = '';
      this.cinemaEmbedFrame.style.display = 'none';
    }
    this.cinemaPlayer.classList.remove('embed-active', 'active', 'idle');
    this.cinemaVideo.pause();
    this.cinemaVideo.currentTime = 0;
    if (this.cinemaEpisodesDrawer) this.cinemaEpisodesDrawer.classList.remove('open');
    document.body.style.overflow = '';
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }

  toggleCinemaPlay() {
    if (this.cinemaVideo.paused) {
      this.cinemaVideo.play();
      this.cinemaPlayIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
      this.showCinemaOsd('▶', 'Play');
    } else {
      this.cinemaVideo.pause();
      this.cinemaPlayIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
      this.showCinemaOsd('❚❚', 'Pause');
      if (this.activeCinemaMovie && this.cinemaVideo.duration > 0) {
        this.recordPlaybackProgress(this.activeCinemaMovie.id, this.cinemaVideo.currentTime, this.cinemaVideo.duration, 0);
      }
    }
  }

  updateCinemaTimeline() {
    if (!this.cinemaVideo.duration) return;
    const ct = this.cinemaVideo.currentTime;
    const dur = this.cinemaVideo.duration;
    const pct = (ct / dur) * 100;
    this.cinemaScrubberProgress.style.width = `${pct}%`;

    const formatTime = (secs) => {
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    this.cinemaTimeDisplay.textContent = `${formatTime(ct)} / ${formatTime(dur)}`;
  }

  updateCinemaSubtitles() {
    if (this.currentSubTrack === 'off' || !this.activeCinemaMovie) {
      this.cinemaSubtitles.classList.remove('active');
      return;
    }

    const subtitlesList = this.activeCinemaMovie.subtitles?.[this.currentSubTrack] || this.activeCinemaMovie.subtitles?.en;
    if (!subtitlesList || !subtitlesList.length) {
      this.cinemaSubtitles.classList.remove('active');
      return;
    }

    const ct = this.cinemaVideo.currentTime;
    const cue = subtitlesList.find(s => ct >= s.time && ct < s.time + 3.8);

    if (cue) {
      this.cinemaSubtitles.textContent = cue.text;
      this.cinemaSubtitles.classList.add('active');
    } else {
      this.cinemaSubtitles.classList.remove('active');
    }
  }

  setSubtitleTrack(track) {
    this.currentSubTrack = track;
    document.querySelectorAll('#cinema-subtitles-options .cinema-option-item').forEach(i => {
      i.classList.toggle('selected', i.getAttribute('data-sub-track') === track);
    });
    if (track === 'off') {
      this.cinemaSubtitles.classList.remove('active');
    }
  }

  updateCinemaVolumeUI() {
    const isMuted = this.cinemaVideo.muted || this.cinemaVideo.volume === 0;
    if (isMuted) {
      this.cinemaVolumeIcon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
    } else {
      this.cinemaVolumeIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
    }
  }

  showCinemaOsd(icon, text) {
    if (!this.cinemaOsdPill) return;
    document.getElementById('cinema-osd-icon').textContent = icon;
    document.getElementById('cinema-osd-text').textContent = text;
    this.cinemaOsdPill.classList.add('show');
    clearTimeout(this.osdTimer);
    this.osdTimer = setTimeout(() => {
      this.cinemaOsdPill.classList.remove('show');
    }, 2400);
  }

  /* ══════════════════════════════════════════════
     GLOBAL EVENTS (Click Delegation)
  ══════════════════════════════════════════════ */
  setupGlobalEvents() {
    document.addEventListener('click', (e) => {
      // 1. Play Button -> Open Cinema Player directly
      const playBtn = e.target.closest('[data-play-id]');
      if (playBtn) {
        const id = playBtn.getAttribute('data-play-id');
        this.openCinemaPlayer(id);
        return;
      }

      // 2. Continue Watching Play Click -> Resume at saved timestamp
      const contPlay = e.target.closest('[data-continue-play-id]');
      if (contPlay && !e.target.closest('[data-remove-continue-id]')) {
        const id = contPlay.getAttribute('data-continue-play-id');
        const startSecs = parseFloat(contPlay.getAttribute('data-continue-start') || '0');
        this.openCinemaPlayer(id, startSecs);
        return;
      }

      // 3. Continue Watching Remove Button
      const removeBtn = e.target.closest('[data-remove-continue-id]');
      if (removeBtn) {
        e.stopPropagation();
        const id = removeBtn.getAttribute('data-remove-continue-id');
        this.removeContinueWatching(id);
        return;
      }

      // 4. Info Button -> Open Modal
      const infoBtn = e.target.closest('[data-info-id]');
      if (infoBtn) {
        const id = infoBtn.getAttribute('data-info-id');
        this.openMovieModal(id);
        return;
      }

      // 5. Watchlist Toggle
      const listBtn = e.target.closest('[data-watchlist-id]');
      if (listBtn) {
        e.stopPropagation();
        const id = listBtn.getAttribute('data-watchlist-id');
        this.toggleWatchlist(id);
        return;
      }

      // 6. Rating Buttons
      const rateBtn = e.target.closest('[data-rating-id]');
      if (rateBtn) {
        e.stopPropagation();
        const id = rateBtn.getAttribute('data-rating-id');
        const val = rateBtn.getAttribute('data-rating-val');
        this.rateMovie(id, val);
        return;
      }

      // 7. Modal Close Button
      const modalClose = e.target.closest('#modal-close-btn');
      if (modalClose) {
        const dialog = document.getElementById('movie-detail-dialog');
        if (dialog) dialog.close();
        return;
      }

      // 8. Click anywhere on Movie Card or Top 10 Card -> Open Interactive Modal
      const card = e.target.closest('[data-card-id]');
      if (card && !e.target.closest('.card-btn')) {
        const id = card.getAttribute('data-card-id');
        this.openMovieModal(id);
        return;
      }

      // 9. Landing Page Top 10 Items -> Open Cinema Player directly
      const landingCard = e.target.closest('[data-landing-play-id]');
      if (landingCard) {
        const id = landingCard.getAttribute('data-landing-play-id');
        this.openCinemaPlayer(id);
        return;
      }
    });
  }

  /* ══════════════════════════════════════════════
     INTERACTIVE DETAIL MODAL (<dialog>)
  ══════════════════════════════════════════════ */
  openMovieModal(movieId) {
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

        <div class="modal-hero-content">
          <h2 class="modal-title">${movie.title}</h2>
          <div class="modal-actions">
            <button class="btn-billboard-play" data-play-id="${movie.id}">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              Play
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
            <span class="quality-badge" style="border-color:#555;">${movie.audio || 'Dolby Atmos'}</span>
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

    const closeBtn = document.getElementById('modal-close-btn');
    closeBtn.addEventListener('click', () => dialog.close());

    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height
        && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!isInDialog) dialog.close();
    });
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
