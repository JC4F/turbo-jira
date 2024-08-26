<script lang="ts" setup>
import { computed } from 'vue'
import { Button } from '@repo/ui'
import { Github } from 'lucide-vue-next'
import AppFilters from '@/components/Project/Filters.vue'
import Lists from '@/components/Project/Lists/Lists.vue'
import type { Filters } from '@/types'
import { mutations, getters } from '@/stores'

// Computed property for project
const project = computed(getters.project)

// Handle filters change
const handleFiltersChange = (f: Filters) => {
  mutations.setFilters(f)
}
</script>

<template>
  <div class="pr-6 py-8 pl-10 h-full w-full flex flex-col">
    <j-breadcrumbs :items="['Projects', project.name, 'Kanban Board']" />
    <header class="mt-3 flex justify-between text-foreground">
      <div class="text-2xl font-medium">Kanban board</div>
      <a href="https://github.com/JC4F/turbo-jira" target="_blank" rel="noreferrer noopener">
        <Button variant="secondary">
          <Github class="w-4 h-4 xl:mr-2" />
          <span class="hidden xl:inline ml-1">Github Repo</span>
        </Button>
      </a>
    </header>
    <AppFilters @change="handleFiltersChange" />
    <Lists />
  </div>
</template>

<style></style>
