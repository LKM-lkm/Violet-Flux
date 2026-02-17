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
      
      <div class="search-wrapper">
        <Icon name="lucide:search" class="search-icon" />
        <input v-model="search" type="text" placeholder="Search articles..." class="search-input" />
      </div>

      <div v-if="filteredArticles?.length" class="articles">
        <article v-for="article in filteredArticles" :key="article.path" class="article-card">
          <NuxtLink :to="article.path">
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

const { data: articles } = await useAsyncData('blog-articles', async () => {
  return await queryContent('/blog').find()
})

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
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 2rem;
  flex: 1;
  box-sizing: border-box;
}

.blog-list h1 {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 3rem;
  margin-bottom: 2rem;
}

.search-wrapper {
  position: relative;
  width: 100%;
  margin-bottom: 3rem !important;
}

.search-icon {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 1rem 1.25rem 1rem 3rem;
  border: 1px solid rgba(128, 128, 128, 0.2);
  border-radius: 0.75rem;
  background: transparent;
  color: var(--text);
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: rgba(128, 128, 128, 0.4);
}

.no-results {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-muted);
}

.articles {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.article-card {
  transition: transform 0.2s;
}

.article-card:hover {
  transform: translateY(-2px);
}

.article-card a {
  display: block;
  padding: 2rem;
  text-decoration: none;
  color: var(--text);
  border: 1px solid rgba(128, 128, 128, 0.15);
  border-radius: 0.75rem;
  background: transparent;
  transition: border-color 0.2s, background 0.2s;
}

.article-card a:hover {
  border-color: rgba(128, 128, 128, 0.3);
  background: rgba(128, 128, 128, 0.05);
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
