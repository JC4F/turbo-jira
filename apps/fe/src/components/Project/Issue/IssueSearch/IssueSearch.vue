<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { debounce } from 'throttle-debounce'
import SearchResult from './SearchResult.vue'
import Spinner from '@/components/Loader.vue'
import { getProjectIssues } from '@/graphql/queries/issue'
import type { Issue } from '@/types/issue'
import { getters } from '@/stores'
import Input from '@/components/shared/Input/Input.vue'
import { sortByNewest } from '@/utils'

// Reactive state
const isSearchTermEmpty = ref(true)
const searchTerm = ref('')
const searchInputRef = ref<InstanceType<typeof Input> | null>(null)

// Apollo Query to fetch project issues
const { result, refetch, loading } = useQuery<{ getProjectIssues: Issue[] }>(getProjectIssues, {
  searchTerm: searchTerm.value
})

// Computed properties for project and issues
const project = computed(() => getters.project())

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

// Focus on search input when the component is mounted
onMounted(() => {
  if (searchInputRef.value) {
    const inputEl = searchInputRef.value.$el.querySelector('input')
    if (inputEl) {
      inputEl.focus()
    }
  }
})
</script>

<template>
  <div class="px-8 pb-16 pt-6">
    <div class="relative pr-7 mb-10">
      <j-input
        ref="searchInputRef"
        class="flat text-foreground"
        icon="search"
        @input="handleSearchChange"
        :value="searchTerm"
        :iconSize="26"
        placeholder="Search issues by summary, description..."
      />
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
        <div class="pt-2 text-15">Try again with a different term.</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

<style lang="scss"></style>
