/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react'
import FormBuilder from 'part:@sanity/form-builder'
import {Doc} from '../types'

import styles from './HistoryForm.css'

interface Props {
  schema: any
  schemaType: {name: string}
  document: Doc | null // {_type: string}
}

const noop = () => null
const noopPatchChannel = {onPatch: () => noop, receivePatches: noop}

export default class HistoryForm extends React.PureComponent<Props> {
  static propTypes = {}

  static defaultProps = {
    document: undefined,
  }

  state = {
    focusPath: [],
  }

  handleFocus = (focusPath: any[]) => {
    this.setState({focusPath})
  }

  render() {
    const {schema, schemaType, document} = this.props
    const {focusPath} = this.state

    return (
      <form className={styles.editor}>
        {document ? (
          <FormBuilder
            onBlur={noop}
            onFocus={this.handleFocus}
            focusPath={focusPath}
            readOnly
            schema={schema}
            type={schemaType}
            value={document}
            patchChannel={noopPatchChannel}
          />
        ) : (
          <p>There is no data associated with this history event.</p>
        )}
      </form>
    )
  }
}
