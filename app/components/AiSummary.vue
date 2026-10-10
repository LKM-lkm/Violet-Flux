<template>
  <div v-if="content" class="ai-summary-wrapper">
    <LiquidGlass v-spotlight class="ai-summary" :scale="-120" :chroma="5" :border="0.03" :mapBlur="10" :blur="2" :saturate="1.5">
      <div class="card-glow"></div>
      <div class="card-border"></div>
      <div class="summary-content">
        <div class="summary-header">
          <div class="ai-label">
            <div class="label-icon-wrapper">
              <Icon name="lucide:sparkles" class="sparkle-icon" />
            </div>
            <span class="label-text">VIOLET FLUX // AI SUMMARY</span>
          </div>
          <div v-if="status === 'thinking'" class="thinking-indicator">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
          <div v-else-if="status === 'done'" class="done-badge">
            <Icon name="lucide:check-circle" class="done-icon" />
          </div>
        </div>
        
        <div class="summary-body">
          <p v-if="displayedText" class="text-content">
            <span
              v-for="(char, index) in typedChars"
              :key="index"
              class="typed-char"
            >{{ char }}</span>
            <span v-if="isTyping" class="type-cursor"></span>
          </p>
          <p v-else-if="status === 'thinking'" class="placeholder-text">
            <span class="placeholder-glow">Synthesizing the digital essence...</span>
          </p>
          <div v-else-if="status === 'error'" class="error-state">
            <p class="error-text">
              <Icon name="lucide:alert-triangle" class="error-icon" />
              The flux was interrupted. Could not generate summary.
            </p>
            <button type="button" class="retry-button" @click="retrySummary">
              <Icon name="lucide:refresh-cw" class="retry-icon" />
              重试
            </button>
          </div>
        </div>
      </div>
    </LiquidGlass>
  </div>
</template>

<script setup>
import { extractPlainText } from '~/utils/minimark-text'

const props = defineProps({
  // article.body：Nuxt Content v3 的 Minimark 树；同时兼容 JSON 字符串和纯文本
  content: {
    type: [Object, String],
    required: true
  },
  articleId: {
    type: String,
    required: true
  }
})

// 缓存版本号：提取逻辑、提示词或缓存格式变化时必须递增，
// 否则浏览器会继续读旧的摘要（包括之前生成失败时存下的错误内容）
const CACHE_VERSION = 'v3'
// 摘要缓存有效期：超过后重新生成，避免文章改了还一直显示旧摘要
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000 // 30 天

const dropCachedSummary = (key) => {
  try {
    localStorage.removeItem(key)
  } catch {
    // localStorage 不可用时忽略
  }
}

const readCachedSummary = (key) => {
  let raw = null
  try {
    raw = localStorage.getItem(key)
  } catch {
    return null // 隐私模式等场景下 localStorage 不可用
  }
  if (!raw) return null

  try {
    const entry = JSON.parse(raw)
    if (!entry?.text) return null
    if (!entry.at || Date.now() - entry.at > CACHE_TTL) {
      dropCachedSummary(key)
      return null
    }
    return entry.text
  } catch {
    // 格式损坏，丢弃重来
    dropCachedSummary(key)
    return null
  }
}

const writeCachedSummary = (key, text) => {
  try {
    localStorage.setItem(key, JSON.stringify({ text, at: Date.now() }))
  } catch (err) {
    console.warn('Failed to cache AI summary:', err)
  }
}

let typingTimer = null

const status = ref('idle') // idle, thinking, typing, done, error
const displayedText = ref('')
const fullText = ref('')
const isTyping = ref(false)

// 逐字渲染成独立 span：Vue 按 index 复用已有节点，
// 于是只有「刚敲出来的那个字」会新建节点、跑一次发光动画，旧字保持静态。
const typedChars = computed(() => (displayedText.value ? Array.from(displayedText.value) : []))

// 使用本地代理接口避免 CORS 问题（服务端转发到 Cloudflare Worker）
// 静态部署时回退到直接调用 Worker（需 Worker 配置 CORS）
const PROXY_URL = '/api/ai-summary'
const DIRECT_URL = 'https://vfs.likem.cc.cd'

