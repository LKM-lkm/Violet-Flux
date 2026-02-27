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
  padding: 3rem;
  border-top: 1px solid var(--border-light);
  background: linear-gradient(135deg,
    rgba(250, 248, 252, 0.5) 0%,
    rgba(243, 238, 248, 0.3) 100%
  );
  border-radius: var(--radius-xl);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 24px rgba(180, 151, 215, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
  min-height: 200px;
  position: relative;
  overflow: hidden;
}

.cwd-comments-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, 
    #b497d7 0%, 
    #c2a9e4 50%, 
    #b497d7 100%
  );
  box-shadow: 0 0 12px rgba(180, 151, 215, 0.6);
}

/* 暗色模式 */
:root.dark .cwd-comments-container {
  background: linear-gradient(135deg,
    rgba(26, 15, 33, 0.5) 0%,
    rgba(45, 27, 61, 0.3) 100%
  );
}
</style>
