<template>
  <div class="blog-layout">
    <!-- Fluid background consistent with home/about/blog-index -->
    <div class="flux-bg">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="noise-overlay"></div>
    </div>

    <header class="header">
      <div class="container header-container">
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

    <div class="container page-container" :class="{ 'has-sidebar': tocLinks.length > 0 }">
      <!-- Sidebar TOC - Glassmorphic -->
      <aside v-if="tocLinks.length" class="sidebar">
        <div class="toc-wrapper glass-card">
          <div class="toc-header">
            <Icon name="lucide:list" class="toc-icon" />
            <span class="toc-title">Index</span>
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
                <a :href="`#${link.id}`" @click.prevent="scrollTo(link.id)" class="toc-link">
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
            <div class="header-meta">
              <NuxtLink to="/blog" class="back-link">
                <Icon name="lucide:chevron-left" />
                Back to Archive
              </NuxtLink>
            </div>
            <h1 class="article-title text-gradient">{{ article.title }}</h1>
            <div class="article-meta" v-if="getTags(article).length">
              <span v-for="tag in getTags(article)" :key="tag" class="tag-label">#{{ tag }}</span>
            </div>

            <!-- AI Summary System -->
            <AiSummary 
              v-if="article" 
              :content="JSON.stringify(article.body)" 
              :article-id="article.id" 
            />
          </header>
          
          <div class="article-body">
            <ContentRenderer :value="article" />
          </div>

          <ClientOnly>
            <CwdComments :slug="article.path" />
          </ClientOnly>
        </article>
        
        <div v-else class="not-found">
          <div class="empty-icon-wrapper">
            <Icon name="lucide:ghost" class="empty-icon" />
          </div>
          <h1>Knowledge lost in flux</h1>
          <p>The content you're looking for doesn't exist or has moved.</p>
          <NuxtLink to="/blog" class="cta-back">Return to Library</NuxtLink>
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

const { data: article } = await useAsyncData(`article-v18-premium-${route.path}`, async () => {
  const all = await queryCollection('content').all()
  
  const normalize = (p) => {
    if (!p) return ''
    try {
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

  let found = all.find(item => {
    const itemId = item.id.replace(/\.md$/, '').normalize('NFC')
    return itemId === relativeRoute || itemId === cleanRoute
  })

  if (!found) {
    found = all.find(item => {
      const itemPath = normalize(item.path)
      return itemPath === cleanRoute || itemPath === relativeRoute
    })
  }

  if (!found) {
    const routeStem = cleanRoute.split('/').pop()
    found = all.find(item => {
      const s = normalize(item.stem || item.path?.split('/').pop() || '')
      return s === routeStem || normalize(item.title) === routeStem
    })
  }

  return found || null
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
  opacity: 0.2;
  pointer-events: none;
}

.flux-bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(var(--border) 1px, transparent 1px);
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
  background: var(--primary);
  top: -10%;
  right: -5%;
  opacity: 0.6;
}

.blob-2 {
  width: 400px;
  height: 400px;
  background: var(--accent);
  bottom: -5%;
  left: 5%;
  animation-delay: -10s;
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
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(15px);
  z-index: 100;
  position: sticky;
  top: 0;
}

.header-container { display: flex; justify-content: space-between; align-items: center; }
.logo { font-family: 'Bricolage Grotesque', sans-serif; font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em; }
.nav { display: flex; gap: 2.5rem; align-items: center; }
.nav a { font-size: 0.9375rem; color: var(--text-muted); text-decoration: none; font-weight: 500; transition: color 0.2s; }
.nav a:hover { color: var(--text); }

.theme-toggle {
  background: var(--secondary);
  border: 1px solid var(--border);
  width: 36px;
  height: 36px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text);
  transition: transform 0.2s;
}
.theme-toggle:hover { transform: scale(1.1); }

/* LAYOUT */
.page-container {
  padding: 8rem 2rem;
  position: relative;
  z-index: 2;
}

.page-container.has-sidebar {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 6rem;
}

.sidebar {
  position: sticky;
  top: 8rem;
  height: fit-content;
}

.toc-wrapper {
  padding: 2rem;
  border-radius: 1rem;
}

.toc-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.toc-icon { color: var(--primary); font-size: 1.1rem; }
.toc-title { font-family: 'Bricolage Grotesque'; font-size: 0.75rem; text-transform: uppercase; font-weight: 800; letter-spacing: 0.1em; color: var(--text-muted); }

.toc { position: relative; border-left: 1px solid var(--border); }

.active-indicator {
  position: absolute;
  left: -1px;
  width: 2px;
  height: 28px;
  background: var(--primary);
  box-shadow: 0 0 10px var(--primary-glow);
  transition: transform 0.3s cubic-bezier(0.2, 1, 0.2, 1);
  border-radius: 4px;
}

.toc-list { list-style: none; padding: 0; margin: 0; }
.toc-list li { transition: all 0.2s; }
.toc-link { 
  display: block;
  padding: 0.5rem 1.25rem;
  color: var(--text-muted); 
  text-decoration: none; 
  font-size: 0.875rem; 
  transition: all 0.2s;
}

.toc-list li.active .toc-link { color: var(--primary); font-weight: 700; background: var(--primary-glow); border-radius: 0 8px 8px 0; }

/* CONTENT */
.main-content { min-width: 0; }
.main-content.no-sidebar { max-width: 820px; margin: 0 auto; }

.article-header { margin-bottom: 5rem; }
.header-meta { margin-bottom: 2rem; }
.back-link { 
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-muted);
  font-size: 0.875rem;
  font-weight: 600;
  transition: color 0.2s;
}
.back-link:hover { color: var(--primary); }

