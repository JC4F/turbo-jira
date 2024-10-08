import { z } from 'zod'
import type { Issue } from './issue'
import type { User } from './user'

export enum ProjectCategory {
  SOFTWARE = 'software',
  MARKETING = 'marketing',
  BUSINESS = 'business'
}

export interface Project {
  id: string
  name: string
  url: string | null
  description: string | null
  category: ProjectCategory
  createdAt: Date
  updatedAt: Date
  issues: Issue[]
  users: User[]
}

export const ProjectCategoryCopy = {
  [ProjectCategory.SOFTWARE]: 'Software',
  [ProjectCategory.MARKETING]: 'Marketing',
  [ProjectCategory.BUSINESS]: 'Business'
}

export const projectSettingSchema = z.object({
  name: z.string(),
  url: z.string().optional(),
  description: z.string().optional(),
  category: z.nativeEnum(ProjectCategory)
})

export type ProjectSettingDTO = z.infer<typeof projectSettingSchema>
