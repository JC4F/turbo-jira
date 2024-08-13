<!-- eslint-disable eslint-comments/require-description -->
<script setup lang="ts">
import { Button } from '@repo/ui'
import { RouterLink, RouterView } from 'vue-router'
import { onMounted } from 'vue'

onMounted(() => {
  // eslint-disable-next-line no-console
  console.log(import.meta.env.VITE_BASE_URL)
})
</script>

<template>
  <header class="mt-2">
    <nav class="flex justify-center gap-2">
      <Button as-child variant="outline">
        <RouterLink to="/">Home</RouterLink>
      </Button>
      <Button as-child variant="outline">
        <RouterLink to="/about">About</RouterLink>
      </Button>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped></style>
