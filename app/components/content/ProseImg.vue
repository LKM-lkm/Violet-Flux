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
  if (props.src.startsWith('http') || props.src.startsWith('data:')) {
    return props.src
  }
  
  // If it starts with /, it's already a root path
  if (props.src.startsWith('/')) {
    return props.src
  }

  // Handle Obsidian-style WikiLink images (just a filename, or starts with assets/)
  // We resolve them relative to the current blog post directory
  const currentPath = route.path || ''
  const cleanRoutePath = decodeURIComponent(currentPath.replace(/\/$/, ''))
  const segments = cleanRoutePath.split('/').filter(Boolean)
  
  // Remove 'blog' and 'content' prefixes if they exist
  // This ensures consistency between SSR and client-side
  const baseSegments = segments.filter(s => s !== 'blog' && s !== 'content')
  
  // Remove the last segment (the slug/filename of the post) to get the directory
  if (baseSegments.length > 0) {
    baseSegments.pop()
  }
  
  // Clean up the src - decode first to handle %20 etc
  let cleanSrc = props.src.replace(/^\.\//, '')
  // Decode if it's already encoded
  try {
    cleanSrc = decodeURIComponent(cleanSrc)
  } catch (e) {
    // If decode fails, use as is
  }
  
  // WIKILINK FIX: If it's just a filename (no slash), assume it's in an 'assets' folder
  if (!cleanSrc.includes('/') && !cleanSrc.startsWith('assets/')) {
    cleanSrc = `assets/${cleanSrc}`
  }
  
  // Join segments for the final path
  const pathParts = baseSegments.length > 0 
    ? ['/_blog_assets', ...baseSegments, cleanSrc]
    : ['/_blog_assets', cleanSrc]
  
  const fullPath = pathParts.join('/').replace(/\/+/g, '/')
  
  // Debug log - always log in development
  if (import.meta.dev) {
    console.log('ProseImg Debug:', {
      original: props.src,
      routePath: currentPath,
      segments: segments,
      baseSegments: baseSegments,
      cleanSrc: cleanSrc,
      pathParts: pathParts,
      fullPath: fullPath,
      encoded: encodeURI(fullPath)
    })
  }
  
  // Encode the final URI for Chinese characters and spaces
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
  box-shadow: 0 25px 50px -12px var(--shadow-lg);
  border: 1px solid var(--border-light);
  transition: transform 0.3s ease;
}

.prose-img:hover {
  transform: scale(1.01);
}

.image-caption {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-style: italic;
  text-align: center;
}

/* Dark mode adjustment for excessive brightness */
:root.dark .prose-img {
  opacity: 0.9;
  filter: brightness(0.9) contrast(1.1);
}
</style>
