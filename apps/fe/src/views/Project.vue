<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { mutations } from '@/stores'
import { getProjectWithUsersAndIssues } from '@/graphql/queries/project'
import Navigation from '@/components/Navigation/Navigation.vue'
import PageLoader from '@/components/Loader.vue'
import ErrorPage from '@/components/ErrorPage.vue'

// Reactive state
const expanded = ref<boolean>(true)

// Handle navigation resize
const handleNavigationResize = (isExpanded: boolean) => {
  expanded.value = isExpanded
}

// Computed styles based on navigation state
const getContentStyles = computed(() => ({
  'padding-left': `${expanded.value ? 240 : 20}px`,
  'margin-left': '64px'
}))

// Media query handling
const match = window.matchMedia('(max-width: 1100px)')
const matchHandler = (e: MediaQueryListEventInit) => {
  expanded.value = !e.matches
}

// Initial media query check
onMounted(() => {
  matchHandler(match)
  match.addListener(matchHandler)
})

// Clean up listener on unmount
onBeforeUnmount(() => {
  match.removeListener(matchHandler)
})

// Apollo query
const { loading, onResult, error } = useQuery(
  getProjectWithUsersAndIssues,
  {},
  { fetchPolicy: 'no-cache' }
)

onResult((res) => {
  if (res && res.data) {
    mutations.setProject(res.data.getProjectWithUsersAndIssues)
  }
})
</script>

<template>
  <div class="w-full h-full flex">
    <Navigation @onResize="handleNavigationResize" :expanded="expanded" />
    <div :style="getContentStyles" id="content">
      <ErrorPage v-if="error" />
      <PageLoader v-else-if="loading" />
      <router-view class="page" v-else />
    </div>
  </div>
</template>
