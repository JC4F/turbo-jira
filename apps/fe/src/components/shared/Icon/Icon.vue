<script lang="ts" setup>
import { computed } from 'vue'

// Define props
const props = defineProps<{
  name: string
  size?: number
  fill?: string
}>()

// Computed properties
const iconStyles = computed(() => ({
  width: `${props.size ?? 16}px`,
  height: `${props.size ?? 16}px`,
  fill: props.fill ?? 'currentColor'
}))
</script>

<template>
  <svg v-bind="$attrs" :style="iconStyles">
    <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#' + name"></use>
  </svg>
</template>
