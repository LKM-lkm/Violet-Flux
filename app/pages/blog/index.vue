<template>
  <div class="blog-layout">

    <div class="container blog-container">
      <!-- Sidebar for Tree Navigation and Tags -->
      <aside class="sidebar glass-card">
        <div class="filter-section">
          <h3 class="section-title">Knowledge</h3>
          <nav class="tree-nav">
            <button 
              :class="{ active: !selectedPath }" 
              @click="selectedPath = ''"
              class="tree-root-btn"
            >
              <Icon name="lucide:layers" class="icon-m" />
              All Content
            </button>
            
            <div class="folder-tree">
              <TreeItem 
                v-for="item in folderTree" 
                :key="item.path" 
                :item="item" 
                :selected-path="selectedPath"
                @select="selectedPath = $event"
              />
            </div>
          </nav>
        </div>

        <div class="filter-section mt-10">
          <h3 class="section-title">Topics</h3>
          <div class="tag-cloud">
            <button 
              v-for="tag in allTags" 
              :key="tag"
              :class="{ active: selectedTags.includes(tag) }"
              @click="toggleTag(tag)"
              class="tag-btn"
            >
              #{{ tag }}
            </button>
          </div>
        </div>
      </aside>

      <main class="content">
        <div class="content-header">
          <div class="path-display">
            <span class="root-label" @click="selectedPath = ''">Library</span>
            <template v-if="selectedPath">
              <span v-for="(p, i) in selectedPath.replace('/blog', '').split('/').filter(Boolean)" :key="i" class="path-crumb">
                <Icon name="lucide:chevron-right" class="chevron-sm" />
                {{ p }}
              </span>
            </template>
          </div>

          <!-- Search Box -->
          <div class="search-box-wrapper">
            <div class="search-box">
              <Icon name="lucide:search" class="search-icon" />
              <input type="text" v-model="search" placeholder="Search knowledge base..." class="search-input" />
            </div>
          </div>
        </div>
        
        <div v-if="filteredArticles?.length">
          <TransitionGroup name="article-list" tag="div" class="article-grid">
            <article v-for="article in filteredArticles" :key="article.path" class="blog-card glass-card">
              <NuxtLink :to="article.path" class="card-link">
                <div class="card-inner">
                  <div class="card-meta">
                    <span class="meta-folder">{{ getBreadcrumbs(article.displayPath) }}</span>
                  </div>
                  <h2 class="card-title">{{ article.title || getFileName(article.displayPath) }}</h2>
                  <p v-if="article.description" class="card-desc">{{ article.description }}</p>
                  
                  <div class="card-footer">
                    <div class="tags-group">
                      <span v-for="tag in getTags(article)" :key="tag" class="tag-chip">#{{ tag }}</span>
                    </div>
                    <div class="read-more">
                      Read
                      <Icon name="lucide:arrow-up-right" class="arrow-icon" />
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </article>
          </TransitionGroup>
        </div>
        
        <div v-else class="empty-boundary">
          <div class="empty-content">
            <div class="empty-icon-wrapper">
              <Icon name="lucide:wind" class="empty-icon" />
            </div>
            <h3>Nothing found in this sector</h3>
            <p>Try refining your search or clearing the path filter.</p>
            <button @click="resetFilters" class="reset-btn">Reset Filters</button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })
import { isDark, toggleDark } from '~/composables/useTheme'
const search = ref('')
const selectedPath = ref('')
const selectedTags = ref([])

// 使用官方推荐的 queryCollectionNavigation
const { data: navigation } = await useAsyncData('blog-navigation', () => 
  queryCollectionNavigation('content')
)

// 使用官方推荐的 queryCollectionSearchSections 用于全文搜索
const { data: searchSections } = await useAsyncData('blog-search-sections', () =>
  queryCollectionSearchSections('content')
)

