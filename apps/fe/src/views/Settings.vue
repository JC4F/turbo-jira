<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import pick from 'lodash.pick'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { ProjectCategoryCopy, ProjectCategory } from '@/types/project'
import { getters, mutations } from '@/stores'
import { updateProject, getProjectWithUsersAndIssues } from '@/graphql/queries/project'
import { successToast, errorToast } from '@/plugins/toast'

// Reactive state
const isWorking = ref<boolean>(false)
const queryEnabled = ref<boolean>(false)

// Computed property for project
const project = computed(getters.project)

// Reactive DTO for project update
const projectUpdateDTO = reactive(pick(project.value, ['name', 'url', 'description', 'category']))

// Validation functions
const isRequired = (value: string) => ['', null, undefined].indexOf(value) === -1

const isValid = computed(
  () => isRequired(projectUpdateDTO.name) && isRequired(projectUpdateDTO.category)
)

// Project category options
const projectCategoryOptions = Object.values(ProjectCategory).map((category) => ({
  value: category,
  label: ProjectCategoryCopy[category]
}))

// Apollo mutation and query
const { mutate } = useMutation(updateProject)
const { refetch } = useQuery(getProjectWithUsersAndIssues, {}, () => ({
  fetchPolicy: 'network-only',
  enabled: queryEnabled.value
}))

// Handle project update
const handleUpdateProject = async () => {
  try {
    isWorking.value = true
    queryEnabled.value = true
    await mutate({ project: projectUpdateDTO })
    const res = await refetch()
    if (res?.data) {
      mutations.setProject(res.data.getProjectWithUsersAndIssues)
    }
    successToast('Changes have been saved successfully.').showToast()
  } catch (error) {
    errorToast('An error has occurred').showToast()
  } finally {
    isWorking.value = false
  }
}
</script>

<template>
  <div class="flex flex-col w-full h-full py-8 pl-10 pr-6">
    <j-breadcrumbs :items="['Projects', project.name, 'Project Details']" />
    <header class="flex justify-between mt-3 text-textDarkest">
      <div class="text-2xl font-medium">Project Details</div>
    </header>
    <form @submit.prevent style="max-width: 640px" autocomplete="off" novalidate>
      <div class="pt-5">
        <label class="label" for="name">Name</label>
        <j-input
          :value="projectUpdateDTO.name"
          id="name"
          placeholder="Project name"
          @input="(v: string) => (projectUpdateDTO.name = v)"
        />
      </div>
      <div class="pt-5">
        <label class="label" for="url">URL</label>
        <j-input
          :value="projectUpdateDTO.url"
          id="url"
          placeholder="URL"
          @input="(v: string) => (projectUpdateDTO.url = v)"
        />
      </div>
      <div class="pt-5">
        <label class="label" for="desc">Description</label>
        <j-textarea
          placeholder="No description"
          class="text-15 bg-backgroundLightest"
          :value="projectUpdateDTO.description"
          @input="(v: string) => (projectUpdateDTO.description = v)"
        />
        <div class="tip">Describe the project in as much detail as you'd like.</div>
      </div>
      <div class="pt-5">
        <label class="label" for="name">Project Category</label>
        <j-select
          :value="projectUpdateDTO.category"
          searchable
          :options="projectCategoryOptions"
          @change="(v: ProjectCategory) => (projectUpdateDTO.category = v)"
        />
      </div>
      <div class="pt-7">
        <j-button
          :isWorking="isWorking"
          :disabled="!isValid"
          @click.prevent="handleUpdateProject"
          variant="primary"
          >Save changes</j-button
        >
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.label {
  @apply pb-2 font-medium text-[13px] text-textMedium block;
}
.tip {
  @apply pt-1-5 text-textMedium text-[13px];
}
</style>
