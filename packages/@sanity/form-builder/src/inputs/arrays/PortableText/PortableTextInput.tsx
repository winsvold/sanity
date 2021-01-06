import {uniqueId} from 'lodash'
import React, {useEffect, useState, useMemo, useCallback} from 'react'
import {Marker, Path} from '@sanity/types'
import {FormFieldPresence} from '@sanity/base/presence'
import {
  EditorChange,
  OnCopyFn,
  OnPasteFn,
  Patch as EditorPatch,
  PortableTextBlock,
  PortableTextEditor,
  Type,
  HotkeyOptions,
} from '@sanity/portable-text-editor'
import {Subject} from 'rxjs'
import {useToast} from '@sanity/ui'
import PatchEvent from '../../../PatchEvent'
import withPatchSubscriber from '../../../utils/withPatchSubscriber'
import {FormField} from '../../../components/FormField'
import type {Patch} from '../../../patch/types'
import {RenderBlockActions, RenderCustomMarkers} from './types'
import {PTInput} from './Input'
import {InvalidValue} from './InvalidValue'

import styles from './PortableTextInput.css'

export type PatchWithOrigin = Patch & {
  origin: 'local' | 'remote' | 'internal'
  timestamp: Date
}

type PatchSubscribe = (subscribeFn: PatchSubscriber) => () => void
type PatchSubscriber = ({
  patches,
}: {
  patches: PatchWithOrigin[]
  snapshot: PortableTextBlock[] | undefined
}) => void

type Props = {
  focusPath: Path
  hotkeys: HotkeyOptions
  level: number
  markers: Marker[]
  onBlur: () => void
  onChange: (event: PatchEvent) => void
  onFocus: (path) => void
  onCopy?: OnCopyFn
  onPaste?: OnPasteFn
  readOnly: boolean | null
  renderBlockActions?: RenderBlockActions
  renderCustomMarkers?: RenderCustomMarkers
  presence: FormFieldPresence[]
  subscribe: PatchSubscribe
  type: Type
  value: PortableTextBlock[] | undefined
}

