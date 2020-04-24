/* eslint-disable @typescript-eslint/no-use-before-define */
import client from 'part:@sanity/base/client'
import {Observable} from 'rxjs'
import {fromSanityClient} from '@sanity/bifur-client'
import {map, tap} from 'rxjs/operators'
import {PresenceEvent} from './transport'

interface WelcomeEvent {
  type: 'welcome'
  channel: string
  project: string
  identity: string
}

type BifurPresenceMessageEvent<T> = {
  type: 'state'
  i: string
  m: {
    sessionId: string
    state: T
  }
}

type RollCallEvent = {
  type: 'rollCall'
}

type BifurMessageEvent<T> = RollCallEvent | BifurPresenceMessageEvent<T>

const bifurMessageToPresenceEvent = <State>(
  message: BifurMessageEvent<State>
): PresenceEvent<State> => {
  if (message.type === 'rollCall') {
    return {
      type: 'rollCall'
    }
  }
  if (message.type === 'state') {
    const {sessionId, state} = message.m

    return {
      type: 'sync',
      identity: message.i,
      sessionId: sessionId,
      timestamp: new Date().toISOString(),
      state
    }
  }
  // if (isSyncEvent(message)) {
  //   return {
  //     type: 'sync',
  //     identity,
  //     clientId: message.clientId,
  //     timestamp: new Date().toISOString(),
  //     state: message.state
  //   }
  // } else if (message.type === 'disconnect') {
  //   return {
  //     type: 'disconnect',
  //     identity,
  //     clientId: message.clientId,
  //     timestamp: new Date().toISOString()
  //   }
  // }
  throw new Error(`Got unknown presence event: ${JSON.stringify(message)}`)
}

export const createBifurTransport = <State>(
  sessionId: string
): [Observable<any>, (messages: PresenceEvent<State>[]) => Promise<void>] => {
  const bifur = fromSanityClient(client)
  const messages$ = bifur.stream('presence').pipe(
    map(bifurMessageToPresenceEvent),
    tap(console.log)
    // doBeforeUnload()
  )

  const sendMessages = async (messages: PresenceEvent<State>[]) => {
    return messages.forEach(message => {
      if (message.type === 'rollCall') {
        bifur.request('presence_rollcall').toPromise()
      }
      if (message.type === 'sync') {
        console.log('send', message)
        bifur.request('presence_announce', {data: {state: message.state, sessionId}}).toPromise()
      }
    })
  }

  return [messages$, sendMessages]
}

function send(channel, message) {
  return client.request({
    url: `presence/send/${channel}`,
    method: 'POST',
    body: message
  })
}

// Sends a message using the beacon api which in some browsers lets us send a little bit of
// data while the window is closing. Returns true if the message was successfully submitted,
// false if it failed or if status is unknown.
function sendBeacon(channel, message) {
  if (typeof navigator == 'undefined' || typeof navigator.sendBeacon != 'function') {
    // If sendBeacon is not supported, just try to send it the old fashioned way
    send(channel, message)
    return false
  }
  const url = client.getUrl(`presence/send/${channel}`)
  return navigator.sendBeacon(url, JSON.stringify(message))
}
