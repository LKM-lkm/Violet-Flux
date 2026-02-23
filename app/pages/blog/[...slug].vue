<template>
  <div class="blog-layout">
    <!-- 背景效果 -->
    <div class="flux-bg">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="noise-overlay"></div>
    </div>

    <!-- 头部导航 -->
    <header class="header">
      <div class="container header-container">
        <NuxtLink to="/" class="logo">Violet Flux</NuxtLink>
        <nav class="nav">
          <NuxtLink to="/" class="nav-link">Home</NuxtLink>
          <NuxtLink to="/blog" class="nav-link">Blog</NuxtLink>
          <NuxtLink to="/about" class="nav-link">About</NuxtLink>
          <button @click="toggleDark()" class="theme-toggle" aria-label="Toggle theme">
            <Icon :name="isDark ? 'lucide:sun' : 'lucide:moon'" />
          </button>
        </nav>
        
        <!-- 移动端菜单按钮 -->
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="mobile-menu-btn">
          <Icon :name="mobileMenuOpen ? 'lucide:x' : 'lucide:menu'" />
        </button>
      </div>
      
      <!-- 移动端菜单 -->
      <Transition name="mobile-menu">
        <div v-if="mobileMenuOpen" class="mobile-menu">
          <NuxtLink to="/" class="mobile-nav-link" @click="mobileMenuOpen = false">Home</NuxtLink>
          <NuxtLink to="/blog" class="mobile-nav-link" @click="mobileMenuOpen = false">Blog</NuxtLink>
          <NuxtLink to="/about" class="mobile-nav-link" @click="mobileMenuOpen = false">About</NuxtLink>
        </div>
      </Transition>
    </header>

    <div class="container page-container" :class="{ 'has-sidebar': tocLinks.length > 0 }">
      <!-- 侧边栏目录 -->
      <ClientOnly>
        <aside v-if="tocLinks.length" class="sidebar">
          <div class="toc-wrapper glass-card">
            <div class="toc-header">
              <Icon name="lucide:list" class="toc-icon" />
              <span class="toc-title">目录</span>
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
                  :class="{ active: activeId === link.id }"
                  :style="{ paddingLeft: `${(link.depth - 1) * 0.75}rem` }"
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
      </ClientOnly>

      <!-- 主内容区 -->
      <main class="main-content" :class="{ 'no-sidebar': !tocLinks.length }">
        <article v-if="article">
          <header class="article-header">
            <div class="header-meta">
              <NuxtLink to="/blog" class="back-link">
                <Icon name="lucide:chevron-left" />
                返回文章列表
              </NuxtLink>
            </div>
            <h1 class="article-title">{{ article.title }}</h1>
            <div class="article-meta" v-if="getTags(article).length">
              <span v-for="tag in getTags(article)" :key="tag" class="tag-label">
                #{{ tag }}
              </span>
            </div>

            <!-- AI 摘要 -->
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
          <h1>内容未找到</h1>
          <p>您查找的内容不存在或已移动</p>
          <NuxtLink to="/blog" class="btn btn-primary">返回博客</NuxtLink>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { isDark, toggleDark } from '~/composables/useTheme'

const activeId = ref('')
const indicatorOffset = ref(0)
const mobileMenuOpen = ref(false)
const route = useRoute()

const { data: article } = await useAsyncData(`article-v19-${route.path}`, async () => {
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
      top: el.offsetTop - 100,
      behavior: 'smooth'
    })
  }
}

const updateActiveHeading = () => {
  const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
  const scrollPosition = window.scrollY + 150
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

// 关闭移动菜单当路由改变
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})
</script>

<style scoped>
.blog-layout {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  position: relative;
}

/* === 背景效果 === */
.flux-bg {
  position: fixed;
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

/* === 头部导航 === */
.header {
  height: 70px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border-light);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  background: var(--glass-bg);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04),
              inset 0 -1px 0 rgba(255, 255, 255, 0.1);
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
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 800;
  letter-spacing: -0.02em;
  text-decoration: none;
  color: var(--text-primary);
  transition: color var(--duration-fast);
}

.logo:hover {
  color: var(--primary);
}

.nav {
  display: flex;
  gap: var(--space-lg);
  align-items: center;
}

.nav-link {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--duration-fast);
  position: relative;
}

.nav-link:hover {
  color: var(--text-primary);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary);
  transition: width var(--duration-normal);
}

.nav-link:hover::after {
  width: 100%;
}

.theme-toggle {
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  transition: all var(--duration-fast);
}

.theme-toggle:hover {
  transform: scale(1.05);
  border-color: var(--border-medium);
}

/* === 移动端菜单 === */
.mobile-menu-btn {
  display: none;
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  font-size: var(--text-lg);
}

.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--border-light);
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.mobile-nav-link {
  padding: var(--space-sm) var(--space-md);
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  border-radius: var(--radius-md);
  transition: all var(--duration-fast);
}

.mobile-nav-link:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all var(--duration-normal) var(--ease-out);
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* === 布局 === */
.page-container {
  padding: var(--space-3xl) var(--space-lg);
  position: relative;
  z-index: 2;
}

