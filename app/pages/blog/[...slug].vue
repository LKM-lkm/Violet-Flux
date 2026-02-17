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

    <div class="page-container">
      <!-- Sidebar TOC -->
      <aside v-if="tocLinks.length" class="sidebar">
        <div class="toc-wrapper">
          <div class="toc-header">
            <Icon name="lucide:list" class="mr-2 opacity-50" />
            <h3>Index</h3>
          </div>
          <nav class="toc">
            <div 
              class="active-indicator" 
              :style="{ transform: `translateY(${indicatorOffset}px)` }"
            ></div>
            
            <ul class="toc-list">
              <li 
                v-for="link in tocLinks" 
                :key="link.id" 
                :class="[{ active: activeId === link.id }]"
                :style="{ paddingLeft: `${(link.depth - 1) * 1}rem` }"
                :id="`toc-${link.id}`"
              >
                <a :href="`#${link.id}`" @click.prevent="scrollTo(link.id)">
                  {{ link.text }}
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <main class="main-content" :class="{ 'no-sidebar': !tocLinks.length }">
        <article v-if="article">
          <header class="article-header">
            <h1 class="article-title">{{ article.title }}</h1>
            <div class="article-meta" v-if="getTags(article).length">
              <span v-for="tag in getTags(article)" :key="tag" class="tag-label">#{{ tag }}</span>
            </div>
          </header>
          
          <div class="article-body">
            <ContentRenderer :value="article" />
          </div>
        </article>
        
        <div v-else class="not-found">
          <Icon name="lucide:alert-circle" class="text-6xl opacity-20 mb-6" />
          <h1>Content not found</h1>
          <NuxtLink to="/blog" class="back-link">Return to Blog</NuxtLink>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { isDark, toggleDark } from '~/composables/useTheme'
const activeId = ref('')
const indicatorOffset = ref(0)
const route = useRoute()

const { data: article } = await useAsyncData(`article-v18-${route.path}`, async () => {
  const all = await queryCollection('content').all()
  
  const normalize = (p) => {
    if (!p) return ''
    try {
      // Decode, NFC normalize, collapse slashes, remove leading/trailing slashes
      return decodeURIComponent(p)
        .normalize('NFC')
        .replace(/\/+/g, '/')
        .replace(/\/$/, '')
        .replace(/^\//, '')
    } catch (e) {
      return p.replace(/\/+/g, '/').replace(/\/$/, '').replace(/^\//, '')
    }
  }

  const cleanRoute = normalize(route.path)
  const relativeRoute = cleanRoute.replace(/^blog\//, '')

  // 1. Match against item.id (This is our new source of truth for Chinese)
  let found = all.find(item => {
    const itemId = item.id.replace(/\.md$/, '').normalize('NFC')
    return itemId === relativeRoute || itemId === cleanRoute
  })

  // 2. Exact Path Match fallback
  if (!found) {
    found = all.find(item => {
      const itemPath = normalize(item.path)
      return itemPath === cleanRoute || itemPath === relativeRoute
    })
  }

  // 3. Stem/Title fallback
  if (!found) {
    const routeStem = cleanRoute.split('/').pop()
    found = all.find(item => {
      const s = normalize(item.stem || item.path?.split('/').pop() || '')
      return s === routeStem || normalize(item.title) === routeStem
    })
  }

  return found || null
})

const processWikiLinks = (node) => {
  if (!node) return
  if (node.type === 'text' && node.value) {
    // Look for Obsidian WikiLink images: ![[Filename.png]]
    const regex = /!\[\[(.*?)\]\]/g
    if (regex.test(node.value)) {
      // This is complex in AST, but we can try to warn or handle simple ones
      // For now, let's keep it simple and focus on the matcher
    }
  }
  if (node.children) node.children.forEach(processWikiLinks)
}

watch(article, (newVal) => {
  if (newVal?.body) processWikiLinks(newVal.body)
}, { immediate: true })

if (!article.value && !import.meta.server) {
  console.log('Article not found for route:', route.path)
}

const tocLinks = computed(() => {
  const rawLinks = article.value?.body?.toc?.links || []
  const links = []
  const flatten = (items) => {
    items.forEach(i => {
      links.push(i)
      if (i.children) flatten(i.children)
    })
  }
  flatten(rawLinks)
  return links
})

const getTags = (art) => {
  const tags = art.tags || art.meta?.tags || []
  return Array.isArray(tags) ? tags : []
}

const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (el) {
    window.scrollTo({
      top: el.offsetTop - 120,
      behavior: 'smooth'
    })
  }
}

const updateActiveHeading = () => {
  const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
  const scrollPosition = window.scrollY + 200
  let currentId = ''

  for (const heading of headings) {
    if (heading.offsetTop <= scrollPosition) {
      if (heading.id) currentId = heading.id
    } else {
      break
    }
  }

  if (currentId && currentId !== activeId.value) {
    activeId.value = currentId
    nextTick(() => {
      const activeTocItem = document.getElementById(`toc-${activeId.value}`)
      if (activeTocItem) {
        indicatorOffset.value = activeTocItem.offsetTop
      }
    })
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateActiveHeading)
  if (window.MathJax?.typesetPromise) {
    setTimeout(() => window.MathJax.typesetPromise(), 1000)
  }
  setTimeout(updateActiveHeading, 600)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveHeading)
})
</script>

