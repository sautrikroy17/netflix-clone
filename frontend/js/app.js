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
    this.preferences = { audio_language: 'en-orig', subtitle_language: 'en', playback_speed: 1.0, video_quality: 'auto' };
    this.profiles = [];
    this.activeProfile = null;
    this.activeGenreFilter = 'all';
    this.currentQuality = 'auto';
    this.hoverPreviewTimeout = null;

    this.init();
  }

  async init() {
    this.setupRouter();
    await this.checkAuthSession();
    if (this.currentUser) {
      await this.fetchProfiles();
    }
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
    } else if (path === '/switch-profile') {
      if (!this.currentUser) return this.navigate('/login');
      appEl.innerHTML = this.renderProfilesScreen();
      this.attachProfilesScreenEvents();
    } else if (path === '/switch-profile') {
      if (!this.currentUser) return this.navigate('/login');
      appEl.innerHTML = this.renderProfilesScreen();
      this.attachProfilesScreenEvents();
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

  async fetchProfiles() {
    if (!this.currentUser) return;
    try {
      const res = await fetch('/api/profiles');
      if (res.ok) {
        const data = await res.json();
        const rawProfiles = data.profiles || [];
        this.profiles = rawProfiles.map(p => {
          let av = p.avatar;
          if (!av || av.includes('wikimedia.org') || av.includes('nflxso.net') || av.includes('unsplash.com')) {
            av = p.is_kids ? '/assets/avatars/avatar-kids.svg' : '/assets/avatars/avatar-red.svg';
          }
          return { ...p, avatar: av };
        });
        const savedId = localStorage.getItem('netflix_active_profile_id');
        const match = this.profiles.find(p => p.id == savedId);
        this.activeProfile = match || this.profiles[0] || null;
        if (this.activeProfile) {
          localStorage.setItem('netflix_active_profile_id', this.activeProfile.id);
        }
      }
    } catch (e) {
      console.error('Error fetching profiles:', e);
    }
  }

  async switchProfile(profileId) {
    const prof = this.profiles.find(p => p.id == profileId);
    if (!prof) return;
    this.activeProfile = prof;
    localStorage.setItem('netflix_active_profile_id', prof.id);
    this.showToast(`Switched to profile: ${prof.name}`, 'info');
    await this.fetchMovies();
    await this.fetchWatchlist();
    await this.fetchContinueWatching();
    this.navigate('/browse');
  }

  async createProfile(name, avatar, isKids, favoriteGenres) {
    try {
      let chosenAvatar = avatar;
      if (!chosenAvatar || chosenAvatar.includes('wikimedia.org') || chosenAvatar.includes('nflxso.net') || chosenAvatar.includes('unsplash.com')) {
        chosenAvatar = isKids ? '/assets/avatars/avatar-kids.svg' : '/assets/avatars/avatar-red.svg';
      }
      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, avatar: chosenAvatar, isKids, favoriteGenres })
      });
      if (res.ok) {
        const data = await res.json();
        const prof = data.profile;
        if (prof) {
          if (!prof.avatar || prof.avatar.includes('wikimedia.org') || prof.avatar.includes('nflxso.net') || prof.avatar.includes('unsplash.com')) {
            prof.avatar = prof.is_kids ? '/assets/avatars/avatar-kids.svg' : '/assets/avatars/avatar-red.svg';
          }
          this.profiles.push(prof);
          this.showToast(`Profile "${name}" created successfully!`, 'success');
          await this.switchProfile(prof.id);
          return true;
        }
      }
    } catch (e) {
      this.showToast('Failed to create profile', 'error');
    }
    return false;
  }

  async checkAuthSession() {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        this.currentUser = data.user;
        await this.fetchProfiles();
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

  // 3b. "Who's Watching?" Profiles Selection Screen
  renderProfilesScreen() {
    return `
      <div class="profiles-screen-container">
        <button class="screen-back-btn" id="profiles-back-btn" title="Back to Browse">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          <span>Back to Browse</span>
        </button>

        <h1 class="profiles-screen-title">Who's watching?</h1>
        <div class="profiles-grid">
          ${this.profiles.map(p => `
            <div class="profile-tile" data-select-profile-id="${p.id}">
              <div class="profile-tile-avatar">
                <img src="${p.avatar || '/assets/avatars/avatar-red.svg'}" alt="${p.name}" onerror="this.onerror=null; this.src='${p.is_kids ? '/assets/avatars/avatar-kids.svg' : '/assets/avatars/avatar-red.svg'}';">
              </div>
              <div class="profile-tile-name">${p.name}${p.is_kids ? ' <span style="font-size:0.8rem; color:#f5a623;">(Kids)</span>' : ''}</div>
            </div>
          `).join('')}
          <div class="profile-tile" id="screen-add-profile-btn">
            <div class="profile-tile-avatar profile-tile-add">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>
            <div class="profile-tile-name">Add Profile</div>
          </div>
        </div>
        <button class="btn-manage-profiles" id="btn-manage-profiles">Manage Profiles</button>
      </div>
    `;
  }

  attachProfilesScreenEvents() {
    const backBtn = document.getElementById('profiles-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.navigate('/browse'));
    }

    document.querySelectorAll('[data-select-profile-id]').forEach(tile => {
      tile.addEventListener('click', () => {
        const id = tile.getAttribute('data-select-profile-id');
        this.switchProfile(id);
      });
    });

    const addBtn = document.getElementById('screen-add-profile-btn');
    const profileDialog = document.getElementById('profile-modal-dialog');
    if (addBtn && profileDialog) {
      addBtn.addEventListener('click', () => {
        profileDialog.showModal();
      });
    }

    const manageBtn = document.getElementById('btn-manage-profiles');
    if (manageBtn) {
      manageBtn.addEventListener('click', () => {
        const accountDialog = document.getElementById('account-modal-dialog');
        if (accountDialog) accountDialog.showModal();
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

    // Genre Filter in TV Shows / Movies view
    if (this.activeGenreFilter && this.activeGenreFilter !== 'all') {
      const gf = this.activeGenreFilter.toLowerCase();
      displayedMovies = displayedMovies.filter(m => 
        m.genres.some(g => g.toLowerCase().includes(gf)) ||
        (gf === 'indian' && ['rrr', 'leo', 'jawan', 'animal', 'kalki-2898-ad', 'kgf-chapter-2', 'salaar', 'baahubali-2', 'dangal', 'three-idiots', 'vikram', 'kantara', 'pushpa-the-rise', 'dunki'].includes(m.id))
      );
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      displayedMovies = this.movies.filter(m => 
        m.title.toLowerCase().includes(q) ||
        m.genres.some(g => g.toLowerCase().includes(q)) ||
        m.cast.some(c => c.toLowerCase().includes(q))
      );
    }

    // Category lists for rows with curated Netflix ranking
    const topShowIds = ['stranger-things','squid-game','wednesday','money-heist','arcane','peaky-blinders','breaking-bad','dark','narcos','better-call-saul'];
    const topShows = topShowIds.map(id => this.movies.find(m => m.id === id)).filter(Boolean);
    const newOnNetflix = this.movies.filter(m => m.year === '2024' || m.year === '2023');
    const yourNextWatch = this.movies.filter(m => m.matchScore >= 95).slice(0, 10);
    const topMovieIds = ['jawan', 'animal', 'rrr', 'kalki-2898-ad', 'leo', 'kgf-chapter-2', 'salaar', 'interstellar', 'inception', 'the-dark-knight'];
    const topMovies = topMovieIds.map(id => this.movies.find(m => m.id === id)).filter(Boolean);
    const topPicks = this.movies.filter(m => ['narcos', 'interstellar', 'cyberpunk-edgerunners', 'dune-part-two', 'all-of-us-are-dead', 'the-witcher'].includes(m.id) || m.matchScore >= 96);
    const usThrillers = this.movies.filter(m => m.genres.some(g => ['crime', 'thriller', 'mystery'].some(kw => g.toLowerCase().includes(kw))));
    const grittyShows = this.movies.filter(m => m.type === 'TV Series' && (m.genres.some(g => ['crime', 'drama', 'action'].some(kw => g.toLowerCase().includes(kw))) || ['breaking-bad', 'better-call-saul', 'narcos', 'peaky-blinders', 'dark'].includes(m.id)));
    const indianHits = this.movies.filter(m => ['rrr', 'leo', 'jawan', 'animal', 'kalki-2898-ad', 'kgf-chapter-2', 'salaar', 'baahubali-2', 'dangal', 'three-idiots', 'vikram', 'kantara', 'pushpa-the-rise', 'dunki'].includes(m.id));
    const scifi = this.movies.filter(m => m.genres.some(g => g.toLowerCase().includes('sci-fi') || g.toLowerCase().includes('cyberpunk') || g.toLowerCase().includes('multiverse')));
    const anime = this.movies.filter(m => m.genres.some(g => g.toLowerCase().includes('anime') || g.toLowerCase().includes('animation')));

    let activeAvatar = this.activeProfile?.avatar;
    if (!activeAvatar || activeAvatar.includes('wikimedia.org') || activeAvatar.includes('nflxso.net') || activeAvatar.includes('unsplash.com')) {
      activeAvatar = this.activeProfile?.is_kids ? '/assets/avatars/avatar-kids.svg' : '/assets/avatars/avatar-red.svg';
    }
    const activeProfileName = this.activeProfile?.name || this.currentUser.name || 'Home';

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

            <!-- Notification Bell with Badge 12 (Matching Screenshot 1 & 2) -->
            <div class="notification-wrapper" id="notification-wrapper">
              <button class="notification-btn" id="notification-btn" aria-label="Notifications" title="Notifications">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                <span class="notification-badge">12</span>
              </button>
              <div class="notification-dropdown" id="notification-dropdown">
                <div class="notification-header">
                  <span>Notifications</span>
                  <span style="font-size:0.75rem; color:var(--netflix-red); font-weight:normal;">12 New</span>
                </div>
                <div class="notification-list">
                  <div class="notification-item" data-play-id="stranger-things">
                    <img src="https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg" class="notification-thumb" alt="Stranger Things">
                    <div class="notification-content">
                      <div class="notification-title">Stranger Things Season 5: Official Teaser is live</div>
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

            <!-- Profile Menu Dropdown with Switcher -->
            <div class="profile-menu-wrapper" id="profile-menu-wrapper">
              <div class="profile-avatar-btn">
                <img src="${activeAvatar}" alt="Profile Avatar" class="profile-img" onerror="this.onerror=null; this.src='/assets/avatars/avatar-red.svg';">
                <span class="profile-caret">▼</span>
              </div>
              <div class="profile-dropdown-menu" id="profile-dropdown">
                <div class="profile-user-info">
                  <div class="profile-user-name" id="dropdown-user-name">${activeProfileName}</div>
                  <div class="profile-user-plan" id="dropdown-user-plan">${this.currentUser.plan} &bull; 4K UHD</div>
                </div>

                <!-- Multi-Profile Switcher List -->
                ${this.profiles.length > 0 ? `
                  <div style="padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.1); display:flex; flex-direction:column; gap:4px;">
                    ${this.profiles.map(p => `
                      <div class="profile-switch-item ${this.activeProfile?.id === p.id ? 'active' : ''}" data-switch-profile-id="${p.id}" style="display:flex; align-items:center; gap:10px; padding:6px 14px; cursor:pointer; font-size:0.88rem; transition:background 0.15s ease;">
                        <img src="${p.avatar || '/assets/avatars/avatar-red.svg'}" alt="${p.name}" style="width:26px; height:26px; border-radius:4px; object-fit:cover;" onerror="this.onerror=null; this.src='${p.is_kids ? '/assets/avatars/avatar-kids.svg' : '/assets/avatars/avatar-red.svg'}';">
                        <span style="flex:1;">${p.name}${p.is_kids ? ' <span style="font-size:0.75rem; color:#f5a623;">(Kids)</span>' : ''}</span>
                        ${this.activeProfile?.id === p.id ? '<span style="color:var(--netflix-red); font-size:0.8rem;">●</span>' : ''}
                      </div>
                    `).join('')}
                    <div class="profile-switch-item" id="nav-add-profile-btn" style="display:flex; align-items:center; gap:10px; padding:6px 14px; cursor:pointer; font-size:0.88rem;">
                      <span style="width:26px; height:26px; border-radius:4px; background:#333; display:flex; align-items:center; justify-content:center; font-weight:bold;">+</span>
                      <span>Add Profile</span>
                    </div>
                    <a href="/switch-profile" data-route="/switch-profile" style="display:flex; align-items:center; gap:10px; padding:6px 14px; cursor:pointer; font-size:0.88rem; color:#bbb; text-decoration:none;">
                      <span style="width:26px; height:26px; display:flex; align-items:center; justify-content:center;">👥</span>
                      <span>Who's Watching?</span>
                    </a>
                  </div>
                ` : ''}

                <a href="/mylist" data-route="/mylist">📋 My List (${this.watchlist.length})</a>
                <button type="button" id="btn-open-account">⚙️ Account Settings</button>
                <button type="button" id="btn-logout">🚪 Sign Out of Netflix</button>
              </div>
            </div>
          </div>
        </header>

        <!-- Sticky Category Subnav for TV Shows & Movies -->
        ${(this.activeCategory === 'tv' || this.activeCategory === 'movies') && !this.searchQuery ? `
          <div class="category-subnav">
            <div class="category-subnav-left">
              <h1 class="category-subnav-title">${this.activeCategory === 'tv' ? 'TV Shows' : 'Movies'}</h1>
              <div class="genre-dropdown-wrapper">
                <button class="genre-dropdown-btn" id="category-genre-dropdown-btn">
                  <span>${this.activeGenreFilter === 'all' ? 'Genres' : this.activeGenreFilter}</span>
                  <span style="font-size:0.75rem;">▾</span>
                </button>
                <div class="genre-dropdown-menu" id="category-genre-dropdown-menu">
                  <div class="genre-menu-item ${this.activeGenreFilter === 'all' ? 'active' : ''}" data-genre-val="all">All Genres</div>
                  <div class="genre-menu-item ${this.activeGenreFilter === 'Action' ? 'active' : ''}" data-genre-val="Action">Action & Adventure</div>
                  <div class="genre-menu-item ${this.activeGenreFilter === 'Sci-Fi' ? 'active' : ''}" data-genre-val="Sci-Fi">Sci-Fi & Fantasy</div>
                  <div class="genre-menu-item ${this.activeGenreFilter === 'Crime' ? 'active' : ''}" data-genre-val="Crime">Crime Thrillers & Mysteries</div>
                  <div class="genre-menu-item ${this.activeGenreFilter === 'Drama' ? 'active' : ''}" data-genre-val="Drama">Gritty TV Shows & Dramas</div>
                  <div class="genre-menu-item ${this.activeGenreFilter === 'Indian' ? 'active' : ''}" data-genre-val="Indian">Indian Mega Blockbusters</div>
                  <div class="genre-menu-item ${this.activeGenreFilter === 'Anime' ? 'active' : ''}" data-genre-val="Anime">Anime & Animation</div>
                  <div class="genre-menu-item ${this.activeGenreFilter === 'Comedy' ? 'active' : ''}" data-genre-val="Comedy">Comedies</div>
                </div>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Search Results View with Back Button -->
        ${this.searchQuery ? `
          <div class="search-results-container" style="padding: 110px 4% 40px; min-height: 80vh;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
              <div style="display:flex; align-items:center; gap: 16px;">
                <button class="search-back-btn" id="search-back-btn" title="Back to Browse">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                  <span>Back to Browse</span>
                </button>
                <h2 style="font-size: 1.4rem; font-weight: 700; margin: 0; color: #fff;">
                  Search results for "${this.searchQuery}" <span style="font-size: 0.95rem; font-weight: normal; color: #888;">(${displayedMovies.length} found)</span>
                </h2>
              </div>
            </div>
            ${displayedMovies.length > 0 ? `
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 18px;">
                ${displayedMovies.map(m => this.renderMovieCard(m)).join('')}
              </div>
            ` : `
              <div style="text-align: center; padding: 60px 20px; color: #888;">
                <p style="font-size: 1.2rem; margin-bottom: 12px; color: #fff;">No titles found matching "${this.searchQuery}".</p>
                <p style="font-size: 0.95rem;">Try searching for movie names like "Drishyam", "Jawan", "Stranger Things", or "Interstellar".</p>
              </div>
            `}
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
                    <span>Continue Watching for ${activeProfileName}</span>
                  </h2>
                </div>
                <button class="slider-arrow slider-arrow-left" aria-label="Previous">‹</button>
                <div class="movie-slider">
                  ${this.continueWatching.map(m => this.renderContinueWatchingCard(m)).join('')}
                </div>
                <button class="slider-arrow slider-arrow-right" aria-label="Next">›</button>
              </div>
            ` : ''}

            <!-- 1. My List Row (Persisted in SQLite database) -->
            ${this.watchlist.length > 0 && this.activeCategory !== 'languages' ? `
              <div class="category-row">
                <div class="category-header">
                  <h2 class="category-title">
                    <span>My List</span>
                  </h2>
                </div>
                <button class="slider-arrow slider-arrow-left" aria-label="Previous">‹</button>
                <div class="movie-slider">
                  ${this.watchlist.map(m => this.renderMovieCard(m)).join('')}
                </div>
                <button class="slider-arrow slider-arrow-right" aria-label="Next">›</button>
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
                <div style="display:flex; align-items:center; gap:16px; margin-bottom: 20px; flex-wrap:wrap;">
                  <button class="search-back-btn" data-category="all" data-route="/browse">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    <span>Back to Home</span>
                  </button>
                  <h2 style="font-size: 1.6rem; font-weight: 700; margin: 0; color: #fff;">
                    ${this.activeCategory === 'tv' ? 'TV Shows & Global Series' : 'Hollywood & Indian Blockbuster Movies'}
                    <span style="font-size: 0.9rem; font-weight: normal; color: #888;">(${displayedMovies.length} titles${this.activeGenreFilter !== 'all' ? ' &bull; ' + this.activeGenreFilter : ''})</span>
                  </h2>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px;">
                  ${displayedMovies.map(m => this.renderMovieCard(m)).join('')}
                </div>
              </div>
            ` : (this.activeCategory !== 'mylist' && this.activeCategory !== 'languages' ? `
              <!-- 2. Top 10 Shows in India Today -->
              <div class="category-row">
                <div class="category-header">
                  <h2 class="category-title">Top 10 Shows in India Today</h2>
                </div>
                <button class="slider-arrow slider-arrow-left" aria-label="Previous">‹</button>
                <div class="movie-slider">
                  ${topShows.map((m, idx) => this.renderTop10Card(m, idx + 1)).join('')}
                </div>
                <button class="slider-arrow slider-arrow-right" aria-label="Next">›</button>
              </div>

              <!-- 3. New on Netflix -->
              <div class="category-row">
                <div class="category-header">
                  <h2 class="category-title">New on Netflix</h2>
                </div>
                <button class="slider-arrow slider-arrow-left" aria-label="Previous">‹</button>
                <div class="movie-slider">
                  ${newOnNetflix.map(m => this.renderMovieCard(m)).join('')}
                </div>
                <button class="slider-arrow slider-arrow-right" aria-label="Next">›</button>
              </div>

              <!-- 4. Your Next Watch -->
              <div class="category-row">
                <div class="category-header">
                  <h2 class="category-title">Your Next Watch</h2>
                </div>
                <button class="slider-arrow slider-arrow-left" aria-label="Previous">‹</button>
                <div class="movie-slider">
                  ${yourNextWatch.map(m => this.renderMovieCard(m)).join('')}
                </div>
                <button class="slider-arrow slider-arrow-right" aria-label="Next">›</button>
              </div>

              <!-- 5. Top 10 Movies in India Today (Screenshot 5 Exact) -->
              <div class="category-row">
                <div class="category-header">
                  <h2 class="category-title">Top 10 Movies in India Today</h2>
                </div>
                <button class="slider-arrow slider-arrow-left" aria-label="Previous">‹</button>
                <div class="movie-slider">
                  ${topMovies.map((m, idx) => this.renderTop10Card(m, idx + 1)).join('')}
                </div>
                <button class="slider-arrow slider-arrow-right" aria-label="Next">›</button>
              </div>

              <!-- 6. Today's Top Picks for You (Screenshot 2 Exact) -->
              <div class="category-row">
                <div class="category-header">
                  <h2 class="category-title">Today's Top Picks for You</h2>
                </div>
                <button class="slider-arrow slider-arrow-left" aria-label="Previous">‹</button>
                <div class="movie-slider">
                  ${topPicks.map(m => this.renderMovieCard(m)).join('')}
                </div>
                <button class="slider-arrow slider-arrow-right" aria-label="Next">›</button>
              </div>

              <!-- 7. US TV Thrillers & Mysteries (Screenshot 2 Exact) -->
              <div class="category-row">
                <div class="category-header">
                  <h2 class="category-title">US TV Thrillers & Mysteries</h2>
                </div>
                <button class="slider-arrow slider-arrow-left" aria-label="Previous">‹</button>
                <div class="movie-slider">
                  ${usThrillers.map(m => this.renderMovieCard(m)).join('')}
                </div>
                <button class="slider-arrow slider-arrow-right" aria-label="Next">›</button>
              </div>

              <!-- 8. Gritty TV Shows (Screenshot 2 Exact) -->
              <div class="category-row">
                <div class="category-header">
                  <h2 class="category-title">Gritty TV Shows</h2>
                </div>
                <button class="slider-arrow slider-arrow-left" aria-label="Previous">‹</button>
                <div class="movie-slider">
                  ${grittyShows.map(m => this.renderMovieCard(m)).join('')}
                </div>
                <button class="slider-arrow slider-arrow-right" aria-label="Next">›</button>
              </div>

              <!-- 9. Indian Mega Blockbusters -->
              <div class="category-row">
                <div class="category-header">
                  <h2 class="category-title">Indian Mega Blockbusters & Cinema</h2>
                </div>
                <button class="slider-arrow slider-arrow-left" aria-label="Previous">‹</button>
                <div class="movie-slider">
                  ${indianHits.map(m => this.renderMovieCard(m)).join('')}
                </div>
                <button class="slider-arrow slider-arrow-right" aria-label="Next">›</button>
              </div>

              <!-- 10. Sci-Fi & Mind-Bending -->
              <div class="category-row">
                <div class="category-header">
                  <h2 class="category-title">Blockbuster Sci-Fi & Mind-Bending</h2>
                </div>
                <button class="slider-arrow slider-arrow-left" aria-label="Previous">‹</button>
                <div class="movie-slider">
                  ${scifi.map(m => this.renderMovieCard(m)).join('')}
                </div>
                <button class="slider-arrow slider-arrow-right" aria-label="Next">›</button>
              </div>

              <!-- 11. Anime & Animation -->
              <div class="category-row">
                <div class="category-header">
                  <h2 class="category-title">Anime & Global Animation</h2>
                </div>
                <button class="slider-arrow slider-arrow-left" aria-label="Previous">‹</button>
                <div class="movie-slider">
                  ${anime.map(m => this.renderMovieCard(m)).join('')}
                </div>
                <button class="slider-arrow slider-arrow-right" aria-label="Next">›</button>
              </div>
            ` : '')}

          </main>
        `}
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

  getTrailerForMovie(movie) {
    if (movie.videoUrl) return movie.videoUrl;
    if (movie.backupVideoUrl) return movie.backupVideoUrl;

    const id = (movie.id || '').toLowerCase();
    const genres = (movie.genres || []).join(' ').toLowerCase();

    if (id.includes('wednesday') || genres.includes('comedy') || genres.includes('supernatural') || genres.includes('anime')) {
      return '/trailers/wednesday.mp4';
    }
    if (id.includes('batman') || id.includes('narcos') || genres.includes('crime') || genres.includes('action') || genres.includes('thriller')) {
      return '/trailers/the-batman.mp4';
    }
    if (id.includes('interstellar') || id.includes('oppenheimer') || genres.includes('drama') || genres.includes('sci-fi')) {
      return '/trailers/interstellar.mp4';
    }
    return '/trailers/stranger-things.mp4';
  }

  renderMovieCard(movie) {
    const isInList = this.watchlist.some(m => m.id === movie.id);
    const userRating = this.ratings[movie.id] || 'none';
    const trailerUrl = this.getTrailerForMovie(movie);

    // Badges calculation matching user's screenshots
    const isTop10 = movie.top10Rank || ['stranger-things','squid-game','wednesday','money-heist','rrr','leo','jawan','animal','kalki-2898-ad','kgf-chapter-2'].includes(movie.id);
    const isNewSeason = movie.year === '2024';
    const isRecentlyAdded = movie.year === '2023' || movie.id === 'arcane' || movie.id === 'cyberpunk-edgerunners' || movie.id === 'narcos';
    const isNewEpisode = movie.type === 'TV Series' && !isNewSeason && !isRecentlyAdded;

    return `
      <div class="movie-card" data-card-id="${movie.id}">
        ${isTop10 ? `<div class="card-badge-top-left">TOP 10</div>` : ''}
        
        <img src="${movie.backdrop}" alt="${movie.title}" loading="lazy" class="movie-card-thumb" onerror="this.onerror=null; this.src='https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg';">

        <!-- Movie Title & Badge Overlay (Visible on Feed & Search results) -->
        <div class="card-title-overlay">
          <div class="card-title-text">${movie.title}</div>
          ${isNewSeason ? `<div class="card-badge-pill">New Season</div>` : (isRecentlyAdded ? `<div class="card-badge-pill">Recently added</div>` : (isNewEpisode ? `<div class="card-badge-pill">New Episode</div>` : ''))}
        </div>

        <!-- Netflix Popout Hover Preview Card (Screenshot 4 Pixel-Perfect Replica) -->
        <div class="movie-card-hover-box">
          <div class="hover-media-section">
            <span class="hover-n-logo">N</span>
            <img src="${movie.backdrop}" alt="${movie.title}" class="hover-media-img" onerror="this.onerror=null; this.src='https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg';">
            <video class="hover-preview-video" muted loop playsinline preload="none" data-src="${trailerUrl}"></video>
            <button class="hover-sound-btn" data-hover-sound-id="${movie.id}" title="Toggle Sound" aria-label="Toggle Sound">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
            </button>
          </div>
          <div class="hover-details-section">
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
              <span class="hover-meta-type">${movie.type === 'TV Series' ? 'Series' : 'Film'}</span>
              <span class="age-badge">${movie.ageRating}</span>
              <span style="color:#aaa;">${movie.type === 'TV Series' ? '1 Season' : movie.duration}</span>
              <span class="dolby-badge">Dolby VISION</span>
            </div>
            <div class="hover-genres">${movie.genres.slice(0, 3).join(' • ')}</div>
          </div>
        </div>
      </div>
    `;
  }

  renderTop10Card(movie, rank = 1) {
    const isInList = this.watchlist.some(m => m.id === movie.id);
    const finalRank = rank;

    return `
      <div class="top10-card" data-card-id="${movie.id}">
        <div class="top10-number ${finalRank === 1 ? 'rank-1' : (finalRank === 10 ? 'rank-10' : '')}">${finalRank}</div>
        <div class="top10-poster-wrap">
          <img src="${movie.poster}" alt="${movie.title}" loading="lazy" class="top10-poster-img" onerror="this.onerror=null; this.src='https://image.tmdb.org/t/p/w780/49WJfeN0moxb9IPfGn8AIqMGskD.jpg';">
          <div class="top10-badge-bottom">Recently added</div>
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

  getEpisodesForMovie(movie, season = 1) {
    const id = (movie.id || '').toLowerCase();

    if (id === 'narcos') {
      if (season === 2) {
        return [
          {
            episodeNum: 1,
            title: 'Free at Last',
            duration: '53m',
            thumb: movie.backdrop,
            synopsis: 'In the wake of a massive military effort to capture Pablo, the family reunites while enemies make daring alliances.'
          },
          {
            episodeNum: 2,
            title: 'Cambalache',
            duration: '47m',
            thumb: movie.poster,
            synopsis: 'Tata gets impatient with life on the run. Pablo responds to President Gaviria\'s reward offer with ruthless counterattacks.'
          },
          {
            episodeNum: 3,
            title: 'Our Man in Madrid',
            duration: '47m',
            thumb: movie.backdrop,
            synopsis: 'President Gaviria has a new job for an old colleague. The Search Bloc turns up the heat, striking close to Escobar\'s inner circle.'
          },
          {
            episodeNum: 4,
            title: 'The Good, the Bad, and the Dead',
            duration: '56m',
            thumb: movie.poster,
            synopsis: 'The Cali cartel weighs an offer to move onto Pablo\'s territory. Limón proposes an ambitious deal to an old neighborhood pal.'
          }
        ];
      }
      return [
        {
          episodeNum: 1,
          title: 'Descenso',
          duration: '57m',
          thumb: movie.backdrop,
          synopsis: 'Chilean drug chemist Cockroach brings his product to Colombian smuggler Pablo Escobar. DEA agent Steve Murphy joins the war on drugs in Bogotá.'
        },
        {
          episodeNum: 2,
          title: 'The Sword of Simón Bolívar',
          duration: '47m',
          thumb: movie.poster,
          synopsis: 'Communist radical group M-19 makes a move against the narcos, while Murphy gets an education in Colombian law enforcement from his new partner Peña.'
        },
        {
          episodeNum: 3,
          title: 'The Men of Always',
          duration: '45m',
          thumb: movie.backdrop,
          synopsis: 'Murphy and Peña try to bring down Escobar by linking him to a high-profile target in politics, while Murphy encounters local corruption.'
        },
        {
          episodeNum: 4,
          title: 'The Palace in Flames',
          duration: '44m',
          thumb: movie.poster,
          synopsis: 'Despite a new extradition treaty, the U.S. puts more money into the fight, leading Murphy and Peña to target Escobar\'s secret banking.'
        }
      ];
    }

    if (id === 'wednesday') {
      if (season === 2) {
        return [
          {
            episodeNum: 1,
            title: 'Chapter I: Here We Woe Again',
            duration: '55m',
            thumb: movie.backdrop,
            synopsis: 'Back at Nevermore, Wednesday unearths fresh dark secrets buried beneath the academy\'s ancient crypts.'
          },
          {
            episodeNum: 2,
            title: 'Chapter II: The Midnight Murders',
            duration: '51m',
            thumb: movie.poster,
            synopsis: 'A series of eerie occurrences around Jericho leads Wednesday and Enid into forbidden territory.'
          }
        ];
      }
      return [
        {
          episodeNum: 1,
          title: 'Chapter I: Wednesday\'s Child Is Full of Woe',
          duration: '59m',
          thumb: movie.backdrop,
          synopsis: 'When a delightfully wicked prank gets Wednesday expelled, her parents ship her off to Nevermore Academy, the boarding school where they fell in love.'
        },
        {
          episodeNum: 2,
          title: 'Chapter II: Woe Is the Loneliest Number',
          duration: '57m',
          thumb: movie.poster,
          synopsis: 'The sheriff questions Wednesday about the night\'s strange happenings. Later, Wednesday faces off against a fierce rival during the Poe Cup race.'
        },
        {
          episodeNum: 3,
          title: 'Chapter III: Friend or Woe',
          duration: '48m',
          thumb: movie.backdrop,
          synopsis: 'Wednesday stumbles upon a secret society. During Outreach Day, Nevermore\'s outcasts mingle with the normies of Jericho in Pilgrim World.'
        },
        {
          episodeNum: 4,
          title: 'Chapter IV: Woe What a Night',
          duration: '49m',
          thumb: movie.poster,
          synopsis: 'Wednesday asks Xavier to the Rave\'N dance, sparking Tyler\'s jealousy — but Thing has something up his sleeve. Meanwhile, Eugene stakes out the cave.'
        }
      ];
    }

    if (id === 'stranger-things') {
      if (season === 2) {
        return [
          {
            episodeNum: 1,
            title: 'Chapter One: MADMAX',
            duration: '48m',
            thumb: movie.backdrop,
            synopsis: 'As the town preps for Halloween, a high-scoring rival shakes up the arcade, and a skeptical Hopper inspects a field of rotting pumpkins.'
          },
          {
            episodeNum: 2,
            title: 'Chapter Two: Trick or Treat, Freak',
            duration: '55m',
            thumb: movie.poster,
            synopsis: 'After Will sees something terrible on trick-or-treat night, Mike wonders whether Eleven is still out there. Dustin adopts a strange new pet.'
          }
        ];
      }
      return [
        {
          episodeNum: 1,
          title: 'Chapter One: The Vanishing of Will Byers',
          duration: '48m',
          thumb: movie.backdrop,
          synopsis: 'On his way home from a friend\'s house, young Will sees something terrifying. Nearby, a sinister secret lurks in the depths of a government lab.'
        },
        {
          episodeNum: 2,
          title: 'Chapter Two: The Weirdo on Maple Street',
          duration: '55m',
          thumb: movie.poster,
          synopsis: 'Lucas, Mike and Dustin try to talk to the girl they found in the woods. Hopper questions an anxious Joyce about an unsettling phone call.'
        },
        {
          episodeNum: 3,
          title: 'Chapter Three: Holly, Jolly',
          duration: '51m',
          thumb: movie.backdrop,
          synopsis: 'An increasingly concerned Nancy looks for Barb and finds out what Jonathan\'s been up to. Joyce is convinced Will is trying to talk to her.'
        },
        {
          episodeNum: 4,
          title: 'Chapter Four: The Body',
          duration: '50m',
          thumb: movie.poster,
          synopsis: 'Refusing to believe Will is dead, Joyce tries to connect with her son. The boys give Eleven a makeover. Nancy and Jonathan form an alliance.'
        }
      ];
    }

    if (season === 2) {
      return [
        {
          episodeNum: 1,
          title: 'Season 2, Episode 1: New Allegiances',
          duration: '52m',
          thumb: movie.backdrop,
          synopsis: 'Following the dramatic events of the finale, tensions escalate as new rivals enter the fray.'
        },
        {
          episodeNum: 2,
          title: 'Season 2, Episode 2: Breaking Point',
          duration: '50m',
          thumb: movie.poster,
          synopsis: 'An unexpected betrayal shifts the balance of power, forcing difficult choices.'
        },
        {
          episodeNum: 3,
          title: 'Season 2, Episode 3: Crossfire',
          duration: '55m',
          thumb: movie.backdrop,
          synopsis: 'The conflict spills into the open as both sides prepare for an inevitable confrontation.'
        },
        {
          episodeNum: 4,
          title: 'Season 2, Episode 4: Endgame',
          duration: '58m',
          thumb: movie.poster,
          synopsis: 'The season concludes with high-stakes reveals and consequences that change everything.'
        }
      ];
    }

    return [
      {
        episodeNum: 1,
        title: 'Episode 1: The Beginning',
        duration: '54m',
        thumb: movie.backdrop,
        synopsis: movie.overview || 'An unexpected event sets into motion a gripping series of secrets and challenges.'
      },
      {
        episodeNum: 2,
        title: 'Episode 2: Into the Shadows',
        duration: '49m',
        thumb: movie.poster,
        synopsis: 'Underground connections come to light as allies struggle to keep their identities guarded.'
      },
      {
        episodeNum: 3,
        title: 'Episode 3: The Gathering Storm',
        duration: '51m',
        thumb: movie.backdrop,
        synopsis: 'A race against time unfolds across multiple battlegrounds, testing everyone\'s resolve.'
      },
      {
        episodeNum: 4,
        title: 'Episode 4: Turning Point',
        duration: '56m',
        thumb: movie.poster,
        synopsis: 'Surprising discoveries alter the course of the investigation and raise the stakes.'
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

    // Netflix Hover Card Video Preview (Screenshot 4)
    document.querySelectorAll('.movie-card').forEach(card => {
      let hoverTimer = null;
      const video = card.querySelector('.hover-preview-video');
      const soundBtn = card.querySelector('.hover-sound-btn');

      card.addEventListener('mouseenter', () => {
        hoverTimer = setTimeout(() => {
          if (video && video.getAttribute('data-src')) {
            const src = video.getAttribute('data-src');
            if (!video.src || !video.src.includes(src)) {
              video.src = src;
            }
            video.muted = true;
            const p = video.play();
            if (p !== undefined) {
              p.catch(() => {});
            }
          }
        }, 220); // 220ms Netflix hover intent
      });

      card.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimer);
        if (video) {
          video.pause();
          try { video.currentTime = 0; } catch (e) {}
        }
      });

      if (soundBtn && video) {
        soundBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          video.muted = !video.muted;
          soundBtn.innerHTML = video.muted
            ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`
            : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
        });
      }
    });

    // Category Carousel Slider Arrows
    document.querySelectorAll('.category-row').forEach(row => {
      const slider = row.querySelector('.movie-slider');
      const leftArrow = row.querySelector('.slider-arrow-left');
      const rightArrow = row.querySelector('.slider-arrow-right');

      if (slider && leftArrow) {
        leftArrow.addEventListener('click', (e) => {
          e.stopPropagation();
          slider.scrollBy({ left: -(slider.clientWidth * 0.75), behavior: 'smooth' });
        });
      }
      if (slider && rightArrow) {
        rightArrow.addEventListener('click', (e) => {
          e.stopPropagation();
          slider.scrollBy({ left: (slider.clientWidth * 0.75), behavior: 'smooth' });
        });
      }
    });

    // Category Subnav Genres Dropdown
    const genreBtn = document.getElementById('category-genre-dropdown-btn');
    const genreMenu = document.getElementById('category-genre-dropdown-menu');
    if (genreBtn && genreMenu) {
      genreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        genreMenu.classList.toggle('open');
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.genre-dropdown-wrapper')) {
          genreMenu.classList.remove('open');
        }
      });

      document.querySelectorAll('.genre-menu-item').forEach(item => {
        item.addEventListener('click', () => {
          const genre = item.getAttribute('data-genre-val');
          this.activeGenreFilter = genre;
          genreMenu.classList.remove('open');
          this.renderCurrentRoute();
        });
      });
    }

    // Profile Switcher click
    document.querySelectorAll('[data-switch-profile-id]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = el.getAttribute('data-switch-profile-id');
        this.switchProfile(id);
      });
    });

    const navAddProfileBtn = document.getElementById('nav-add-profile-btn');
    const profileDialog = document.getElementById('profile-modal-dialog');
    const profileClose = document.getElementById('profile-modal-close');
    const profileCancel = document.getElementById('profile-cancel-btn');
    const profileForm = document.getElementById('profile-modal-form');

    if (navAddProfileBtn && profileDialog) {
      navAddProfileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (profileMenu) profileMenu.classList.remove('show');
        profileDialog.showModal();
      });
    }

    if (profileClose && profileDialog) {
      profileClose.addEventListener('click', () => profileDialog.close());
    }
    if (profileCancel && profileDialog) {
      profileCancel.addEventListener('click', () => profileDialog.close());
    }

    // Avatar picker in Add Profile Dialog
    document.querySelectorAll('#avatar-options-grid .avatar-option').forEach(img => {
      img.addEventListener('click', () => {
        document.querySelectorAll('#avatar-options-grid .avatar-option').forEach(i => i.classList.remove('selected'));
        img.classList.add('selected');
      });
    });

    if (profileForm) {
      profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('profile-name-input')?.value.trim();
        const selAvatar = document.querySelector('#avatar-options-grid .avatar-option.selected')?.getAttribute('data-avatar-url') || 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png';
        const isKids = document.getElementById('profile-kids-checkbox')?.checked || false;
        const genres = Array.from(document.querySelectorAll('#profile-genres-group input:checked')).map(cb => cb.value);

        if (!name) return;
        const finalAvatar = selAvatar.includes('wikimedia') || selAvatar.includes('nflxso') || selAvatar.includes('unsplash')
          ? (isKids ? '/assets/avatars/avatar-kids.svg' : '/assets/avatars/avatar-red.svg')
          : selAvatar;
        await this.createProfile(name, finalAvatar, isKids, genres);
        profileDialog.close();
      });
    }

    // Search back button
    const searchBackBtn = document.getElementById('search-back-btn');
    if (searchBackBtn) {
      searchBackBtn.addEventListener('click', () => {
        this.searchQuery = '';
        const sInput = document.getElementById('search-input');
        if (sInput) sInput.value = '';
        this.navigate('/browse');
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

    this.cinemaYtFrame = document.getElementById('cinema-yt-frame');
    this.cinemaModeNative = document.getElementById('cinema-mode-native');
    this.cinemaModeYt = document.getElementById('cinema-mode-yt');
    this.cinemaYtLink = document.getElementById('cinema-yt-link');
    this.trailerMode = 'native'; // 'native' or 'youtube'
    this.activeSeason = 1;
    this.activeEpisode = 1;

    if (!this.cinemaPlayer || !this.cinemaVideo) return;

    // Mode Selector: Trailer HD (Native) vs YouTube HD
    if (this.cinemaModeNative) {
      this.cinemaModeNative.addEventListener('click', (e) => {
        e.stopPropagation();
        this.setTrailerMode('native');
      });
    }
    if (this.cinemaModeYt) {
      this.cinemaModeYt.addEventListener('click', (e) => {
        e.stopPropagation();
        this.setTrailerMode('youtube');
      });
    }

    // Native Video Automatic Fallback
    this.cinemaVideo.addEventListener('error', () => {
      console.warn('Native video stream error. Attempting smooth fallback...');
      if (this.activeCinemaMovie) {
        if (this.activeCinemaMovie.backupVideoUrl && this.cinemaVideo.src !== this.activeCinemaMovie.backupVideoUrl) {
          this.cinemaVideo.src = this.activeCinemaMovie.backupVideoUrl;
          this.cinemaVideo.play().catch(() => {});
        } else if (this.activeCinemaMovie.youtubeTrailerId) {
          this.setTrailerMode('youtube');
        } else {
          this.cinemaVideo.src = '/trailers/stranger-things.mp4';
          this.cinemaVideo.play().catch(() => {});
        }
      }
    });

    // Video play/pause events
    this.cinemaPlayBtn.addEventListener('click', () => this.toggleCinemaPlay());
    this.cinemaVideo.addEventListener('click', () => this.toggleCinemaPlay());

    // Single Sleek Netflix Back button
    if (this.cinemaBackBtn) {
      this.cinemaBackBtn.addEventListener('click', () => this.closeCinemaPlayer());
    }

    // Episodes Drawer Toggle (from both bottom bar and top bar)
    const toggleEpisodesDrawer = (e) => {
      if (e) e.stopPropagation();
      if (this.cinemaEpisodesDrawer) {
        this.cinemaEpisodesDrawer.classList.toggle('open');
      }
    };

    if (this.cinemaEpisodesBtn) {
      this.cinemaEpisodesBtn.addEventListener('click', toggleEpisodesDrawer);
    }
    const topEpBtn = document.getElementById('cinema-top-episodes-btn');
    if (topEpBtn) {
      topEpBtn.addEventListener('click', toggleEpisodesDrawer);
    }
    if (this.cinemaEpisodesClose) {
      this.cinemaEpisodesClose.addEventListener('click', () => {
        this.cinemaEpisodesDrawer.classList.remove('open');
      });
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

    // Direct Subtitles Toggle Button (CC)
    const subToggleBtn = document.getElementById('cinema-subtitles-toggle-btn');
    if (subToggleBtn) {
      subToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.currentSubTrack === 'off') {
          this.setSubtitleTrack('en');
          this.showCinemaOsd('💬', 'Subtitles: English [CC]');
          this.savePreferences({ subtitle_language: 'en' });
        } else {
          this.setSubtitleTrack('off');
          this.showCinemaOsd('💬', 'Subtitles: Off');
          this.savePreferences({ subtitle_language: 'off' });
        }
      });
    }

    // Direct Close Button on Subtitle Container (✕)
    const subCloseBtn = document.getElementById('cinema-subtitles-close-btn');
    if (subCloseBtn) {
      subCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.setSubtitleTrack('off');
        this.showCinemaOsd('💬', 'Subtitles: Closed');
        this.savePreferences({ subtitle_language: 'off' });
      });
    }

    // Video Quality Selector Flyout
    const qualityBtn = document.getElementById('cinema-quality-btn');
    const qualityMenu = document.getElementById('cinema-quality-menu');
    const qualityLabel = document.getElementById('cinema-quality-label');

    if (qualityBtn && qualityMenu) {
      qualityBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        qualityMenu.classList.toggle('open');
        this.cinemaAudioMenu?.classList.remove('open');
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('#cinema-quality-wrapper')) {
          qualityMenu.classList.remove('open');
        }
      });

      document.querySelectorAll('#cinema-quality-options .cinema-option-item').forEach(item => {
        item.addEventListener('click', () => {
          document.querySelectorAll('#cinema-quality-options .cinema-option-item').forEach(i => i.classList.remove('selected'));
          item.classList.add('selected');
          const q = item.getAttribute('data-quality');
          this.currentQuality = q;
          qualityMenu.classList.remove('open');

          const labels = {
            'auto': '4K UHD',
            '4k': '4K UHD',
            '1080p': '1080p FHD',
            '720p': '720p HD',
            '480p': '480p SD'
          };
          if (qualityLabel) qualityLabel.textContent = labels[q] || '4K UHD';

          const qualityNames = {
            'auto': 'Auto (Best 4K)',
            '4k': '4K Ultra HD (2160p)',
            '1080p': 'Full HD (1080p)',
            '720p': 'HD (720p)',
            '480p': 'Data Saver (480p)'
          };
          this.showCinemaOsd('⚡', `Quality: ${qualityNames[q] || q} - Zero Buffering`);
          this.savePreferences({ video_quality: q });
        });
      });
    }

    // Fast Buffering & Zero-Lag Spinner
    const spinner = document.getElementById('cinema-loading-spinner');
    if (spinner && this.cinemaVideo) {
      this.cinemaVideo.addEventListener('waiting', () => spinner.classList.add('active'));
      this.cinemaVideo.addEventListener('seeking', () => spinner.classList.add('active'));
      this.cinemaVideo.addEventListener('playing', () => spinner.classList.remove('active'));
      this.cinemaVideo.addEventListener('canplay', () => spinner.classList.remove('active'));
      this.cinemaVideo.addEventListener('seeked', () => spinner.classList.remove('active'));
    }

    // Idle mouse auto-hiding
    this.cinemaPlayer.addEventListener('mousemove', () => {
      this.cinemaPlayer.classList.remove('idle');
      clearTimeout(this.idleTimer);
      this.idleTimer = setTimeout(() => {
        if (!this.cinemaVideo.paused || this.cinemaPlayer.classList.contains('embed-active')) {
          this.cinemaPlayer.classList.add('idle');
          if (this.cinemaAudioMenu) this.cinemaAudioMenu.classList.remove('open');
        }
      }, 3000);
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
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        const toggleBtn = document.getElementById('cinema-subtitles-toggle-btn');
        if (toggleBtn) toggleBtn.click();
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

  setTrailerMode(mode) {
    this.trailerMode = mode;
    if (this.cinemaModeNative) this.cinemaModeNative.classList.toggle('active', mode === 'native');
    if (this.cinemaModeYt) this.cinemaModeYt.classList.toggle('active', mode === 'youtube');

    if (!this.activeCinemaMovie) return;

    if (mode === 'youtube') {
      // Pause and hide native video
      this.cinemaVideo.pause();
      this.cinemaVideo.style.display = 'none';

      // Show and load YouTube embed
      const ytId = this.activeCinemaMovie.youtubeTrailerId || 'b9EkMc79ZSU';
      if (this.cinemaYtFrame) {
        const embedUrl = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
        if (this.cinemaYtFrame.src !== embedUrl) {
          this.cinemaYtFrame.src = embedUrl;
        }
        this.cinemaYtFrame.style.display = 'block';
      }
      this.cinemaPlayer.classList.add('embed-active');
      this.showCinemaOsd('▶', `${this.activeCinemaMovie.title} • Official Studio Trailer`);
    } else {
      // Native Ultra HD Mode
      if (this.cinemaYtFrame) {
        this.cinemaYtFrame.src = '';
        this.cinemaYtFrame.style.display = 'none';
      }
      this.cinemaPlayer.classList.remove('embed-active');
      this.cinemaVideo.style.display = 'block';

      const streamSrc = this.getTrailerForMovie(this.activeCinemaMovie);
      if (!this.cinemaVideo.src || !this.cinemaVideo.src.includes(streamSrc)) {
        this.cinemaVideo.src = streamSrc;
      }
      this.cinemaVideo.play().catch(e => console.warn('Autoplay prevented:', e));
      this.showCinemaOsd('⚡', `${this.activeCinemaMovie.title} • Ultra HD Trailer`);
    }
  }

  openCinemaPlayer(movieId, startSecs = 0, episodeNum = null) {
    let movie = this.movies.find(m => m.id === movieId);
    if (!movie && movieId && movieId.startsWith('tmdb-')) {
      const tmdbId = movieId.replace('tmdb-', '');
      const cardEl = document.querySelector(`[data-card-id="${movieId}"]`);
      movie = {
        id: movieId,
        title: cardEl?.querySelector('.card-hover-title')?.textContent || 'Trending Movie',
        type: 'Movie',
        duration: 'Official Trailer',
        videoUrl: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4',
        youtubeTrailerId: 'b9EkMc79ZSU',
        subtitles: { en: [{ time: 1, text: '[Official Studio Trailer]' }] }
      };
      // Asynchronously fetch the actual YouTube trailer key for this TMDB item
      fetch(`/api/trailer/${tmdbId}`)
        .then(r => r.json())
        .then(t => {
          if (t && t.youtubeTrailerId) {
            movie.youtubeTrailerId = t.youtubeTrailerId;
            if (this.activeCinemaMovie && this.activeCinemaMovie.id === movieId && this.trailerMode === 'youtube') {
              this.setTrailerMode('youtube');
            }
          }
        }).catch(() => {});
    }
    if (!movie || !this.cinemaPlayer) return;

    this.activeCinemaMovie = movie;
    this.activeCinemaMovieProgress = startSecs || 0;
    const episodes = this.getEpisodesForMovie(movie);
    this.activeEpisodeIndex = 0;
    if (episodeNum) {
      const idx = episodes.findIndex(e => e.episodeNum === episodeNum);
      if (idx !== -1) this.activeEpisodeIndex = idx;
    }
    const currentEp = episodes[this.activeEpisodeIndex];
    if (currentEp) {
      this.activeEpisode = currentEp.episodeNum;
    }

    // Update metadata - Clean Netflix Standard
    const titleEl = document.getElementById('cinema-title');
    if (titleEl) titleEl.textContent = movie.title;

    const badgeEl = document.getElementById('cinema-episode-badge');
    if (badgeEl) {
      badgeEl.textContent = movie.type === 'TV Series' 
        ? `S1:E${currentEp ? currentEp.episodeNum : 1} "${currentEp ? currentEp.title : ''}" • Official Trailer`
        : `${movie.duration || '2h 15m'} • Official Trailer • Full HD`;
    }

    // External YouTube button link
    if (this.cinemaYtLink) {
      const ytId = movie.youtubeTrailerId || 'b9EkMc79ZSU';
      this.cinemaYtLink.href = `https://www.youtube.com/watch?v=${ytId}`;
      this.cinemaYtLink.title = `Watch ${movie.title} official trailer on YouTube`;
      this.cinemaYtLink.style.display = 'inline-flex';
    }

    // Show or hide episodes button in bottom bar and top bar
    if (this.cinemaEpisodesBtn) {
      this.cinemaEpisodesBtn.style.display = movie.type === 'TV Series' ? 'inline-flex' : 'none';
    }
    const topEpBtn = document.getElementById('cinema-top-episodes-btn');
    if (topEpBtn) {
      topEpBtn.style.display = movie.type === 'TV Series' ? 'inline-flex' : 'none';
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

      const dTitleEl = document.getElementById('episodes-drawer-title');
      const seasonEl = document.getElementById('episodes-drawer-season');
      if (dTitleEl) dTitleEl.textContent = movie.title;
      if (seasonEl) seasonEl.textContent = `Season 1 (${episodes.length} Episodes)`;

      this.cinemaEpisodesList.querySelectorAll('[data-play-ep-num]').forEach(item => {
        item.addEventListener('click', () => {
          const epNum = parseInt(item.getAttribute('data-play-ep-num'), 10);
          if (this.cinemaEpisodesDrawer) this.cinemaEpisodesDrawer.classList.remove('open');
          this.playEpisode(epNum);
        });
      });
    }

    // Show player
    this.cinemaPlayer.classList.add('active');
    this.cinemaPlayer.classList.remove('idle');
    document.body.style.overflow = 'hidden';

    // Does this title have an offline local trailer file?
    const hasLocalTrailer = ['stranger-things', 'wednesday', 'interstellar', 'the-batman'].includes(movie.id);

    // If it has an actual local trailer, start in native mode; otherwise, play the real official studio trailer via YouTube HD!
    this.setTrailerMode(hasLocalTrailer ? 'native' : 'youtube');
    if (startSecs && this.cinemaVideo) {
      this.cinemaVideo.currentTime = startSecs;
    }

    // Record initial playback progress to SQLite database
    this.recordPlaybackProgress(movie.id, Math.max(10, startSecs || 10), 180, 0);

    // Save playback progress at 15-second interval
    clearInterval(this.playbackThrottleTimer);
    this.playbackThrottleTimer = setInterval(() => {
      if (this.activeCinemaMovie && this.cinemaVideo && !this.cinemaVideo.paused) {
        this.activeCinemaMovieProgress = this.cinemaVideo.currentTime;
        this.recordPlaybackProgress(this.activeCinemaMovie.id, this.activeCinemaMovieProgress, this.cinemaVideo.duration || 180, 0);
      }
    }, 15000);
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
      if (badge) badge.textContent = `S1:E${ep.episodeNum} "${ep.title}" • Official Trailer`;
    }

    if (this.cinemaEpisodesList) {
      this.cinemaEpisodesList.querySelectorAll('.episode-item').forEach((item, idx) => {
        item.classList.toggle('active', idx === epIdx);
      });
    }

    if (this.trailerMode === 'youtube') {
      const ytId = this.activeCinemaMovie.youtubeTrailerId || 'b9EkMc79ZSU';
      if (this.cinemaYtFrame) {
        this.cinemaYtFrame.src = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
      }
    } else if (this.cinemaVideo) {
      this.cinemaVideo.currentTime = 0;
      this.cinemaVideo.play().catch(() => {});
    }
    this.showCinemaOsd('▶', `Episode ${epNum} • Trailer`);
  }

  closeCinemaPlayer() {
    if (!this.cinemaPlayer) return;
    clearInterval(this.playbackThrottleTimer);
    if (this.activeCinemaMovie && this.cinemaVideo) {
      const prog = this.cinemaVideo.currentTime || this.activeCinemaMovieProgress || 10;
      const dur = this.cinemaVideo.duration || 180;
      this.recordPlaybackProgress(this.activeCinemaMovie.id, prog, dur, 0);
      this.fetchContinueWatching();
    }
    if (this.cinemaYtFrame) {
      this.cinemaYtFrame.src = '';
      this.cinemaYtFrame.style.display = 'none';
    }
    this.cinemaPlayer.classList.remove('embed-active', 'active', 'idle');
    this.cinemaVideo.pause();
    this.cinemaVideo.removeAttribute('src');
    this.cinemaVideo.load();
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
    const subContainer = document.getElementById('cinema-subtitles');
    const subText = document.getElementById('cinema-subtitles-text');
    if (!subContainer || !subText) return;

    if (this.currentSubTrack === 'off' || !this.activeCinemaMovie) {
      subContainer.classList.remove('active');
      return;
    }

    const subtitlesList = this.activeCinemaMovie.subtitles?.[this.currentSubTrack] || this.activeCinemaMovie.subtitles?.en;
    if (!subtitlesList || !subtitlesList.length) {
      subContainer.classList.remove('active');
      return;
    }

    const ct = this.cinemaVideo.currentTime;
    const cue = subtitlesList.find(s => ct >= s.time && ct < s.time + 3.8);

    if (cue) {
      subText.textContent = cue.text;
      subContainer.classList.add('active');
    } else {
      subContainer.classList.remove('active');
    }
  }

  setSubtitleTrack(track) {
    this.currentSubTrack = track;
    document.querySelectorAll('#cinema-subtitles-options .cinema-option-item').forEach(i => {
      i.classList.toggle('selected', i.getAttribute('data-sub-track') === track);
    });
    const subToggleBtn = document.getElementById('cinema-subtitles-toggle-btn');
    if (subToggleBtn) {
      subToggleBtn.classList.toggle('active', track !== 'off');
      subToggleBtn.title = track === 'off' ? 'Turn on Subtitles (C)' : 'Close / Turn off Subtitles (C)';
    }
    const subContainer = document.getElementById('cinema-subtitles');
    if (track === 'off') {
      if (subContainer) subContainer.classList.remove('active');
    } else {
      this.updateCinemaSubtitles();
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
        const epNum = playBtn.getAttribute('data-episode-num') ? parseInt(playBtn.getAttribute('data-episode-num'), 10) : null;
        const dialog = document.getElementById('movie-detail-dialog');
        if (dialog && dialog.open) {
          const vid = dialog.querySelector('.modal-hero-video');
          if (vid) vid.pause();
          dialog.close();
        }
        this.openCinemaPlayer(id, 0, epNum);
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
        if (dialog) {
          const vid = dialog.querySelector('.modal-hero-video');
          if (vid) vid.pause();
          dialog.close();
        }
        return;
      }

      // 8. Open Movie Modal from More Like This or Interactive Cards
      const modalOpen = e.target.closest('[data-modal-open-id]');
      if (modalOpen && !e.target.closest('.similar-add-btn') && !e.target.closest('[data-watchlist-id]')) {
        const id = modalOpen.getAttribute('data-modal-open-id');
        this.openMovieModal(id);
        return;
      }

      // 9. Click anywhere on Movie Card or Top 10 Card -> Open Interactive Modal
      const card = e.target.closest('[data-card-id]');
      if (card && !e.target.closest('.card-btn') && !e.target.closest('.hover-sound-btn')) {
        const id = card.getAttribute('data-card-id');
        this.openMovieModal(id);
        return;
      }

      // 10. Landing Page Top 10 Items -> Open Cinema Player directly
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
     Pixel-Perfect Replica matching Screenshot 3
  ══════════════════════════════════════════════ */
  openMovieModal(movieId) {
    const movie = this.movies.find(m => m.id === movieId);
    if (!movie) return;

    this.selectedMovie = movie;
    const dialog = document.getElementById('movie-detail-dialog');
    if (!dialog) return;

    const isInList = this.watchlist.some(m => m.id === movie.id);
    const similar = this.movies.filter(m => m.id !== movie.id && m.genres.some(g => movie.genres.includes(g))).slice(0, 6);
    const isSeries = movie.type === 'TV Series';
    const s1Episodes = this.getEpisodesForMovie(movie, 1);
    const s2Episodes = this.getEpisodesForMovie(movie, 2);
    const trailerUrl = this.getTrailerForMovie(movie);

    dialog.innerHTML = `
      <div class="modal-header-hero" style="background-image: url('${movie.backdrop}')">
        <video class="modal-hero-video" autoplay muted loop playsinline src="${trailerUrl}"></video>
        <div class="modal-hero-vignette"></div>
        <button class="modal-close-btn" id="modal-close-btn" aria-label="Close dialog">✕</button>

        <div class="modal-hero-content">
          <div class="modal-series-badge">
            <span class="modal-n-red">N</span>
            <span class="modal-badge-label">${isSeries ? 'SERIES' : 'FILM'}</span>
          </div>
          <h2 class="modal-title">${movie.title.toUpperCase()}</h2>
          <div class="modal-actions">
            <button class="modal-hero-play-btn" data-play-id="${movie.id}">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              <span>Play</span>
            </button>
            <button class="modal-circle-btn card-btn-list ${isInList ? 'in-list' : ''}" data-watchlist-id="${movie.id}" title="${isInList ? 'In My List' : 'Add to My List'}">
              ${isInList ? '✓' : '+'}
            </button>
            <button class="modal-circle-btn card-btn-thumb ${this.ratings[movie.id] === 'like' ? 'rated' : ''}" data-rating-id="${movie.id}" data-rating-val="like" title="I like this">👍</button>
            <button class="modal-hero-sound-btn" id="modal-hero-sound-btn" title="Toggle audio" aria-label="Toggle audio">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="modal-body">
        <div class="modal-left">
          <div class="modal-meta-row">
            <span class="modal-year">${movie.year || '2024'}</span>
            <span class="modal-duration">${movie.duration}</span>
            <span class="dolby-badge">Dolby VISION</span>
            <span class="dolby-badge">AD)))</span>
            <span class="dolby-badge">[CC]</span>
            <span class="match-score">${movie.matchScore}% Match</span>
          </div>
          <div class="modal-advisory-row">
            <span class="advisory-badge-box">${movie.ageRating || 'A'}</span>
            <span class="advisory-tags">sex, violence, substances, coarse language, sexual violence, nudity, tobacco use</span>
          </div>
          <p class="modal-synopsis">${movie.overview}</p>
        </div>

        <div class="modal-right">
          <div class="modal-meta-field">
            <span class="meta-label">Cast: </span>
            <span class="meta-val">${movie.cast.join(', ')}, <em>more</em></span>
          </div>
          <div class="modal-meta-field">
            <span class="meta-label">Genres: </span>
            <span class="meta-val">${movie.genres.join(', ')}</span>
          </div>
          <div class="modal-meta-field">
            <span class="meta-label">This Show Is: </span>
            <span class="meta-val">Gritty, Dark, Exciting</span>
          </div>
        </div>
      </div>

      <!-- Episodes Section (Matching Screenshot 3) -->
      ${isSeries ? `
        <div class="modal-episodes-section">
          <div class="modal-episodes-header">
            <h3 class="modal-episodes-title">Episodes</h3>
            <select class="modal-season-select" id="modal-season-select">
              <option value="1">Season 1</option>
              <option value="2">Season 2</option>
            </select>
          </div>
          <div class="modal-season-advisory" id="modal-season-advisory">Season 1: <span class="advisory-badge-box">${movie.ageRating || 'A'}</span> sex, violence, substances, coarse language, sexual violence, nudity, tobacco use</div>
          <div class="modal-episodes-list" id="modal-episodes-list">
            ${s1Episodes.map(ep => `
              <div class="modal-episode-row" data-play-id="${movie.id}" data-episode-num="${ep.episodeNum}">
                <div class="episode-num">${ep.episodeNum}</div>
                <div class="episode-thumb-wrap">
                  <img src="${ep.thumb || movie.backdrop}" alt="${ep.title}" loading="lazy">
                  <div class="episode-play-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><polygon points="8 5 19 12 8 19 8 5"/></svg>
                  </div>
                </div>
                <div class="episode-info">
                  <div class="episode-top-line">
                    <span class="episode-title">${ep.title}</span>
                    <span class="episode-duration">${ep.duration}</span>
                  </div>
                  <p class="episode-desc">${ep.synopsis}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- More Like This Grid -->
      <div class="modal-similar-section">
        <h3 style="font-size:1.4rem; font-weight:700; margin-bottom:18px;">More Like This</h3>
        <div class="modal-similar-grid">
          ${similar.map(s => `
            <div class="similar-card" data-modal-open-id="${s.id}">
              <div class="similar-thumb-wrap">
                <img src="${s.backdrop || s.poster}" alt="${s.title}" loading="lazy" onerror="this.onerror=null; this.src='https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg';">
                <button class="similar-add-btn ${this.watchlist.some(w => w.id === s.id) ? 'in-list' : ''}" data-watchlist-id="${s.id}" title="Add to My List">
                  ${this.watchlist.some(w => w.id === s.id) ? '✓' : '+'}
                </button>
              </div>
              <div class="similar-content">
                <div class="similar-meta-row">
                  <span class="match-score">${s.matchScore}% Match</span>
                  <span class="advisory-badge-box">${s.ageRating}</span>
                  <span style="color:#aaa;">${s.year}</span>
                </div>
                <p class="similar-synopsis">${s.overview}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- About Section -->
      <div style="padding: 10px 40px 40px; border-top: 1px solid rgba(255,255,255,0.1);">
        <h3 style="font-size:1.3rem; margin-bottom:16px;">About <strong>${movie.title}</strong></h3>
        <div style="font-size:0.88rem; line-height:1.7; color:#a3a3a3;">
          <p><b style="color:#777;">Creators:</b> <span style="color:#fff;">${movie.creator || 'Netflix Studios'}</span></p>
          <p><b style="color:#777;">Cast:</b> <span style="color:#fff;">${movie.cast.join(', ')}</span></p>
          <p><b style="color:#777;">Genres:</b> <span style="color:#fff;">${movie.genres.join(', ')}</span></p>
          <p><b style="color:#777;">Maturity Rating:</b> <span class="advisory-badge-box" style="color:#fff; margin-left:4px;">${movie.ageRating}</span> Recommended for mature audiences.</p>
        </div>
      </div>
    `;

    document.body.style.overflow = 'hidden';
    dialog.showModal();
    dialog.scrollTop = 0;

    dialog.onclose = () => {
      document.body.style.overflow = '';
      if (heroVid) heroVid.pause();
    };

    // Sound toggle in modal hero
    const heroVid = dialog.querySelector('.modal-hero-video');
    const heroSoundBtn = document.getElementById('modal-hero-sound-btn');
    if (heroVid && heroSoundBtn) {
      heroSoundBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        heroVid.muted = !heroVid.muted;
        heroSoundBtn.innerHTML = heroVid.muted
          ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`
          : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
      });
    }

    // Season selector change
    const seasonSelect = document.getElementById('modal-season-select');
    const epList = document.getElementById('modal-episodes-list');
    const seasonAdv = document.getElementById('modal-season-advisory');
    if (seasonSelect && epList) {
      seasonSelect.addEventListener('change', () => {
        const season = parseInt(seasonSelect.value);
        if (seasonAdv) {
          seasonAdv.innerHTML = `Season ${season}: <span class="advisory-badge-box">${movie.ageRating || 'A'}</span> sex, violence, substances, coarse language, sexual violence, nudity, tobacco use`;
        }
        const eps = this.getEpisodesForMovie(movie, season);
        epList.innerHTML = eps.map(ep => `
          <div class="modal-episode-row" data-play-id="${movie.id}" data-episode-num="${ep.episodeNum}">
            <div class="episode-num">${ep.episodeNum}</div>
            <div class="episode-thumb-wrap">
              <img src="${ep.thumb || movie.backdrop}" alt="${ep.title}" loading="lazy">
              <div class="episode-play-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><polygon points="8 5 19 12 8 19 8 5"/></svg>
              </div>
            </div>
            <div class="episode-info">
              <div class="episode-top-line">
                <span class="episode-title">${ep.title}</span>
                <span class="episode-duration">${ep.duration}</span>
              </div>
              <p class="episode-desc">${ep.synopsis}</p>
            </div>
          </div>
        `).join('');
      });
    }

    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (heroVid) heroVid.pause();
        dialog.close();
      });
    }

    dialog.onclick = (e) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height
        && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!isInDialog) {
        if (heroVid) heroVid.pause();
        dialog.close();
      }
    };
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
