import {Button, ButtonProps} from '@sanity/ui'
import React, {forwardRef} from 'react'
import {ButtonProps as LegacyButtonProps} from './types'

const DefaultButton = forwardRef((props: LegacyButtonProps, ref) => {
  return <Button {...(mapLegacyPropsToProps(props) as any)} ref={ref} />
})

DefaultButton.displayName = 'DefaultButton'

export default DefaultButton

const KIND_TO_MODE = {
  simple: 'bleed'
}

const SIZE_TO_SIZE = {
  'extra-small': 0,
  small: 1,
  medium: 2,
  large: 3,
  'extra-large': 4
}

const COLOR_TO_TONE = {
  primary: 'brand',
  success: 'positive',
  warning: 'caution',
  danger: 'critical'
}

const PADDING_TO_PADDING = {
  small: 3,
  medium: 4,
  large: 5,
  none: 0
}

function mapLegacyPropsToProps(props: LegacyButtonProps): ButtonProps {
  const {
    as,
    // bleed?: boolean
    bleed,
    // children
    children,
    // color?: ButtonColor
    color,
    // icon?: React.ComponentType<Record<string, unknown>>
    icon,
    // iconStatus?: 'primary' | 'success' | 'warning' | 'danger'
    iconStatus,
    // inverted?: boolean
    inverted,
    // kind?: ButtonKind
    kind,
    // loading?: boolean
    loading,
    // padding?: ButtonPadding
    padding,
    // selected?: boolean
    selected,
    // size?: ButtonSize
    size,
    // tone?: 'navbar'
    tone,
    type,
    ...restProps
  } = props

  return {
    ...restProps,
    // as?: React.ElementType | keyof JSX.IntrinsicElements;
    mode: (inverted && 'ghost') || (bleed && 'bleed') || (kind ? KIND_TO_MODE[kind] : undefined),
    // icon?: IconSymbol;
    icon: icon as any,
    padding: padding ? PADDING_TO_PADDING[padding] : 3,
    // size?: number | number[];
    size: size ? SIZE_TO_SIZE[size] : undefined,
    // text?: React.ReactNode
    text: children,
    // tone?: ButtonTone;
    tone: color ? COLOR_TO_TONE[color] : undefined,
    // type?: 'button' | 'reset' | 'submit';
    type: type as any
  }
}
