<template>
  <div class="blog-layout">
    <header class="header">
      <div class="container">
        <h1 class="logo">Violet Flux</h1>
        <nav class="nav">
          <a href="/">Home</a>
          <a href="/blog">Blog</a>
          <a href="/about">About</a>
          <button @click="toggleTheme" class="theme-toggle">
            <Icon :name="isDark ? 'lucide:sun' : 'lucide:moon'" />
          </button>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <article v-if="article">
        <h1>{{ article.title }}</h1>
        <p class="description">{{ article.description }}</p>
        <ContentRenderer :value="article" />
      </article>
      <div v-else class="not-found">
        <h1>Article not found</h1>
        <NuxtLink to="/blog">Back to blog</NuxtLink>
      </div>
    </main>
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
})

const { data: article } = await useAsyncData(`article-${route.path}`, async () => {
  const all = await queryCollection('content').all()
  return all.find(item => item.path === route.path)
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
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.main-content {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 4rem 2rem;
  box-sizing: border-box;
}

.main-content article h1 {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 2.5rem;
  margin: 0 0 1rem;
}

.description {
  color: var(--text-muted);
  font-size: 1.125rem;
  margin-bottom: 3rem;
}

.main-content :deep(h2) {
  font-size: 1.75rem;
  margin: 2.5rem 0 1rem;
}

.main-content :deep(h3) {
  font-size: 1.25rem;
  margin: 2rem 0 0.75rem;
}

.main-content :deep(p) {
  line-height: 1.7;
  margin-bottom: 1.25rem;
}

.main-content :deep(code) {
  background: rgba(128, 128, 128, 0.1);
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.main-content :deep(pre) {
  background: rgba(128, 128, 128, 0.1);
  padding: 1.5rem;
  border-radius: 0.75rem;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.main-content :deep(pre code) {
  background: none;
  padding: 0;
}

.main-content :deep(strong) {
  font-weight: 600;
}

.main-content :deep(em) {
  font-style: italic;
}
</style>
