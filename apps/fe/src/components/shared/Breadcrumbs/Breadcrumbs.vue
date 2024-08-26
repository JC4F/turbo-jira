<script lang="ts" setup>
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@repo/ui'
import BreadcrumbList from '@ui/components/ui/breadcrumb/BreadcrumbList.vue'
import { defineProps } from 'vue'

defineProps<{
  items: string[]
}>()
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem v-for="(item, index) in items" :key="item">
        <BreadcrumbLink>
          <BreadcrumbSeparator v-if="index !== 0" class="mx-2" />
          {{ item }}
        </BreadcrumbLink>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
</template>
