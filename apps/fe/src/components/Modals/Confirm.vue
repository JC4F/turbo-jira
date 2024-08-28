<script lang="ts" setup>
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle
} from '@repo/ui'
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

const handleUpdateOpen = (value: boolean) => {
  if (!value) handleClose()
}

onUnmounted(() => {
  isWorking.value = false
})
</script>

<template>
  <Dialog class="z-[99999]" :open="true" @update:open="handleUpdateOpen">
    <DialogContent class="z-[99999] w-[600px]">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>
          {{ message }}
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <Button :disabled="isWorking" @click="handleConfirmed" class="mr-2">
          {{ confirmText }}
        </Button>
        <Button @click="handleClose" class="mr-2" variant="outline">Cancel</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
