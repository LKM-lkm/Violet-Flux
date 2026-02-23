<template>
  <div class="home">
    <div class="flux-bg">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
      <div class="mist-overlay"></div>
    </div>

    <header class="header">
      <div class="container">
        <h1 class="logo">Violet Flux</h1>
        <nav class="nav">
          <NuxtLink to="/blog">Blog</NuxtLink>
          <NuxtLink to="/about">About</NuxtLink>
          <button @click="toggleDark()" class="theme-toggle">
            <Icon :name="isDark ? 'lucide:sun' : 'lucide:moon'" />
          </button>
        </nav>
      </div>
    </header>

    <main class="hero-section">
      <div class="container hero-container">
        <div class="hero-content">
          <div class="badge pulse">Nuxt 4 • MathJax v4</div>
          <h1 class="title">
            <span class="text-gradient">Violet Flux</span>
          </h1>
          <p class="subtitle">
            A digital garden where precision meets aesthetics. Exploring code, 
            mathematics, and the flow of digital creativity.
          </p>
          <div class="cta-group">
            <NuxtLink to="/blog" class="btn btn-primary">
              Explore Library
              <Icon name="lucide:arrow-right" class="btn-icon" />
            </NuxtLink>
            <NuxtLink to="/about" class="btn btn-secondary">Our Story</NuxtLink>
          </div>
        </div>

        <div class="hero-visual">
          <div class="visual-container">
            <div class="glass-card main-card flux-card">
              <div class="card-glow"></div>
              <div class="card-content">
                <div class="card-header">
                  <div class="dot red"></div>
                  <div class="dot yellow"></div>
                  <div class="dot green"></div>
                </div>
                <div class="card-body">
                  <div class="line w-3/4"></div>
                  <div class="line w-1/2"></div>
                  <div class="line w-5/6"></div>
                  <div class="card-signature">Likem // 2026</div>
                </div>
              </div>
            </div>
            <div class="glass-card sub-card-1 flux-card"></div>
            <div class="glass-card sub-card-2 flux-card"></div>
            
          </div>
        </div>
      </div>

      <div class="scroll-indicator">
        <div class="mouse">
          <div class="wheel"></div>
        </div>
      </div>
    </main>

    <footer class="footer">
      <div class="container footer-container">
        <div class="footer-left">
          <p>&copy; {{ currentYear }} Violet Flux. Built for the era of intelligence.</p>
        </div>
        <div class="footer-right">
          <span class="signature-tag">Designed by Likem</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { isDark, toggleDark } from '~/composables/useTheme'
const currentYear = new Date().getFullYear();
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background: var(--bg-primary);
  color: var(--text-primary);
}

/* FLUX BACKGROUND */
.flux-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  filter: blur(80px);
  opacity: 0.35;
  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
  animation: blob-float 25s infinite alternate ease-in-out;
  mix-blend-mode: screen;
}

.blob-1 {
  width: 500px;
  height: 500px;
  background: var(--primary);
  top: -10%;
  left: -5%;
  opacity: 0.6;
}

.blob-2 {
  width: 600px;
  height: 600px;
  background: var(--accent);
  bottom: -10%;
  right: -5%;
  animation-delay: -7s;
}

.blob-3 {
  width: 450px;
  height: 450px;
  background: var(--primary); /* Was explicit blue #4f46e5 */
  top: 35%;
  left: 35%;
  opacity: 0.4;
  animation-delay: -12s;
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
}

@keyframes blob-float {
  0% { transform: translate(0, 0) scale(1) rotate(0); border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
  33% { transform: translate(50px, -70px) scale(1.1) rotate(60deg); border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; }
  66% { transform: translate(-40px, 40px) scale(0.9) rotate(120deg); border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%; }
  100% { transform: translate(0, 0) scale(1) rotate(180deg); border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
}

.mist-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, transparent, var(--bg-primary));
  opacity: 0.5;
  mix-blend-mode: soft-light;
  animation: cloud-pulse 10s infinite alternate ease-in-out;
  z-index: 1;
}

@keyframes cloud-pulse {
  from { transform: scale(1) translate(0, 0); opacity: 0.3; }
  to { transform: scale(1.2) translate(20px, -20px); opacity: 0.6; }
}

/* HEADER */
.header {
  height: 80px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border-light);
  backdrop-filter: blur(15px);
  z-index: 10;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.nav { display: flex; gap: 2.5rem; align-items: center; }