const PortableTextInputWithRef = React.forwardRef(function PortableTextInput(
  props: Omit<Props, 'level'>,
  ref: React.RefObject<PortableTextEditor>
) {
  const {
    focusPath,
    hotkeys,
    markers,
    // @todo
    // onBlur,
    onChange,
    onCopy,
    onFocus,
    onPaste,
    presence,
    readOnly,
    renderBlockActions,
    renderCustomMarkers,
    subscribe,
    type,
    value,
  } = props
  const {push} = useToast()
  // The PortableTextEditor will not re-render unless the value is changed (which is good).
  // But, we want to re-render it when the markers changes too,
  // (we render error indicators directly in the editor nodes for inline objects and annotations)
  const validationHash = markers
    .filter((marker) => marker.type === 'validation')
    .map((marker) => JSON.stringify(marker.path).concat(marker.type).concat(marker.level))
    .sort()
    .join('')
  const [valueTouchedByMarkers, setValueTouchedByMarkers] = useState(value)
  // Handle editor changes
  const [hasFocus, setHasFocus] = useState(false)
  const [ignoreValidationError, setIgnoreValidationError] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const editorId = useMemo(() => uniqueId('PortableTextInputRoot'), [])
  const [invalidValue, setInvalidValue] = useState(null)
  // Memoized patch stream
  const patche$: Subject<EditorPatch> = useMemo(() => new Subject(), [])

  const handleForceUpdate = useCallback(() => {
    setValueTouchedByMarkers(value ? [...value] : value)
  }, [value])

  // Handle incoming patches from withPatchSubscriber HOC
  const handleDocumentPatches = useCallback(
    ({patches}: {patches: PatchWithOrigin[]; snapshot: PortableTextBlock[] | undefined}) => {
      const patchSelection =
        patches && patches.length > 0 && patches.filter((patch) => patch.origin !== 'local')
      if (patchSelection) {
        patchSelection.map((patch) => patche$.next(patch))
      }
    },
    [patche$]
  )

  const handleEditorChange = useCallback(
    (change: EditorChange) => {
      switch (change.type) {
        case 'mutation':
          // Don't wait for the result
          setTimeout(() => {
            onChange(PatchEvent.from(change.patches))
          })
          break
        case 'focus':
          setHasFocus(true)
          break
        case 'blur':
          setHasFocus(false)
          break
        case 'undo':
        case 'redo':
          onChange(PatchEvent.from(change.patches))
          break
        case 'invalidValue':
          setInvalidValue(change)
          break
        case 'error':
          push({
            status: change.level,
            description: change.description,
          })
          break
        default:
      }
    },
    [onChange, push]
  )

  const handleIgnoreValidation = useCallback(() => {
    setIgnoreValidationError(true)
  }, [])

  const handleFocusSkipper = useCallback(() => {
    if (ref.current) {
      PortableTextEditor.focus(ref.current)
    }
  }, [ref])

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen((flag) => !flag)
  }, [])

  // Force update when validation or value changes
  useEffect(
    (fromValue?: PortableTextBlock[] | undefined) => {
      const val = fromValue || value
      setValueTouchedByMarkers(val ? [...val] : val)
    },
    [validationHash, value]
  )

  // Subscribe to incoming patches
  useEffect(() => subscribe(handleDocumentPatches), [handleDocumentPatches, subscribe])

  // Reset invalidValue if new value is coming in from props
  useEffect(() => {
    if (invalidValue && value !== invalidValue.value) {
      setInvalidValue(null)
    }
  }, [invalidValue, value])

  return (
    <>
      {invalidValue && !ignoreValidationError && (
        <InvalidValue
          onChange={handleEditorChange}
          onIgnore={handleIgnoreValidation}
          resolution={invalidValue.resolution}
          value={value}
        />
      )}

      {(!invalidValue || ignoreValidationError) && (
        <PortableTextEditor
          ref={ref}
          incomingPatche$={patche$.asObservable()}
          key={`portable-text-editor-${editorId}`}
          onChange={handleEditorChange}
          // @todo: from schema?
          maxBlocks={undefined}
          readOnly={readOnly}
          type={type}
          value={valueTouchedByMarkers}
        >
          {!readOnly && (
            <button
              type="button"
              tabIndex={0}
              className={styles.focusSkipper}
              onClick={handleFocusSkipper}
            >
              Jump to editor
            </button>
          )}

          <PTInput
            focusPath={focusPath}
            forceUpdate={handleForceUpdate}
            hasFocus={hasFocus}
            hotkeys={hotkeys}
            isFullscreen={isFullscreen}
            key={`portable-text-input-${editorId}`}
            markers={markers}
            // onBlur={onBlur}
            onChange={onChange}
            onCopy={onCopy}
            onFocus={onFocus}
            onPaste={onPaste}
            onToggleFullscreen={handleToggleFullscreen}
            patche$={patche$}
            presence={presence}
            readOnly={readOnly}
            renderBlockActions={renderBlockActions}
            renderCustomMarkers={renderCustomMarkers}
            type={type}
            value={valueTouchedByMarkers}
          />
        </PortableTextEditor>
      )}
    </>
  )
})

export default withPatchSubscriber(
  class PortableTextInputWithFocusAndBlur extends React.Component<
    Props & {children: React.ReactNode}
  > {
    editorRef: React.RefObject<PortableTextEditor> = React.createRef()
    focus() {
      if (this.editorRef.current) {
        PortableTextEditor.focus(this.editorRef.current)
      }
    }
    blur() {
      if (this.editorRef.current) {
        PortableTextEditor.blur(this.editorRef.current)
      }
    }
    render() {
      const {type, level, markers, presence} = this.props
      return (
        <FormField
          description={type.description}
          title={type.title}
          level={level}
          markers={markers}
          presence={presence}
          changeIndicator={false}
        >
          <PortableTextInputWithRef {...this.props} ref={this.editorRef} />
        </FormField>
      )
    }
  }
)
