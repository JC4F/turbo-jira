<script lang="ts" setup>
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@repo/ui'
import { defineProps } from 'vue'

defineProps<{
  items: string[]
}>()
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <template v-for="(item, index) in items" :key="item">
        <BreadcrumbSeparator v-if="index !== 0" class="mx-1" />
        <BreadcrumbItem>
          <BreadcrumbLink>
            {{ item }}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>
