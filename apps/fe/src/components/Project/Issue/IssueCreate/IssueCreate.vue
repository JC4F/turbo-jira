<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import Omit from 'lodash.omit'
import { useMutation, useQuery } from '@vue/apollo-composable'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  Input
} from '@repo/ui'
import { ArrowDown, ArrowUp, X, XIcon } from 'lucide-vue-next'
import FormItem from '@ui/components/ui/form/FormItem.vue'
import { getters, mutations } from '@/stores'
import {
  IssueType,
  IssuePriority,
  IssuePriorityCopy,
  IssueTypeCopy,
  IssueStatus,
  type IssueCreateDTO,
  type Issue
} from '@/types/issue'
import { issuePriorityColors } from '@/utils/colors'
import { createIssue, getProjectIssues } from '@/graphql/queries/issue'
import { successToast } from '@/plugins'
import IssueTypeIcon from '@/components/shared/issue-type-icon/issue-type-icon.vue'

const emit = defineEmits(['close'])

// Computed values for project and current user
const project = computed(getters.project)
const currentUser = computed(getters.currentUser)

// Computed value for project users
const projectUsers = computed(() => {
  if (!project.value) return []
  return project.value.users.map((user) => ({
    value: user.id,
    label: user.name,
    user
  }))
})

// Default values for a new issue
const defaultIssueValues = {
  type: IssueType.TASK,
  title: '',
  description: '',
  reporterId: currentUser.value.id,
  userIds: [],
  priority: IssuePriority.MEDIUM
}

// Loading states
const loading = ref<boolean>(false)

const { mutate, loading: isMutationLoading } = useMutation(createIssue)
const { refetch: fetchProjectIssues, loading: isFetchIssuesLoading } = useQuery<{
  getProjectIssues: Issue[]
}>(getProjectIssues)

// Computed property to check if the component is currently working
const isWorking = computed(() => loading.value && isFetchIssuesLoading && isMutationLoading)

const formSchema = toTypedSchema(
  z.object({
    issuetype: z.string(),
    type: z.nativeEnum(IssueType),
    title: z.string(),
    reporterId: z.string(),
    summary: z.string(),
    description: z.string(),
    reporter: z.string(),
    userIds: z.string().array(),
    priority: z.nativeEnum(IssuePriority)
  })
)

const { handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: defaultIssueValues
})

const getUserById = (userId: string) =>
  Omit(
    project.value.users.find((user) => user.id === userId),
    ['__typename', 'name', 'avatarUrl', 'projectId']
  )

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  const issue: IssueCreateDTO = {
    ...values,
    status: IssueStatus.BACKLOG,
    projectId: project.value.id,
    users: values.userIds.map(getUserById)
  }
  try {
    await mutate({ createIssueInput: issue } as any)
    const res = await fetchProjectIssues()
    if (res?.data) {
      mutations.setProject({
        ...project.value,
        issues: res.data.getProjectIssues
      })
    }
    loading.value = false
    emit('close')
    successToast('Issue has been successfully created').showToast()
  } catch (error) {
    console.error(error)
    emit('close')
  }
})
</script>

