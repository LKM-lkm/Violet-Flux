<template>
  <div 
    class="reading-progress" 
    :style="{ width: `${progress}%` }"
    :class="{ visible: progress > 0 }"
  />
</template>

<script setup>
const progress = ref(0)

const updateProgress = () => {
  const winScroll = document.documentElement.scrollTop || document.body.scrollTop
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
  const scrolled = (winScroll / height) * 100
  progress.value = Math.min(Math.max(scrolled, 0), 100)
}

onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true })
  updateProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})
</script>

<style scoped>
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    var(--primary) 0%,
    var(--primary-hover) 100%
  );
  z-index: 1001;
  transition: width 0.1s ease-out;
  box-shadow: 0 0 10px var(--primary-glow);
  opacity: 0;
  transform: translateY(-3px);
  transition: width 0.1s ease-out, opacity 0.3s ease, transform 0.3s ease;
}

.reading-progress.visible {
  opacity: 1;
  transform: translateY(0);
}

/* 在暗色模式下增强可见性 */
:root.dark .reading-progress {
  box-shadow: 0 0 15px var(--primary-glow);
}
</style>
