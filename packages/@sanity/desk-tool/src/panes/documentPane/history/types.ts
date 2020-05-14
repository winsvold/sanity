import {WelcomeEvent, MutationEvent} from '@sanity/client'
import {incremental} from 'mendoza'
import {Doc} from '../types'

export interface HistoryRevisionState {
  isLoading: boolean
  snapshot: Doc | null
  prevSnapshot: Doc | null
}

export interface HistoryEventsState {
  isLoading: boolean
  isLoaded: boolean
  error: null | Error
  events: HistoryTimelineEvent[]
}

export type RevisionRange = string[] | string | null

export interface HistorySelectionRange {
  from: {rev: string | null; index: number; event: HistoryTimelineEvent | null}
  to: {rev: string | null; index: number; event: HistoryTimelineEvent | null}
}

export type MendozaPatch = unknown[]

export type MendozaEffectPair = {
  apply: MendozaPatch
  revert: MendozaPatch
}

export type Transaction = {
  author: string
  documentIDs: string[]
  id: string
  mutations: unknown[]
  timestamp: string
  effects: Record<string, MendozaEffectPair>
}

export type PatchMetadata = {
  rev: string
  author: string
  timestamp: number
}

export interface EditSession {
  type: 'editSession'
  edits: string[]
  length: number
  offset: number
  endTime: number
  value?: incremental.Value
}

interface BaseHistoryTimelineEvent {
  displayDocumentId: string | null
  timestamp: number
  offset: number
  rev: string
}

export type HistoryTimelineCreateEvent = BaseHistoryTimelineEvent & {
  type: 'create'
  userId: string
}

export type HistoryTimelineDeleteEvent = BaseHistoryTimelineEvent & {
  type: 'delete'
  userId: string
}

export type HistoryTimelineDiscardDraftEvent = BaseHistoryTimelineEvent & {
  type: 'discardDraft'
  userId: string
}

export type HistoryTimelineEditSessionGroupEvent = BaseHistoryTimelineEvent & {
  type: 'editSessionGroup'
  sessions: Array<EditSession>
  userIds: string[]
  length: number
}

export type HistoryTimelinePublishEvent = BaseHistoryTimelineEvent & {
  type: 'publish'
  userId: string
}

export type HistoryTimelineTruncateEvent = BaseHistoryTimelineEvent & {
  type: 'truncate'
  userIds: string[]
}

export type HistoryTimelineUnpublishEvent = BaseHistoryTimelineEvent & {
  type: 'unpublish'
  userId: string
}

export type HistoryTimelineUnknownEvent = BaseHistoryTimelineEvent & {
  type: 'unknown'
  message?: string
  userId: string
}

export type HistoryTimelineEvent =
  | HistoryTimelineCreateEvent
  | HistoryTimelineDeleteEvent
  | HistoryTimelineDiscardDraftEvent
  | HistoryTimelineEditSessionGroupEvent
  | HistoryTimelinePublishEvent
  | HistoryTimelineTruncateEvent
  | HistoryTimelineUnpublishEvent
  | HistoryTimelineUnknownEvent

export type ComputedHistoryTimelineEvent = HistoryTimelineEvent & {
  value: incremental.Value
}

export type TransactionLogEvent = {
  id: string
  timestamp: string
  author: string
  mutations: MutationStub[]
  documentIDs: string[]
  effects: Record<string, MendozaEffectPair | undefined>
}

export type NormalizedTransactionLogEvent = Omit<TransactionLogEvent, 'timestamp'> & {
  timestamp: number
}

export type ListenEvent = MutationEvent | WelcomeEvent
export type GroupedEvent = TransactionLogEvent | WelcomeEvent

export interface CreateMutationStub {
  _id: string
}

export interface DeleteMutationStub {
  id: string
}

export interface PatchMutationStub {
  id: string
}

export interface CreateOrReplaceMutation {
  createOrReplace: CreateMutationStub
}

export interface CreateIfNotExistsMutation {
  createIfNotExists: CreateMutationStub
}

export interface CreateSquashedMutation {
  createSquashed: {document: CreateMutationStub; authors: string[]}
}

export interface CreateMutation {
  create: CreateMutationStub
}

export interface DeleteMutation {
  delete: PatchMutationStub
}

export interface PatchMutation {
  patch: PatchMutationStub
}

export type MutationStub =
  | CreateOrReplaceMutation
  | CreateIfNotExistsMutation
  | CreateSquashedMutation
  | CreateMutation
  | DeleteMutation
  | PatchMutation
