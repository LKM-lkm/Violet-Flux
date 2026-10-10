<template>
  <div v-spotlight class="prose-pre-wrapper">
    <div class="prose-pre-header">
      <div class="language-info">
        <Icon v-if="languageIcon" :name="languageIcon" class="language-logo" />
        <span class="language-text">{{ displayLanguage }}</span>
        <span v-if="filename" class="filename-text" :title="filename">{{ filename }}</span>
      </div>

      <button
        type="button"
        class="copy-btn"
        :class="{ 'is-copied': copied }"
        :aria-label="copied ? '代码已复制' : '复制代码'"
        :title="copied ? '已复制' : '复制代码'"
        @click="copy"
      >
        <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" class="copy-icon" />
        <span class="copy-text">{{ copied ? 'Copied' : 'Copy' }}</span>
      </button>
    </div>

    <div class="code-container">
      <pre :class="['vf-code', $props.class, { 'has-line-numbers': showLineNumbers }]"><slot /></pre>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  code: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: null
  },
  filename: {
    type: String,
    default: null
  },
  // MDC 会把 ```js {1,3-5} 解析成行号数组，高亮由 Shiki 输出 .line.highlight，样式在本组件里
  highlights: {
    type: Array,
    default: () => []
  },
  // 声明但不使用，避免它作为属性落到根元素上
  meta: {
    type: String,
    default: null
  },
  class: {
    type: String,
    default: null
  }
})

// 语言显示名：不再全大写，用常见的规范写法（JavaScript / C++ / YAML …）
const LANGUAGE_LABELS = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  jsx: 'JSX',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  tsx: 'TSX',
  py: 'Python',
  python: 'Python',
  java: 'Java',
  c: 'C',
  cpp: 'C++',
  cxx: 'C++',
  sh: 'Shell',
  shell: 'Shell',
  bash: 'Bash',
  zsh: 'Zsh',
  json: 'JSON',
  jsonc: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  md: 'Markdown',
  markdown: 'Markdown',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  vue: 'Vue',
  text: 'Text',
  plaintext: 'Text'
}

// 语言 logo（Simple Icons）。Simple Icons 里没有 java，官方 Java logo 用 openjdk 代替；
// jsx/tsx 借 React / TypeScript 的图标；bash 用 GNU Bash。
const LANGUAGE_ICONS = {
  js: 'simple-icons:javascript',
  javascript: 'simple-icons:javascript',
  jsx: 'simple-icons:react',
  ts: 'simple-icons:typescript',
  typescript: 'simple-icons:typescript',
  tsx: 'simple-icons:typescript',
  py: 'simple-icons:python',
  python: 'simple-icons:python',
  java: 'simple-icons:openjdk',
  c: 'simple-icons:c',
  cpp: 'simple-icons:cplusplus',
  cxx: 'simple-icons:cplusplus',
  sh: 'simple-icons:gnubash',
  shell: 'simple-icons:gnubash',
  bash: 'simple-icons:gnubash',
  zsh: 'simple-icons:gnubash',
  json: 'simple-icons:json',
  jsonc: 'simple-icons:json',
  yaml: 'simple-icons:yaml',
  yml: 'simple-icons:yaml',
  md: 'simple-icons:markdown',
  markdown: 'simple-icons:markdown',
  html: 'simple-icons:html5',
  css: 'simple-icons:css',
  scss: 'simple-icons:css',
  vue: 'simple-icons:vuedotjs'
}

const normalizedLanguage = computed(() => (props.language || 'text').toLowerCase())

// 没有语言时也保持头部一致，避免出现“有头/无头”两种形态
const displayLanguage = computed(
  () => LANGUAGE_LABELS[normalizedLanguage.value] || props.language || 'Text'
)

const languageIcon = computed(() => LANGUAGE_ICONS[normalizedLanguage.value] || null)

// 超过 10 行才显示行号；Shiki 渲染前会 trimEnd，这里对齐同样的口径
const showLineNumbers = computed(() => {
  const raw = props.code
  if (!raw) return false
  return raw.replace(/\n+$/, '').split('\n').length > 10
})

const copied = ref(false)
let copiedTimer = null

const fallbackCopy = (text) => {
  // navigator.clipboard 在非 HTTPS 或旧浏览器下不可用
  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.top = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(textarea)
    return ok
  } catch {
    return false
  }
}

const copy = async () => {
  const text = props.code || ''
  if (!text) return

  let ok = false
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      ok = true
    }
  } catch {
    ok = false
  }
  if (!ok) ok = fallbackCopy(text)

  // 复制失败时不要给出“已复制”的假反馈
  if (!ok) {
    console.warn('Failed to copy code to clipboard')
    return
  }

  copied.value = true
  if (copiedTimer) clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => {
    copied.value = false
    copiedTimer = null
  }, 2000)
}

onBeforeUnmount(() => {
  if (copiedTimer) clearTimeout(copiedTimer)
  copiedTimer = null
})
</script>

<style scoped>
/* === 容器 === */
.prose-pre-wrapper {
  position: relative;
  margin: 2rem 0;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
  background: var(--code-bg);
  box-shadow: var(--shadow-sm),
              inset 0 1px 0 rgba(255, 255, 255, 0.04);
  overflow: hidden;
}

