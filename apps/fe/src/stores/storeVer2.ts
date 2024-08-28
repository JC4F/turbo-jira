import type { Filters, Project, User } from '@/types'
import { getStoredAuthToken } from '@/utils/authToken'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // State
  const currentUser = ref<User>({} as User)
  const project = ref<Project>({} as Project)
  const isAuthenticated = ref<boolean>(Boolean(getStoredAuthToken()))
  const filters = reactive<Filters>({
    searchTerm: '',
    userIds: [],
    myOnly: false,
    recent: false
  })

  // Getters
  const getProject = () => project.value
  const getFilters = () => filters
  const getCurrentUser = () => currentUser.value
  const getIsAuthenticated = () => isAuthenticated.value

  // Actions (Mutations)
  function setFilters(newFilters: Filters) {
    filters.searchTerm = newFilters.searchTerm
    filters.userIds = newFilters.userIds
    filters.myOnly = newFilters.myOnly
    filters.recent = newFilters.recent
  }

  function setCurrentUser(user: User) {
    currentUser.value = user
  }

  function setProject(newProject: Project) {
    project.value = newProject
  }

  function setIsAuthenticated(isAuth: boolean) {
    isAuthenticated.value = isAuth
  }

  return {
    currentUser,
    project,
    isAuthenticated,
    filters,
    getProject,
    getFilters,
    getCurrentUser,
    getIsAuthenticated,
    setFilters,
    setCurrentUser,
    setProject,
    setIsAuthenticated
  }
})
