<template>
  <div class="blog-layout">
    <header class="header">
      <div class="container">
        <h1 class="logo">Violet Flux</h1>
        <nav class="nav">
          <NuxtLink to="/">Home</NuxtLink>
          <NuxtLink to="/blog">Blog</NuxtLink>
          <NuxtLink to="/about">About</NuxtLink>
          <button @click="toggleTheme" class="theme-toggle">
            <Icon :name="isDark ? 'lucide:sun' : 'lucide:moon'" />
          </button>
        </nav>
      </div>
    </header>

    <div class="page-container">
      <!-- Left Sidebar for TOC -->
      <aside v-if="tocLinks.length" class="sidebar">
        <div class="toc-wrapper">
          <div class="toc-header">
            <Icon name="lucide:align-left" class="mr-2 opacity-50" />
            <h3>CONTENTS</h3>
          </div>
          <nav class="toc">
            <!-- Refined Premium Indicator: Elegant Bar without "cheap" dot -->
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
          <!-- Article Header -->
          <div class="breadcrumb-trail">
            <NuxtLink to="/blog" class="breadcrumb-link">Blog</NuxtLink>
            <template v-for="(p, i) in pathBreadcrumbs" :key="i">
              <Icon name="lucide:chevron-right" class="breadcrumb-sep" />
              <span class="breadcrumb-text">{{ p }}</span>
            </template>
          </div>

          <header class="article-header">
            <h1 class="article-title">{{ article.title }}</h1>
            <div class="article-meta" v-if="getTags(article).length">
              <span v-for="tag in getTags(article)" :key="tag" class="tag-label">#{{ tag }}</span>
            </div>
          </header>
          
          <!-- Optimized Typography Core -->
          <div class="markdown-body">
            <ContentRenderer :value="article" />
          </div>
        </article>
        
        <div v-else class="not-found">
          <Icon name="lucide:search-x" class="text-6xl opacity-10 mb-6" />
          <h1>Article could not be found</h1>
          <NuxtLink to="/blog" class="back-link">Return to Library</NuxtLink>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const isDark = ref(false)
const activeId = ref('')
const indicatorOffset = ref(0)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark')
}

const pathBreadcrumbs = computed(() => {
  const parts = route.path.split('/').filter(Boolean)
  if (parts.length <= 2) return []
  return parts.slice(1, -1)
})

const { data: article } = await useAsyncData(`article-v5-${route.path}`, async () => {
  const all = await queryCollection('content').all()
  const cleanRoutePath = decodeURIComponent(route.path.replace(/\/+/g, '/')).toLowerCase()
  
  return all.find(item => {
    const itemPath = item.path.replace(/\/+/g, '/').toLowerCase()
    return itemPath === cleanRoutePath || itemPath === cleanRoutePath + '/'
  })
})

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
  const headings = Array.from(document.querySelectorAll('h2, h3, h1'))
  const scrollPosition = window.scrollY + 180
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
  isDark.value = document.documentElement.classList.contains('dark')
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

/* Redesigned Sidebar: Premium Experience */
.sidebar {
  width: 260px;
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
  letter-spacing: 0.2em; 
  color: var(--text-muted); 
  font-weight: 700; 
}

.toc { position: relative; border-left: 1px solid var(--border); }

.active-indicator {
  position: absolute;
  left: -2px;
  width: 3px;
  height: 20px;
  background: linear-gradient(to bottom, var(--primary), var(--accent));
  box-shadow: 0 0 10px var(--primary-glow);
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  z-index: 2;
  border-radius: 4px;
}

.toc-list { list-style: none; padding: 0; margin: 0; }
.toc-list li { padding: 0.5rem 1.5rem; transition: color 0.3s ease; }
.toc-list li a { 
  color: var(--text-muted); 
  text-decoration: none; 
  font-size: 0.875rem; 
  display: block; 
  overflow: hidden; 
  text-overflow: ellipsis; 
  white-space: nowrap;
  transition: all 0.2s;
}

.toc-list li.active a { 
  color: var(--primary); 
  font-weight: 600; 
  padding-left: 4px;
}

/* Typography & Content Body */
.main-content { flex: 1; max-width: 820px; padding: 5rem 0; min-width: 0; }
.main-content.no-sidebar { margin: 0 auto; }

.breadcrumb-trail { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 2rem; }
.breadcrumb-link { text-decoration: none; color: inherit; }
.breadcrumb-sep { font-size: 0.75rem; opacity: 0.3; }

.article-header { margin-bottom: 4rem; }
.article-title { font-family: 'Bricolage Grotesque', sans-serif; font-size: 3.75rem; line-height: 1.1; margin-bottom: 1.5rem; letter-spacing: -0.04em; font-weight: 800; }
.tag-label { font-size: 0.75rem; color: var(--text-muted); background: var(--secondary); padding: 0.2rem 0.6rem; border-radius: 0.4rem; margin-right: 0.5rem; }

/* Manually restoring "Default" high-quality article styles */
.markdown-body {
  font-family: inherit;
  font-size: 1.125rem;
  line-height: 1.75;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4) {
  font-family: 'Bricolage Grotesque', sans-serif;
  color: var(--text);
  margin-top: 3.5rem;
  margin-bottom: 1.25rem;
  scroll-margin-top: 120px;
  line-height: 1.2;
}

.markdown-body :deep(h2) { font-size: 2rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
.markdown-body :deep(h3) { font-size: 1.5rem; }

.markdown-body :deep(p) { margin-bottom: 1.5rem; }
.markdown-body :deep(strong) { font-weight: 700; color: var(--text); }

.markdown-body :deep(code) {
  font-family: 'Fira Code', monospace;
  background: var(--secondary);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9em;
  color: var(--accent);
}

.markdown-body :deep(pre) {
  background: var(--secondary);
  padding: 1.5rem;
  border-radius: 1rem;
  margin: 2rem 0;
  overflow-x: auto;
  border: 1px solid var(--border);
}

.markdown-body :deep(pre code) {
  background: none;
  color: inherit;
  padding: 0;
}

.markdown-body :deep(ul), .markdown-body :deep(ol) {
  padding-left: 2rem;
  margin-bottom: 1.5rem;
}

.markdown-body :deep(li) {
  margin-bottom: 0.75rem;
}

.markdown-body :deep(blockquote) {
  border-left: 4px solid var(--primary);
  padding-left: 1.5rem;
  color: var(--text-muted);
  font-style: italic;
  margin: 2rem 0;
}

.markdown-body :deep(img) {
  max-width: 100%;
  border-radius: 1rem;
  margin: 2.5rem 0;
}

.not-found { text-align: center; padding: 6rem 0; }
.back-link { display: inline-block; margin-top: 2rem; padding: 0.8rem 1.5rem; border: 1px solid var(--border); border-radius: 0.8rem; text-decoration: none; color: var(--text); }

@media (max-width: 1024px) {
  .sidebar { display: none; }
}
</style>
