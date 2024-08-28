import { Bug, Component, Filter, Kanban, Rocket, Settings, StickyNote } from 'lucide-vue-next'

export const navLinks = [
  {
    name: 'Kanban Board',
    icon: Kanban,
    to: { name: 'board' }
  },
  {
    name: 'Project settings',
    icon: Settings,
    to: { name: 'settings' }
  },
  {
    name: 'Releases',
    icon: Rocket
  },
  {
    name: 'Issues and filters',
    icon: Filter
  },
  {
    name: 'Pages',
    icon: StickyNote
  },
  {
    name: 'Reports',
    icon: Bug
  },
  {
    name: 'Components',
    icon: Component
  }
]
