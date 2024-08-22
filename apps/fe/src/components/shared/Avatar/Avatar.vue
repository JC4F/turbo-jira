<script lang="ts" setup>
import { computed } from 'vue'
import { avatarColors } from '@/utils/colors'

// Define props
const props = defineProps<{
  avatarUrl?: string | null
  name?: string
  size?: number
  rounded?: boolean
}>()

// Computed properties
const getImageStyle = computed(() => ({
  display: 'inline-block',
  width: `${props.size || 32}px`,
  height: `${props.size || 32}px`,
  'border-radius': props.rounded ? '100%' : '3px',
  backgroundImage: `url('${props.avatarUrl || ''}')`,
  backgroundPosition: '50% 50%',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover'
}))

const getColorFromName = computed(
  () => avatarColors[(props.name?.toLocaleLowerCase().charCodeAt(0) || 0) % avatarColors.length]
)

const getLetterStyle = computed(() => ({
  width: `${props.size || 32}px`,
  height: `${props.size || 32}px`,
  background: getColorFromName.value,
  fontSize: `${Math.round((props.size || 32) / 2)}px`
}))
</script>

<template>
  <div :style="getImageStyle" v-if="avatarUrl" />
  <div v-else :style="getLetterStyle" class="letter"></div>
</template>
