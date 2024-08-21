<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import NavbarLeft from './NavbarLeft.vue'
import Sidebar from './Sidebar.vue'
import Resizer from './Resizer.vue'

// Define props
const props = defineProps<{
  expanded: boolean
}>()

// Define emits
const emit = defineEmits(['onResize'])

// Method to handle resizing
const handleResize = (isExpanded: boolean) => {
  emit('onResize', isExpanded)
}
</script>

<template>
  <NavbarLeft />
  <Sidebar />
  <Resizer @resize="handleResize" :expanded="props.expanded" />
</template>

<template>
  <div class="navigation">
    <div class="flex flex-row h-full overflow-hidden">
      <NavbarLeft />
      <Sidebar :expanded="expanded" />
    </div>
    <Resizer :expanded="expanded" @onResize="handleResize" />
  </div>
</template>

<style lang="scss" scoped>
.navigation {
  bottom: 0px;
  left: 0px;
  position: fixed;
  top: 0px;
  z-index: 200;
}
</style>
