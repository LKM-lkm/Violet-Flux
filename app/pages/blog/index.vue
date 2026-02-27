<template>
  <div class="blog-layout">
    <!-- Fluid background consistent with home/about -->
    <div class="flux-bg">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
      <div class="noise-overlay"></div>
    </div>

    <header class="header">
      <div class="container header-container">
        <h1 class="logo">Violet Flux</h1>
        <nav class="nav">
          <NuxtLink to="/">Home</NuxtLink>
          <NuxtLink to="/blog" class="nav-active">Blog</NuxtLink>
          <NuxtLink to="/about">About</NuxtLink>
          <button @click="toggleDark()" class="theme-toggle">
            <Icon :name="isDark ? 'lucide:sun' : 'lucide:moon'" />
          </button>
        </nav>
      </div>
    </header>

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
        </div>

        <div class="search-box-wrapper">
          <ContentSearch />
        </div>
        
        <div v-if="filteredArticles?.length" class="article-grid">
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
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  color: var(--text-primary);
  position: relative;
}

/* FLUX BACKGROUND */
.flux-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  filter: blur(100px);
  opacity: 0.25;
  pointer-events: none;
}

.flux-bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(var(--border-light) 1px, transparent 1px);
  background-size: 30px 30px;
  opacity: 0.2;
}

.blob {
  position: absolute;
  border-radius: 50%;
  animation: blob-float 20s infinite alternate ease-in-out;
}

.blob-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #b497d7, #a682cf);
  top: -10%;
  right: -5%;
  opacity: 0.3;
}

.blob-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #c2a9e4, #b497d7);
  bottom: -5%;
  left: 5%;
  opacity: 0.25;
  animation-delay: -10s;
}

.blob-3 {
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, #9163c0, #7743a3);
  top: 40%;
  left: 50%;
  opacity: 0.2;
  animation: blob-float 25s infinite alternate ease-in-out;
  animation-delay: -5s;
}

@keyframes blob-float {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -40px) scale(1.05); }
  100% { transform: translate(0, 0) scale(1); }
}

.noise-overlay {
  position: absolute;
  inset: 0;
  background-image: url('https://grainy-gradients.vercel.app/noise.svg');
  opacity: 0.05;
  z-index: 1;
}

/* HEADER */
.header {
  height: 80px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border-light);
  backdrop-filter: blur(15px);
  z-index: 100;
  position: sticky;
  top: 0;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.nav { display: flex; gap: 2.5rem; align-items: center; }
.nav a { 
  font-size: 0.9375rem; 
  color: var(--text-secondary); 
  text-decoration: none; 
  font-weight: 500;
  transition: color 0.2s;
}
.nav a:hover, .nav-active { color: var(--text-primary); }

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
  transition: transform 0.2s;
}
.theme-toggle:hover { transform: scale(1.1); }

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
}

.sidebar::-webkit-scrollbar { width: 4px; }
.sidebar::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 10px; }

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
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 4rem;
  gap: 2rem;
}

.path-display {
  display: flex;
  align-items: center;
  font-family: 'Bricolage Grotesque';
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.root-label { cursor: pointer; transition: opacity 0.2s; }
.root-label:hover { opacity: 0.5; }

.path-crumb {
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 1.5rem;
  opacity: 0.6;
}

.chevron-sm { font-size: 1.25rem; margin: 0 0.75rem; opacity: 0.3; }

.search-box {
  position: relative;
  width: 320px;
  padding: 0;
  border-radius: 0.8rem;
  overflow: hidden;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--card-shadow),
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.search-icon {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  opacity: 0.5;
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

/* CARDS */
.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2.5rem;
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
}

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

/* UTILS */
/* Using global .glass-card */



@media (max-width: 1200px) {
  .blog-container { grid-template-columns: 1fr; }
  .sidebar { display: none; }
  .path-display { font-size: 2rem; }
}

@media (max-width: 768px) {
  .content-header { flex-direction: column; align-items: stretch; }
  .search-box-wrapper { width: 100%; position: static; margin-bottom: 2rem; }
  .article-grid { grid-template-columns: 1fr; }
}
</style>

<style scoped>
.search-box-wrapper {
  position: sticky;
  top: 100px;
  z-index: 50;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
  margin-top: -5rem;
  pointer-events: none;
}

.search-box {
  pointer-events: auto;
  position: relative;
  width: 320px;
  border-radius: 0.8rem;
  overflow: hidden;
}

.search-icon {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  opacity: 0.5;
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
</style>
