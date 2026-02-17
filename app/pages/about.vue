<template>
  <div class="about-layout">
    <!-- Fluid background similar to home -->
    <div class="flux-bg">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>

    <header class="header">
      <div class="container header-container">
        <h1 class="logo">Violet Flux</h1>
        <nav class="nav">
          <NuxtLink to="/">Home</NuxtLink>
          <NuxtLink to="/blog">Blog</NuxtLink>
          <NuxtLink to="/about">About</NuxtLink>
          <button @click="toggleDark()" class="theme-toggle">
            <Icon :name="isDark ? 'lucide:sun' : 'lucide:moon'" />
          </button>
        </nav>
      </div>
    </header>

    <main class="container page-content">
      <section class="hero-simple">
        <h1 class="title">The Philosopher behind the Flux</h1>
        <p class="subtitle">Merging mathematical precision with digital aesthetics.</p>
      </section>

      <div class="profile-grid">
        <!-- Author Side (Assume 'Likem' is the persona) -->
        <aside class="author-card glass-card">
          <div class="avatar-wrapper">
             <div class="avatar-placeholder">DL</div>
          </div>
          <h2 class="author-name">Likem</h2>
          <p class="author-title">Digital Architect & Pianist</p>
          <div class="social-links">
            <a href="#" class="social-btn"><Icon name="lucide:github" /></a>
            <a href="#" class="social-btn"><Icon name="lucide:twitter" /></a>
            <a href="#" class="social-btn"><Icon name="lucide:mail" /></a>
          </div>
          <div class="author-tags">
            <span class="tag">#Blogger</span>
            <span class="tag">#Composer</span>
            <span class="tag">#NuxtExpert</span>
          </div>
        </aside>

        <!-- Content Side (The Story) -->
        <div class="main-story">
          <div class="glass-card story-card">
            <h3>The Vision</h3>
            <p>
              Violet Flux was born from a desire to create a sanctuary for thought. In a world of fast content, 
              I wanted a space that respects the reader's focus. This is a digital garden where 
              <strong>MathJax v4</strong> brings equations to life and <strong>Nuxt 4</strong> ensures 
              instantaneous transitions.
            </p>
          </div>

          <div class="glass-card tech-card">
            <h3>The Tech Stack</h3>
            <div class="tech-grid">
              <div class="tech-item">
                <Icon name="lucide:zap" class="tech-icon" />
                <span>Nuxt 4 Engine</span>
              </div>
              <div class="tech-item">
                <Icon name="lucide:function-square" class="tech-icon" />
                <span>MathJax v4</span>
              </div>
              <div class="tech-item">
                <Icon name="lucide:pen-tool" class="tech-icon" />
                <span>Obsidian Sync</span>
              </div>
              <div class="tech-item">
                <Icon name="lucide:palette" class="tech-icon" />
                <span>Glassmorphism</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="footer">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} Violet Flux. Precision & Poetics.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { isDark, toggleDark } from '~/composables/useTheme'
</script>

<style scoped>
.about-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  color: var(--text);
  position: relative;
  overflow-x: hidden;
}

.flux-bg {
  position: absolute;
  inset: 0;
  filter: blur(100px);
  opacity: 0.25;
  z-index: 0;
  pointer-events: none;
}

.blob {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: var(--primary);
  animation: float 20s infinite alternate linear;
}

.blob-1 { top: -10%; right: -5%; }
.blob-2 { bottom: -10%; left: -5%; background: var(--accent); animation-delay: -10s; }

@keyframes float {
  from { transform: translate(0,0) rotate(0); }
  to { transform: translate(50px, 50px) rotate(180deg); }
}

.header {
  height: 80px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(10px);
  z-index: 10;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo { font-family: 'Bricolage Grotesque', sans-serif; font-size: 1.5rem; font-weight: 800; }
.nav { display: flex; gap: 2rem; align-items: center; }
.nav a { color: var(--text-muted); text-decoration: none; font-size: 0.9375rem; transition: color 0.2s; }
.nav a.router-link-active { color: var(--primary); font-weight: 600; }

.theme-toggle {
  background: var(--secondary);
  border: 1px solid var(--border);
  width: 36px;
  height: 36px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text);
}

.page-content { position: relative; z-index: 1; padding: 5rem 0; }

.hero-simple { text-align: center; margin-bottom: 5rem; }
.hero-simple .title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
  letter-spacing: -0.03em;
  background: linear-gradient(to bottom, var(--text) 50%, var(--primary));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-simple .subtitle { font-size: 1.25rem; color: var(--text-muted); }

/* PROFILE GRID - FIXING LAYOUT */
.profile-grid {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 3rem;
  align-items: start;
}

.glass-card {
  border-radius: 2rem;
  padding: 2.5rem;
}

.author-card {
  text-align: center;
  position: sticky;
  top: 8rem;
}

.avatar-wrapper {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  padding: 4px;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: var(--bg);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 800;
  font-family: 'Bricolage Grotesque';
  color: var(--primary);
}

.author-name { font-family: 'Bricolage Grotesque'; font-size: 1.75rem; font-weight: 800; margin-bottom: 0.5rem; }
.author-title { color: var(--text-muted); font-size: 1rem; margin-bottom: 1.5rem; }

.social-links { display: flex; justify-content: center; gap: 1rem; margin-bottom: 2rem; }
.social-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--secondary);
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s;
}
.social-btn:hover { background: var(--primary); color: white; transform: translateY(-3px); }

.author-tags { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; }
.tag { font-size: 0.75rem; font-weight: 700; color: var(--primary); background: var(--primary-glow); padding: 0.25rem 0.75rem; border-radius: 6px; }

/* STORY SIDE */
.main-story { display: flex; flex-direction: column; gap: 2rem; }
.story-card h3, .tech-card h3 { 
  font-family: 'Bricolage Grotesque'; 
  font-size: 1.5rem; 
  font-weight: 700; 
  margin-bottom: 1.5rem; 
  color: var(--primary);
}
.story-card p { font-size: 1.125rem; line-height: 1.8; color: var(--text-muted); }

.tech-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.tech-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(128, 128, 128, 0.03);
  border-radius: 1rem;
  font-weight: 600;
  font-size: 0.9375rem;
}
.tech-icon { color: var(--primary); width: 1.25rem; height: 1.25rem; }

.footer { padding: 4rem 0; border-top: 1px solid var(--border); text-align: center; color: var(--text-muted); }

@media (max-width: 1024px) {
  .profile-grid { grid-template-columns: 1fr; }
  .author-card { position: relative; top: 0; }
  .hero-simple .title { font-size: 2.75rem; }
}
</style>
