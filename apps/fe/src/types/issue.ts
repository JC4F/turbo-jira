import { z } from 'zod'
import type { Comment } from '@/types/comment'

export enum IssueType {
  TASK = 'task',
  BUG = 'bug',
  STORY = 'story'
}

export enum IssueStatus {
  BACKLOG = 'backlog',
  SELECTED = 'selected',
  INPROGRESS = 'inprogress',
  DONE = 'done'
}

export enum IssuePriority {
  HIGHEST = '5',
  HIGH = '4',
  MEDIUM = '3',
  LOW = '2',
  LOWEST = '1'
}

export interface Issue {
  id: string
  title: string
  type: IssueType
  status: IssueStatus
  priority: IssuePriority
  listPosition: number
  description: string | null
  estimate: number | null
  timeSpent: number | null
  timeRemaining: number | null
  createdAt: Date
  updatedAt: Date
  reporterId: string
  userIds: string[]
  comments: Comment[]
  projectId: string
}

// export interface IssueCreateDTO {
//   type: IssueType
//   title: string
//   description: string | null
//   reporterId: string
//   userIds: string[]
//   priority: IssuePriority
//   status?: IssueStatus
//   projectId?: string
//   users?: Partial<User>[]
// }

export const IssueStatusCopy = {
  [IssueStatus.BACKLOG]: 'Backlog',
  [IssueStatus.SELECTED]: 'Selected for development',
  [IssueStatus.INPROGRESS]: 'In progress',
  [IssueStatus.DONE]: 'Done'
}
export const IssuePriorityCopy = {
  [IssuePriority.HIGH]: 'High',
  [IssuePriority.HIGHEST]: 'Highest',
  [IssuePriority.MEDIUM]: 'Medium',
  [IssuePriority.LOW]: 'Low',
  [IssuePriority.LOWEST]: 'Lowest'
}

export const IssueTypeCopy = {
  [IssueType.TASK]: 'Task',
  [IssueType.BUG]: 'Bug',
  [IssueType.STORY]: 'Story'
}

export const issueCreateSchema = z.object({
  issuetype: z.string(),
  type: z.nativeEnum(IssueType),
  title: z.string(),
  reporterId: z.string(),
  summary: z.string(),
  description: z.string(),
  reporter: z.string(),
  userIds: z.string().array(),
  priority: z.nativeEnum(IssuePriority),
  status: z.nativeEnum(IssueStatus).optional(),
  projectId: z.string().optional()
  // users: z.array(z.any()).optional()
})

export type IssueCreateDTO = z.infer<typeof issueCreateSchema>
