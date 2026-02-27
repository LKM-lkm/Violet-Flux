<template>
  <nav v-if="prevArticle || nextArticle" class="article-navigation">
    <NuxtLink 
      v-if="prevArticle" 
      :to="prevArticle.path" 
      class="nav-link nav-prev"
    >
      <div class="nav-label">
        <Icon name="i-lucide-chevron-left" class="nav-icon" />
        <span>上一篇</span>
      </div>
      <div class="nav-title">{{ prevArticle.title }}</div>
      <div v-if="prevArticle.description" class="nav-description">
        {{ truncate(prevArticle.description, 60) }}
      </div>
    </NuxtLink>

    <NuxtLink 
      v-if="nextArticle" 
      :to="nextArticle.path" 
      class="nav-link nav-next"
    >
      <div class="nav-label">
        <span>下一篇</span>
        <Icon name="i-lucide-chevron-right" class="nav-icon" />
      </div>
      <div class="nav-title">{{ nextArticle.title }}</div>
      <div v-if="nextArticle.description" class="nav-description">
        {{ truncate(nextArticle.description, 60) }}
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
  gap: var(--space-lg);
  margin: var(--space-3xl) 0;
  padding: var(--space-2xl) 0;
  border-top: 1px solid var(--border-light);
}

.nav-link {
  display: flex;
  flex-direction: column;
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  text-decoration: none;
  transition: all var(--duration-normal);
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(112, 26, 69, 0.05) 0%,
    rgba(157, 23, 77, 0.03) 100%
  );
  opacity: 0;
  transition: opacity var(--duration-normal);
}

.nav-link:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg), 0 0 20px var(--primary-glow);
}

.nav-link:hover::before {
  opacity: 1;
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
  gap: var(--space-xs);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: var(--space-sm);
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
  transition: transform var(--duration-fast);
}

.nav-link:hover .nav-icon {
  transform: translateX(0);
}

.nav-prev:hover .nav-icon {
  transform: translateX(-4px);
}

.nav-next:hover .nav-icon {
  transform: translateX(4px);
}

.nav-title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
  line-height: 1.4;
  position: relative;
  z-index: 1;
}

.nav-description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.5;
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .article-navigation {
    grid-template-columns: 1fr;
  }
  
  .nav-link {
    padding: var(--space-md);
  }
}
</style>