<style scoped>
.blog-layout {
  min-height: 100vh;
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

.logo { font-family: 'Bricolage Grotesque', sans-serif; font-size: 1.25rem; font-weight: 800; }
.nav { display: flex; gap: 2rem; align-items: center; }
.nav a { font-size: 0.9375rem; color: var(--text-muted); text-decoration: none; }
.theme-toggle { background: none; border: none; font-size: 1.1rem; cursor: pointer; color: var(--text-muted); }

.page-container {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  padding: 0 2rem;
  box-sizing: border-box;
}

.sidebar {
  width: 240px;
  position: sticky;
  top: 6rem;
  height: calc(100vh - 8rem);
  padding-top: 5rem;
  border-right: 1px solid var(--border);
  margin-right: 4rem;
}

.toc-header {
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
}

.toc-header h3 { 
  font-size: 0.7rem; 
  text-transform: uppercase; 
  letter-spacing: 0.15em; 
  color: var(--text-muted); 
  font-weight: 700; 
}

.toc { position: relative; border-left: 1px solid var(--border); }

.active-indicator {
  position: absolute;
  left: -2px;
  width: 3px;
  height: 28px;
  background: var(--primary);
  box-shadow: 0 0 12px var(--primary-glow);
  transition: transform 0.3s cubic-bezier(0.2, 1, 0.2, 1);
  z-index: 2;
  border-radius: 4px;
}

.toc-list { list-style: none; padding: 0; margin: 0; }
.toc-list li { padding: 0.5rem 1.5rem; transition: all 0.2s; }
.toc-list li a { 
  color: var(--text-muted); 
  text-decoration: none; 
  font-size: 0.875rem; 
  display: block; 
}

.toc-list li.active a { color: var(--primary); font-weight: 700; }

.main-content { flex: 1; max-width: 820px; padding: 5rem 0; min-width: 0; }
.main-content.no-sidebar { margin: 0 auto; }

.article-header { margin-bottom: 4rem; }
.article-title { 
  font-family: 'Bricolage Grotesque', sans-serif; 
  font-size: 3.5rem; 
  line-height: 1.2; 
  margin-bottom: 1.5rem; 
  font-weight: 800; 
}
.tag-label { font-size: 0.75rem; color: var(--text-muted); background: var(--secondary); padding: 0.2rem 0.6rem; border-radius: 0.4rem; margin-right: 0.5rem; }

/* ARTICLE BODY TYPOGRAPHY */
.article-body {
  font-family: 'Geist Sans', sans-serif;
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--text);
}

.article-body :deep(h1),
.article-body :deep(h2),
.article-body :deep(h3) {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700;
  color: var(--text);
  margin-top: 3.5rem;
  margin-bottom: 1.5rem;
  scroll-margin-top: 100px;
}

/* Forceful removal of heading underlines (The 'surgical' fix) */
.article-body :deep(h1),
.article-body :deep(h2),
.article-body :deep(h3),
.article-body :deep(h4) {
  text-decoration: none !important;
  border-bottom: none !important;
}

.article-body :deep(h1) a,
.article-body :deep(h2) a,
.article-body :deep(h3) a,
.article-body :deep(h4) a {
  text-decoration: none !important;
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
  color: inherit !important;
}

.article-body :deep(h2) {
  font-size: 2rem;
  padding-bottom: 0.2rem;
}

.article-body :deep(h3) {
  font-size: 1.5rem;
}

.article-body :deep(p) {
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

/* Restoring the dots and numbers */
.article-body :deep(ul) {
  list-style: disc;
  margin: 1.5rem 0;
  padding-left: 1.5rem;
}

.article-body :deep(ol) {
  list-style: decimal;
  margin: 1.5rem 0;
  padding-left: 1.5rem;
}

.article-body :deep(li) {
  margin-bottom: 0.5rem;
}

.article-body :deep(blockquote) {
  border-left: 4px solid var(--primary);
  padding-left: 1.5rem;
  font-style: italic;
  margin: 2.3rem 0;
  color: var(--text-muted);
}

/* Image styling - Handled by ProseImg.vue component */
.article-body :deep(.prose-img-wrapper) {
  width: 100%;
}

/* TABLE STYLES - REINFORCED */
.article-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 2.5rem 0;
  font-size: 0.95rem;
  border: 1px solid var(--border);
}

.article-body :deep(th),
.article-body :deep(td) {
  border: 1px solid var(--border) !important;
  padding: 0.75rem 1rem;
  text-align: left;
}

.article-body :deep(th) {
  background: rgba(128, 128, 128, 0.08);
  font-weight: 700;
  color: var(--primary);
}

.article-body :deep(tr:nth-child(even)) {
  background: rgba(128, 128, 128, 0.03);
}

/* Link styles */
.article-body :deep(a) {
  color: var(--primary);
  text-decoration: none;
  transition: opacity 0.2s;
}

.article-body :deep(p a),
.article-body :deep(li a) {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.article-body :deep(a:hover) {
  opacity: 0.8;
}

.article-body :deep(code:not(pre code)) {
  background: var(--secondary);
  padding: 0.2rem 0.45rem;
  border-radius: 0.5rem;
  font-size: 0.875em;
  font-family: 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Fira Code', 'Liberation Mono', 'Courier New', monospace;
  color: var(--primary);
  border: 1px solid var(--border);
  font-weight: 500;
}

.not-found { text-align: center; padding: 6rem 0; }
.back-link { display: inline-block; margin-top: 2rem; padding: 0.8rem 1.5rem; border: 1px solid var(--border); border-radius: 0.8rem; text-decoration: none; color: var(--text); }

@media (max-width: 1024px) {
  .sidebar { display: none; }
  .article-title { font-size: 2.75rem; }
}
</style>
