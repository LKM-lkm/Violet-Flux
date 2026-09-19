<template>
  <div v-if="content" class="ai-summary-wrapper">
    <LiquidGlass class="ai-summary" :scale="-120" :chroma="5" :border="0.03" :mapBlur="10" :blur="2" :saturate="1.5">
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
            {{ displayedText }}
            <span v-if="isTyping" class="type-cursor"></span>
          </p>
          <p v-else-if="status === 'thinking'" class="placeholder-text">
            <span class="placeholder-glow">Synthesizing the digital essence...</span>
          </p>
          <p v-else-if="status === 'error'" class="error-text">
            <Icon name="lucide:alert-triangle" class="error-icon" />
            The flux was interrupted. Could not generate summary.
          </p>
        </div>
      </div>
    </LiquidGlass>
  </div>
</template>

<script setup>
const props = defineProps({
  content: {
    type: String,
    required: true
  },
  articleId: {
    type: String,
    required: true
  }
})

const status = ref('idle') // idle, thinking, typing, done, error
const displayedText = ref('')
const fullText = ref('')
const isTyping = ref(false)

// 使用本地代理接口避免 CORS 问题（服务端转发到 Cloudflare Worker）
// 静态部署时回退到直接调用 Worker（需 Worker 配置 CORS）
const PROXY_URL = '/api/ai-summary'
const DIRECT_URL = 'https://violet-flux-summery.likem.cc.cd'

const generateSummary = async () => {
  if (status.value !== 'idle') return
  
  status.value = 'thinking'
  
  try {
    // Check localStorage first for cache
    const cacheKey = `summary_${props.articleId}`
    const cached = localStorage.getItem(cacheKey)
    
    if (cached) {
      fullText.value = cached
      startTyping()
      return
    }

    // Extract raw text from Nuxt Content AST to send cleaner data to AI
    let rawText = ''
    try {
      const body = JSON.parse(props.content)
      const extractText = (node) => {
        if (node.type === 'text') return node.value
        if (node.children) return node.children.map(extractText).join(' ')
        return ''
      }
      rawText = body.children.map(extractText).join('\n').substring(0, 3000)
    } catch (e) {
      rawText = props.content.substring(0, 3000)
    }

    // Call Cloudflare Worker (优先走代理，失败后直连)
    console.log('Requesting AI summary for:', props.articleId)
    let response
    try {
      response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: rawText })
      })
    } catch (proxyErr) {
      // 代理不可用（静态部署），回退直连 Worker
      console.warn('Proxy unavailable, trying direct:', proxyErr.message)
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
    localStorage.setItem(cacheKey, fullText.value)
    
    startTyping()
  } catch (err) {
    console.error('AI Summary Fetch Error:', err)
    status.value = 'error'
  }
}

const startTyping = () => {
  status.value = 'typing'
  isTyping.value = true
  let i = 0
  const interval = setInterval(() => {
    if (i < fullText.value.length) {
      displayedText.value += fullText.value[i]
      i++
    } else {
      clearInterval(interval)
      isTyping.value = false
      status.value = 'done'
    }
  }, 30) // Speed of typing
}

onMounted(() => {
  // Delay a bit to ensure smooth entry
  setTimeout(generateSummary, 1000)
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

.type-cursor {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  background: var(--primary);
  margin-left: 4px;
  vertical-align: middle;
  box-shadow: 0 0 8px var(--primary-glow);
  animation: blink 0.8s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@media (max-width: 768px) {
  .summary-content {
    padding: 1.25rem 1.5rem;
  }
}
</style>
