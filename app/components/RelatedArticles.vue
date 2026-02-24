<template>
  <div v-if="relatedArticles?.length" class="related-articles">
    <h3 class="related-title">
      <Icon name="i-lucide-sparkles" class="title-icon" />
      相关文章推荐
    </h3>
    <div class="articles-grid">
      <NuxtLink
        v-for="article in relatedArticles"
        :key="article.id"
        :to="article.path"
        class="article-card"
      >
        <div class="card-header">
          <h4 class="card-title">{{ article.title }}</h4>
          <div v-if="article.tags?.length" class="card-tags">
            <span 
              v-for="tag in article.tags.slice(0, 2)" 
              :key="tag" 
              class="tag"
            >
              #{{ tag }}
            </span>
          </div>
        </div>
        <p v-if="article.description" class="card-description">
          {{ truncate(article.description, 100) }}
        </p>
        <div class="card-footer">
          <span class="read-more">
            阅读更多
            <Icon name="i-lucide-arrow-right" class="arrow-icon" />
          </span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  article: {
    type: Object,
    required: true
  },
  maxItems: {
    type: Number,
    default: 3
  }
})

// 基于标签推荐相关文章
const { data: relatedArticles } = await useAsyncData(
  `related-${props.article.id}`,
  async () => {
    const tags = props.article.tags || []
    if (tags.length === 0) return []
    
    const articles = await queryCollection('content')
      .where('path', 'startsWith', '/blog')
      .where('id', '!=', props.article.id)
      .all()
    
    // 计算相关度分数
    const scored = articles
      .map(a => ({
        ...a,
        score: (a.tags || []).filter(t => tags.includes(t)).length
      }))
      .filter(a => a.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, props.maxItems)
    
    return scored
  }
)

// 截断文本
const truncate = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}
</script>

<style scoped>
.related-articles {
  margin: var(--space-3xl) 0;
  padding: var(--space-2xl);
  border-radius: var(--radius-xl);
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-light);
  position: relative;
  overflow: hidden;
}

.related-articles::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at top right,
    rgba(112, 26, 69, 0.05) 0%,
    transparent 50%
  );
  pointer-events: none;
}

.related-title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-xl);
  position: relative;
  z-index: 1;
}

.title-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--primary);
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-lg);
  position: relative;
  z-index: 1;
}

.article-card {
  display: flex;
  flex-direction: column;
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  background: var(--bg-primary);
  text-decoration: none;
  transition: all var(--duration-normal);
  position: relative;
  overflow: hidden;
}

.article-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    var(--primary-light) 0%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity var(--duration-normal);
}

.article-card:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg), 0 0 20px var(--primary-glow);
}

.article-card:hover::before {
  opacity: 1;
}

.card-header {
  margin-bottom: var(--space-md);
  position: relative;
  z-index: 1;
}

.card-title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.tag {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--primary);
  background: var(--primary-light);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-light);
}

.card-description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-md);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.card-footer {
  margin-top: auto;
  position: relative;
  z-index: 1;
}

.read-more {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--primary);
  transition: gap var(--duration-fast);
}

.article-card:hover .read-more {
  gap: var(--space-sm);
}

.arrow-icon {
  width: 1rem;
  height: 1rem;
  transition: transform var(--duration-fast);
}

.article-card:hover .arrow-icon {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .articles-grid {
    grid-template-columns: 1fr;
  }
  
  .related-articles {
    padding: var(--space-lg);
  }
}
</style>
