<template>
  <div class="blog-layout">
    <header class="header">
      <div class="container">
        <h1 class="logo">Violet Flux</h1>
        <nav class="nav">
          <NuxtLink to="/">Home</NuxtLink>
          <NuxtLink to="/blog">Blog</NuxtLink>
          <NuxtLink to="/about">About</NuxtLink>
          <button @click="toggleDark()" class="theme-toggle">
            <Icon :name="isDark ? 'lucide:sun' : 'lucide:moon'" />
          </button>
        </nav>
      </div>
    </header>

    <div class="blog-container">
      <!-- Sidebar for Tree Navigation and Tags -->
      <aside class="sidebar">
        <div class="filter-section">
          <h3>Knowledge Base</h3>
          <nav class="tree-nav">
            <button 
              :class="{ active: !selectedPath }" 
              @click="selectedPath = ''"
              class="tree-root-btn"
            >
              <Icon name="lucide:library" class="mr-2" />
              All Notes
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

        <div class="filter-section mt-8">
          <h3>Tags</h3>
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
          <div class="breadcrumb-nav">
            <span class="root" @click="selectedPath = ''">Blog</span>
            <template v-if="selectedPath">
              <span v-for="(p, i) in selectedPath.replace('/blog', '').split('/').filter(Boolean)" :key="i" class="crumb">
                <Icon name="lucide:chevron-right" class="chevron" />
                {{ p }}
              </span>
            </template>
          </div>
          <div class="search-wrapper">
            <Icon name="lucide:search" class="search-icon" />
            <input v-model="search" type="text" placeholder="Search knowledge base..." class="search-input" />
          </div>
        </div>
        
        <div v-if="filteredArticles?.length" class="article-grid">
          <article v-for="article in filteredArticles" :key="article.path" class="article-card">
            <NuxtLink :to="article.path">
              <div class="card-content">
                <span class="category-path">{{ getBreadcrumbs(article.path) }}</span>
                <h2 class="title">{{ article.title || getFileName(article.path) }}</h2>
                <p v-if="article.description" class="desc">{{ article.description }}</p>
                <div class="card-footer">
                  <div class="tags-row" v-if="getTags(article).length">
                    <span v-for="tag in getTags(article)" :key="tag" class="tag-pill">#{{ tag }}</span>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </article>
        </div>
        
        <div v-else class="no-results">
          <div class="empty-state">
            <Icon name="lucide:search-x" class="empty-icon" />
            <p v-if="articles?.length">No matching articles in this selection</p>
            <p v-else>Thinking... if no articles appear, check your <code>content/blog/</code> folder.</p>
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

const { data: articles } = await useAsyncData('blog-articles-v4', async () => {
  const all = await queryCollection('content').all()
  return all
    .map(item => {
      let path = item.path.replace(/\/+/g, '/')
      // If path doesn't start with /blog, prepend it (ensuring internal links work)
      if (!path.startsWith('/blog')) {
        path = '/blog' + (path.startsWith('/') ? '' : '/') + path
      }
      return {
        ...item,
        path: decodeURIComponent(path)
      }
    })
    .filter(item => {
      const segments = item.path.split('/')
      // Strict exclusion of hidden/system folders
      if (segments.some(s => s.startsWith('.') && s.length > 1)) return false
      return true
    })
})

