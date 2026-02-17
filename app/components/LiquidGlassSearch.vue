<template>
  <div class="liquid-input-wrapper">
    <div
      ref="containerRef"
      class="liquid-glass-input-container"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <div class="input-filter"></div>
      <div class="input-content">
        <Icon name="lucide:search" class="search-icon" />
        <input
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          type="text"
          :placeholder="placeholder"
          class="liquid-input-field"
          @focus="handleFocus"
          @blur="handleBlur"
        />
      </div>
    </div>

    <!-- Hidden SVG Filter -->
    <svg class="liquid-glass-svg" aria-hidden="true">
      <defs>
        <filter :id="filterId" color-interpolation-filters="sRGB">
          <feGaussianBlur
            ref="blurRef"
            in="SourceGraphic"
            :stdDeviation="ANIMATION_CONFIG.initial.blur"
            result="blurred_source"
          />
          
          <!-- Liquid Displacement -->
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.01 0.01" 
            numOctaves="3" 
            result="noise"
          />
          <feDisplacementMap
            ref="displacerRef"
            in="blurred_source"
            in2="noise"
            :scale="ANIMATION_CONFIG.initial.displacement"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          
          <feColorMatrix
            in="displaced"
            type="saturate"
            values="1.2"
            result="displaced_saturated"
          />

          <!-- Specular Highlight Overlay -->
          <feSpecularLighting
            surfaceScale="5"
            specularConstant="0.6"
            specularExponent="20"
            lighting-color="#ffffff"
            in="displaced"
            result="specular"
          >
            <fePointLight x="150" y="-100" z="300" />
          </feSpecularLighting>
          
          <feComposite
            in="specular"
            in2="displaced"
            operator="in"
            result="specular_masked"
          />

          <feBlend in="specular_masked" in2="displaced" mode="screen" />
        </filter>
      </defs>
    </svg>
  </div>
</template>

<script setup>
import gsap from 'gsap'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Search archive...' },
  width: { type: [Number, String], default: 320 },
  height: { type: [Number, String], default: 56 } // Standard height
})

const emit = defineEmits(['update:modelValue'])

const filterId = `liquid-search-${Math.random().toString(36).substr(2, 9)}`
const containerRef = ref(null)
const displacerRef = ref(null)
const blurRef = ref(null)
const isFocused = ref(false)

const ANIMATION_CONFIG = {
  initial: {
    displacement: 30, // Less displacement for search box initially
    blur: 0.5
  },
  active: { // Hover or Focus
    displacement: 80,
    blur: 2
  },
  duration: {
    enter: 0.4,
    leave: 0.5
  },
  ease: {
    enter: "back.out(1.5)",
    leave: "power2.out"
  }
}

const updateSVGAttributes = (val) => {
  if (displacerRef.value) displacerRef.value.setAttribute("scale", val.displacement)
  if (blurRef.value) blurRef.value.setAttribute("stdDeviation", val.blur)
}

const animateToState = (state) => {
  if (!containerRef.value) return
  
  const currentDis = parseFloat(displacerRef.value?.getAttribute('scale') || ANIMATION_CONFIG.initial.displacement)
  const currentBlur = parseFloat(blurRef.value?.getAttribute('stdDeviation') || ANIMATION_CONFIG.initial.blur)
  
  const obj = { displacement: currentDis, blur: currentBlur }
  const target = state === 'active' ? ANIMATION_CONFIG.active : ANIMATION_CONFIG.initial
  
  gsap.to(obj, {
    displacement: target.displacement,
    blur: target.blur,
    duration: ANIMATION_CONFIG.duration.enter,
    ease: state === 'active' ? ANIMATION_CONFIG.ease.enter : ANIMATION_CONFIG.ease.leave,
    onUpdate: () => updateSVGAttributes(obj)
  })
}

const handleMouseEnter = () => {
  if (!isFocused.value) animateToState('active')
}

const handleMouseLeave = () => {
  if (!isFocused.value) animateToState('initial')
}

const handleFocus = () => {
  isFocused.value = true
  animateToState('active')
}

const handleBlur = () => {
  isFocused.value = false
  animateToState('initial')
}
</script>

<style scoped>
.liquid-input-wrapper {
  display: inline-block;
  position: relative;
}

.liquid-glass-input-container {
  position: relative;
  width: v-bind('typeof width === "number" ? width + "px" : width');
  height: v-bind('typeof height === "number" ? height + "px" : height');
  border-radius: 0.8rem;
  overflow: hidden; /* Ensure content stays within rounded corners */
}

.input-filter {
  position: absolute;
  inset: 0;
  background: var(--glass-bg); /* Use glass background */
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid var(--glass-border);
  border-radius: 0.8rem;
  filter: v-bind('"url(#" + filterId + ")"');
  opacity: 1;
  z-index: 0;
}

.input-content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1.25rem;
  font-size: 1.1rem;
  color: var(--text-muted);
  opacity: 0.5;
  pointer-events: none;
}

.liquid-input-field {
  width: 100%;
  height: 100%;
  padding: 0 1.25rem 0 3.25rem;
  background: transparent;
  border: none;
  color: var(--text);
  font-family: inherit;
  font-size: 0.9375rem;
  outline: none;
  font-weight: 500;
}

.liquid-input-field::placeholder {
  color: var(--text-muted);
  opacity: 0.6;
}

.liquid-glass-svg {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}
</style>
