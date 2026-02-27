<template>
  <div class="home">
    <!-- 鼠标粒子效果 -->
    <canvas ref="particleCanvas" class="particle-canvas"></canvas>
    
    <!-- 精确的网格背景 -->
    <div class="grid-overlay"></div>
    
    <!-- 闪烁星星背景 -->
    <div class="stars-container">
      <div 
        v-for="i in 50" 
        :key="i" 
        class="star"
        :style="{
          '--star-size': `${Math.random() * 3 + 1}px`,
          '--twinkle-duration': `${Math.random() * 3 + 2}s`,
          '--twinkle-delay': `${Math.random() * 5}s`,
          '--star-color': ['#b497d7', '#c2a9e4', '#d4c0ed', '#a682cf'][Math.floor(Math.random() * 4)],
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`
        }"
      ></div>
    </div>
    
    <!-- 朦胧的紫色流体背景 -->
    <div class="flux-bg">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
      <div class="blob blob-4"></div>
      <div class="mist-overlay"></div>
    </div>

    <!-- 精确的头部导�?-->
    <header class="header">
      <div class="container header-inner">
        <div class="logo-wrapper">
          <div class="logo-glow"></div>
          <h1 class="logo">Violet Flux</h1>
        </div>
        <nav class="nav">
          <NuxtLink to="/blog" class="nav-link">
            <span class="nav-text">Blog</span>
            <span class="nav-underline"></span>
          </NuxtLink>
          <NuxtLink to="/about" class="nav-link">
            <span class="nav-text">About</span>
            <span class="nav-underline"></span>
          </NuxtLink>
          <button @click="toggleDark()" class="theme-toggle" aria-label="Toggle theme">
            <div class="toggle-bg"></div>
            <Icon :name="isDark ? 'lucide:sun' : 'lucide:moon'" class="toggle-icon" />
          </button>
        </nav>
      </div>
    </header>

    <!-- 主要内容-->
    <main class="hero-section">
      <div class="container hero-container">
        <!-- 左侧内容 -->
        <div class="hero-content">
          <div class="badge-wrapper">
            <div class="badge">
              <span class="badge-dot"></span>
              <span class="badge-text">Nuxt 4 & MathJax v4</span>
            </div>
          </div>
          
          <h1 class="title">
            <span class="title-line">
              <span class="title-word">Violet</span>
            </span>
            <span class="title-line">
              <span class="title-word gradient">Flux</span>
            </span>
          </h1>
          
          <p class="subtitle">
            A digital garden where <span class="highlight">precision</span> meets 
            <span class="highlight">aesthetics</span>. Exploring code, mathematics, 
            and the flow of digital creativity.
          </p>
          
          <div class="cta-group">
            <NuxtLink to="/blog" class="btn btn-primary">
              <span class="btn-bg"></span>
              <span class="btn-content">
                <span>Explore Library</span>
                <Icon name="lucide:arrow-right" class="btn-icon" />
              </span>
            </NuxtLink>
            <NuxtLink to="/about" class="btn btn-secondary">
              <span class="btn-content">
                <span>Our Story</span>
              </span>
            </NuxtLink>
          </div>

          <!-- 特性卡�?-->
          <div class="features">
            <div class="feature-card">
              <Icon name="lucide:zap" class="feature-icon" />
              <span class="feature-text">Lightning Fast</span>
            </div>
            <div class="feature-card">
              <Icon name="lucide:sparkles" class="feature-icon" />
              <span class="feature-text">Beautiful Design</span>
            </div>
            <div class="feature-card">
              <Icon name="lucide:code-2" class="feature-icon" />
              <span class="feature-text">Clean Code</span>
            </div>
          </div>
        </div>

        <!-- 右侧视觉效果 -->
        <div class="hero-visual">
          <div class="visual-container">
            <!-- 主卡�?-->
            <div class="glass-card main-card">
              <div class="card-glow"></div>
              <div class="card-shine"></div>
              <div class="card-content">
                <div class="card-header">
                  <div class="dots">
                    <div class="dot red"></div>
                    <div class="dot yellow"></div>
                    <div class="dot green"></div>
                  </div>
                  <div class="card-title">index.vue</div>
                </div>
                <div class="card-body">
                  <div class="code-line">
                    <span class="code-number">1</span>
                    <span class="code-text"><span class="code-tag">&lt;template&gt;</span></span>
                  </div>
                  <div class="code-line">
                    <span class="code-number">2</span>
                    <span class="code-text">  <span class="code-tag">&lt;div</span> <span class="code-attr">class</span>=<span class="code-string">"violet"</span><span class="code-tag">&gt;</span></span>
                  </div>
                  <div class="code-line">
                    <span class="code-number">3</span>
                    <span class="code-text">    <span class="code-comment">// Magic happens</span></span>
                  </div>
                  <div class="code-line">
                    <span class="code-number">4</span>
                    <span class="code-text">  <span class="code-tag">&lt;/div&gt;</span></span>
                  </div>
                  <div class="code-line">
                    <span class="code-number">5</span>
                    <span class="code-text"><span class="code-tag">&lt;/template&gt;</span></span>
                  </div>
                </div>
                <div class="card-footer">
                  <span class="card-signature">Likem // 2026</span>
                </div>
              </div>
            </div>

            <!-- 浮动装饰卡片 -->
            <div class="glass-card float-card float-card-1">
              <div class="float-content">
                <Icon name="lucide:sparkles" class="float-icon" />
              </div>
            </div>
            <div class="glass-card float-card float-card-2">
              <div class="float-content">
                <Icon name="lucide:code" class="float-icon" />
              </div>
            </div>
            <div class="glass-card float-card float-card-3">
              <div class="float-content">
                <Icon name="lucide:heart" class="float-icon" />
              </div>
            </div>

            <!-- 装饰圆环 -->
            <div class="orbit-ring ring-1"></div>
            <div class="orbit-ring ring-2"></div>
          </div>
        </div>
      </div>

      <!-- 滚动指示�?-->
      <div class="scroll-indicator">
        <div class="scroll-text">Scroll to explore</div>
        <div class="scroll-arrow">
          <Icon name="lucide:chevron-down" />
        </div>
      </div>
    </main>

    <!-- 精确的底�?-->
    <footer class="footer">
      <div class="container footer-container">
        <div class="footer-left">
          <p>&copy; {{ currentYear }} Violet Flux. Built for the era of intelligence.</p>
        </div>
        <div class="footer-right">
          <div class="signature-tag">
            <Icon name="lucide:sparkles" class="signature-icon" />
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

// 鼠标粒子效果
const particleCanvas = ref(null)

onMounted(() => {
  if (!particleCanvas.value) return
  
  const canvas = particleCanvas.value
  const ctx = canvas.getContext('2d')
  
  // 设置画布大小
  const resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  
  // 粒子数组
  const particles = []
  const maxParticles = 50
  
  // 粒子类
  class Particle {
    constructor(x, y) {
      this.x = x
      this.y = y
      this.size = Math.random() * 3 + 1
      this.speedX = (Math.random() - 0.5) * 2
      this.speedY = (Math.random() - 0.5) * 2
      this.life = 1
      this.decay = Math.random() * 0.01 + 0.005
      this.color = ['#b497d7', '#c2a9e4', '#d4c0ed', '#a682cf'][Math.floor(Math.random() * 4)]
    }
    
    update() {
      this.x += this.speedX
      this.y += this.speedY
      this.life -= this.decay
      this.size *= 0.98
    }
    
    draw() {
      ctx.save()
      ctx.globalAlpha = this.life
      ctx.fillStyle = this.color
      ctx.shadowBlur = 10
      ctx.shadowColor = this.color
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
  }
  
  // 鼠标移动事件
  let mouseX = 0
  let mouseY = 0
  let lastTime = Date.now()
  
  const handleMouseMove = (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
    
    // 限制粒子生成频率
    const now = Date.now()
    if (now - lastTime > 30) {
      lastTime = now
      
      // 创建粒子
      if (particles.length < maxParticles) {
        particles.push(new Particle(mouseX, mouseY))
      }
    }
  }
  
  window.addEventListener('mousemove', handleMouseMove)
  
  // 动画循环
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // 更新和绘制粒子
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update()
      particles[i].draw()
      
      // 移除死亡粒子
      if (particles[i].life <= 0 || particles[i].size <= 0.1) {
        particles.splice(i, 1)
      }
    }
    
    requestAnimationFrame(animate)
  }
  
  animate()
  
  // 清理
  onUnmounted(() => {
    window.removeEventListener('resize', resizeCanvas)
    window.removeEventListener('mousemove', handleMouseMove)
  })
})
</script>

<style scoped>
/* === 鼠标粒子画布 === */
.particle-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999;
}

/* === 基础布局 === */
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background: var(--bg-primary);
  color: var(--text-primary);
  overflow-x: hidden;
}

/* 确保容器有正确的宽度 */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
}

/* === 精确的网格背�?=== */
.grid-overlay {
  position: fixed;
  inset: 0;
  background-image: 
    linear-gradient(rgba(180, 151, 215, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(180, 151, 215, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: 0;
  pointer-events: none;
}

/* === 闪烁星星背景 === */
.stars-container {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.star {
  position: absolute;
  background-color: var(--star-color);
  border-radius: 50%;
  width: var(--star-size);
  height: var(--star-size);
  animation: twinkle var(--twinkle-duration) ease-in-out infinite;
  animation-delay: var(--twinkle-delay);
  will-change: opacity;
  box-shadow: 0 0 4px var(--star-color);
}

@keyframes twinkle {
  0%, 100% { 
    opacity: 0.2;
    transform: scale(1);
  }
  50% { 
    opacity: 1;
    transform: scale(1.2);
  }
}

/* 暗色模式下星星更明显 */
:root.dark .star {
  box-shadow: 0 0 6px var(--star-color);
}

:root.dark .stars-container {
  opacity: 1;
}

/* 亮色模式下星星更柔和 */
:root:not(.dark) .stars-container {
  opacity: 0.6;
}

/* === 朦胧的流体背�?=== */
.flux-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  filter: blur(100px);
  opacity: 0.2;
  pointer-events: none;
}

/* 暗色模式下增强背�?*/
:root.dark .flux-bg {
  opacity: 0.15;
  filter: blur(120px);
}

.blob {
  position: absolute;
  border-radius: 50%;
  animation: blob-float 25s infinite ease-in-out;
  will-change: transform;
}

.blob-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #b497d7, #a682cf);
  top: -15%;
  left: -10%;
  animation-delay: 0s;
}

.blob-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #c2a9e4, #b497d7);
  bottom: -10%;
  right: -5%;
  animation-delay: -8s;
}

.blob-3 {
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, #9163c0, #7743a3);
  top: 40%;
  right: 20%;
  animation-delay: -16s;
}

.blob-4 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #a682cf, #9163c0);
  bottom: 30%;
  left: 15%;
  animation-delay: -12s;
}

@keyframes blob-float {
  0%, 100% { 
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
  25% { 
    transform: translate(40px, -50px) scale(1.1) rotate(90deg);
  }
  50% { 
    transform: translate(-30px, 30px) scale(0.9) rotate(180deg);
  }
  75% { 
    transform: translate(50px, 40px) scale(1.05) rotate(270deg);
  }
}

.mist-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 50% 50%, 
    transparent 0%, 
    var(--bg-primary) 70%
  );
  opacity: 0.6;
  animation: mist-pulse 15s infinite ease-in-out;
}

@keyframes mist-pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
}

/* === 精确的头�?=== */
.header {
  height: 80px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border-light);
  background: var(--glass-bg);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  box-shadow: 0 4px 24px rgba(180, 151, 215, 0.08),
              inset 0 -1px 0 rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-wrapper {
  position: relative;
  display: inline-block;
}

.logo-glow {
  position: absolute;
  inset: -10px;
  background: radial-gradient(circle, rgba(180, 151, 215, 0.3), transparent 70%);
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
  filter: blur(20px);
}

.logo-wrapper:hover .logo-glow {
  opacity: 1;
}

.logo {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, var(--text-primary), #b497d7);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  cursor: pointer;
  transition: all 0.3s;
}

.nav {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  position: relative;
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.9375rem;
  padding: 0.5rem 0;
  transition: color 0.3s;
}

.nav-text {
  position: relative;
  z-index: 1;
}

.nav-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #b497d7, #c2a9e4);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 8px rgba(180, 151, 215, 0.6);
}

.nav-link:hover {
  color: var(--primary);
}

.nav-link:hover .nav-underline {
  width: 100%;
}

.theme-toggle {
  position: relative;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-bg {
  position: absolute;
  inset: 0;
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  transition: all 0.3s;
}

.toggle-icon {
  position: relative;
  z-index: 1;
  color: var(--text-primary);
  font-size: 1.25rem;
  transition: all 0.3s;
}

.theme-toggle:hover .toggle-bg {
  background: linear-gradient(135deg, rgba(180, 151, 215, 0.15), rgba(194, 169, 228, 0.1));
  border-color: var(--primary);
  box-shadow: 0 0 20px rgba(180, 151, 215, 0.3);
}

.theme-toggle:hover .toggle-icon {
  transform: rotate(15deg) scale(1.1);
  color: var(--primary);
}

/* === 主要内容�?=== */
.hero-section {
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
  padding: 6rem 0 8rem;
}

.hero-container {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 6rem;
  align-items: center;
}

/* === 左侧内容 === */
.hero-content {
  animation: slideUp 0.8s cubic-bezier(0.2, 1, 0.2, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

.badge-wrapper {
  margin-bottom: 2.5rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, 
    rgba(180, 151, 215, 0.15), 
    rgba(194, 169, 228, 0.2)
  );
  border: 1px solid var(--border-light);
  border-radius: 100px;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--primary);
  text-transform: uppercase;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(180, 151, 215, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: badge-pulse 3s infinite;
}

/* 暗色模式下增�?badge */
:root.dark .badge {
  background: linear-gradient(135deg, 
    rgba(194, 169, 228, 0.15), 
    rgba(180, 151, 215, 0.2)
  );
  border-color: rgba(194, 169, 228, 0.3);
  color: #d4c0ed;
}

.badge-dot {
  width: 8px;
  height: 8px;
  background: var(--primary);
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(180, 151, 215, 0.8);
  animation: dot-pulse 2s infinite;
}

@keyframes badge-pulse {
  0%, 100% { box-shadow: 0 4px 16px rgba(180, 151, 215, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1); }
  50% { box-shadow: 0 8px 24px rgba(180, 151, 215, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15); }
}

@keyframes dot-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.8); }
}

.title {
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 8vw, 6.5rem);
  line-height: 0.95;
  font-weight: 800;
  margin-bottom: 2rem;
  letter-spacing: -0.04em;
}

.title-line {
  display: block;
  overflow: hidden;
}

.title-word {
  display: inline-block;
  color: var(--text-primary);
  text-shadow: 0 2px 20px rgba(180, 151, 215, 0.3);
}

.title-word.gradient {
  background: linear-gradient(135deg, #c2a9e4 0%, #b497d7 50%, #9163c0 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  filter: drop-shadow(0 0 20px rgba(180, 151, 215, 0.5));
}

.title-word.gradient::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 120px;
  height: 4px;
  background: linear-gradient(90deg, #b497d7, #c2a9e4, transparent);
  border-radius: 2px;
  box-shadow: 0 0 16px rgba(180, 151, 215, 0.6);
}

.subtitle {
  font-size: 1.25rem;
  line-height: 1.7;
  color: var(--text-secondary);
  max-width: 560px;
  margin-bottom: 3rem;
  letter-spacing: -0.01em;
  font-weight: 400;
}

/* 暗色模式下增强可读�?*/
:root.dark .subtitle {
  color: var(--text-secondary);
  opacity: 0.9;
}

.highlight {
  color: var(--primary);
  font-weight: 600;
  position: relative;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--primary), transparent);
  opacity: 0.4;
}

/* === 按钮�?=== */
.cta-group {
  display: flex;
  gap: 1.25rem;
  margin-bottom: 3rem;
}

.btn {
  position: relative;
  padding: 1.125rem 2.5rem;
  border-radius: 12px;
  font-weight: 700;
  text-decoration: none;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.2, 1, 0.2, 1);
  border: none;
}

.btn-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #b497d7, #9163c0);
  transition: all 0.4s;
}

.btn-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-primary {
  color: white;
  box-shadow: 0 8px 24px rgba(180, 151, 215, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.btn-primary:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(180, 151, 215, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.btn-primary:hover .btn-bg {
  background: linear-gradient(135deg, #c2a9e4, #b497d7);
}

.btn-icon {
  transition: transform 0.4s;
}

.btn-primary:hover .btn-icon {
  transform: translateX(4px);
}

.btn-secondary {
  background: var(--glass-bg);
  border: 1px solid var(--border-light);
  color: var(--text-primary);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(180, 151, 215, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.btn-secondary:hover {
  background: linear-gradient(135deg, 
    rgba(180, 151, 215, 0.15), 
    rgba(194, 169, 228, 0.1)
  );
  border-color: var(--primary);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(180, 151, 215, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

/* === 特性卡�?=== */
.features {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.feature-card {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1.25rem;
  background: var(--glass-bg);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(180, 151, 215, 0.08);
}

.feature-card:hover {
  background: linear-gradient(135deg, 
    rgba(180, 151, 215, 0.12), 
    rgba(194, 169, 228, 0.08)
  );
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(180, 151, 215, 0.15);
}

.feature-icon {
  color: var(--primary);
  font-size: 1.125rem;
}

.feature-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
}

/* === 右侧视觉效果 === */
.hero-visual {
  position: relative;
  animation: slideUp 0.8s 0.2s cubic-bezier(0.2, 1, 0.2, 1) backwards;
}

.visual-container {
  position: relative;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* === 主卡�?=== */
.glass-card {
  position: absolute;
  background: var(--glass-bg);
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(180, 151, 215, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.2, 1, 0.2, 1);
}

/* 暗色模式下增强卡片背�?*/
:root.dark .glass-card {
  background: rgba(45, 27, 61, 0.6);
  border-color: rgba(194, 169, 228, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.main-card {
  width: 380px;
  height: 480px;
  z-index: 10;
  padding: 1.5rem;
  overflow: hidden;
}

.main-card:hover {
  transform: translateY(-8px) rotateX(2deg);
  box-shadow: 0 16px 48px rgba(180, 151, 215, 0.25),
              inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.card-glow {
  position: absolute;
  inset: -50%;
  background: radial-gradient(circle, rgba(180, 151, 215, 0.4), transparent 60%);
  opacity: 0;
  transition: opacity 0.6s;
  pointer-events: none;
  animation: glow-rotate 10s linear infinite;
}

@keyframes glow-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.main-card:hover .card-glow {
  opacity: 0.6;
}

.card-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.6s;
  pointer-events: none;
}

.main-card:hover .card-shine {
  opacity: 1;
  animation: shine-sweep 1.5s ease-in-out;
}

@keyframes shine-sweep {
  from { transform: translateX(-100%) translateY(-100%); }
  to { transform: translateX(100%) translateY(100%); }
}

.card-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-light);
}

.dots {
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.dot.red { background: #ff5f56; }
.dot.yellow { background: #ffbd2e; }
.dot.green { background: #27c93f; }

.card-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-secondary);
  font-family: var(--font-mono);
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.code-line {
  display: flex;
  gap: 1rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.6;
}

.code-number {
  color: var(--text-tertiary);
  opacity: 0.5;
  user-select: none;
  min-width: 1.5rem;
  text-align: right;
}

.code-text {
  color: var(--text-secondary);
}

.code-tag { color: #c2a9e4; font-weight: 600; }
.code-attr { color: #b497d7; }
.code-string { color: #d4c0ed; }
.code-comment { color: var(--text-tertiary); font-style: italic; opacity: 0.8; }

/* 暗色模式下增强代码颜�?*/
:root.dark .code-tag { color: #d4c0ed; }
:root.dark .code-attr { color: #c2a9e4; }
:root.dark .code-string { color: #e8dff0; }

.card-footer {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--border-light);
}

.card-signature {
  font-family: var(--font-display);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-tertiary);
  opacity: 0.6;
}

/* === 浮动装饰卡片 === */
.float-card {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: float 6s ease-in-out infinite;
}

.float-card-1 {
  top: 10%;
  right: 5%;
  animation-delay: 0s;
}

.float-card-2 {
  bottom: 15%;
  left: 5%;
  animation-delay: -2s;
}

.float-card-3 {
  top: 50%;
  right: -5%;
  animation-delay: -4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

.float-content {
  color: var(--primary);
  font-size: 2rem;
  opacity: 0.6;
  transition: all 0.3s;
}

.float-card:hover .float-content {
  opacity: 1;
  transform: scale(1.2);
}

/* === 装饰圆环 === */
.orbit-ring {
  position: absolute;
  border: 1px solid var(--border-light);
  border-radius: 50%;
  opacity: 0.3;
  animation: orbit-rotate 20s linear infinite;
}

.ring-1 {
  width: 500px;
  height: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.ring-2 {
  width: 600px;
  height: 600px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-direction: reverse;
  animation-duration: 30s;
}

@keyframes orbit-rotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

/* === 滚动指示�?=== */
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.6;
  animation: scroll-bounce 2s infinite;
}

@keyframes scroll-bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(8px); }
}

.scroll-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.scroll-arrow {
  color: var(--primary);
  font-size: 1.5rem;
}

/* === 底部 === */
.footer {
  position: relative;
  padding: 2rem 0;
  border-top: 1px solid var(--border-light);
  background: var(--glass-bg);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  box-shadow: 0 -4px 24px rgba(180, 151, 215, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
  z-index: 10;
}

.footer-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-left p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.signature-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, 
    rgba(180, 151, 215, 0.1), 
    rgba(194, 169, 228, 0.15)
  );
  border: 1px solid var(--border-light);
  border-radius: 10px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--primary);
  letter-spacing: 0.05em;
  backdrop-filter: blur(10px);
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(180, 151, 215, 0.1);
}

.signature-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(180, 151, 215, 0.2);
  border-color: var(--primary);
}

.signature-icon {
  font-size: 1rem;
}

/* === 响应式设�?=== */
@media (max-width: 1280px) {
  .hero-container {
    gap: 4rem;
  }

  .main-card {
    width: 340px;
    height: 440px;
  }

  .visual-container {
    height: 500px;
  }
}

@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 4rem;
    text-align: center;
  }

  .hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .subtitle {
    max-width: 100%;
  }

  .hero-visual {
    display: none;
  }

  .features {
    justify-content: center;
  }

  .container {
    padding: 0 1.5rem;
  }
}

@media (max-width: 768px) {
  .header {
    height: 70px;
  }

  .logo {
    font-size: 1.5rem;
  }

  .nav {
    gap: 1.5rem;
  }

  .nav-link {
    font-size: 0.875rem;
  }

  .title {
    font-size: clamp(2.5rem, 10vw, 4rem);
  }

  .subtitle {
    font-size: 1.125rem;
  }

  .cta-group {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .footer-container {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
}

@media (max-width: 640px) {
  .hero-section {
    padding: 3rem 0 5rem;
  }

  .badge {
    font-size: 0.75rem;
    padding: 0.625rem 1.25rem;
  }

  .features {
    flex-direction: column;
    width: 100%;
  }

  .feature-card {
    width: 100%;
    justify-content: center;
  }
}
</style>