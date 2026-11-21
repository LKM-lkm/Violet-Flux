<script setup lang="ts">
import { liquidGlass } from '../lib/vendor/liunian-liquid-glass'
import type { LiquidGlassInstance } from '../lib/vendor/liunian-liquid-glass'
import {
  LIQUID_GLASS_DEFAULTS,
  LIQUID_GLASS_PRESETS,
  type LiquidGlassPreset,
} from '../config/liquid-glass'

const props = withDefaults(defineProps<{
  as?: string
  preset?: LiquidGlassPreset
}>(), {
  as: 'div',
  preset: 'default',
})

const containerRef = ref<HTMLElement | null>(null)
let glassInstance: LiquidGlassInstance | null = null
let resizeObserver: ResizeObserver | null = null
let rafId: number | null = null
let disposed = false

const getOptions = () => ({
  ...LIQUID_GLASS_DEFAULTS,
  ...LIQUID_GLASS_PRESETS[props.preset],
})

function applyGlass() {
  rafId = null
  const el = containerRef.value
  if (disposed || !el || !el.offsetWidth || !el.offsetHeight || glassInstance) return

  const options = getOptions()
  glassInstance = liquidGlass(el, options)
}

function scheduleApply() {
  if (glassInstance || rafId !== null) return
  rafId = requestAnimationFrame(applyGlass)
}

watch(() => props.preset, () => {
  glassInstance?.destroy()
  glassInstance = null
  scheduleApply()
})

onMounted(() => {
  const el = containerRef.value
  if (!el) return

  resizeObserver = new ResizeObserver(() => {
    if (!glassInstance) scheduleApply()
  })
  resizeObserver.observe(el)
  scheduleApply()
})

onBeforeUnmount(() => {
  disposed = true
  if (rafId !== null) cancelAnimationFrame(rafId)
  resizeObserver?.disconnect()
  glassInstance?.destroy()
  glassInstance = null
})
</script>

<template>
  <component :is="as" ref="containerRef">
    <slot />
  </component>
</template>
