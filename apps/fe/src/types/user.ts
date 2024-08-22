import type { Issue } from './issue'
import type { Project } from './project'

export enum Role {
  ADMIN = 'admin',
  USER = 'user'
}

export interface User {
  id: string
  name: string
  email: string
  avatarUrl: string
  role: Role
  createdAt: Date
  updatedAt: Date
  comments: Comment[]
  issues: Issue[]
  project: Project
  projectId: string
}
