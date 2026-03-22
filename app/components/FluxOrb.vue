<template>
  <div class="flux-orb-container">
    <div class="orb-wrapper">
      <!-- 内部发光核心 -->
      <div class="orb-core">
        <div class="core-inner"></div>
        <div class="core-glow"></div>
      </div>
      
      <!-- 流动的 Flux 效果 (SVG Filter) -->
      <div class="flux-layers">
        <div class="flux-blob flux-1"></div>
        <div class="flux-blob flux-2"></div>
        <div class="flux-blob flux-3"></div>
      </div>

      <!-- 玻璃圆环装饰 -->
      <div class="glass-rings">
        <div class="glass-ring ring-1"></div>
        <div class="glass-ring ring-2"></div>
        <div class="glass-ring ring-3"></div>
      </div>

      <!-- 粒子浮现效果 -->
      <div class="orb-particles">
        <div v-for="i in 8" :key="i" class="orb-particle"></div>
      </div>
    </div>

    <!-- SVG 滤镜定义 -->
    <svg style="position: absolute; width: 0; height: 0;">
      <defs>
        <filter id="flux-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  </div>
</template>

<script setup>
// Pure CSS/SVG Component - No 3D/JS crash risk
</script>

<style scoped>
.flux-orb-container {
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  perspective: 1000px;
}

.orb-wrapper {
  position: relative;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transform-style: preserve-3d;
}

/* === 核心发光 === */
.orb-core {
  position: absolute;
  width: 120px;
  height: 120px;
  z-index: 5;
}

.core-inner {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 30%, #fff, #b497d7 40%, #9163c0 80%);
  border-radius: 50%;
  box-shadow: 0 0 40px rgba(180, 151, 215, 0.6);
  animation: pulse-core 4s ease-in-out infinite;
}

.core-glow {
  position: absolute;
  inset: -10px;
  background: var(--primary);
  border-radius: 50%;
  filter: blur(20px);
  opacity: 0.4;
  animation: glow-breathe 3s ease-in-out infinite alternate;
}

/* === 流动 Flux 层 === */
.flux-layers {
  position: absolute;
  inset: 0;
  filter: url(#flux-goo);
  opacity: 0.7;
}

.flux-blob {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  top: 50%;
  left: 50%;
}

.flux-1 {
  background: #b497d7;
  animation: move-1 8s infinite ease-in-out;
}

.flux-2 {
  background: #9163c0;
  animation: move-2 10s infinite ease-in-out;
}

.flux-3 {
  background: #c2a9e4;
  animation: move-3 12s infinite ease-in-out;
}

/* === 玻璃圆环 === */
.glass-rings {
  position: absolute;
  inset: -40px;
  pointer-events: none;
}

.glass-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 1px solid rgba(180, 151, 215, 0.2);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
  backdrop-filter: blur(2px);
  transform-origin: center;
}

.ring-1 {
  width: 320px;
  height: 320px;
  margin: -160px;
  transform: rotateX(70deg) rotateZ(0deg);
  animation: rotate-ring 15s linear infinite;
}

.ring-2 {
  width: 380px;
  height: 380px;
  margin: -190px;
  transform: rotateX(60deg) rotateY(20deg) rotateZ(0deg);
  animation: rotate-ring 20s linear infinite reverse;
}

.ring-3 {
  width: 440px;
  height: 440px;
  margin: -220px;
  border-style: dashed;
  transform: rotateX(80deg) rotateY(-10deg) rotateZ(0deg);
  animation: rotate-ring 30s linear infinite;
  opacity: 0.5;
}

/* === 粒子 === */
.orb-particles {
  position: absolute;
  inset: 0;
}

.orb-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--primary);
  border-radius: 50%;
  filter: blur(1px);
  opacity: 0;
  animation: particle-fly 3s infinite ease-in;
}

/* 生成随机位置的粒子动画，这里简单写几个 */
.orb-particle:nth-child(1) { left: 40%; top: 50%; animation-delay: 0s; }
.orb-particle:nth-child(2) { left: 60%; top: 40%; animation-delay: 0.5s; }
.orb-particle:nth-child(3) { left: 30%; top: 70%; animation-delay: 1.2s; }
.orb-particle:nth-child(4) { left: 70%; top: 30%; animation-delay: 2s; }
.orb-particle:nth-child(5) { left: 20%; top: 40%; animation-delay: 1.5s; }
.orb-particle:nth-child(6) { left: 80%; top: 60%; animation-delay: 0.8s; }
.orb-particle:nth-child(7) { left: 50%; top: 20%; animation-delay: 2.2s; }
.orb-particle:nth-child(8) { left: 50%; top: 80%; animation-delay: 1.7s; }

/* === 动画定义 === */
@keyframes pulse-core {
  0%, 100% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(1.1); filter: brightness(1.2); }
}

@keyframes glow-breathe {
  from { opacity: 0.2; transform: scale(0.9); }
  to { opacity: 0.5; transform: scale(1.2); }
}

@keyframes rotate-ring {
  from { transform: inherit rotateZ(0deg); }
  to { transform: inherit rotateZ(360deg); }
}

@keyframes move-1 {
  0%, 100% { transform: translate(-50%, -50%) translate(-30px, -20px); }
  50% { transform: translate(-50%, -50%) translate(30px, 20px); }
}

@keyframes move-2 {
  0%, 100% { transform: translate(-50%, -50%) translate(40px, -30px); }
  50% { transform: translate(-50%, -50%) translate(-40px, 30px); }
}

@keyframes move-3 {
  0%, 100% { transform: translate(-50%, -50%) translate(-10px, 40px); }
  50% { transform: translate(-50%, -50%) translate(10px, -40px); }
}

@keyframes particle-fly {
  0% { transform: scale(0) translateY(0); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: scale(1) translateY(-100px); opacity: 0; }
}
</style>
