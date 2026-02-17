<template>
  <div class="home">
    <header class="header">
      <div class="container">
        <h1 class="logo">Violet Flux</h1>
        <nav class="nav">
          <a href="/about">About</a>
          <a href="/blog">Blog</a>
          <button @click="toggleTheme" class="theme-toggle">
            <Icon :name="isDark ? 'lucide:sun' : 'lucide:moon'" />
          </button>
        </nav>
      </div>
    </header>

    <main class="hero">
      <h1 class="title">Violet Flux</h1>
      <p class="subtitle">A modern blog built with Nuxt Content</p>
      <div class="buttons">
        <a href="/blog" class="btn btn-primary">Read Blog</a>
        <a href="/about" class="btn btn-secondary">About Me</a>
      </div>
    </main>

    <footer class="footer">
      <p>&copy; {{ currentYear }} Violet Flux. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
const isDark = ref(false)
const currentYear = new Date().getFullYear();

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark')
}

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.header,
.hero,
.footer {
  position: relative;
  z-index: 1;
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

.hero {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 4rem 2rem;
}

.title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 5rem;
  font-weight: 800;
  margin: 0 0 1rem;
  background: linear-gradient(135deg, var(--text) 0%, var(--primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: fadeInUp 0.8s ease-out;
}

.subtitle {
  font-size: 1.5rem;
  color: var(--text-muted);
  margin: 0 0 2rem;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.buttons {
  display: flex;
  gap: 1.5rem;
  animation: fadeInUp 0.8s ease-out 0.4s both;
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

.btn {
  padding: 0.875rem 2.5rem;
  border-radius: 0.75rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary {
  background: var(--primary);
  color: white;
  box-shadow: 0 10px 20px -5px var(--primary-glow);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -5px var(--primary-glow);
}

.btn-secondary {
  background: var(--secondary);
  color: var(--text);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  background: rgba(128, 128, 128, 0.05);
  transform: translateY(-2px);
}

.footer {
  padding: 2rem;
  text-align: center;
  border-top: 1px solid var(--border);
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1.25rem;
  }
  
  .buttons {
    flex-direction: column;
  }
}
</style>
