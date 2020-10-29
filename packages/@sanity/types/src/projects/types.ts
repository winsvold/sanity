export interface Project {
  id: string
  displayName: string
  studioHost: string | null
  organizationId: string | null
  members: ProjectMember[]
  createdAt: string
  isBlocked: boolean
  isDisabled: boolean
  isDisabledByUser: boolean
  metadata: {
    color?: string
    externalStudioHost?: string
  }
}

export interface ProjectMember {
  id: string
  role: string
  isRobot: boolean
  isCurrentUser: boolean
}