const { data: articles } = await useAsyncData('blog-articles-v4-premium', async () => {
  const all = await queryCollection('content').all()
  return all
    .map(item => {
      let cleanId = item.id.replace(/\.md$/, '')
      let finalPath = '/blog/' + cleanId
      finalPath = finalPath.replace(/\/+/g, '/')
      
      return {
        ...item,
        path: encodeURI(finalPath),
        displayPath: decodeURIComponent(finalPath)
      }
    })
    .filter(item => {
      const segments = item.path.split('/')
      if (segments.some(s => s.startsWith('.') && s.length > 1)) return false
      return true
    })
})

const folderTree = computed(() => {
  if (!articles.value) return []
  const tree = []
  
  articles.value.forEach(article => {
    if (!article?.path) return
    const parts = article.path.split('/').filter(Boolean)
    if (parts[0] !== 'blog') return
    
    let currentLevel = tree
    let currentFullPath = '/blog'
    
    for (let i = 1; i < parts.length - 1; i++) {
      const segment = parts[i]
      currentFullPath += '/' + segment
      let folder = currentLevel.find(f => f.name === segment)
      if (!folder) {
        folder = { name: segment, path: currentFullPath, children: [] }
        currentLevel.push(folder)
      }
      currentLevel = folder.children
    }
  })
  
  const sort = (nodes) => {
    nodes.sort((a, b) => a.name.localeCompare(b.name))
    nodes.forEach(n => sort(n.children))
    return nodes
  }
  
  return sort(tree)
})

const allTags = computed(() => {
  if (!articles.value) return []
  const set = new Set()
  articles.value.forEach(article => {
    getTags(article).forEach(tag => set.add(tag))
  })
  return Array.from(set).sort()
})

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index === -1) selectedTags.value.push(tag)
  else selectedTags.value.splice(index, 1)
}

const resetFilters = () => {
  search.value = ''
  selectedPath.value = ''
  selectedTags.value = []
}

const getBreadcrumbs = (path) => {
  if (!path) return 'General'
  const parts = path.split('/').filter(Boolean)
  if (parts.length <= 2) return 'General'
  return parts.slice(1, -1).join(' / ')
}

const getFileName = (path) => {
  if (!path) return 'Untitled'
  const parts = path.split('/').filter(Boolean)
  let name = parts[parts.length - 1] || 'Untitled'
  return name.charAt(0).toUpperCase() + name.slice(1)
}

const getTags = (article) => {
  const tags = article.tags || article.meta?.tags || []
  if (Array.isArray(tags)) return tags.map(String)
  if (typeof tags === 'string') return tags.split(/,\s*/).filter(Boolean)
  return []
}

const filteredArticles = computed(() => {
  if (!articles.value) return []
  
  let results = articles.value
  
  // 使用全文搜索
  if (search.value && searchSections.value) {
    const searchLower = search.value.toLowerCase()
    const matchingPaths = new Set()
    
    // 在搜索段落中查找匹配
    searchSections.value.forEach(section => {
      if (
        section.title?.toLowerCase().includes(searchLower) ||
        section.content?.toLowerCase().includes(searchLower)
      ) {
        matchingPaths.add(section.id)
      }
    })
    
    results = results.filter(article => {
      // 检查文章路径是否在匹配的搜索结果中
      const articleId = article.id || article.path.replace('/blog/', '')
      return matchingPaths.has(articleId) ||
        (article.title && String(article.title).toLowerCase().includes(searchLower)) ||
        (article.description && String(article.description).toLowerCase().includes(searchLower))
    })
  }
  
  // 路径过滤
  if (selectedPath.value) {
    results = results.filter(article => 
      article.path === selectedPath.value || 
      (article.path && String(article.path).startsWith(selectedPath.value + '/'))
    )
  }
  
  // 标签过滤
  if (selectedTags.value.length > 0) {
    results = results.filter(article => {
      const articleTags = getTags(article)
      return selectedTags.value.every(tag => articleTags.includes(tag))
    })
  }
  
  return results
})
</script>