.page-container.has-sidebar {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: var(--space-3xl);
  align-items: start;
}

/* === 侧边栏 === */
.sidebar {
  position: sticky;
  top: calc(70px + var(--space-lg));
  height: fit-content;
  max-height: calc(100vh - 70px - var(--space-2xl));
  overflow-y: auto;
}

.toc-wrapper {
  padding: var(--space-lg);
  position: relative;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--card-shadow),
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.toc-wrapper::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at top right,
    rgba(112, 26, 69, 0.05) 0%,
    rgba(157, 23, 77, 0.03) 35%,
    transparent 65%
  );
  opacity: 0.5;
  border-radius: var(--radius-xl);
  pointer-events: none;
}

.toc-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--border-light);
}

.toc-icon {
  color: var(--primary);
  font-size: var(--text-lg);
}

.toc-title {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
}

.toc {
  position: relative;
}

.active-indicator {
  position: absolute;
  left: 0;
  width: 3px;
  height: 24px;
  background: linear-gradient(
    180deg, 
    var(--primary) 0%,
    var(--primary-hover) 100%
  );
  box-shadow: 0 0 8px var(--primary-glow);
  transition: transform var(--duration-normal) var(--ease-out);
  border-radius: var(--radius-sm);
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-link {
  display: block;
  padding: var(--space-xs) var(--space-sm);
  padding-left: var(--space-md);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--text-sm);
  line-height: 1.5;
  transition: all var(--duration-fast);
  border-radius: var(--radius-sm);
}

.toc-link:hover {
  color: var(--text-primary);
  background: var(--bg-secondary);
}

.toc-list li.active .toc-link {
  color: var(--primary);
  font-weight: 600;
}

/* === 主内容 === */
.main-content {
  min-width: 0;
}

.main-content.no-sidebar {
  max-width: 800px;
  margin: 0 auto;
}

/* === 文章头部 === */
.article-header {
  margin-bottom: var(--space-3xl);
}

.header-meta {
  margin-bottom: var(--space-lg);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  text-decoration: none;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: 600;
  transition: all var(--duration-fast);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
}

.back-link:hover {
  color: var(--primary);
  background: var(--bg-secondary);
}

.article-title {
  font-family: var(--font-display);
  font-size: var(--text-6xl);
  line-height: 1.1;
  margin-bottom: var(--space-lg);
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(
    135deg, 
    var(--text-primary) 0%,
    var(--primary) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
}

.article-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 140px;
  height: 3px;
  background: linear-gradient(
    90deg, 
    var(--primary) 0%,
    var(--primary-hover) 50%,
    transparent 100%
  );
  border-radius: var(--radius-sm);
  box-shadow: 0 0 12px var(--primary-glow);
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-top: var(--space-md);
}

.tag-label {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--primary);
  background: var(--primary-light);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-light);
  backdrop-filter: blur(8px);
  transition: all var(--duration-fast);
  position: relative;
  overflow: hidden;
}

.tag-label::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s;
}

.tag-label:hover {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
  box-shadow: 0 4px 12px var(--primary-glow);
  transform: translateY(-2px);
}

.tag-label:hover::before {
  left: 100%;
}

/* === 文章内容 === */
.article-body {
  font-size: var(--text-lg);
  line-height: 1.8;
  color: var(--text-primary);
}

.article-body :deep(h1),
.article-body :deep(h2),
.article-body :deep(h3),
.article-body :deep(h4) {
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--text-primary);
  margin-top: var(--space-3xl);
  margin-bottom: var(--space-lg);
  scroll-margin-top: 100px;
  letter-spacing: -0.02em;
  line-height: 1.3;
}

.article-body :deep(h2) {
  font-size: var(--text-4xl);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--border-light);
}

.article-body :deep(h3) {
  font-size: var(--text-3xl);
}

.article-body :deep(h4) {
  font-size: var(--text-2xl);
}

.article-body :deep(p) {
  margin-bottom: var(--space-lg);
  color: var(--text-primary);
}

.article-body :deep(a) {
  color: var(--primary);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all var(--duration-fast);
  position: relative;
  background: linear-gradient(
    to right,
    var(--primary-glow),
    var(--primary-glow)
  );
  background-size: 0% 100%;
  background-repeat: no-repeat;
  background-position: left bottom;
}

.article-body :deep(a:hover) {
  border-bottom-color: var(--primary);
  background-size: 100% 100%;
  color: var(--primary-hover);
  text-shadow: 0 0 8px var(--primary-glow);
}

.article-body :deep(blockquote) {
  border-left: 4px solid var(--primary);
  background: linear-gradient(
    135deg,
    var(--bg-secondary) 0%,
    rgba(112, 26, 69, 0.04) 40%,
    rgba(157, 23, 77, 0.06) 70%,
    rgba(157, 23, 77, 0.08) 100%
  );
  padding: var(--space-lg) var(--space-xl);
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
  font-style: italic;
  margin: var(--space-xl) 0;
  color: var(--text-secondary);
  box-shadow: var(--shadow-md),
              inset 4px 0 0 var(--primary);
  position: relative;
  overflow: hidden;
}

