<script lang="ts" setup>
import { defineProps } from 'vue'

defineProps<{
  items: string[]
}>()
</script>

<template>
  <div class="text-foreground text-15">
    <span v-for="(item, index) in items" :key="item">
      <span class="relative mx-2 font-lg" v-if="index !== 0">/</span>
      {{ item }}
    </span>
  </div>
</template>
