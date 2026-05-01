<script setup lang="ts">
import { computed, ref, onMounted, useId } from 'vue';
import { gu, yu, xu, vu, De, Tu } from '../utils/glass-logic';

/**
 * LiquidGlass Component
 * A premium glass refraction effect for Vue/Nuxt.
 */

interface Props {
  /** Unqiue ID for the SVG filter. If not provided, one will be generated. */
  id?: string;
  /** Width of the component in pixels. */
  width?: number;
  /** Height of the component in pixels. */
  height?: number;
  /** Border radius of the glass element. */
  radius?: number;
  /** Background blur intensity. Defaults to 4. */
  blur?: number;
  /** Thickness of the glass. Defaults to 10. */
  glassThickness?: number;
  /** Width of the bezel (edge refraction area). Defaults to 40. */
  bezelWidth?: number;
  /** Refractive index. Defaults to 1.5. */
  refractiveIndex?: number;
  /** Global scale factor for the refraction displacement. Defaults to 1. */
  scaleRatio?: number;
  /** Opacity of the specular (highlight) layer. Defaults to 0.5. */
  specularOpacity?: number;
  /** Hardness of the specular highlights. Larger values mean sharper highlights. Defaults to 2. */
  specularHardness?: number;
  /** Saturation boost for the refracted background. Defaults to 1.2. */
  refractionSaturation?: number;
  /** Optional magnifying scale factor. If provided, adds a magnifying effect. */
  magnifyingScale?: number;
  /** Optional color scheme adjustment. */
  colorScheme?: 'light' | 'dark';
  /** Device Pixel Ratio. Defaults to window.devicePixelRatio. */
  dpr?: number;
  /** HTML tag for the wrapper element. Defaults to 'div'. */
  as?: string;
}

const props = withDefaults(defineProps<Props>(), {
  width: 300,
  height: 200,
  radius: 20,
  blur: 4,
  glassThickness: 10,
  bezelWidth: 40,
  refractiveIndex: 1.5,
  scaleRatio: 1,
  specularOpacity: 0.5,
  specularHardness: 2,
  refractionSaturation: 1.2,
  as: 'div'
});

// Generate a unique ID if not provided
const filterId = props.id || useId() || `glass-${Math.random().toString(36).slice(2, 11)}`;

const clientDpr = ref(1);
onMounted(() => {
  clientDpr.value = window.devicePixelRatio || 1;
});

const currentDpr = computed(() => props.dpr ?? clientDpr.value);

const bezelHeightFn = Tu.fn;

// 1. Calculate displacement map
const x = computed(() => 
  gu(props.glassThickness, props.bezelWidth, bezelHeightFn, props.refractiveIndex)
);

const maxRefraction = computed(() => 
  Math.max(...x.value.map(q => Math.abs(q)))
);

const displacementUrl = computed(() => {
  if (!import.meta.client) return '';
  const imageData = yu(
    props.width, 
    props.height, 
    props.width, 
    props.height, 
    props.radius, 
    props.bezelWidth, 
    maxRefraction.value, 
    x.value, 
    currentDpr.value
  );
  return De(imageData);
});

// 2. Calculate specular layer
const mappedHardness = computed(() => 4 / Math.max(0.1, props.specularHardness));

const specularUrl = computed(() => {
  if (!import.meta.client) return '';
  const imageData = xu(
    props.width, 
    props.height, 
    props.radius, 
    props.bezelWidth, 
    1.047, 
    currentDpr.value, 
    mappedHardness.value
  );
  return De(imageData);
});

// 3. Magnifying displacement map
const magnifyingUrl = computed(() => {
  if (props.magnifyingScale === undefined || !import.meta.client) return '';
  const imageData = vu(props.width, props.height);
  return De(imageData);
});

const finalScale = computed(() => maxRefraction.value * props.scaleRatio);

// Color schemas
const darkMatrix = "0.8 0 0 0 0  0 0.8 0 0 0  0 0 0.8 0 0  0 0 0 1 0";
const lightMatrix = "1.2 0 0 0 0  0 1.2 0 0 0  0 0 1.2 0 0  0 0 0 1 0";

</script>

<template>
  <component 
    :is="as" 
    class="liquid-glass-wrapper"
    :style="{ filter: `url(#${filterId})` }"
  >
    <!-- The content that will be filtered -->
    <slot />

    <!-- SVG Filter Definition (Injected into body or kept nearby) -->
    <Teleport to="body">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        style="position: absolute; width: 0; height: 0; pointer-events: none;" 
        color-interpolation-filters="sRGB"
      >
        <defs>
          <filter 
            :id="filterId" 
            :x="-width * 0.2" 
            :y="-height * 0.2" 
            :width="width * 1.4" 
            :height="height * 1.4" 
            primitiveUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <!-- Magnifying layer -->
            <template v-if="magnifyingScale !== undefined && magnifyingUrl">
              <feImage 
                :href="magnifyingUrl" 
                result="magnifying_displacement_map" 
                x="0" y="0" 
                :width="width" 
                :height="height" 
                preserveAspectRatio="none" 
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="magnifying_displacement_map"
                :scale="magnifyingScale"
                xChannelSelector="R"
                yChannelSelector="G"
                result="magnified_source"
              />
            </template>

            <!-- Color Scheme Adjustment -->
            <feColorMatrix
              v-if="colorScheme"
              :in="magnifyingScale !== undefined ? 'magnified_source' : 'SourceGraphic'"
              type="matrix"
              :values="colorScheme === 'dark' ? darkMatrix : lightMatrix"
              result="brightened_source"
            />

            <!-- Core Pipeline -->
            <feGaussianBlur
              :in="colorScheme ? 'brightened_source' : magnifyingScale !== undefined ? 'magnified_source' : 'SourceGraphic'"
              :stdDeviation="blur"
              result="blurred_source"
            />

            <feImage 
              :href="displacementUrl" 
              result="displacement_map" 
              x="0" y="0" 
              :width="width" 
              :height="height" 
              preserveAspectRatio="none" 
            />

            <feDisplacementMap
              in="blurred_source"
              in2="displacement_map"
              :scale="finalScale"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />

            <feColorMatrix
              in="displaced"
              type="saturate"
              :values="refractionSaturation.toString()"
              result="displaced_saturated"
            />

            <feImage 
              :href="specularUrl" 
              result="specular_layer" 
              x="0" y="0" 
              :width="width" 
              :height="height" 
              preserveAspectRatio="none" 
            />

            <feComponentTransfer in="specular_layer" result="specular_faded">
              <feFuncA type="linear" :slope="specularOpacity" />
            </feComponentTransfer>

            <feBlend in="specular_faded" in2="displaced_saturated" mode="screen" result="final_output" />
            
            <!-- Compositing to keep original alpha structure if needed -->
            <feComposite in="final_output" in2="SourceAlpha" operator="in" />
          </filter>
        </defs>
      </svg>
    </Teleport>
  </component>
</template>

<style scoped>
.liquid-glass-wrapper {
  position: relative;
  display: inline-block;
  /* Ensure the container has dimensions if possible */
  width: v-bind("`${width}px`" || 'auto');
  height: v-bind("`${height}px`" || 'auto');
}
</style>
