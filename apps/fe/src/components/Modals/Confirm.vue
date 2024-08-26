<script lang="ts" setup>
import { Button } from '@repo/ui'
import { ref, onUnmounted, defineProps, defineEmits } from 'vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: undefined
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  variant: {
    type: String,
    default: 'primary'
  }
})

const emit = defineEmits(['confirm', 'close'])

const isWorking = ref<boolean>(false)

const handleConfirmed = () => {
  if (isWorking.value) return
  isWorking.value = true
  emit('confirm')
}

const handleClose = () => emit('close')

onUnmounted(() => {
  isWorking.value = false
})
</script>

<template>
  <div class="px-10 py-8">
    <div class="pb-4 text-2xl font-medium leading-normal text-foreground">
      {{ title }}
    </div>
    <p class="pb-4 whitespace-pre-wrap text-15">{{ message }}</p>
    <div class="flex pt-3">
      <Button :disabled="isWorking" @click="handleConfirmed" class="mr-2">{{ confirmText }}</Button>
      <Button @click="handleClose" class="mr-2" variant="outline">Cancel</Button>
    </div>
  </div>
</template>
