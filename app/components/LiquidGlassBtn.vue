<template>
  <div class="liquid-btn-wrapper">
    <component
      :is="as"
      ref="containerRef"
      class="liquid-glass-element"
      :style="{ maxWidth: `${width}px`, minHeight: `${height}px` }"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @click="handleClick"
    >
      <!-- Filter layer -->
      <div class="glass-filter-layer"></div>

      <!-- Content layer -->
      <div class="glass-content-layer">
        <slot></slot>
      </div>
    </component>

    <!-- Hidden SVG Filter Definition -->
    <svg style="display: none;">
      <defs>
        <filter :id="filterId" color-interpolation-filters="sRGB">
          <!-- 1. Gaussian blur on source -->
          <feGaussianBlur
            ref="blurRef"
            in="SourceGraphic"
            :stdDeviation="ANIMATION_CONFIG.initial.blur"
            result="blurred_source"
          />

          <!-- 2. Displacement Map Image (Refraction) -->
          <feImage
            :href="DISPLACEMENT_MAP_URI"
            x="0"
            y="0"
            :width="width"
            :height="height"
            result="displacement_map"
            preserveAspectRatio="none"
          />

          <!-- 3. Apply Displacement -->
          <feDisplacementMap
            ref="displacerRef"
            in="blurred_source"
            in2="displacement_map"
            :scale="ANIMATION_CONFIG.initial.displacement"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />

          <!-- 4. Saturate the Displaced Layer -->
          <feColorMatrix
            in="displaced"
            type="saturate"
            values="1.5"
            result="displaced_saturated"
          />

          <!-- 5. Specular Rim Image (Reflection) -->
          <feImage
            :href="SPECULAR_LIGHTING_URI"
            x="0"
            y="0"
            :width="width"
            :height="height"
            result="specular_layer"
            preserveAspectRatio="none"
          />

          <!-- 6. Blur the Rim -->
          <feGaussianBlur
            in="specular_layer"
            stdDeviation="1"
            result="specular_layer_blurred"
          />

          <!-- 7. Composite Rim on Saturated Content -->
          <feComposite
            in="displaced_saturated"
            in2="specular_layer_blurred"
            operator="in"
            result="specular_saturated"
          />

          <!-- 8. Final Blend -->
          <feBlend
            in="specular_saturated"
            in2="displaced"
            mode="screen"
          />
        </filter>
      </defs>
    </svg>
  </div>
</template>

<script setup>
import gsap from 'gsap'

const props = defineProps({
  width: { type: [Number, String], default: 300 },
  height: { type: [Number, String], default: 56 },
  as: { type: String, default: 'button' },
  active: { type: Boolean, default: false }
})

const filterId = `liquid-glass-${Math.random().toString(36).substr(2, 9)}`
const containerRef = ref(null)
const displacerRef = ref(null)
const blurRef = ref(null)
const isHovered = ref(false)

// Constants from the article (Base64 URIs)
// Since the displacement map was missing, I generated a placeholder gradient map that mimics the effect.
const DISPLACEMENT_MAP_URI = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjU2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzgwODA4MCIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2ZmZmZmZiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9XYiI3aWxsPSJ1cmwoI2cpIi8+PC9zdmc+`

// The provided specular map base64
const SPECULAR_LIGHTING_URI = "data:image/png;base64,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"

const ANIMATION_CONFIG = {
  initial: {
    scale: 1,
    displacement: 55,
    blur: 1
  },
  hover: {
    scale: 1.05,
    displacement: 125,
    blur: 4
  },
  click: {
    scaleDown: 0.95,
    scaleUp: 1.05
  },
  duration: {
    hover: 0.25,
    clickDown: 0.08,
    clickUp: 0.25
  },
  ease: {
    hover: "back.out(1.4)",
    hoverOut: "power2.out",
    clickDown: "power2.in",
    clickUp: "back.out(2)"
  }
}

const styles = computed(() => {
  return {
    '--btn-radius': '12px',
    '--btn-content-bg': 'transparent', // No background as requested, user has own bg
    '--liquid-glass-filters': `url(#${filterId})`
  }
})

const updateSVGAttributes = (val) => {
  if (displacerRef.value) displacerRef.value.setAttribute("scale", val.displacement)
  if (blurRef.value) blurRef.value.setAttribute("stdDeviation", val.blur)
}

const animateToState = (state) => {
  if (!containerRef.value) return
  
  const currentDis = parseFloat(displacerRef.value?.getAttribute('scale') || ANIMATION_CONFIG.initial.displacement)
  const currentBlur = parseFloat(blurRef.value?.getAttribute('stdDeviation') || ANIMATION_CONFIG.initial.blur)
  
  const obj = { displacement: currentDis, blur: currentBlur }
  const target = state === 'active' ? ANIMATION_CONFIG.hover : ANIMATION_CONFIG.initial
  
  gsap.to(obj, {
    displacement: target.displacement,
    blur: target.blur,
    duration: ANIMATION_CONFIG.duration.hover,
    ease: state === 'active' ? ANIMATION_CONFIG.ease.hover : ANIMATION_CONFIG.ease.hoverOut,
    onUpdate: () => updateSVGAttributes(obj)
  })

  gsap.to(containerRef.value, {
    scale: target.scale,
    duration: ANIMATION_CONFIG.duration.hover,
    ease: state === 'active' ? ANIMATION_CONFIG.ease.hover : ANIMATION_CONFIG.ease.hoverOut
  })
}

watch(() => props.active, (newVal) => {
  if (newVal) {
    animateToState('active')
  } else if (!isHovered.value) {
    animateToState('initial')
  }
})

const handleMouseEnter = () => {
  isHovered.value = true
  if (!props.active) animateToState('active')
}

const handleMouseLeave = () => {
  isHovered.value = false
  if (!props.active) animateToState('initial')
}

const handleClick = () => {
  if (!containerRef.value) return
  if (props.as === 'button' || props.as === 'a') {
    const tl = gsap.timeline()
    tl.to(containerRef.value, {
      scale: 0.92,
      duration: ANIMATION_CONFIG.duration.clickDown,
      ease: ANIMATION_CONFIG.ease.clickDown
    }).to(containerRef.value, {
      scale: ANIMATION_CONFIG.hover.scale,
      duration: ANIMATION_CONFIG.duration.clickUp,
      ease: ANIMATION_CONFIG.ease.clickUp
    })
  }
}
</script>

<style scoped>
.liquid-btn-wrapper {
  display: inline-block;
}

.liquid-glass-element {
  position: relative;
  width: 100%;
  border-radius: v-bind('styles["--btn-radius"]');
  overflow: hidden;
  cursor: pointer;
  background: transparent;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.liquid-glass-element:not(button):not(a) {
  cursor: default;
}

.glass-filter-layer {
  position: absolute;
  inset: 0;
  backdrop-filter: v-bind('styles["--liquid-glass-filters"]');
  -webkit-backdrop-filter: v-bind('styles["--liquid-glass-filters"]');
  z-index: 0;
  pointer-events: none;
}

.glass-content-layer {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: v-bind('styles["--btn-content-bg"]');
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