<style scoped>
.blog-layout {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

/* LAYOUT */
.blog-container {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 4rem;
  padding: 5rem 2rem;
  position: relative;
  z-index: 1;
}

.sidebar {
  padding: 2.5rem;
  position: sticky;
  top: 8rem;
  height: fit-content;
  max-height: calc(100vh - 12rem);
  overflow-y: auto;
  background: var(--glass-bg);
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl),
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              0 0 20px rgba(180, 151, 215, 0.15);
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.sidebar::-webkit-scrollbar { 
  display: none; 
}

.section-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--primary);
  margin-bottom: 1.5rem;
  font-weight: 800;
  text-shadow: 0 0 10px var(--primary-glow);
}

.tree-root-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 0.5rem;
}

.tree-root-btn:hover { background: var(--bg-secondary); color: var(--text-primary); }
.tree-root-btn.active { 
  background: linear-gradient(135deg, 
    rgba(180, 151, 215, 0.15), 
    rgba(194, 169, 228, 0.1)
  );
  color: var(--primary);
  box-shadow: inset 0 0 12px rgba(180, 151, 215, 0.2);
}

.icon-m { width: 1.25rem; height: 1.25rem; }

/* SEARCH & CONTENT HEADER */
.content { min-width: 0; }

.content-header {
  position: sticky;
  top: 90px; /* Slight offset to make it float below the main navigation */
  z-index: 50;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  
  /* Adjust width so the edges don't align with the content grid below */
  margin: 0 1.5rem 3rem 1.5rem;
  padding: 1rem 1.8rem;
  
  /* Independent floating glass card */
  background: var(--glass-bg);
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  border: 1px solid var(--glass-border);
  border-radius: 1.5rem; /* Fully rounded on all corners */
  box-shadow: var(--shadow-xl),
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              0 10px 40px rgba(180, 151, 215, 0.08);
}

.path-display {
  display: flex;
  align-items: center;
  flex-wrap: wrap; /* allow wrapping on smaller screens */
  gap: 0.5rem;
  font-family: 'Bricolage Grotesque', sans-serif !important;
  font-size: clamp(1.5rem, 2.5vw, 2rem); /* Scaled down slightly to fit the card gracefully */
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  line-height: 1.1;
}

.root-label { cursor: pointer; transition: opacity 0.2s; }
.root-label:hover { opacity: 0.5; }

.path-crumb {
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  font-weight: 600;
}

.chevron-sm { font-size: clamp(1.2rem, 2vw, 2rem); margin: 0 0.25rem; opacity: 0.3; }

.search-box-wrapper {
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0; /* prevent search box from getting crushed */
}

.search-box {
  pointer-events: auto;
  position: relative;
  width: 320px;
  padding: 0;
  border-radius: 0.8rem;
  overflow: hidden;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-sm),
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.search-box:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(180, 151, 215, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transform: translateY(-1px);
}

.search-icon {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.search-box:focus-within .search-icon {
  color: var(--primary);
}

.search-input {
  width: 100%;
  padding: 1rem 1.25rem 1rem 3.25rem;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.9375rem;
  outline: none;
}

/* CARDS ANIMATION & GRID */
.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2.5rem;
  position: relative;
}

/* Vue Transition Group Classes */
.article-list-move, /* apply transition to moving elements */
.article-list-enter-active,
.article-list-leave-active {
  transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.article-list-enter-from,
.article-list-leave-to {
  opacity: 0;
  transform: translateY(40px) scale(0.95);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.article-list-leave-active {
  position: absolute;
  /* give it the same width as grid columns minus gap */
  width: calc(100% - 2.5rem); 
  z-index: 0;
}

.blog-card {
  padding: 0;
  border-radius: 1.2rem;
  transition: all 0.4s cubic-bezier(0.2, 1, 0.2, 1);
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-md),
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  z-index: 1; /* keep above leaving items */
}

/* ... keep other styles the same ... */
.blog-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 1.2rem;
  padding: 1px;
  background: linear-gradient(135deg, 
    rgba(180, 151, 215, 0.3), 
    rgba(194, 169, 228, 0.2),
    rgba(166, 130, 207, 0.3)
  );
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.4s cubic-bezier(0.2, 1, 0.2, 1);
}

