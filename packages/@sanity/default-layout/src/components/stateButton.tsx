import {Button, ButtonProps} from '@sanity/ui'
import {StateLink} from 'part:@sanity/base/router'
import React, {forwardRef} from 'react'

export const StateButton = forwardRef(
  (props: ButtonProps & {state: any} & React.HTMLProps<HTMLButtonElement>, ref) => {
    const {children, state, ...buttonProps} = props

    return (
      <Button {...buttonProps} {...({state} as any)} as={StateLink as any} ref={ref}>
        {children}
      </Button>
    )
  }
)

StateButton.displayName = 'StateButton'
