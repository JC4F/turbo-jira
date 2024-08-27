<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { Button, Textarea } from '@repo/ui'
import type { Comment } from '@/types'
import { formatDateTimeConversational } from '@/utils/date'
import { createComment, updateComment } from '@/graphql/queries/comment'
import { getters } from '@/stores'

// Define props
const props = defineProps<{
  comment: Comment
  isCreate?: boolean
  refetchIssue: Function
}>()

// Emit events
const emit = defineEmits(['delete'])

// Computed properties
const currentUser = computed(getters.currentUser)
const newComment = ref<string>(props.isCreate ? '' : props.comment.body)
const isWorking = ref<boolean>(false)
const isFormOpen = ref<boolean>(false)
// const isCommentDeleteConfirmOpen = ref<boolean>(false)
const readOnly = computed(() => currentUser.value.id !== props.comment.userId)
const createdAt = computed(() => formatDateTimeConversational(props.comment.createdAt))

// GraphQL mutations
const { mutate: createMutation } = useMutation(createComment)
const { mutate: updateMutation } = useMutation(updateComment)

// Handlers
const handleCommentCreate = async () => {
  if (isWorking.value) return
  try {
    isWorking.value = true
    const comment = {
      body: newComment.value,
      issueId: props.comment.issueId,
      userId: props.comment.user.id
    }
    await createMutation({ createCommentInput: comment } as any)
    await props.refetchIssue()
    newComment.value = ''
    isFormOpen.value = false
    isWorking.value = false
  } catch (error) {
    console.error(error)
    // Handle error notification
  }
}

const handleCommentUpdate = async () => {
  if (isWorking.value) return
  try {
    isWorking.value = true
    const comment = {
      body: newComment.value,
      issueId: props.comment.issueId,
      userId: props.comment.user.id
    }
    await updateMutation({ updateCommentInput: { ...comment, id: props.comment.id } } as any)
    await props.refetchIssue()
    isFormOpen.value = false
    isWorking.value = false
  } catch (error) {
    console.error(error)
    // Handle error notification
  }
}

const triggerCommentDelete = () => {
  emit('delete', props.comment.id)
}

const handleSubmit = () => {
  props.isCreate ? handleCommentCreate() : handleCommentUpdate()
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSubmit()
  }
}

const handleCancel = () => {
  isFormOpen.value = false
}
</script>

<template>
  <div class="relative mt-6 text-15">
    <!-- user-avatar -->
    <Avatar class="absolute top-0 left-0">
      <AvatarImage :src="comment.user.avatarUrl" alt="avatar" />
      <AvatarFallback>{{ comment.user.name }}</AvatarFallback>
    </Avatar>

    <!-- content -->
    <div class="pl-10">
      <!-- username -->
      <div
        v-if="!isCreate"
        v-text="comment.user.name"
        class="inline-block mb-2 mr-3 font-medium text-foreground"
      />
      <!-- createdAt -->
      <div v-if="!isCreate" v-text="createdAt" class="inline-block pb-2 text-sm text-foreground" />
      <!-- body-form -->
      <div v-if="isFormOpen">
        <Textarea
          :modelValue="newComment"
          autofocus
          rows="2"
          @keydown="handleKeyDown"
          placeholder="Add a comment..."
        />
        <div class="flex items-center pt-2">
          <Button class="mr-2" type="submit" @click="handleSubmit" :disabled="isWorking">
            Save
          </Button>
          <Button variant="outline" @click="handleCancel"> Cancel </Button>
        </div>
      </div>
      <div v-else>
        <!-- comment-body -->
        <p v-if="isCreate" @click="isFormOpen = true" class="pb-2 whitespace-pre-wrap fakeTa">
          Add a comment...
        </p>
        <p v-else v-text="comment.body" class="pb-2 whitespace-pre-wrap"></p>
        <!-- edit-link -->
        <div v-if="!isCreate && !readOnly">
          <div
            @click="isFormOpen = true"
            class="inline-block py-1 mr-3 text-sm cursor-pointer select-none text-foreground hover:underline"
          >
            Edit
          </div>
          <div
            @click="triggerCommentDelete"
            class="inline-block py-1 mr-3 text-sm cursor-pointer select-none text-foreground hover:underline"
          >
            Delete
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fakeTa {
  color: rgb(137, 147, 164);
  border: 1px solid rgb(223, 225, 230);
  cursor: text;
  user-select: none;
  padding: 12px 16px;
  border-radius: 4px;
}
</style>
