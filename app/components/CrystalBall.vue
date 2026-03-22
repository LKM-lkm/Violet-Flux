<template>
  <div ref="container" class="crystal-ball-container">
    <canvas ref="canvas" class="crystal-canvas"></canvas>
    <!-- 底部装饰圆环，与 Three.js 场景同步 -->
    <div class="base-rings">
      <div class="ring ring-1"></div>
      <div class="ring ring-2"></div>
    </div>
  </div>
</template>

<script setup>
import * as THREE from 'three'
import { gsap } from 'gsap'

const container = ref(null)
const canvas = ref(null)

let scene, camera, renderer, crystal, internalCore, particles
let animationFrameId

onMounted(() => {
  initThree()
  animate()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(animationFrameId)
  if (renderer) {
    renderer.dispose()
  }
})

const initThree = () => {
  if (!container.value || !canvas.value) return
  
  // Scene setup
  scene = new THREE.Scene()
  
  let width = container.value.clientWidth
  let height = container.value.clientHeight
  
  // If dimensions are zero, try to wait or use a reasonable default
  if (width === 0 || height === 0) {
    width = 400
    height = 400
  }
  
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.z = 5
  
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas.value,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    })
    renderer.setSize(width, height, false) // false means don't force style
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  } catch (e) {
    console.error('Three.js Renderer init failed:', e)
    return
  }

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const mainLight = new THREE.PointLight(0xb497d7, 2, 10)
  mainLight.position.set(2, 3, 4)
  scene.add(mainLight)

  const purpleLight = new THREE.PointLight(0x9163c0, 1.5, 10)
  purpleLight.position.set(-2, -1, 3)
  scene.add(purpleLight)

  // Crystal Ball Geometry
  const geometry = new THREE.SphereGeometry(1.5, 64, 64)
  
  // Crystal Material (Glass-like)
  const crystalMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0,
    transmission: 1, // Full transparency
    thickness: 1, // Refraction thickness
    ior: 1.5, // Index of refraction
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    attenuationColor: 0xffffff,
    attenuationDistance: 0.5,
    transparent: true,
    opacity: 0.8,
  })

  crystal = new THREE.Mesh(geometry, crystalMaterial)
  scene.add(crystal)

  // Internal Glowing Core
  const coreGeometry = new THREE.SphereGeometry(0.6, 32, 32)
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0xb497d7,
    transparent: true,
    opacity: 0.4
  })
  internalCore = new THREE.Mesh(coreGeometry, coreMaterial)
  scene.add(internalCore)

  // Internal Dust/Flux Particles
  const particlesCount = 200
  const posArray = new Float32Array(particlesCount * 3)
  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 2.2
  }
  
  const particlesGeometry = new THREE.BufferGeometry()
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
  
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0xffffff,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  })
  
  particles = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particles)

  // GSAP Floating Animation
  gsap.to(crystal.position, {
    y: 0.2,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
  })
  
  gsap.to(internalCore.scale, {
    x: 1.2,
    y: 1.2,
    z: 1.2,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  })
}

const handleResize = () => {
  if (!container.value) return
  const width = container.value.clientWidth
  const height = container.value.clientHeight
  
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  
  renderer.setSize(width, height)
}

const animate = () => {
  if (!renderer) return
  animationFrameId = requestAnimationFrame(animate)
  
  if (crystal) {
    crystal.rotation.y += 0.005
    crystal.rotation.x += 0.002
  }
  
  if (particles) {
    particles.rotation.y -= 0.002
    particles.rotation.z += 0.001
  }
  
  if (internalCore) {
    internalCore.rotation.z += 0.01
  }
  
  renderer.render(scene, camera)
}
</script>

<style scoped>
.crystal-ball-container {
  width: 100%;
  height: 500px;
  min-width: 300px;
  min-height: 300px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.crystal-canvas {
  width: 100% !important;
  height: 100% !important;
  z-index: 2;
  filter: drop-shadow(0 0 50px rgba(180, 151, 215, 0.4));
}

.base-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotateX(75deg);
  width: 300px;
  height: 300px;
  z-index: 1;
}

.ring {
  position: absolute;
  inset: 0;
  border: 2px solid var(--primary);
  border-radius: 50%;
  opacity: 0.2;
  box-shadow: 0 0 20px var(--primary-glow), inset 0 0 20px var(--primary-glow);
}

.ring-1 {
  animation: ring-rotate 10s linear infinite;
}

.ring-2 {
  inset: -20px;
  border-style: dashed;
  animation: ring-rotate 15s linear infinite reverse;
  opacity: 0.1;
}

@keyframes ring-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
