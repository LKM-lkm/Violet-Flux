<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

interface Props {
  /** HTML tag or component for the wrapper element. Defaults to 'div'. */
  as?: string;
  scale?: number;
  chroma?: number;
  border?: number;
  mapBlur?: number;
  blur?: number;
  saturate?: number;
  radius?: number | null;
  fallbackBlur?: number;
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  scale: -112,
  chroma: 6,
  border: 0.07,
  mapBlur: 12,
  blur: 3,
  saturate: 1.5,
  radius: null,
  fallbackBlur: 16,
});

const containerRef = ref<HTMLElement | null>(null);
let glassInstance: { supported: boolean; refresh: () => void; destroy: () => void } | null = null;

onMounted(() => {
  // 严格按照原版 Framework usage:
  //   const glass = liquidGlass(ref.current);
  //   return () => glass.destroy();
  if (typeof window === 'undefined' || typeof (window as any).liquidGlass !== 'function') {
    // 脚本尚未加载，等待 load 事件
    const onLoad = () => {
      applyGlass();
      window.removeEventListener('load', onLoad);
    };
    if (document.readyState === 'complete') {
      // 脚本已在 defer 模式下加载完毕但 liquidGlass 未注册 — 短暂等待
      setTimeout(applyGlass, 100);
    } else {
      window.addEventListener('load', onLoad);
    }
    return;
  }
  applyGlass();
});

function applyGlass() {
  console.log('[LiquidGlass Vue] applyGlass called, containerRef:', containerRef.value);
  if (!containerRef.value) {
    console.warn('[LiquidGlass Vue] containerRef is null');
    return;
  }

  // 获取真实 DOM 元素（兼容 Vue 组件实例与原生 DOM）
  const el: HTMLElement = (containerRef.value as any).$el ?? containerRef.value;
  console.log('[LiquidGlass Vue] Resolved target element:', el);
  if (!(el instanceof HTMLElement)) {
    console.warn('[LiquidGlass Vue] Target element is not an HTMLElement:', el);
    return;
  }

  const opts: Record<string, number | null | undefined> = {
    scale: props.scale,
    chroma: props.chroma,
    border: props.border,
    mapBlur: props.mapBlur,
    blur: props.blur,
    saturate: props.saturate,
    fallbackBlur: props.fallbackBlur,
  };
  if (props.radius != null) opts.radius = props.radius;

  glassInstance = (window as any).liquidGlass(el, opts);
}

onBeforeUnmount(() => {
  if (glassInstance) {
    glassInstance.destroy();
    glassInstance = null;
  }
});
</script>

<template>
  <component :is="as" ref="containerRef">
    <slot />
  </component>
</template>
