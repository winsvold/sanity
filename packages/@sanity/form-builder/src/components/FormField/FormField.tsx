import {FieldPresence, FormFieldPresence} from '@sanity/base/presence'
import {Stack} from '@sanity/ui'
import React from 'react'
import {FormFieldHeader} from './FormFieldHeader'
import {Validation} from './types'

export function FormField({
  children,
  htmlFor,
  level,
  title,
  description,
  presence: presenceProp = [],
  validation = [],
}: {
  children: React.ReactNode
  htmlFor?: string
  level?: number
  title?: React.ReactNode
  description?: React.ReactNode
  // @todo: Turn `presence` into a React.ReactNode property
  // presence?: React.ReactNode
  presence?: FormFieldPresence[]
  validation?: Validation[]
}) {
  const presence = <FieldPresence maxAvatars={4} presence={presenceProp} />

  return (
    <Stack data-level={level} space={1} style={{outline: '1px solid red'}}>
      <FormFieldHeader
        description={description}
        htmlFor={htmlFor}
        presence={presence}
        title={title}
        validation={validation}
      />
      <div>{children}</div>
    </Stack>
  )
}
