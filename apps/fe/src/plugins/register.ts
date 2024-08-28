import type { App } from 'vue'
import Breadcrumbs from '@/components/shared/Breadcrumbs/Breadcrumbs.vue'
import Icon from '@/components/shared/Icon/Icon.vue'
import TextEditor from '@/components/shared/TextEditor/TextEditor.vue'

const sharedComponents = [
  {
    name: 'j-breadcrumbs',
    component: Breadcrumbs
  },
  {
    name: 'j-icon',
    component: Icon
  },
  {
    name: 'j-text-editor',
    component: TextEditor
  }
]

export const registerSharedComponents = (app: App) => {
  sharedComponents.forEach((c) => app.component(c.name, c.component))
}
