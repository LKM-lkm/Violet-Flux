<template>
  <div class="prose-img-wrapper">
    <img 
      :src="resolvedSrc" 
      :alt="alt" 
      :title="title" 
      class="prose-img"
      loading="lazy"
    />
    <span v-if="alt" class="image-caption">{{ alt }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
})

const route = useRoute()

const resolvedSrc = computed(() => {
  if (!props.src) return ''
  
  // If it's already an absolute URL or a direct root path, leave it be
  if (props.src.startsWith('http') || props.src.startsWith('/') || props.src.startsWith('data:')) {
    return props.src
  }

  // Handle Obsidian-style WikiLink images (just a filename, or starts with assets/)
  // We resolve them relative to the current blog post directory
  const currentPath = route.path || ''
  const cleanRoutePath = decodeURIComponent(currentPath.replace(/\/$/, ''))
  const segments = cleanRoutePath.split('/').filter(Boolean)
  
  // Remove 'blog' prefix if it exists to match the folder structure in content/blog
  const baseSegments = segments.filter(s => s !== 'blog')
  
  // Remove the last segment (the slug/filename of the post) to get the directory
  baseSegments.pop()
  
  // Clean up the src
  let cleanSrc = decodeURIComponent(props.src).replace(/^\.\//, '')
  
  // WIKILINK FIX: If it's just a filename (no slash), assume it's in an 'assets' folder
  if (!cleanSrc.includes('/') && !cleanSrc.startsWith('assets/')) {
    cleanSrc = `assets/${cleanSrc}`
  }
  
  // Join segments and encode URIs for the final path
  const fullPath = `/_blog_assets/${baseSegments.join('/')}/${cleanSrc}`.replace(/\/+/g, '/')
  
  // We MUST encode the final URI because it likely contains Chinese
  return encodeURI(fullPath)
})
</script>

<style scoped>
.prose-img-wrapper {
  margin: 3.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.prose-img {
  max-width: 100%;
  height: auto;
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border);
  transition: transform 0.3s ease;
}

.prose-img:hover {
  transform: scale(1.01);
}

.image-caption {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: var(--text-muted);
  font-style: italic;
  text-align: center;
}

/* Dark mode adjustment for excessive brightness */
:root.dark .prose-img {
  opacity: 0.9;
  filter: brightness(0.9) contrast(1.1);
}
</style>