.article-body :deep(blockquote)::before {
  content: '"';
  position: absolute;
  top: -10px;
  left: 20px;
  font-size: 80px;
  color: var(--primary);
  opacity: 0.08;
  font-family: Georgia, serif;
  line-height: 1;
}

.article-body :deep(blockquote)::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 140px;
  height: 140px;
  background: radial-gradient(
    circle at bottom right,
    var(--primary-light),
    transparent 70%
  );
  opacity: 0.6;
  pointer-events: none;
}

.article-body :deep(code:not(pre code)) {
  background: var(--bg-secondary);
  padding: 0.2em 0.4em;
  border-radius: var(--radius-sm);
  font-size: 0.9em;
  color: var(--primary);
  font-weight: 500;
  font-family: var(--font-mono);
  border: 1px solid var(--border-light);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.article-body :deep(pre) {
  background: var(--code-bg);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  margin: var(--space-xl) 0;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: 1.7;
  box-shadow: var(--shadow-md),
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
  position: relative;
  white-space: pre; /* 保留换行和空格 */
}

.article-body :deep(pre code) {
  background: transparent;
  padding: 0;
  border: none;
  font-size: inherit;
  font-weight: normal;
  display: block;
  color: var(--code-text);
  white-space: pre; /* 保留换行和空格 */
  overflow-wrap: normal;
  word-break: normal;
}

/* Shiki 语法高亮样式 */
.article-body :deep(pre code .line) {
  display: block; /* 改为 block 确保换行 */
  min-height: 1.5em;
  line-height: 1.7;
}

/* 确保 Shiki 的 token 样式正常显示 */
.article-body :deep(pre code span) {
  font-family: inherit;
}

/* 如果没有高亮，至少保证可读性 */
.article-body :deep(pre code:not([class*="language-"])) {
  color: var(--code-text);
}

.article-body :deep(pre)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--primary-glow),
    transparent
  );
}

.article-body :deep(ul),
.article-body :deep(ol) {
  margin: var(--space-lg) 0;
  padding-left: var(--space-xl);
  list-style-position: outside;
}

.article-body :deep(ul) {
  list-style-type: disc;
}

.article-body :deep(ol) {
  list-style-type: decimal;
}

.article-body :deep(li) {
  margin-bottom: var(--space-sm);
  padding-left: var(--space-xs);
}

.article-body :deep(ul ul) {
  list-style-type: circle;
  margin-top: var(--space-xs);
}

.article-body :deep(ul ul ul) {
  list-style-type: square;
}

.article-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg),
              0 0 40px var(--primary-glow);
  margin: var(--space-xl) auto;
  display: block;
  border: 1px solid var(--border-light);
  transition: all var(--duration-normal);
}

.article-body :deep(img:hover) {
  transform: scale(1.02);
  box-shadow: var(--shadow-2xl),
              0 0 60px var(--primary-glow);
}

.article-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: var(--space-xl) 0;
  font-size: var(--text-base);
}

.article-body :deep(th),
.article-body :deep(td) {
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--border-light);
  text-align: left;
}

.article-body :deep(th) {
  background: var(--bg-secondary);
  font-weight: 600;
  color: var(--text-primary);
}

/* === 404 页面 === */
.not-found {
  text-align: center;
  padding: var(--space-3xl) 0;
}

.empty-icon-wrapper {
  width: 100px;
  height: 100px;
  background: var(--bg-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-xl);
}

.empty-icon {
  font-size: 3rem;
  opacity: 0.3;
}

.not-found h1 {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  margin-bottom: var(--space-md);
}

.not-found p {
  color: var(--text-secondary);
  margin-bottom: var(--space-xl);
}

/* === 响应式设计 === */
@media (max-width: 1024px) {
  .page-container.has-sidebar {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }
  
  .sidebar {
    position: relative;
    top: 0;
    max-height: none;
    order: 2;
  }
  
  .main-content {
    order: 1;
  }
  
  .article-title {
    font-size: var(--text-5xl);
  }
}

@media (max-width: 768px) {
  .nav {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .page-container {
    padding: var(--space-2xl) var(--space-md);
  }
  
  .article-title {
    font-size: var(--text-4xl);
  }
  
  .article-body {
    font-size: var(--text-base);
  }
  
  .article-body :deep(h2) {
    font-size: var(--text-3xl);
  }
  
  .article-body :deep(h3) {
    font-size: var(--text-2xl);
  }
  
  .sidebar {
    display: none;
  }
  
  .toc-wrapper {
    padding: var(--space-md);
  }
}

@media (max-width: 640px) {
  .header {
    height: 60px;
  }
  
  .logo {
    font-size: var(--text-lg);
  }
  
  .article-title {
    font-size: var(--text-3xl);
  }
  
  .page-container {
    padding: var(--space-xl) var(--space-sm);
  }
  
  .article-body :deep(blockquote) {
    padding: var(--space-md) var(--space-lg);
  }
  
  .article-body :deep(pre) {
    font-size: var(--text-xs);
    padding: var(--space-md);
  }
}
</style>
