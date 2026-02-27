<template>
  <UAlert
    :color="color"
    :title="title"
    :description="description"
    :icon="icon"
  >
    <template v-if="$slots.default" #default>
      <slot />
    </template>
  </UAlert>
</template>

<script setup lang="ts">
defineProps({
  color: {
    type: String,
    default: 'primary'
  },
  title: String,
  description: String,
  icon: String
})
</script>