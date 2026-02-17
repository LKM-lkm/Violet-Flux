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
      <aside v-if="article?.body?.toc?.links?.length" class="sidebar">
        <div class="toc-wrapper">
          <h3>Table of Contents</h3>
          <nav class="toc">
            <ul>
              <li v-for="link in article.body.toc.links" :key="link.id" :class="`depth-${link.depth}`">
                <a :href="`#${link.id}`">{{ link.text }}</a>
                <ul v-if="link.children">
                  <li v-for="child in link.children" :key="child.id" class="depth-3">
                    <a :href="`#${child.id}`">{{ child.text }}</a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <main class="main-content" :class="{ 'no-sidebar': !article?.body?.toc?.links?.length }">
        <article v-if="article">
          <header class="article-header">
            <h1>{{ article.title }}</h1>
            <p v-if="article.description" class="description">{{ article.description }}</p>
          </header>
          <ContentRenderer :value="article" />
        </article>
        <div v-else class="not-found">
          <h1>Article not found</h1>
          <NuxtLink to="/blog">Back to blog</NuxtLink>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark')
}

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
  
  // Re-trigger MathJax if it exists
  if (window.MathJax && window.MathJax.typesetPromise) {
    setTimeout(() => {
      window.MathJax.typesetPromise()
    }, 500)
  }
})

const { data: article } = await useAsyncData(`article-${route.path}`, async () => {
  const all = await queryCollection('content').all()
  // Match path, handling potential double/triple slashes in the data
  return all.find(item => {
    const normalizedItemPath = item.path?.replace(/\/+/g, '/')
    const normalizedRoutePath = route.path.replace(/\/+/g, '/')
    return normalizedItemPath === normalizedRoutePath
  })
})
</script>

<style scoped>
.blog-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background: var(--bg);
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
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.nav {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav a {
  color: var(--text);
  text-decoration: none;
  transition: opacity 0.2s;
}

.nav a:hover {
  opacity: 0.7;
}

.theme-toggle {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  color: var(--text);
}

.page-container {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  position: relative;
  padding: 0 2rem;
  box-sizing: border-box;
}

.sidebar {
  width: 280px;
  position: sticky;
  top: 6rem;
  height: calc(100vh - 8rem);
  padding-top: 4rem;
  overflow-y: auto;
  border-right: 1px solid var(--border);
  margin-right: 2rem;
}

.toc-wrapper h3 {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.toc ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc li {
  margin-bottom: 0.75rem;
}

.toc a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9375rem;
  transition: color 0.2s;
  display: block;
}

.toc a:hover {
  color: var(--text);
}

.depth-3 {
  padding-left: 1.25rem;
  font-size: 0.875rem;
}

.main-content {
  flex: 1;
  max-width: 800px;
  padding: 4rem 0;
  min-width: 0;
}

.main-content.no-sidebar {
  margin: 0 auto;
}

.article-header {
  margin-bottom: 3rem;
}

.article-header h1 {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 3rem;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.description {
  color: var(--text-muted);
  font-size: 1.25rem;
  margin: 0;
}

.main-content :deep(h2) {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 2rem;
  margin: 3rem 0 1.5rem;
  scroll-margin-top: 6rem;
}

.main-content :deep(h3) {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 1.5rem;
  margin: 2.5rem 0 1rem;
  scroll-margin-top: 6rem;
}

.main-content :deep(p) {
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-size: 1.125rem;
}

.main-content :deep(code) {
  background: rgba(128, 128, 128, 0.1);
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.9em;
}

.main-content :deep(pre) {
  background: rgba(128, 128, 128, 0.05);
  padding: 1.5rem;
  border-radius: 0.75rem;
  overflow-x: auto;
  margin: 2rem 0;
  border: 1px solid var(--border);
}

@media (max-width: 1024px) {
  .sidebar {
    display: none;
  }
  .page-container {
    padding: 0 1.5rem;
  }
}
</style>

