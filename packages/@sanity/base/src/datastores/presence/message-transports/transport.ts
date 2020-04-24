import {Observable} from 'rxjs'

export interface Payload<T> {
  identity: string
  timestamp: string
  message: T
}

export interface PresenceSyncEvent<State> {
  type: 'sync'
  identity: string
  sessionId: string
  timestamp: string
  state: State
}

export interface PresenceDisconnectEvent {
  type: 'disconnect'
}

export interface PresenceRollCallEvent {
  type: 'rollCall'
}

export type PresenceEvent<T> =
  | PresenceSyncEvent<T>
  | PresenceDisconnectEvent
  | PresenceRollCallEvent

export type Transport<T> = [Observable<PresenceEvent<T>>, (messages: T[]) => Promise<void>]
