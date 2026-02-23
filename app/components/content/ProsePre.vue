<template>
  <div class="prose-pre-wrapper">
    <div class="prose-pre-header" v-if="language || filename">
      <div class="language-info">
        <span v-if="language" class="language-text">{{ language }}</span>
        <span v-if="filename" class="filename-text">{{ filename }}</span>
      </div>
      <button @click="copy(code)" class="copy-btn">
        <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" class="w-4 h-4" />
        <span>{{ copied ? 'Copied!' : 'Copy' }}</span>
      </button>
    </div>
    <div class="code-container">
      <button v-if="!language && !filename" @click="copy(code)" class="floating-copy-btn">
        <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" class="w-4 h-4" />
      </button>
      <pre :class="$props.class"><slot /></pre>
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
  highlights: {
    type: Array,
    default: () => []
  },
  meta: {
    type: String,
    default: null
  },
  class: {
    type: String,
    default: null
  }
})

const copied = ref(false)
const copy = (text) => {
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<style scoped>
.prose-pre-wrapper {
  margin: 2rem 0;
  border-radius: 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  overflow: hidden;
  position: relative;
}

.prose-pre-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-light);
  font-size: 0.75rem;
  font-family: sans-serif;
}

.language-info {
  display: flex;
  gap: 0.75rem;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--primary);
}

.copy-btn, .floating-copy-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.4rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.copy-btn:hover, .floating-copy-btn:hover {
  background: var(--border-light);
  color: var(--text-primary);
}

.floating-copy-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 10;
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
}

.code-container {
  position: relative;
}

pre {
  margin: 0 !important;
  padding: 1.25rem !important;
  font-family: 'Fira Code', 'Cascadia Code', monospace !important;
  font-size: 0.875rem !important;
  line-height: 1.7 !important;
  overflow-x: auto;
  background: transparent !important;
  border: none !important; /* Fix double border */
}

:deep(code) {
  background: transparent !important;
  padding: 0 !important;
  border: none !important;
  color: inherit !important;
}
</style>
