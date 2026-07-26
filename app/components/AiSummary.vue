<template>
  <div class="ai-summary glass-card" v-if="content">
    <div class="summary-header">
      <div class="ai-label">
        <Icon name="lucide:sparkles" class="sparkle-icon" />
        <span>VIOLET FLUX // AI SUMMARY</span>
      </div>
      <div v-if="status === 'thinking'" class="thinking-indicator">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>
    
    <div class="summary-body">
      <p v-if="displayedText" class="text-content">
        {{ displayedText }}
        <span v-if="isTyping" class="type-cursor"></span>
      </p>
      <p v-else-if="status === 'thinking'" class="placeholder-text">
        Synthesizing the digital essence...
      </p>
      <p v-else-if="status === 'error'" class="error-text">
        The flux was interrupted. Could not generate summary.
      </p>
    </div>
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
.ai-summary {
  margin: 2rem 0 3rem;
  padding: 1.5rem 2.5rem;
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-light);
  background: var(--glass-bg);
  box-shadow: var(--shadow-lg), 
              0 0 20px rgba(180, 151, 215, 0.05);
}

.ai-summary::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
  background: linear-gradient(to bottom, var(--primary), var(--secondary));
  box-shadow: 2px 0 10px var(--primary-glow);
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.ai-label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: 'Bricolage Grotesque';
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: var(--primary);
  opacity: 0.8;
}

.sparkle-icon {
  font-size: 1rem;
  animation: rotate-sparkle 4s infinite linear;
}

@keyframes rotate-sparkle {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.thinking-indicator {
  display: flex;
  gap: 4px;
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

.summary-body {
  min-height: 3.5rem;
}

.text-content {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-primary);
  margin: 0;
}

.placeholder-text {
  font-style: italic;
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin: 0;
}

.error-text {
  color: var(--primary);
  font-size: 0.9rem;
  margin: 0;
}

.type-cursor {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  background: var(--primary);
  margin-left: 4px;
  vertical-align: middle;
  animation: blink 0.8s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