// article.body 是 Minimark 树（不是 MDC/HAST 树），必须用专门的遍历提取正文，
// 否则拿到的会是 `{"type":"minimark","value":[["h1",{},...` 这样的原始 JSON。
// 实现见 app/utils/minimark-text.js
const extractArticleText = () => {
  const source = props.content

  // 兼容直接传入 JSON 字符串的场景
  if (typeof source === 'string') {
    try {
      const parsed = JSON.parse(source)
      return extractFromTree(parsed) || source.substring(0, 3000)
    } catch {
      // 不是 JSON，说明本身就是纯文本
      return source.substring(0, 3000)
    }
  }

  return extractFromTree(source)
}

const extractFromTree = (tree) => {
  if (!tree || typeof tree !== 'object') return ''
  // 默认跳过块级代码（pre）；若整篇只剩代码，再退回不跳过，避免出现空摘要
  return extractPlainText(tree) || extractPlainText(tree, { skipTags: [] })
}

const generateSummary = async () => {
  if (status.value !== 'idle') return
  
  status.value = 'thinking'
  
  try {
    // Check localStorage first for cache
    const cacheKey = `summary_${CACHE_VERSION}_${props.articleId}`
    const cached = readCachedSummary(cacheKey)
    
    if (cached) {
      fullText.value = cached
      startTyping()
      return
    }

    // 提取正文纯文本再送给 AI
    const rawText = extractArticleText()
    if (!rawText) throw new Error('Article content is empty after text extraction')

    // Call Cloudflare Worker (优先走代理，失败后直连)
    console.log('Requesting AI summary for:', props.articleId)
    let response = null

    // 尝试代理
    try {
      response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: rawText })
      })
      if (!response.ok) {
        console.warn('Proxy returned', response.status, '- falling back to direct')
        response = null
      }
    } catch (proxyErr) {
      console.warn('Proxy unavailable:', proxyErr.message)
    }

    // 代理不可用或失败，直连 Worker
    if (!response) {
      response = await fetch(DIRECT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: rawText })
      })
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Worker Response Error:', response.status, errorText);
      throw new Error(`Worker returned ${response.status}`);
    }
    
    const data = await response.json()
    if (!data.summary) throw new Error('No summary returned')
    
    fullText.value = data.summary
    
    // Save to cache
    writeCachedSummary(cacheKey, fullText.value)
    
    startTyping()
  } catch (err) {
    console.error('AI Summary Fetch Error:', err)
    status.value = 'error'
  }
}

const startTyping = () => {
  if (typingTimer) clearInterval(typingTimer)

  status.value = 'typing'
  isTyping.value = true
  displayedText.value = ''

  // 按码点切分，避免 emoji 被拆成两个半字符
  const chars = Array.from(fullText.value)
  let i = 0

  typingTimer = setInterval(() => {
    if (i < chars.length) {
      displayedText.value += chars[i]
      i++
    } else {
      clearInterval(typingTimer)
      typingTimer = null
      isTyping.value = false
      status.value = 'done'
    }
  }, 30) // Speed of typing
}

// 生成失败后允许手动重试，不用刷新页面或清 localStorage
const retrySummary = () => {
  if (status.value !== 'error') return
  status.value = 'idle'
  generateSummary()
}

onMounted(() => {
  // Delay a bit to ensure smooth entry
  setTimeout(generateSummary, 1000)
})

onUnmounted(() => {
  // 组件卸载后停止打字机定时器，避免定时器继续修改已卸载组件的状态
  if (typingTimer) clearInterval(typingTimer)
  typingTimer = null
})
</script>

<style scoped>
.ai-summary-wrapper {
  margin: 2.5rem 0 3rem;
  position: relative;
}

.ai-summary {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-xl);
  background: linear-gradient(180deg,
    rgba(255, 255, 255, 0.25),
    rgba(255, 255, 255, 0.08));
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-xl),
              inset 0 1px 1px rgba(255, 255, 255, 0.6),
              inset 0 -8px 20px rgba(255, 255, 255, 0.06),
              inset 0 0 0 1px rgba(255, 255, 255, 0.18);
  transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
              box-shadow 0.4s ease;
}

:root.dark .ai-summary {
  background: linear-gradient(180deg,
    rgba(30, 22, 45, 0.35),
    rgba(30, 22, 45, 0.18));
  box-shadow: var(--shadow-xl),
              inset 0 1px 1px rgba(255, 255, 255, 0.08),
              inset 0 -8px 20px rgba(255, 255, 255, 0.02),
              inset 0 0 0 1px rgba(255, 255, 255, 0.06);
}

