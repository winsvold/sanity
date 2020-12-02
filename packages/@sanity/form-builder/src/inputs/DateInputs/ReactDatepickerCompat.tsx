import React from 'react'
import DatePicker from 'react-datepicker'

export default class ReactDatepickerCompat extends DatePicker {
  constructor(props) {
    super(props)
  }

  deferFocusInput = () => {
    this.cancelFocusInput()
  }
}
