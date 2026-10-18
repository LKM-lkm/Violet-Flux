<template>
  <div id="comments"></div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, watch } from 'vue'
import CWDComments from "cwd-widget"
import { isDark } from '~/composables/useTheme'

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
})

let comments = null

const commentsSlug = computed(() => {
  if (encodeURIComponent(props.slug).length <= 80) return props.slug

  let hash = 14695981039346656037n
  for (const character of props.slug) {
    hash = BigInt.asUintN(64, (hash ^ BigInt(character.codePointAt(0) ?? 0)) * 1099511628211n)
  }

  return `vf-${hash.toString(36)}`
})

onMounted(() => {
  // 获取完整的 customCssUrl
  const baseUrl = window.location.origin
  const customCssUrl = `${baseUrl}/styles/cwd-custom.css`
  
  console.log('🎨 CWD Custom CSS URL:', customCssUrl)
  
  // 初始化评论组件
  comments = new CWDComments({
    el: '#comments',
    apiBaseUrl: 'https://cwd-api.likem.qzz.io/',
    postSlug: commentsSlug.value,
    siteId: 'blog',
    lang: 'zh-CN',
    theme: isDark.value ? 'dark' : 'light',
    pageSize: 10,
    customCssUrl: customCssUrl
  })
  
  comments.mount()
  
  console.log('✅ CWD Comments mounted')
})

onUnmounted(() => {
  if (comments) {
    comments.unmount()
  }
})

// 动态切换主题
watch(isDark, (newVal) => {
  if (comments) {
    comments.updateConfig({ theme: newVal ? 'dark' : 'light' })
  }
})

// 动态修改评论标识符
watch(() => props.slug, () => {
  if (comments) {
    comments.updateConfig({ postSlug: commentsSlug.value })
  }
})
</script>

<style scoped>
#comments {
  margin-top: 4rem;
}
</style>