.article-title { 
  font-family: 'Bricolage Grotesque', sans-serif; 
  font-size: 4.5rem; 
  line-height: 1.1; 
  margin-bottom: 2rem; 
  font-weight: 800; 
  letter-spacing: -0.04em;
}

.text-gradient {
  background: linear-gradient(135deg, var(--text) 40%, var(--primary) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.tag-label { 
  font-size: 0.75rem; 
  font-weight: 700;
  color: var(--primary); 
  background: var(--primary-glow); 
  padding: 0.3rem 0.8rem; 
  border-radius: 0.5rem; 
  margin-right: 0.6rem; 
}

/* BODY TYPOGRAPHY */
.article-body {
  font-size: 1.1875rem;
  line-height: 1.8;
  color: var(--text);
}

.article-body :deep(h1),
.article-body :deep(h2),
.article-body :deep(h3) {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  color: var(--text);
  margin-top: 5rem;
  margin-bottom: 2rem;
  scroll-margin-top: 120px;
  letter-spacing: -0.02em;
}

.article-body :deep(h2) { font-size: 2.25rem; border-bottom: 1px solid var(--border); padding-bottom: 0.75rem; }
.article-body :deep(h3) { font-size: 1.625rem; }

.article-body :deep(p) { margin-bottom: 2rem; opacity: 0.9; }

.article-body :deep(blockquote) {
  border-left: 5px solid var(--primary);
  background: var(--secondary);
  padding: 2.5rem 3rem;
  border-radius: 0 0.8rem 0.8rem 0;
  font-style: italic;
  margin: 3.5rem 0;
  color: var(--text-muted);
}

.article-body :deep(code:not(pre code)) {
  background: var(--secondary);
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.9em;
  color: var(--accent);
  font-weight: 600;
}

.article-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.8rem;
  box-shadow: var(--card-shadow);
  margin: 2rem auto;
  display: block;
}

.article-body :deep(figure) {
  margin: 2.5rem 0;
  text-align: center;
}

.article-body :deep(figcaption) {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-top: 0.75rem;
  font-style: italic;
}

.article-body :deep(iframe) {
  max-width: 100%;
  border-radius: 0.8rem;
  margin: 2rem auto;
  display: block;
}

/* UTILS */
/* Using global .glass-card */

.empty-icon-wrapper {
  width: 100px;
  height: 100px;
  background: var(--secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2.5rem;
}
.empty-icon { font-size: 3rem; opacity: 0.3; }

.not-found { text-align: center; padding: 10rem 0; }
.cta-back {
  display: inline-block;
  margin-top: 3rem;
  padding: 1rem 2.5rem;
  background: var(--primary);
  color: white;
  border-radius: 1rem;
  text-decoration: none;
  font-weight: 800;
}

@media (max-width: 1024px) {
  .page-container { grid-template-columns: 1fr; padding-top: 4rem; }
  .sidebar { display: none; }
  .article-title { font-size: 3rem; }
}
</style>