/* === 头部：玻璃条 === */
.prose-pre-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 0.75rem 0.5rem 1rem;
  background: var(--code-header-bg);
  backdrop-filter: blur(8px) saturate(1.4);
  -webkit-backdrop-filter: blur(8px) saturate(1.4);
  border-bottom: 1px solid var(--border-light);
}

.language-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.language-logo {
  flex-shrink: 0;
  font-size: 0.95rem;
  /* Simple Icons 是单色图标，跟着主题走；塞一堆品牌色反而会在浅底上糊掉 */
  color: var(--text-secondary);
}

.language-text {
  flex-shrink: 0;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: var(--primary);
}

/* 文件名保留原样大小写（原来被 language-info 的 uppercase 一起大写了） */
.filename-text {
  min-width: 0;
  padding-left: 0.75rem;
  border-left: 1px solid var(--border-medium);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* === 复制按钮 === */
.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  flex-shrink: 0;
  padding: 0.3rem 0.7rem;
  border-radius: 50px;
  border: 1px solid var(--border-light);
  background: rgba(255, 255, 255, 0.35);
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  transition: color var(--duration-fast) var(--ease-out),
              border-color var(--duration-fast) var(--ease-out),
              background var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
}

:root.dark .copy-btn {
  background: rgba(255, 255, 255, 0.06);
}

.copy-btn:hover {
  color: var(--primary);
  border-color: var(--border-strong);
  box-shadow: 0 0 12px var(--primary-glow);
}

.copy-btn.is-copied {
  color: var(--primary);
  border-color: var(--border-strong);
}

.copy-btn:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.copy-icon {
  font-size: 0.85rem;
}

/* === 代码区 === */
.code-container {
  overflow-x: auto;
  overscroll-behavior-x: contain;
  /* 横向滚动时两侧的渐隐提示（local 图层随内容滚动，scroll 图层固定） */
  background:
    linear-gradient(to right, var(--code-bg) 30%, rgba(0, 0, 0, 0)) left center / 40px 100% no-repeat local,
    linear-gradient(to left, var(--code-bg) 30%, rgba(0, 0, 0, 0)) right center / 40px 100% no-repeat local,
    radial-gradient(farthest-side at 0% 50%, rgba(120, 90, 150, 0.16), rgba(0, 0, 0, 0)) left center / 14px 100% no-repeat scroll,
    radial-gradient(farthest-side at 100% 50%, rgba(120, 90, 150, 0.16), rgba(0, 0, 0, 0)) right center / 14px 100% no-repeat scroll;
}

.code-container::-webkit-scrollbar {
  height: 10px;
}

.code-container::-webkit-scrollbar-track {
  background: transparent;
}

.code-container::-webkit-scrollbar-thumb {
  background-color: var(--border-medium);
  background-clip: content-box;
  border: 3px solid transparent;
  border-radius: 50px;
}

.code-container::-webkit-scrollbar-thumb:hover {
  background-color: var(--border-strong);
}

.vf-code {
  margin: 0;
  /* 横向 padding 放在 pre 上，而不是 .line 上：
     MDC 对 text（以及不在 Shiki langs 白名单里的语言）根本不会跑高亮，
     也就没有 .line 包裹，padding 写在 .line 上这些块的文字会直接贴左边框。 */
  padding: 1.1rem 1.25rem;
  min-width: max-content;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  line-height: 1.75;
  tab-size: 2;
  color: var(--code-text);
  background: transparent;
  border: none;
  border-radius: 0;
  white-space: pre;
}

.vf-code code {
  display: block;
  padding: 0;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  background: transparent;
  border: none;
  white-space: pre;
  overflow-wrap: normal;
  word-break: normal;
}

.vf-code :deep(.line) {
  display: block;
  min-height: 1.75em;
  /* 横向留白由 .vf-code 统一提供，这里不再重复 */
}

.vf-code :deep(span) {
  font-family: inherit;
}

/* MDC 把 ```js {1,3} 解析为 highlights，Shiki 会给对应行加 .highlight */
.vf-code :deep(.line.highlight) {
  background: var(--code-line-highlight);
  box-shadow: inset 2px 0 0 var(--primary);
}

/* 超过 10 行才显示行号（行号取自 Shiki 写在 .line 上的 line 属性） */
.vf-code.has-line-numbers :deep(.line)::before {
  content: attr(line);
  display: inline-block;
  width: 2rem;
  margin-right: 0.9rem;
  text-align: right;
  color: var(--text-tertiary);
  font-variant-numeric: tabular-nums;
  user-select: none;
  -webkit-user-select: none;
}

/* === 响应式 === */
@media (max-width: 640px) {
  .prose-pre-header {
    padding: 0.45rem 0.5rem 0.45rem 0.85rem;
  }

  .copy-btn {
    padding: 0.3rem 0.5rem;
  }

  .copy-text {
    display: none;
  }

  .vf-code {
    font-size: 0.8rem;
    /* 窄屏收一点横向留白；padding 在 pre 上，所以这里也改 pre */
    padding: 1rem 1rem;
  }
}
</style>
