<template>
  <div class="home-page">
    <main class="hero-section">
      <div class="container hero-container">
        <!-- Center Content -->
        <div class="hero-content">
          <div class="badge-wrapper animate-fade-in-up" style="animation-delay: 0.1s">
            <div class="premium-badge">
              <div class="badge-border-flow"></div>
              <span class="badge-dot pulse"></span>
              <span class="badge-text">Nuxt 4 & MathJax v4</span>
            </div>
          </div>
          
          <h1 class="title animate-fade-in-up" style="animation-delay: 0.2s">
            <span class="title-line">
              <span class="title-word">Discover</span>
            </span>
            <span class="title-line reveal-line">
              <span class="title-word gradient-text animated-gradient">Violet Flux</span>
            </span>
          </h1>
          
          <p class="subtitle animate-fade-in-up" style="animation-delay: 0.3s">
            A digital garden where <span class="highlight text-glow">precision</span> meets 
            <span class="highlight text-glow">aesthetics</span>. Exploring code, mathematics, 
            and the serene flow of digital creativity.
          </p>
          
          <div class="cta-group animate-fade-in-up" style="animation-delay: 0.4s">
            <NuxtLink to="/blog" class="btn premium-btn-primary">
              <span class="btn-shimmer"></span>
              <span class="btn-content">
                <span>Explore Library</span>
                <Icon name="lucide:arrow-right" class="btn-icon" />
              </span>
            </NuxtLink>
            <NuxtLink to="/about" class="btn premium-btn-secondary">
              <span class="btn-outline"></span>
              <span class="btn-content">
                <span>Our Story</span>
              </span>
            </NuxtLink>
          </div>

          <!-- Feature Cards / Bento Grid -->
          <div class="features-grid animate-fade-in-up" style="animation-delay: 0.5s">
            <!-- Card 1 -->
            <div class="glass-card">
              <div class="card-glow"></div>
              <div class="card-border"></div>
              <div class="card-content">
                <div class="card-icon-wrapper">
                  <Icon name="lucide:zap" class="feature-icon" />
                </div>
                <h3 class="card-title">Lightning Fast</h3>
                <p class="card-desc">Zero runtime overhead. Every interaction feels instantaneous and fluid.</p>
              </div>
            </div>

            <!-- Card 2 -->
            <div class="glass-card">
              <div class="card-glow"></div>
              <div class="card-border"></div>
              <div class="card-content">
                <div class="card-icon-wrapper">
                  <Icon name="lucide:sparkles" class="feature-icon" />
                </div>
                <h3 class="card-title">Precision Design</h3>
                <p class="card-desc">Crafted with meticulous attention to typography, spacing, and micro-interactions.</p>
              </div>
            </div>

            <!-- Card 3 -->
            <div class="glass-card">
              <div class="card-glow"></div>
              <div class="card-border"></div>
              <div class="card-content">
                <div class="card-icon-wrapper">
                  <Icon name="lucide:layers" class="feature-icon" />
                </div>
                <h3 class="card-title">Deep Architecture</h3>
                <p class="card-desc">Built on a solid foundation, ensuring lasting performance and flawless scalability.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// Page logic removed since global elements are in layout
definePageMeta({ layout: 'default' });
</script>

<style scoped>
/* =========================================
   Hero Content area
   ========================================= */
.home-page {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.hero-section {
  flex: 1;
  display: flex;
  align-items: center;
  padding-top: 5rem;
  padding-bottom: 6rem;
  position: relative;
  z-index: 10;
}

.hero-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.hero-content {
  max-width: 900px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Premium Badge */
.badge-wrapper {
  margin-bottom: 2.5rem;
}

.premium-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1.4rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.4);
  color: var(--text-primary);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 4px 24px -6px rgba(180, 151, 215, 0.2), inset 0 1px 0 rgba(255,255,255,0.4);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: default;
}

html.dark .premium-badge, [data-theme='dark'] .premium-badge {
  background: rgba(20, 15, 30, 0.5);
  box-shadow: 0 4px 24px -6px rgba(145, 99, 192, 0.3), inset 0 1px 0 rgba(255,255,255,0.05);
}

.premium-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px -6px rgba(180, 151, 215, 0.3), inset 0 1px 0 rgba(255,255,255,0.5);
}

.badge-border-flow {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  padding: 1px;
  background: conic-gradient(from 0deg, transparent 70%, var(--primary) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: border-spin 3s linear infinite;
}

@keyframes border-spin {
  100% { transform: rotate(360deg); }
}

.badge-dot.pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--primary);
  box-shadow: 0 0 0 0 rgba(180, 151, 215, 0.7);
  animation: dot-pulse 2s infinite;
}

@keyframes dot-pulse {
  70% { box-shadow: 0 0 0 6px rgba(180, 151, 215, 0); }
  100% { box-shadow: 0 0 0 0 rgba(180, 151, 215, 0); }
}

