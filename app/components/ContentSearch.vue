<template>
  <div class="content-search">
    <div class="search-input-wrapper">
      <UIcon name="i-lucide-search" class="search-icon" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索文章内容..."
        class="search-input"
        @focus="showResults = true"
      />
      <UButton
        v-if="searchQuery"
        color="neutral"
        variant="ghost"
        icon="i-lucide-x"
        size="xs"
        class="clear-btn"
        @click="clearSearch"
      />
    </div>

    <!-- 搜索结果 -->
    <Transition name="results">
      <div
        v-if="showResults && searchQuery && searchResults.length > 0"
        class="search-results"
      >
        <div class="results-header">
          <span class="results-count">找到 {{ searchResults.length }} 个结果</span>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-x"
            size="xs"
            @click="showResults = false"
          />
        </div>

        <div class="results-list">
          <NuxtLink
            v-for="result in searchResults.slice(0, 10)"
            :key="result.id"
            :to="result.id"
            class="result-item"
            @click="showResults = false"
          >
            <div class="result-title">{{ result.title }}</div>
            <div v-if="result.content" class="result-excerpt">
              {{ truncate(result.content, 120) }}
            </div>
            <div class="result-meta">
              <UIcon name="i-lucide-file-text" class="meta-icon" />
              <span>{{ result.id }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </Transition>

    <!-- 无结果 -->
    <Transition name="results">
      <div v-if="showResults && searchQuery && searchResults.length === 0" class="no-results">
        <UIcon name="i-lucide-search-x" class="no-results-icon" />
        <p>未找到匹配的内容</p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const searchQuery = ref('')
const showResults = ref(false)

// 使用官方推荐的 queryCollectionSearchSections
const { data: searchSections } = await useAsyncData('search-sections', () =>
  queryCollectionSearchSections('content')
)

// 搜索结果
const searchResults = computed(() => {
  if (!searchQuery.value || !searchSections.value) return []
  
  const query = searchQuery.value.toLowerCase()
  const results = []
  const seen = new Set()
  
  searchSections.value.forEach(section => {
    // 检查标题或内容是否匹配
    const titleMatch = section.title?.toLowerCase().includes(query)
    const contentMatch = section.content?.toLowerCase().includes(query)
    
    if (titleMatch || contentMatch) {
      // 避免重复
      if (!seen.has(section.id)) {
        results.push({
          id: section.id,
          title: section.title || '无标题',
          content: section.content || '',
          score: titleMatch ? 2 : 1 // 标题匹配权重更高
        })
        seen.add(section.id)
      }
    }
  })
  
  // 按相关度排序
  return results.sort((a, b) => b.score - a.score)
})

const clearSearch = () => {
  searchQuery.value = ''
  showResults.value = false
}

const truncate = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

// 点击外部关闭结果
onMounted(() => {
  const handleClickOutside = (e) => {
    const searchEl = document.querySelector('.content-search')
    if (searchEl && !searchEl.contains(e.target)) {
      showResults.value = false
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<style scoped>
.content-search {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--card-shadow),
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.3s;
}

.search-input-wrapper:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(180, 151, 215, 0.2),
              var(--shadow-md);
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: var(--text-secondary);
  opacity: 0.6;
  font-size: 1.25rem;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.875rem 3rem 0.875rem 3rem;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.9375rem;
  outline: none;
}

.search-input::placeholder {
  color: var(--text-secondary);
  opacity: 0.6;
}

.clear-btn {
  position: absolute;
  right: 0.5rem;
}

/* 搜索结果 */
.search-results,
.no-results {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl),
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
  max-height: 500px;
  overflow-y: auto;
  z-index: 100;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-light);
  position: sticky;
  top: 0;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  z-index: 1;
}

.results-count {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.results-list {
  padding: 0.5rem;
}

.result-item {
  display: block;
  padding: 0.875rem 1rem;
  border-radius: var(--radius-md);
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.result-item:hover {
  background: linear-gradient(135deg, 
    rgba(180, 151, 215, 0.12), 
    rgba(194, 169, 228, 0.08)
  );
  border-color: var(--primary);
  transform: translateX(4px);
}

.result-title {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.375rem;
  font-size: 0.9375rem;
}

.result-excerpt {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.result-meta {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
  opacity: 0.7;
}

.meta-icon {
  font-size: 0.875rem;
}

/* 无结果 */
.no-results {
  padding: 2rem;
  text-align: center;
}

.no-results-icon {
  font-size: 3rem;
  color: var(--text-secondary);
  opacity: 0.3;
  margin-bottom: 1rem;
}

.no-results p {
  color: var(--text-secondary);
  font-size: 0.9375rem;
}

/* 动画 */
.results-enter-active,
.results-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.results-enter-from,
.results-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 滚动条 */
.search-results::-webkit-scrollbar {
  width: 6px;
}

.search-results::-webkit-scrollbar-thumb {
  background: var(--border-light);
  border-radius: 10px;
}

.search-results::-webkit-scrollbar-thumb:hover {
  background: var(--border-medium);
}

/* 响应式 */
@media (max-width: 768px) {
  .search-results,
  .no-results {
    max-height: 400px;
  }
}
</style>