const folderTree = computed(() => {
  if (!articles.value) return []
  const tree = []
  
  articles.value.forEach(article => {
    const parts = article.path.split('/').filter(Boolean)
    if (parts[0] !== 'blog') return
    
    let currentLevel = tree
    let currentFullPath = '/blog'
    
    // Build tree for folders (everything except the last item)
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

const getBreadcrumbs = (path) => {
  const parts = path.split('/').filter(Boolean)
  // blog / folder / sub / file -> folder / sub
  if (parts.length <= 2) return 'General'
  return parts.slice(1, -1).join(' / ')
}

const getFileName = (path) => {
  const parts = path.split('/').filter(Boolean)
  let name = parts[parts.length - 1] || 'Untitled'
  // Handle 'index' specifically if desired
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
  return articles.value.filter(article => {
    const matchesSearch = !search.value || 
      article.title?.toLowerCase().includes(search.value.toLowerCase()) ||
      article.description?.toLowerCase().includes(search.value.toLowerCase())
    
    // Hierarchical path matching
    const matchesPath = !selectedPath.value || 
      article.path === selectedPath.value || 
      article.path.startsWith(selectedPath.value + '/')
    
    const articleTags = getTags(article)
    const matchesTags = selectedTags.value.length === 0 || 
      selectedTags.value.every(tag => articleTags.includes(tag))
    
    return matchesSearch && matchesPath && matchesTags
  })
})
</script>

<style scoped>
.blog-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  color: var(--text);
}

.header {
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background: var(--bg);
  backdrop-filter: blur(12px);
  z-index: 100;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.02em;
}

.nav {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav a {
  font-size: 0.9375rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s;
}

.nav a:hover {
  color: var(--text);
}

.theme-toggle {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.4rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.theme-toggle:hover {
  color: var(--text);
}

.blog-container {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  padding: 3rem 2rem;
  gap: 4rem;
  box-sizing: border-box;
}

.sidebar {
  width: 250px;
  flex-shrink: 0;
  position: sticky;
  top: 6rem;
  height: calc(100vh - 9rem);
  overflow-y: auto;
  padding-right: 1rem;
}

/* Custom Scrollbar for Sidebar */
.sidebar::-webkit-scrollbar { width: 4px; }
.sidebar::-webkit-scrollbar-thumb { background: rgba(128, 128, 128, 0.1); border-radius: 10px; }

.filter-section h3 {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
  font-weight: 700;
  opacity: 0.6;
}

.tree-root-btn {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.6rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 0.5rem;
}

.tree-root-btn:hover, .tree-root-btn.active {
  background: rgba(128, 128, 128, 0.08);
  color: var(--text);
}

.tree-root-btn.active {
  font-weight: 600;
  color: var(--primary);
  background: rgba(139, 92, 246, 0.05);
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-btn {
  padding: 0.3rem 0.75rem;
  background: rgba(128, 128, 128, 0.05);
  border: 1px solid rgba(128, 128, 128, 0.1);
  border-radius: 2rem;
  font-size: 0.8125rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.tag-btn:hover {
  border-color: rgba(128, 128, 128, 0.3);
  color: var(--text);
}

.tag-btn.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
  box-shadow: 0 0 15px var(--primary-glow);
}

.content {
  flex: 1;
  min-width: 0;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3.5rem;
}

.breadcrumb-nav {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 700;
  font-family: 'Bricolage Grotesque', sans-serif;
}

.breadcrumb-nav .root {
  cursor: pointer;
  transition: opacity 0.2s;
}

.breadcrumb-nav .root:hover {
  opacity: 0.6;
}

.crumb {
  display: flex;
  align-items: center;
  color: var(--text-muted);
  font-weight: 500;
  font-size: 1.125rem;
}

.chevron {
  font-size: 0.9rem;
  margin: 0 0.5rem;
  opacity: 0.3;
}

.search-wrapper {
  position: relative;
  width: 320px;
}

.search-icon {
  position: absolute;
  left: 1.1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1.25rem 0.75rem 2.75rem;
  border: 1px solid rgba(128, 128, 128, 0.15);
  border-radius: 0.85rem;
  background: rgba(128, 128, 128, 0.03);
  color: var(--text);
  outline: none;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.search-input:focus {
  border-color: var(--text);
  background: transparent;
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 2.5rem;
}

.article-card a {
  display: block;
  height: 100%;
  text-decoration: none;
  color: var(--text);
  border: 1px solid rgba(128, 128, 128, 0.1);
  border-radius: 1.25rem;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  overflow: hidden;
  background: rgba(128, 128, 128, 0.02);
}

.article-card a:hover {
  border-color: rgba(128, 128, 128, 0.25);
  transform: translateY(-6px);
  background: rgba(128, 128, 128, 0.06);
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.1);
}

.card-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.category-path {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  margin-bottom: 1.25rem;
  font-weight: 600;
  opacity: 0.8;
}

.article-card h2 {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 1.625rem;
  margin: 0 0 1rem;
  line-height: 1.2;
  font-weight: 700;
}

.article-card p {
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 2rem;
  flex: 1;
}

.card-footer {
  margin-top: auto;
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-pill {
  font-size: 0.75rem;
  color: var(--text-muted);
  background: rgba(128, 128, 128, 0.08);
  padding: 0.2rem 0.6rem;
  border-radius: 0.4rem;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 6rem 2rem;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 3rem;
  opacity: 0.15;
  margin-bottom: 1.5rem;
}

.mt-8 { margin-top: 2rem; }
.mr-2 { margin-right: 0.5rem; }

@media (max-width: 1024px) {
  .sidebar { display: none; }
  .blog-container { padding: 2rem 1.5rem; gap: 0; }
  .content-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
  .search-wrapper { width: 100%; }
}
</style>
