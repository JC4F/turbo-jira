<script setup lang="ts">
import Spinner from '@/components/Loader.vue'
import { getProjectIssues } from '@/graphql/queries/issue'
import { useAppStore } from '@/stores'
import type { Issue } from '@/types/issue'
import { sortByNewest } from '@/utils'
import { Input, Sheet, SheetContent } from '@repo/ui'
import { useQuery } from '@vue/apollo-composable'
import { Search } from 'lucide-vue-next'
import { debounce } from 'throttle-debounce'
import { computed, ref } from 'vue'
import SearchResult from './SearchResult.vue'

const emit = defineEmits(['close'])

const store = useAppStore()

// Reactive state
const isSearchTermEmpty = ref(true)
const searchTerm = ref('')

// Apollo Query to fetch project issues
const { result, refetch, loading } = useQuery<{ getProjectIssues: Issue[] }>(getProjectIssues, {
  searchTerm: searchTerm.value
})

// Computed properties for project and issues
const project = computed(store.getProject)

const matchingIssues = computed(() => result.value?.getProjectIssues ?? [])

const recentIssues = computed(() => sortByNewest(project.value.issues, 'createdAt').slice(0, 10))

// Handle search input change with debounce
const handleSearchChange = debounce(500, (value: string) => {
  searchTerm.value = value.trim()
  isSearchTermEmpty.value = !searchTerm.value
  if (searchTerm.value) {
    refetch({ searchTerm: searchTerm.value })
  }
})

const handleUpdateOpen = (value: boolean) => {
  if (!value) emit('close')
}
</script>

<template>
  <Sheet :open="true" @update:open="handleUpdateOpen">
    <SheetContent class="w-[600px]" side="left" hide-close>
      <div class="relative pr-7 mb-10 w-full max-w-sm items-center">
        <Input
          autofocus
          type="text"
          placeholder="Search issues by summary, description..."
          class="pl-10 text-foreground"
          :value="searchTerm"
          @input="handleSearchChange"
        />
        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
          <Search class="size-6 text-muted-foreground" />
        </span>
      </div>

      <div
        class="pt-10 flex flex-col justify-center items-center"
        v-if="loading && !isSearchTermEmpty"
      >
        <Spinner />
      </div>
      <div class="fadeIn" v-else>
        <div v-if="isSearchTermEmpty && recentIssues.length > 0">
          <div class="text-foreground font-bold text-xs uppercase pb-3">Recent Issues</div>
          <SearchResult v-for="issue in recentIssues" :key="issue.id" :issue="issue" />
        </div>
        <div v-if="!isSearchTermEmpty && matchingIssues.length > 0">
          <div class="text-foreground font-bold text-xs uppercase pb-3">Matching Issues</div>
          <SearchResult v-for="issue in matchingIssues" :key="issue.id" :issue="issue" />
        </div>
        <div
          class="pt-10 flex flex-col justify-center items-center"
          v-if="!isSearchTermEmpty && !loading && matchingIssues.length === 0"
        >
          <j-icon :size="125" name="no-result"></j-icon>
          <div class="pt-8 font-medium text-xl">
            We couldn&apos;t find anything matching your search
          </div>
          <div class="pt-2">Try again with a different term.</div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
