import type { App } from 'vue'
import Avatar from '@/components/shared/Avatar/Avatar.vue'
import Breadcrumbs from '@/components/shared/Breadcrumbs/Breadcrumbs.vue'
import Button from '@/components/shared/Button/Button.vue'
import Icon from '@/components/shared/Icon/Icon.vue'
import Input from '@/components/shared/Input/Input.vue'
import Select from '@/components/shared/Select/Select.vue'
import TextEditor from '@/components/shared/TextEditor/TextEditor.vue'
import Textarea from '@/components/shared/Textarea/Textarea.vue'

const sharedComponents = [
  {
    name: 'j-avatar',
    component: Avatar
  },
  {
    name: 'j-breadcrumbs',
    component: Breadcrumbs
  },
  {
    name: 'j-button',
    component: Button
  },
  {
    name: 'j-icon',
    component: Icon
  },
  {
    name: 'j-input',
    component: Input
  },
  {
    name: 'j-select',
    component: Select
  },
  {
    name: 'j-text-editor',
    component: TextEditor
  },
  {
    name: 'j-textarea',
    component: Textarea
  }
]

export const registerSharedComponents = (app: App) => {
  sharedComponents.forEach((c) => app.component(c.name, c.component))
}
