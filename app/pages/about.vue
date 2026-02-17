<template>
  <div class="about-layout">
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

    <main class="container about-content">
      <section class="hero">
        <h1 class="title">About Violet Flux</h1>
        <p class="subtitle">A digital garden for thought, code, and creativity.</p>
      </section>

      <section class="details">
        <div class="card">
          <h2>The Vision</h2>
          <p>
            Violet Flux is more than just a blog. It's a high-performance digital garden designed to showcase 
            mathematical beauty through MathJax v4 and a seamless reading experience powered by Nuxt 4.
          </p>
        </div>
        
        <div class="card">
          <h2>Technology</h2>
          <ul>
            <li><strong>Nuxt 4:</strong> The modern web framework for Vue.</li>
            <li><strong>MathJax v4:</strong> Providing state-of-the-art LaTeX rendering.</li>
            <li><strong>Obsidian Sync:</strong> My creative workflow starts in Obsidian and flows here.</li>
            <li><strong>Glassmorphism:</strong> A design aesthetic that feels alive and deep.</li>
          </ul>
        </div>
      </section>
    </main>

    <footer class="footer">
      <p>&copy; {{ new Date().getFullYear() }} Violet Flux. All rights reserved.</p>
    </footer>
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
.about-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--border);
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
}

.logo {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
}

.nav {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9375rem;
  transition: color 0.2s;
}

.nav a.router-link-active {
  color: var(--primary);
  font-weight: 600;
}

.hero {
  padding: 6rem 0 4rem;
  text-align: center;
}

.title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--text) 0%, var(--primary) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.5rem;
  color: var(--text-muted);
}

.details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 6rem;
}

.card {
  padding: 2.5rem;
  border-radius: 1.5rem;
  background: rgba(128, 128, 128, 0.03);
  border: 1px solid var(--border);
}

.card h2 {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 1.75rem;
  margin-bottom: 1.25rem;
}

.card p, .card li {
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--text-muted);
}

.card ul {
  padding-left: 1.25rem;
}

.card li {
  margin-bottom: 0.75rem;
}

.footer {
  padding: 4rem 0;
  text-align: center;
  border-top: 1px solid var(--border);
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .details { grid-template-columns: 1fr; }
  .title { font-size: 2.5rem; }
}
</style>
