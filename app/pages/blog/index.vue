<template>
  <div class="blog-layout">
    <header class="header">
      <div class="container">
        <h1 class="logo">Violet Flux</h1>
        <nav class="nav">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <button @click="toggleTheme" class="theme-toggle">
            <Icon :name="isDark ? 'lucide:sun' : 'lucide:moon'" />
          </button>
        </nav>
      </div>
    </header>

    <main class="blog-list">
      <h1>Blog</h1>
      
      <div class="debug">
        <p>Articles count: {{ articles?.length || 0 }}</p>
        <pre>{{ JSON.stringify(articles, null, 2) }}</pre>
      </div>

      <div class="search-box">
        <Icon name="lucide:search" />
        <input v-model="search" type="text" placeholder="Search articles..." />
      </div>

      <div v-if="filteredArticles?.length" class="articles">
        <article v-for="article in filteredArticles" :key="article._path" class="article-card">
          <NuxtLink :to="article._path">
            <h2>{{ article.title }}</h2>
            <p>{{ article.description }}</p>
          </NuxtLink>
        </article>
      </div>
      
      <div v-else-if="articles?.length" class="no-results">
        <p>No articles match your search</p>
      </div>
      
      <div v-else class="no-results">
        <p>No articles found. Create one in <code>content/blog/</code></p>
      </div>
    </main>
  </div>
</template>

<script setup>
const isDark = ref(false)
const search = ref('')

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark')
}

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
})

const { data: articles } = await useAsyncData('articles', () => 
  queryCollection('content').all()
)

const filteredArticles = computed(() => {
  if (!articles.value) return []
  if (!search.value) return articles.value
  return articles.value.filter(article => 
    article.title?.toLowerCase().includes(search.value.toLowerCase()) ||
    article.description?.toLowerCase().includes(search.value.toLowerCase())
  )
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
  max-width: 1200px;
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

.blog-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 2rem;
  flex: 1;
}

.blog-list h1 {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 3rem;
  margin-bottom: 2rem;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  margin-bottom: 3rem;
}

.search-box input {
  flex: 1;
  border: none;
  background: none;
  color: var(--text);
  font-size: 1rem;
  outline: none;
}

.search-box input::placeholder {
  color: var(--text-muted);
}

.no-results {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-muted);
}

.debug {
  background: var(--secondary);
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.875rem;
  overflow-x: auto;
}

.articles {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.article-card {
  padding: 2rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.article-card:hover {
  border-color: var(--text);
}

.article-card a {
  text-decoration: none;
  color: var(--text);
}

.article-card h2 {
  font-size: 1.5rem;
  margin: 0 0 0.5rem;
}

.article-card p {
  color: var(--text-muted);
  margin: 0;
}
</style>
