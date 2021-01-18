import React from 'react'
import {Button} from '@sanity/ui'
import {useRouter} from '../legacyPluginParts'

export function IntentButton(props) {
  const router = useRouter()

  return <Button {...props} as="a" href={router.resolveIntentLink(props.intent, props.params)} />
}
