import React from 'react'
import {StringSchemaType, ValidationMarker} from '@sanity/types'
import {TextInput} from '@sanity/ui'
import {useId} from '@reach/auto-id'
import PatchEvent, {set, unset} from '../PatchEvent'
import {FormField} from '../components/FormField/FormField'
import {Validation} from '../components/FormField/types'
import {Props} from './types'

function markersToValidationList(markers: ValidationMarker[]): Validation[] {
  const validationMarkers = markers.filter((marker) => marker.type === 'validation')

  return validationMarkers.map((marker) => {
    return {
      type: marker.level === 'error' ? 'error' : 'warning',
      label: marker.item.message,
    }
  })
}

const StringInput = React.forwardRef(function StringInput(
  props: Props<string, StringSchemaType>,
  forwardedRef: React.ForwardedRef<HTMLInputElement>
) {
  const {value, readOnly, type, markers, level, onFocus, onBlur, onChange, presence} = props
  const inputId = useId()
  const validation = markers.filter((marker) => marker.type === 'validation')
  const errors = validation.filter((marker) => marker.level === 'error')

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.currentTarget.value
      onChange(PatchEvent.from(inputValue ? set(inputValue) : unset()))
    },
    [onChange]
  )

  return (
    <FormField
      description={type.description}
      htmlFor={inputId}
      level={level}
      presence={presence}
      title={type.title}
      validation={markersToValidationList(markers)}
    >
      <TextInput
        id={inputId}
        customValidity={errors.length > 0 ? errors[0].item.message : ''}
        value={value || ''}
        readOnly={Boolean(readOnly)}
        placeholder={type.placeholder}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        ref={forwardedRef}
      />
    </FormField>
  )
})

export default StringInput