.ai-summary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-2xl),
              0 0 32px rgba(180, 151, 215, 0.12),
              inset 0 1px 1px rgba(255, 255, 255, 0.6);
}

.card-glow {
  position: absolute;
  top: -80px;
  left: 20%;
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(180, 151, 215, 0.15), transparent 70%);
  pointer-events: none;
  opacity: 0.6;
}

.card-border {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-xl);
  padding: 1px;
  background: linear-gradient(135deg,
    rgba(180, 151, 215, 0.35),
    rgba(194, 169, 228, 0.15) 50%,
    transparent);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.summary-content {
  position: relative;
  z-index: 2;
  padding: 1.75rem 2.5rem;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-light);
}

.ai-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.label-icon-wrapper {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: linear-gradient(135deg,
    rgba(180, 151, 215, 0.15),
    rgba(180, 151, 215, 0.05));
  border: 1px solid rgba(180, 151, 215, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sparkle-icon {
  font-size: 0.95rem;
  color: var(--primary);
  filter: drop-shadow(0 2px 6px rgba(180, 151, 215, 0.4));
  animation: rotate-sparkle 4s infinite linear;
}

@keyframes rotate-sparkle {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.label-text {
  font-family: var(--font-display);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: var(--primary);
  opacity: 0.8;
  text-shadow: 0 0 10px var(--primary-glow);
}

.thinking-indicator {
  display: flex;
  gap: 5px;
}

.dot {
  width: 6px;
  height: 6px;
  background: var(--primary);
  border-radius: 50%;
  opacity: 0.3;
  animation: dot-pulse 1.4s infinite ease-in-out;
}

.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes dot-pulse {
  0%, 100% { transform: scale(0.8); opacity: 0.3; }
  50% { transform: scale(1.2); opacity: 0.8; }
}

.done-badge {
  display: flex;
  align-items: center;
}

.done-icon {
  font-size: 1rem;
  color: var(--primary);
  opacity: 0.6;
}

.summary-body {
  min-height: 3.5rem;
}

.text-content {
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: 0.01em;
}

:root.dark .text-content {
  color: #d8d0e0;
}

/* 打字光效：每个字出现时亮一下再回落，光标同步呼吸。
   每个字都是独立 span，动画只在节点创建时跑一次，
   所以只有刚敲出来的字在发光，已经打完的字是静止的。 */
.typed-char {
  animation: char-bloom 620ms var(--ease-out) both;
}

@keyframes char-bloom {
  0% {
    color: var(--primary);
    text-shadow: 0 0 10px var(--primary), 0 0 22px var(--primary-glow);
  }
  100% {
    color: inherit;
    text-shadow: 0 0 0 rgba(0, 0, 0, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .typed-char,
  .type-cursor {
    animation: none;
  }
}

.placeholder-text {
  margin: 0;
}

.placeholder-glow {
  font-style: italic;
  color: var(--text-secondary);
  font-size: 0.95rem;
  animation: placeholder-breathe 2s infinite ease-in-out;
}

@keyframes placeholder-breathe {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.error-state {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.error-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary);
  font-size: 0.9rem;
  margin: 0;
}

.error-icon {
  font-size: 1rem;
  flex-shrink: 0;
}

.retry-button {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.9rem;
  border-radius: 50px;
  border: 1px solid rgba(180, 151, 215, 0.35);
  background: linear-gradient(135deg,
    rgba(180, 151, 215, 0.15),
    rgba(180, 151, 215, 0.05));
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--duration-fast);
}

.retry-button:hover {
  border-color: var(--primary);
  box-shadow: 0 0 16px var(--primary-glow);
  transform: translateY(-1px);
}

.retry-button:active {
  transform: translateY(0);
}

.retry-icon {
  font-size: 0.85rem;
}

.type-cursor {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  background: var(--primary);
  margin-left: 4px;
  vertical-align: middle;
  box-shadow: 0 0 8px var(--primary), 0 0 18px var(--primary-glow);
  animation: cursor-breathe 0.9s ease-in-out infinite;
}

@keyframes cursor-breathe {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 8px var(--primary), 0 0 18px var(--primary-glow);
  }
  50% {
    opacity: 0.35;
    box-shadow: 0 0 4px var(--primary-glow);
  }
}

@media (max-width: 768px) {
  .summary-content {
    padding: 1.25rem 1.5rem;
  }
}
</style>
