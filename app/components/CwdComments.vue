<template>
  <div id="cwd-comments" class="cwd-comments-container"></div>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import CWDComments from "cwd-widget"
import { isDark } from '~/composables/useTheme'

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
})

let commentsInstance = null

const initComments = () => {
  if (import.meta.client) {
    try {
      commentsInstance = new CWDComments({
        el: '#cwd-comments',
        apiBaseUrl: 'https://cwd-api.likem.qzz.io/',
        postSlug: props.slug,
        siteId: 'blog',
        lang: 'auto',
        theme: isDark.value ? 'dark' : 'light',
        pageSize: 10,
        customCssUrl: '/styles/cwd-custom.css'
      })
      console.log('CWD Initialized with BaseURL:', 'https://cwd-api.likem.qzz.io/')
      commentsInstance.mount()
    } catch (e) {
      console.error('Failed to initialize CWD comments:', e)
    }
  }
}

onMounted(() => {
  initComments()
})

onUnmounted(() => {
  if (commentsInstance && typeof commentsInstance.unmount === 'function') {
    commentsInstance.unmount()
  }
  commentsInstance = null
})

// Watch theme changes
watch(isDark, (newVal) => {
  if (commentsInstance && typeof commentsInstance.updateConfig === 'function') {
    commentsInstance.updateConfig({
      theme: newVal ? 'dark' : 'light'
    })
  }
})

// Watch slug changes (if navigating between posts without full reload)
watch(() => props.slug, (newSlug) => {
  if (commentsInstance && typeof commentsInstance.updateConfig === 'function') {
    commentsInstance.updateConfig({
      postSlug: newSlug
    })
    // Re-mount might not be needed if updateConfig handles data reload, usually better to unmount/remount if the library doesn't support hot swap fully
    // But documentation says "comments.updateConfig({ postSlug: '/new-post-slug' })" is supported.
  }
})
</script>

<style scoped>
.cwd-comments-container {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-light);
  min-height: 200px; /* Prevent layout shift */
}
</style>