<template>
  <div class="w-full h-full px-8 py-5">
    <div class="flex items-center py-3 text-foreground">
      <div class="text-xl">Create issue</div>
      <div class="flex-auto"></div>
      <Button @click="$emit('close')" variant="outline">
        <X class="w-4 h-4" />
      </Button>
    </div>
    <form novalidate autocomplete="off" @submit="onSubmit">
      <div class="formField">
        <label for="issuetype" class="formFieldLabel">Issue type</label>
        <j-select
          id="issuetype"
          :value="issueCreateObject.type"
          searchable
          :options="
            Object.values(IssueType).map((type) => ({
              value: type,
              label: IssueTypeCopy[type],
              icon: IssueTypeCopy[type].toLowerCase()
            }))
          "
          @change="setFieldValue('type', $event)"
          customRender
        >
          <template v-slot:default="{ label, icon }">
            <div class="flex items-center my-px mr-4">
              <IssueTypeIcon :issueType="icon" class="w-4 h-4 mr-1" />
              <div class="pl-2 pr-1">
                {{ label }}
              </div>
            </div>
          </template>
        </j-select>
        <div class="formFieldTip">Start typing to get a list of possible matches.</div>
      </div>

      <div class="sep"></div>

      <FormField v-slot="{ componentField }" name="username">
        <FormItem>
          <FormLabel>Short Summary</FormLabel>
          <FormControl>
            <Input type="text" placeholder="shadcn" v-bind="componentField" />
          </FormControl>
          <FormDescription> Concisely summarize the issue in one or two sentences </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <div class="formField">
        <label class="formFieldLabel" for="description">Description</label>
        <j-text-editor
          :mode="`write`"
          @input="setFieldValue('description', $event)"
          class="descriptionEditor"
          id="description"
        />
        <div class="formFieldTip">Describe the issue in as much detail as you'd like.</div>
      </div>
      <div class="formField">
        <label class="formFieldLabel" for="reporter">Reporter</label>
        <j-select
          id="reporter"
          searchable
          :value="issueCreateObject.reporterId"
          :options="projectUsers"
          customRender
          @change="setFieldValue('reporterId', $event)"
        >
          <template v-slot:default="{ label, user, remove, optionValue }">
            <div class="flex items-center my-px mr-4">
              <Avatar class="w-5 h-5">
                <AvatarImage :src="user.avatarUrl" alt="avatar" />
                <AvatarFallback>{{ user.name }}</AvatarFallback>
              </Avatar>
              <div class="pl-2 pr-1">
                {{ label }}
              </div>
              <XIcon v-if="remove" @click="remove(optionValue)" class="text-background" />
            </div>
          </template>
        </j-select>
      </div>
      <div class="formField">
        <label class="formFieldLabel" for="userIds">Assignees</label>
        <j-select
          id="userIds"
          :value="issueCreateObject.userIds"
          searchable
          :options="projectUsers"
          :isMulti="true"
          @change="setFieldValue('userIds', $event)"
          customRender
        >
          <template v-slot:default="{ label, user, remove, optionValue }">
            <div class="flex items-center my-px mr-4">
              <Avatar class="w-5 h-5">
                <AvatarImage :src="user.avatarUrl" alt="avatar" />
                <AvatarFallback>{{ user.name }}</AvatarFallback>
              </Avatar>
              <div class="pl-2 pr-1">
                {{ label }}
              </div>
              <XIcon v-if="remove" @click="remove(optionValue)" class="text-background" />
            </div>
          </template>
        </j-select>
      </div>
      <div class="formField">
        <label class="formFieldLabel" for="priority">Priority</label>
        <j-select
          id="priority"
          :value="issueCreateObject.priority"
          searchable
          :options="
            Object.values(IssuePriority).map((p) => ({
              value: p,
              label: IssuePriorityCopy[p],
              icon: parseInt(p) < 3 ? ArrowDown : ArrowUp,
              color: issuePriorityColors[p]
            }))
          "
          customRender
          @change="setFieldValue('priority', $event)"
        >
          <template v-slot:default="{ label, icon, color }">
            <div class="flex items-center my-px mr-4">
              <component :is="icon" class="w-4 h-4" :style="{ color }"></component>

              <div class="pl-2 pr-1">
                {{ label }}
              </div>
            </div>
          </template>
        </j-select>
        <div class="formFieldTip">Priority in relation to other issues.</div>
      </div>
      <div class="flex items-center justify-end formField">
        <Button @click.prevent="handleSubmit" :disabled="!isValidDTO || isWorking" class="ml-3"
          >Create</Button
        >
        <Button @click.prevent="$emit('close')" class="ml-3" variant="secondary">Cancel</Button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.formField {
  margin-top: 20px;
}
.sep {
  margin-top: 20px;
  background-color: rgb(244 245 247);
}
.formFieldLabel {
  display: block;
  padding-bottom: 5px;
  color: rgb(94 108 132);
  font-size: 13px;
  font-weight: 500;
}
.formFieldTip {
  padding-top: 6px;
  color: rgb(94 108 132);
  font-size: 13px;
}

.descriptionEditor .ql-editor {
  min-height: 110px;
}
</style>
