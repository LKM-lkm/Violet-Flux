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

    <div class="content-wrapper">
      <aside class="sidebar">
        <h3>Articles</h3>
        <nav>
          <ContentNavigation v-slot="{ navigation }">
            <ul>
              <li v-for="link in navigation" :key="link._path">
                <NuxtLink :to="link._path">{{ link.title }}</NuxtLink>
              </li>
            </ul>
          </ContentNavigation>
        </nav>
      </aside>

      <main class="main-content">
        <ContentDoc>
          <template #default="{ doc }">
            <article>
              <h1>{{ doc.title }}</h1>
              <ContentRenderer :value="doc" />
            </article>
          </template>
          <template #not-found>
            <div class="not-found">
              <h1>No articles yet</h1>
              <p>Create your first article in <code>content/blog/</code></p>
            </div>
          </template>
        </ContentDoc>
      </main>

      <aside class="toc">
        <h3>On this page</h3>
        <ContentDoc v-slot="{ doc }">
          <nav v-if="doc.body?.toc?.links">
            <ul>
              <li v-for="link in doc.body.toc.links" :key="link.id">
                <a :href="`#${link.id}`">{{ link.text }}</a>
              </li>
            </ul>
          </nav>
        </ContentDoc>
      </aside>
    </div>
  </div>
</template>

<script setup>
const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark')
}

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
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
  display: grid;
  grid-template-columns: 250px 1fr 200px;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  flex: 1;
}

.sidebar {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.sidebar h3,
.toc h3 {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sidebar ul,
.toc ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li,
.toc li {
  margin-bottom: 0.5rem;
}

.sidebar a,
.toc a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.sidebar a:hover,
.toc a:hover {
  color: var(--text);
}

.main-content {
  max-width: 800px;
}

.main-content article {
  animation: fadeInUp 0.6s ease-out;
}

.main-content h1 {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 2.5rem;
  margin: 0 0 2rem;
}

.main-content :deep(h2) {
  font-size: 1.75rem;
  margin: 2rem 0 1rem;
}

.main-content :deep(h3) {
  font-size: 1.25rem;
  margin: 1.5rem 0 0.75rem;
}

.main-content :deep(p) {
  line-height: 1.7;
  margin-bottom: 1rem;
}

.main-content :deep(code) {
  background: var(--secondary);
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.main-content :deep(pre) {
  background: var(--secondary);
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.toc {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.not-found {
  text-align: center;
  padding: 4rem 2rem;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  .content-wrapper {
    grid-template-columns: 200px 1fr;
  }
  
  .toc {
    display: none;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    position: static;
  }
}
</style>
