<script setup lang="ts">
import { Book, Bug, SquareCheck } from 'lucide-vue-next'
import type { FunctionalComponent } from 'vue'
import { IssueType } from '@/types'

defineProps<{
  issueType: IssueType
}>()

const issueIcon: Record<IssueType, FunctionalComponent> = {
  [IssueType.TASK]: SquareCheck,
  [IssueType.STORY]: Book,
  [IssueType.BUG]: Bug
}
</script>

<template>
  <component :is="issueIcon[issueType]" class="w-4 h-4"></component>
</template>

<style scoped></style>
