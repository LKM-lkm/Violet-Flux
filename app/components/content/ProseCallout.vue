<template>
  <div 
    class="callout-wrapper"
    :class="[
      `callout-${color}`,
      to && 'callout-link'
    ]"
  >
    <div class="callout-header">
      <Icon v-if="icon" :name="icon" class="callout-icon" />
      <slot name="title" />
    </div>
    <div class="callout-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon?: string
  color?: 'info' | 'success' | 'warning' | 'error' | 'primary' | 'neutral'
  to?: string
}>()
</script>

<style scoped>
.callout-wrapper {
  margin: 1.5rem 0;
  padding: 1rem 1.25rem;
  border-radius: 0.5rem;
  border-left: 4px solid;
  position: relative;
  overflow: hidden;
}

.callout-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.callout-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.callout-content {
  line-height: 1.6;
}

.callout-content :deep(p) {
  margin: 0;
}

.callout-content :deep(p + p) {
  margin-top: 0.5rem;
}

.callout-content :deep(ul),
.callout-content :deep(ol) {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.callout-content :deep(code) {
  background: rgba(0, 0, 0, 0.1);
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
  font-size: 0.9em;
}

:root.dark .callout-content :deep(code) {
  background: rgba(255, 255, 255, 0.1);
}

/* Info - 蓝色 */
.callout-info {
  background: rgba(59, 130, 246, 0.1);
  border-left-color: #3b82f6;
  color: var(--text-primary);
}

.callout-info .callout-header {
  color: #3b82f6;
}

:root.dark .callout-info {
  background: rgba(59, 130, 246, 0.15);
  border-left-color: #60a5fa;
}

:root.dark .callout-info .callout-header {
  color: #60a5fa;
}

/* Success - 绿色 */
.callout-success {
  background: rgba(34, 197, 94, 0.1);
  border-left-color: #22c55e;
  color: var(--text-primary);
}

.callout-success .callout-header {
  color: #22c55e;
}

:root.dark .callout-success {
  background: rgba(34, 197, 94, 0.15);
  border-left-color: #4ade80;
}

:root.dark .callout-success .callout-header {
  color: #4ade80;
}

/* Warning - 橙色 */
.callout-warning {
  background: rgba(249, 115, 22, 0.1);
  border-left-color: #f97316;
  color: var(--text-primary);
}

.callout-warning .callout-header {
  color: #f97316;
}

:root.dark .callout-warning {
  background: rgba(249, 115, 22, 0.15);
  border-left-color: #fb923c;
}

:root.dark .callout-warning .callout-header {
  color: #fb923c;
}

/* Error - 红色 */
.callout-error {
  background: rgba(239, 68, 68, 0.1);
  border-left-color: #ef4444;
  color: var(--text-primary);
}

.callout-error .callout-header {
  color: #ef4444;
}

:root.dark .callout-error {
  background: rgba(239, 68, 68, 0.15);
  border-left-color: #f87171;
}

:root.dark .callout-error .callout-header {
  color: #f87171;
}

/* Primary - 主色调 */
.callout-primary {
  background: rgba(168, 85, 247, 0.1);
  border-left-color: #a855f7;
  color: var(--text-primary);
}

.callout-primary .callout-header {
  color: #a855f7;
}

:root.dark .callout-primary {
  background: rgba(168, 85, 247, 0.15);
  border-left-color: #c084fc;
}

:root.dark .callout-primary .callout-header {
  color: #c084fc;
}

/* Neutral - 中性 */
.callout-neutral {
  background: rgba(107, 114, 128, 0.1);
  border-left-color: #6b7280;
  color: var(--text-primary);
}

.callout-neutral .callout-header {
  color: #6b7280;
}

:root.dark .callout-neutral {
  background: rgba(156, 163, 175, 0.15);
  border-left-color: #9ca3af;
}

:root.dark .callout-neutral .callout-header {
  color: #9ca3af;
}

/* Link 样式 */
.callout-link {
  cursor: pointer;
  transition: all 0.2s ease;
}

.callout-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:root.dark .callout-link:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
