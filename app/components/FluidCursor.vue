<script setup lang="ts">
const props = withDefaults(defineProps<{
  simResolution?: number
  dyeResolution?: number
  densityDissipation?: number
  velocityDissipation?: number
  pressure?: number
  curl?: number
  splatRadius?: number
  splatForce?: number
  transparent?: boolean
}>(), {
  simResolution: 128,
  dyeResolution: 1440,
  densityDissipation: 3.5,
  velocityDissipation: 2,
  pressure: 0.1,
  curl: 3,
  splatRadius: 0.2,
  splatForce: 6000,
  transparent: true
})

const canvas = ref<HTMLCanvasElement>()

onMounted(() => {
  if (!canvas.value) return
  const gl = canvas.value.getContext('webgl2')
  if (!gl) return

  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight

  // Simplified fluid simulation
  let pointer = { x: 0, y: 0, dx: 0, dy: 0 }

  const handleMove = (e: MouseEvent) => {
    const rect = canvas.value!.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = 1 - (e.clientY - rect.top) / rect.height
    pointer = { x, y, dx: e.movementX, dy: -e.movementY }
  }

  canvas.value.addEventListener('mousemove', handleMove)

  const animate = () => {
    if (Math.abs(pointer.dx) > 0 || Math.abs(pointer.dy) > 0) {
      gl.clearColor(0, 0, 0, props.transparent ? 0 : 1)
      gl.clear(gl.COLOR_BUFFER_BIT)
      pointer.dx *= 0.95
      pointer.dy *= 0.95
    }
    requestAnimationFrame(animate)
  }
  animate()
})
</script>

<template>
  <canvas ref="canvas" class="fixed inset-0 pointer-events-none z-0" />
</template>
