<template>
  <main class="container page-content">
    <section class="hero-simple">
      <h1 class="title">The Philosopher behind the Flux</h1>
      <p class="subtitle">Merging mathematical precision with digital aesthetics.</p>
    </section>

    <div class="profile-grid">
      <!-- Author Side (Assume 'Likem' is the persona) -->
      <aside class="author-card glass-card">
        <div class="avatar-wrapper">
           <img src="https://avatars.githubusercontent.com/u/183704833?v=4" alt="Likem" class="avatar-img" />
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
</template>

<script setup>
definePageMeta({ layout: 'default' })
</script>

<style scoped>
.page-content {
  position: relative;
  z-index: 1;
  padding: 5rem 0;
  flex: 1;
}

.hero-simple { text-align: center; margin-bottom: 5rem; }
.hero-simple .title {
  font-family: 'Bricolage Grotesque', sans-serif !important;
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
  letter-spacing: -0.03em;
  background: linear-gradient(to bottom, var(--text-primary) 30%, var(--text-secondary));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-simple .subtitle { font-size: 1.25rem; color: var(--text-secondary); }

/* PROFILE GRID - FIXING LAYOUT */
.profile-grid {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 3rem;
  align-items: start;
}

.glass-card {
  border-radius: 1.2rem;
  padding: 2.5rem;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--card-shadow),
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.author-card {
  text-align: center;
  position: sticky;
  top: 8rem;
}

.avatar-wrapper {
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--bg-primary);
}

.author-name { font-family: 'Bricolage Grotesque', sans-serif !important; font-size: 1.75rem; font-weight: 800; margin-bottom: 0.5rem; }
.author-title { color: var(--text-secondary); font-size: 1rem; margin-bottom: 1.5rem; }

.social-links { display: flex; justify-content: center; gap: 1rem; margin-bottom: 2rem; }
.social-btn {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s;
}
.social-btn:hover { 
  background: linear-gradient(135deg, #b497d7, #a682cf);
  color: white; 
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(180, 151, 215, 0.4);
}

.author-tags { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; }
.tag { font-size: 0.75rem; font-weight: 700; color: var(--text-secondary); background: var(--bg-secondary); padding: 0.25rem 0.75rem; border-radius: 4px; border: 1px solid var(--border-light); }

/* STORY SIDE */
.main-story { display: flex; flex-direction: column; gap: 2rem; }
.story-card h3, .tech-card h3 { 
  font-family: 'Bricolage Grotesque', sans-serif !important; 
  font-size: 1.5rem; 
  font-weight: 700; 
  margin-bottom: 1.5rem; 
  color: var(--primary);
}
.story-card p { font-size: 1.125rem; line-height: 1.8; color: var(--text-secondary); }

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
  background: var(--bg-secondary);
  border-radius: 1rem;
  font-weight: 600;
  font-size: 0.9375rem;
}
.tech-icon { color: var(--primary); width: 1.25rem; height: 1.25rem; }

@media (max-width: 1024px) {
  .profile-grid { grid-template-columns: 1fr; }
  .author-card { position: relative; top: 0; }
  .hero-simple .title { font-size: 2.75rem; }
}
</style>
