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

// For demonstration, you would replace this with your Cloudflare Worker URL
const WORKER_URL = 'https://violet-flux-summery.likem.workers.dev/'

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

    // Call Cloudflare Worker
    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: props.content.substring(0, 3000) }) // Content limit
    })

    if (!response.ok) throw new Error('Worker failed')
    
    const data = await response.json()
    fullText.value = data.summary
    
    // Save to cache
    localStorage.setItem(cacheKey, fullText.value)
    
    startTyping()
  } catch (err) {
    console.error('AI Summary Error:', err)
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
  padding: 1.5rem 2rem;
  position: relative;
  overflow: hidden;
  border-left: 4px solid var(--primary);
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
  color: var(--text);
  margin: 0;
}

.placeholder-text {
  font-style: italic;
  color: var(--text-muted);
  font-size: 0.95rem;
  margin: 0;
}

.error-text {
  color: #ef4444;
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