.blog-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: var(--border-medium);
  box-shadow: var(--shadow-2xl),
              0 0 32px rgba(180, 151, 215, 0.4);
}

.blog-card:hover::before {
  opacity: 1;
}

.card-link { 
  text-decoration: none; 
  color: inherit; 
  display: flex;
  flex-direction: column;
  height: 100%; 
  width: 100%;
}

.card-inner { 
  padding: 2.5rem; 
  display: flex; 
  flex-direction: column; 
  height: 100%; 
  min-height: 100%;
  flex: 1;
  position: relative;
}

.card-meta { margin-bottom: 1.5rem; }
.meta-folder {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--primary);
  font-weight: 800;
  opacity: 0.8;
}

.card-title {
  font-family: 'Bricolage Grotesque';
  font-size: 1.75rem;
  line-height: 1.1;
  font-weight: 800;
  margin-bottom: 1.25rem;
  letter-spacing: -0.02em;
}

.card-desc {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  margin-top: auto;
  display: flex !important;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: nowrap;
  padding-top: 1rem;
  border-top: 1px solid transparent;
}

.tags-group {
  display: flex !important;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  flex: 1;
  min-width: 0;
  max-width: calc(100% - 80px);
  overflow: visible;
}

.tag-chip {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--primary);
  background: linear-gradient(135deg, 
    rgba(180, 151, 215, 0.1), 
    rgba(194, 169, 228, 0.15)
  );
  border: 1px solid var(--border-light);
  padding: 0.3rem 0.75rem;
  border-radius: 0.5rem;
  white-space: nowrap;
  flex-shrink: 0;
  display: inline-block;
  line-height: 1.2;
  transition: all 0.3s;
}

.tag-chip:hover {
  background: var(--primary);
  color: white;
  box-shadow: 0 4px 12px rgba(180, 151, 215, 0.4);
  transform: translateY(-2px);
}

.read-more {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--primary);
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s;
  flex-shrink: 0;
  white-space: nowrap;
  min-width: 60px;
}

.blog-card:hover .read-more { opacity: 1; transform: translateX(0); }

/* TAG CLOUD */
.tag-cloud { display: flex; flex-wrap: wrap; gap: 0.6rem; }
.tag-btn {
  padding: 0.4rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: 1rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}
.tag-btn:hover { border-color: var(--primary); color: var(--primary); background: rgba(180, 151, 215, 0.08); }
.tag-btn.active { 
  background: linear-gradient(135deg, #b497d7, #a682cf);
  color: white;
  border-color: transparent;
  box-shadow: 0 8px 20px rgba(180, 151, 215, 0.4);
}

/* EMPTY STATE */
.empty-boundary {
  padding: 8rem 0;
  text-align: center;
}

.empty-icon-wrapper {
  width: 80px;
  height: 80px;
  background: var(--bg-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
}

.empty-icon { font-size: 2.5rem; color: var(--text-secondary); opacity: 0.4; }

.empty-content h3 { font-family: 'Bricolage Grotesque'; font-size: 1.5rem; margin-bottom: 1rem; }
.reset-btn {
  margin-top: 2rem;
  padding: 0.75rem 2rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 1rem;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 1200px) {
  .blog-container { grid-template-columns: 1fr; }
  .sidebar { display: none; }
  .path-display { font-size: 2rem; }
}

@media (max-width: 768px) {
  .content-header { flex-direction: column; align-items: stretch; gap: 1.5rem; }
  .search-box-wrapper { width: 100%; justify-content: stretch; }
  .search-box { width: 100%; }
  .article-grid { grid-template-columns: 1fr; }
}
</style>
