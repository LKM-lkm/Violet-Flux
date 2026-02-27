<template>
  <nav v-if="prevArticle || nextArticle" class="article-navigation">
    <NuxtLink
      v-if="prevArticle"
      :to="prevArticle.path"
      class="nav-card nav-prev"
    >
      <div class="nav-content">
        <div class="nav-label">
          <UIcon name="i-lucide-chevron-left" class="nav-icon" />
          <span>上一篇</span>
        </div>
        <div class="nav-title">{{ prevArticle.title }}</div>
        <div v-if="prevArticle.description" class="nav-description">
          {{ truncate(prevArticle.description, 60) }}
        </div>
      </div>
    </NuxtLink>

    <NuxtLink
      v-if="nextArticle"
      :to="nextArticle.path"
      class="nav-card nav-next"
    >
      <div class="nav-content">
        <div class="nav-label">
          <span>下一篇</span>
          <UIcon name="i-lucide-chevron-right" class="nav-icon" />
        </div>
        <div class="nav-title">{{ nextArticle.title }}</div>
        <div v-if="nextArticle.description" class="nav-description">
          {{ truncate(nextArticle.description, 60) }}
        </div>
      </div>
    </NuxtLink>
  </nav>
</template>

<script setup>
const props = defineProps({
  currentPath: {
    type: String,
    required: true
  }
})

// 使用官方推荐的 queryCollectionItemSurroundings
const { data: surround } = await useAsyncData(
  `surround-${props.currentPath}`,
  () => queryCollectionItemSurroundings('content', props.currentPath)
)

const prevArticle = computed(() => surround.value?.[0] || null)
const nextArticle = computed(() => surround.value?.[1] || null)

// 截断文本
const truncate = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}
</script>

<style scoped>
.article-navigation {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 3rem 0;
  padding: 2rem 0;
  border-top: 1px solid var(--border-light);
}

.nav-card {
  display: block;
  text-decoration: none;
  color: inherit;
  padding: 2rem;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-light);
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  box-shadow: var(--card-shadow),
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,
    rgba(180, 151, 215, 0.08) 0%,
    rgba(194, 169, 228, 0.05) 100%
  );
  opacity: 0;
  transition: opacity 0.3s;
}

.nav-card:hover {
  transform: translateY(-4px);
  border-color: var(--primary);
  box-shadow: var(--shadow-lg), 0 0 24px rgba(180, 151, 215, 0.3);
}

.nav-card:hover::before {
  opacity: 1;
}

.nav-content {
  position: relative;
  z-index: 1;
}

.nav-prev {
  text-align: left;
}

.nav-next {
  text-align: right;
}

.nav-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.nav-prev .nav-label {
  justify-content: flex-start;
}

.nav-next .nav-label {
  justify-content: flex-end;
}

.nav-icon {
  width: 1rem;
  height: 1rem;
  transition: transform 0.2s ease;
}

.nav-card:hover .nav-icon {
  transform: translateX(0);
}

.nav-prev:hover .nav-icon {
  transform: translateX(-4px);
}

.nav-next:hover .nav-icon {
  transform: translateX(4px);
}

.nav-title {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.nav-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .article-navigation {
    grid-template-columns: 1fr;
  }
  
  .nav-card {
    padding: 1.5rem;
  }
}
</style>