.nav a { 
  font-size: 0.9375rem; 
  color: var(--text-secondary); 
  text-decoration: none; 
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.nav a:hover { color: var(--text-primary); transform: translateY(-2px); }

.theme-toggle {
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  width: 40px;
  height: 40px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-toggle:hover { background: var(--border-light); transform: rotate(15deg) scale(1.1); }

/* HERO SECTION */
.hero-section {
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
  padding-bottom: 100px; /* 为fixed footer留出空间 */
}

.hero-container {
  display: flex;
  align-items: center;
  gap: 4rem;
}

.hero-content {
  flex: 1.2;
  animation: slideLeft 1s cubic-bezier(0.2, 1, 0.2, 1);
}

.badge {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--primary);
  margin-bottom: 2.5rem;
  text-transform: uppercase;
  backdrop-filter: blur(5px);
}

.pulse { animation: pulse 4s infinite cubic-bezier(0.4, 0, 0.6, 1); }
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
  50% { box-shadow: 0 0 20px 5px rgba(255, 255, 255, 0.3); }
  100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
}

.title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 6rem;
  line-height: 0.9;
  font-weight: 800;
  margin-bottom: 2.5rem;
  letter-spacing: -0.05em;
}

.text-gradient {
  background: linear-gradient(135deg, var(--text-primary) 30%, var(--primary) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.4rem;
  line-height: 1.6;
  color: var(--text-secondary);
  max-width: 580px;
  margin-bottom: 3.5rem;
  letter-spacing: -0.01em;
}

.cta-group { display: flex; gap: 1.5rem; }

.btn {
  padding: 1.1rem 2.8rem;
  border-radius: 0.8rem;
  font-weight: 700;
  text-decoration: none;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.4s cubic-bezier(0.2, 1, 0.2, 1);
}

.btn-primary {
  background: var(--primary);
  color: white;
  box-shadow: 0 15px 35px -10px var(--primary-glow);
}

.btn-primary:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 25px 50px -10px var(--primary-glow);
}

.btn-icon { transition: transform 0.4s; }
.btn-primary:hover .btn-icon { transform: translateX(6px); }

.btn-secondary {
  background: var(--glass-bg);
  border: 1px solid var(--border-light);
  color: var(--text-primary);
  backdrop-filter: blur(15px);
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
  transform: translateY(-5px);
  border-color: var(--text-secondary);
}

/* HERO VISUAL (ADVANCED GLASS) */
.hero-visual {
  flex: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.visual-container {
  position: relative;
  height: 500px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
}

.glass-card {
  border-radius: 1.2rem;
  position: absolute;
}

.flux-card:hover {
  transform: translateY(-10px) rotateX(10deg) rotateY(-5deg);
  border-color: var(--glass-border);
  background: var(--glass-bg);
}

.main-card {
  width: 320px;
  height: 420px;
  z-index: 5;
  padding: 1.8rem;
  box-shadow: var(--shadow-xl);
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-border);
  position: relative;
  overflow: hidden;
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, var(--primary-glow), transparent 70%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;
}

.main-card:hover .card-glow {
  opacity: 0.3;
}

.dot { width: 12px; height: 12px; border-radius: 50%; }
.red { background: #ff5f56; }
.yellow { background: #ffbd2e; }
.green { background: #27c93f; }

.card-header { display: flex; gap: 0.6rem; margin-bottom: 2.5rem; }
.line { height: 8px; background: var(--border-light); border-radius: 4px; margin-bottom: 1.2rem; opacity: 0.5; }

.card-signature {
  position: absolute;
  bottom: 1.8rem;
  right: 1.8rem;
  font-family: 'Bricolage Grotesque';
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--text-secondary);
}

.sub-card-1 {
  width: 280px;
  height: 360px;
  top: 5%;
  right: 5%;
  z-index: 4;
  transform: rotate(8deg);
  box-shadow: var(--shadow-xl);
  opacity: 0.9;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-border);
}

.sub-card-2 {
  width: 280px;
  height: 360px;
  bottom: 5%;
  left: 5%;
  z-index: 3;
  transform: rotate(-12deg);
  box-shadow: var(--shadow-xl);
  opacity: 0.8;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-border);
}


/* FOOTER REFORM */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1.8rem 0;
  border-top: 1px solid var(--border-light);
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.06),
              inset 0 1px 0 var(--glass-border);
  user-select: none;
  z-index: 100;
}

.footer-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.footer-left p {
  margin: 0;
  font-weight: 500;
  letter-spacing: 0.01em;
}

.signature-tag {
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  padding: 0.5rem 1.2rem;
  border-radius: 10px;
  font-family: 'Bricolage Grotesque';
  font-weight: 700;
  color: var(--primary);
  letter-spacing: 0.05em;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.signature-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--primary-glow);
  border-color: var(--primary);
}


@keyframes slideLeft {
  from { opacity: 0; transform: translateX(-60px); }
  to { opacity: 1; transform: translateX(0); }
}

@media (max-width: 1024px) {
  .hero-container { flex-direction: column; text-align: center; padding-top: 2rem; }
  .title { font-size: 3.8rem; }
  .hero-visual { display: none; }
  .subtitle { margin: 0 auto 3.5rem; }
  .cta-group { justify-content: center; }
  .footer-container { flex-direction: column; gap: 1.5rem; }
}
</style>