/* Premium Title Typography */
.hero-content .title {
  font-family: 'Bricolage Grotesque', sans-serif !important;
  font-size: clamp(3.5rem, 8vw, 6.5rem);
  line-height: 1.05;
  font-weight: 800;
  margin-bottom: 2rem;
  letter-spacing: -0.04em;
}

.title-line {
  display: block;
}

.animated-gradient {
  background: linear-gradient(to right, #b497d7, #9163c0, #7a4ba3, #b497d7);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: shine-gradient 5s linear infinite;
}

@keyframes shine-gradient {
  to { background-position: 200% center; }
}

.subtitle {
  font-size: clamp(1.15rem, 2vw, 1.35rem);
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 4rem;
  max-width: 650px;
  font-weight: 400;
}

.text-glow {
  color: var(--text-primary);
  font-weight: 500;
  text-shadow: 0 0 20px rgba(180, 151, 215, 0.3);
}

/* Premium Buttons */
.cta-group {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 6rem;
  justify-content: center;
}

.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1.1rem 2.8rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 1.05rem;
  text-decoration: none;
  transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
  overflow: hidden;
}

.premium-btn-primary {
  background-color: var(--primary);
  color: white;
  border: 1px solid rgba(255,255,255,0.2);
  box-shadow: 0 20px 40px -10px rgba(145, 99, 192, 0.5), inset 0 1px 0 rgba(255,255,255,0.3);
}

.premium-btn-primary:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 30px 50px -10px rgba(145, 99, 192, 0.7), inset 0 1px 0 rgba(255,255,255,0.5);
  border-color: rgba(255,255,255,0.4);
}

.btn-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent);
  transform: skewX(-20deg);
  animation: shimmer 3s infinite 2s;
}

@keyframes shimmer {
  100% { left: 200%; }
}

.premium-btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  border: 1px solid rgba(180, 151, 215, 0.3);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
}

html.dark .premium-btn-secondary, [data-theme='dark'] .premium-btn-secondary {
  background: rgba(20, 15, 30, 0.4);
}

.btn-outline {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  padding: 1px;
  background: linear-gradient(135deg, var(--primary), transparent);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.premium-btn-secondary:hover {
  transform: translateY(-4px);
  background: rgba(180, 151, 215, 0.08);
}

.premium-btn-secondary:hover .btn-outline {
  opacity: 1;
}

.btn-icon {
  margin-left: 0.6rem;
  transition: transform 0.3s ease;
}

.premium-btn-primary:hover .btn-icon {
  transform: translateX(6px);
}

.btn-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
}

/* Glass Cards */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;
  max-width: 1100px;
}

.glass-card {
  position: relative;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 28px;
  padding: 3rem 2.5rem;
  text-align: left;
  overflow: hidden;
  transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.6s ease;
  box-shadow: 0 10px 40px -10px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.5);
  transform: translateZ(0);
}

html.dark .glass-card, [data-theme='dark'] .glass-card {
  background: rgba(25, 20, 35, 0.5);
  box-shadow: 0 10px 40px -10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05);
}

.card-border {
  position: absolute;
  inset: 0;
  border-radius: 28px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(180, 151, 215, 0.4), rgba(180, 151, 215, 0.05) 50%, transparent);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  transition: background 0.5s ease;
}

.glass-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 40px 80px -20px rgba(145, 99, 192, 0.2), inset 0 1px 0 rgba(255,255,255,0.6);
}

html.dark .glass-card:hover, [data-theme='dark'] .glass-card:hover {
  box-shadow: 0 40px 80px -20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
}

.glass-card:hover .card-border {
  background: linear-gradient(135deg, var(--primary), rgba(180, 151, 215, 0.2) 60%, transparent);
}

.card-glow {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(180, 151, 215, 0.3), transparent 70%);
  opacity: 0;
  transition: opacity 0.7s ease;
  pointer-events: none;
}

.glass-card:hover .card-glow {
  opacity: 1;
}

.card-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(180, 151, 215, 0.15), rgba(180, 151, 215, 0.05));
  border: 1px solid rgba(180, 151, 215, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  color: var(--primary);
}

.feature-icon {
  font-size: 1.75rem;
  filter: drop-shadow(0 2px 8px rgba(180, 151, 215, 0.4));
}

.card-title {
  font-family: 'Bricolage Grotesque', sans-serif !important;
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.card-desc {
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 1rem;
  font-weight: 400;
}

/* Animations */
.animate-fade-in-up {
  opacity: 0;
  animation: fade-in-up 1.2s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
}

@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Adjustments */
@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .hero-content .title {
    font-size: clamp(3rem, 10vw, 5rem);
  }
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .cta-group {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 320px;
  }
  
  .btn {
    width: 100%;
  }
}
</style>