<script lang="ts" setup>
import { getProjectWithUsersAndIssues, updateProject } from '@/graphql/queries/project'
import { errorToast, successToast } from '@/plugins/toast'
import { useAppStore } from '@/stores'
import {
  ProjectCategory,
  ProjectCategoryCopy,
  projectSettingSchema,
  type ProjectSettingDTO
} from '@/types/project'
import { Button, Textarea } from '@repo/ui'
import { toTypedSchema } from '@vee-validate/zod'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'

const store = useAppStore()

const isWorking = ref<boolean>(false)
const queryEnabled = ref<boolean>(false)

const project = computed(store.getProject)

const defaultProjectSettingValues: Partial<ProjectSettingDTO> = {}

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(projectSettingSchema),
  initialValues: defaultProjectSettingValues
})

// Apollo mutation and query
const { mutate } = useMutation(updateProject)
const { refetch } = useQuery(getProjectWithUsersAndIssues, {}, () => ({
  fetchPolicy: 'network-only',
  enabled: queryEnabled.value
}))

const handleUpdateProject = handleSubmit(async (values) => {
  try {
    isWorking.value = true
    queryEnabled.value = true
    await mutate({ project: values })
    const res = await refetch()
    if (res?.data) {
      store.setProject(res.data.getProjectWithUsersAndIssues)
    }
    successToast('Changes have been saved successfully.').showToast()
  } catch {
    errorToast('An error has occurred').showToast()
  } finally {
    isWorking.value = false
  }
})
</script>

<template>
  <div class="flex flex-col w-full h-full py-8 pl-10 pr-6">
    <j-breadcrumbs :items="['Projects', project.name, 'Project Details']" />
    <header class="flex justify-between mt-3 text-foreground">
      <div class="text-2xl font-medium">Project Details</div>
    </header>
    <form style="max-width: 640px" autocomplete="off" novalidate @submit="handleUpdateProject">
      <FormField class="pt-5" v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Name ..." v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField class="pt-5" v-slot="{ componentField }" name="url">
        <FormItem>
          <FormLabel>URL</FormLabel>
          <FormControl>
            <Input type="text" placeholder="URL ..." v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField class="pt-5" v-slot="{ componentField }" name="description">
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea placeholder="No description" class="resize-none" v-bind="componentField" />
          </FormControl>
          <FormDescription> Describe the project in as much detail as you'd like. </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField class="pt-5" v-slot="{ componentField }" name="category">
        <FormItem>
          <FormLabel>Category</FormLabel>

          <Select v-bind="componentField">
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="category in Object.values(ProjectCategory)"
                  :key="category"
                  :value="category"
                >
                  {{ ProjectCategoryCopy[category] }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </FormField>

      <div class="pt-7">
        <Button :disabled="isWorking"> Save changes </Button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.label {
  @apply pb-2 font-medium text-[13px] text-foreground block;
}
.tip {
  @apply pt-[0.375rem] text-foreground text-[13px];
}
</style>
