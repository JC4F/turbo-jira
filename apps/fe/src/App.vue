<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { getters, mutations } from './stores'
import PageLoader from '@/components/Loader.vue'
import Modals from '@/components/Modals/Modals.vue'
import { getProjectWithUsersAndIssues } from '@/graphql/queries/project'

// Reactive state
const expanded = ref<boolean>(true)

// Computed property to check if the app is ready
const isAppReady = computed(
  () => getters.isAuthenticated() && Object.keys(getters.currentUser()).length !== 0
)

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
const { onResult } = useQuery(getProjectWithUsersAndIssues, {}, { fetchPolicy: 'no-cache' })

onResult((res) => {
  const { data } = res as any
  if (data) {
    mutations.setProject(data.getProjectWithUsersAndIssues)
  }
})
</script>

<template>
  <div id="root">
    <Modals />
    <PageLoader v-if="!isAppReady" />
    <div id="app-frame">
      <router-view></router-view>
    </div>
  </div>
</template>
