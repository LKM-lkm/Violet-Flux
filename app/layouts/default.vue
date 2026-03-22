<template>
  <div class="violet-flux-layout">
    <!-- Premium Environment: Dynamic Ambient Lights & Masked Grid -->
    <div class="ambient-background">
      <div class="ambient-orb orb-1"></div>
      <div class="ambient-orb orb-2"></div>
      <div class="ambient-orb orb-3"></div>
      <div class="noise-overlay"></div>
    </div>
    <div class="premium-grid"></div>

    <!-- Global Header -->
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

    <!-- Page Content Slot -->
    <div class="page-wrapper">
      <slot />
    </div>

    <!-- Global Footer -->
    <footer class="footer">
      <div class="container footer-container">
        <div class="footer-left">
          <p>&copy; {{ currentYear }} Violet Flux. Engineered for elegance.</p>
        </div>
        <div class="footer-right">
          <div class="signature-tag">
            <Icon name="lucide:fingerprint" class="signature-icon" />
            <span>Designed by Likem</span>
          </div>
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
/* =========================================
   Base Layout
   ========================================= */
.violet-flux-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background: var(--bg-primary);
  color: var(--text-primary);
  overflow-x: hidden;
}

.page-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  z-index: 10;
  position: relative;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
}

/* =========================================
   Premium Ambient Background
   ========================================= */
.ambient-background {
  position: fixed;
  inset: 0;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
  background-color: var(--bg-primary);
}

.ambient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.35;
  animation: orb-float 20s infinite alternate ease-in-out;
  transform: translateZ(0); /* Hardware accel */
}

html.dark .ambient-orb, [data-theme='dark'] .ambient-orb {
  opacity: 0.25;
}

.orb-1 {
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, #b497d7 0%, transparent 60%);
  top: -200px;
  left: -200px;
}

.orb-2 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #7a4ba3 0%, transparent 60%);
  bottom: -100px;
  right: -100px;
  animation-delay: -5s;
  animation-duration: 25s;
}

.orb-3 {
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, #9163c0 0%, transparent 60%);
  top: 40%;
  left: 60%;
  transform: translate(-50%, -50%);
  animation-delay: -10s;
  animation-duration: 30s;
}

@keyframes orb-float {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(60px, 80px) scale(1.1); }
  100% { transform: translate(-40px, -40px) scale(0.9); }
}

.noise-overlay {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.04;
  mix-blend-mode: overlay;
  pointer-events: none;
}

/* =========================================
   Masked Premium Grid
   ========================================= */
.premium-grid {
  position: fixed;
  inset: 0;
  background-image: 
    linear-gradient(rgba(180, 151, 215, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(180, 151, 215, 0.08) 1px, transparent 1px);
  background-size: 50px 50px;
  z-index: 0;
  pointer-events: none;
  -webkit-mask-image: radial-gradient(ellipse at center, black 20%, transparent 80%);
  mask-image: radial-gradient(ellipse at center, black 20%, transparent 80%);
}

/* =========================================
   Header Navbar
   ========================================= */
.header {
  height: 80px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border-light);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 50;
  flex-shrink: 0;
  position: relative;
  width: 100%;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo { font-family: 'Bricolage Grotesque', sans-serif; font-size: 1.5rem; font-weight: 800; color: inherit; letter-spacing: normal; }
.nav { display: flex; gap: 2rem; align-items: center; }
.nav a { color: var(--text-secondary); text-decoration: none; font-size: 0.9375rem; transition: color 0.2s; padding: 0; }
.nav a.router-link-active { color: var(--primary); font-weight: 600; }

.theme-toggle {
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  width: 36px;
  height: 36px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  outline: none;
}

/* =========================================
   Footer
   ========================================= */
.footer {
  padding: 3rem 0;
  border-top: 1px solid rgba(180, 151, 215, 0.1);
  position: relative;
  z-index: 10;
  background: transparent;
  flex-shrink: 0;
}

.footer-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.signature-tag {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 1rem;
  background: rgba(180, 151, 215, 0.05);
  border-radius: 9999px;
  border: 1px solid rgba(180, 151, 215, 0.1);
}

.signature-icon {
  color: var(--primary);
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
}
</style>
