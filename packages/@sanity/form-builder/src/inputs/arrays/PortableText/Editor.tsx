import {
  HotkeyOptions,
  PortableTextBlock,
  PortableTextEditable,
  // PortableTextFeatures,
  RenderAnnotationFunction,
  RenderBlockFunction,
  RenderChildFunction,
  RenderDecoratorFunction,
  EditorSelection,
  OnPasteFn,
  OnCopyFn,
  PortableTextEditor,
  usePortableTextEditor,
} from '@sanity/portable-text-editor'
import {Marker} from '@sanity/types'
import {Card, useLayer} from '@sanity/ui'
// import {FOCUS_TERMINATOR} from '@sanity/util/paths'
import classNames from 'classnames'
import {ScrollContainer} from 'part:@sanity/components/scroll'
import React, {useMemo, useEffect} from 'react'
import PatchEvent from '../../../PatchEvent'
import {Toolbar} from './Toolbar/Toolbar'
import {ExpandCollapseButton} from './expandCollapseButton'
import BlockExtrasOverlay from './BlockExtrasOverlay'
import {RenderBlockActions, RenderCustomMarkers} from './types'
import {Decorator} from './Text/Decorator'

import styles from './Editor.css'

type Props = {
  initialSelection?: EditorSelection
  isFullscreen: boolean
  markers: Array<Marker>
  hotkeys: HotkeyOptions
  // onBlur: () => void
  onCopy?: OnCopyFn
  onFocus: (Path) => void
  onFormBuilderChange: (change: PatchEvent) => void
  onPaste?: OnPasteFn
  onToggleFullscreen: () => void
  // portableTextFeatures: PortableTextFeatures
  readOnly: boolean | null
  renderAnnotation: RenderAnnotationFunction
  renderBlock: RenderBlockFunction
  renderBlockActions?: RenderBlockActions
  renderChild: RenderChildFunction
  renderCustomMarkers?: RenderCustomMarkers
  setPortalElement?: (el: HTMLDivElement | null) => void
  setScrollContainerElement: (el: HTMLElement | null) => void
  value: PortableTextBlock[] | undefined
}

const renderDecorator: RenderDecoratorFunction = (mark, mType, attributes, defaultRender) => {
  return <Decorator mark={mark}>{defaultRender()}</Decorator>
}

export function PortableTextSanityEditor(props: Props) {
  const {
    initialSelection,
    isFullscreen,
    markers,
    onCopy,
    onFocus,
    onFormBuilderChange,
    onPaste,
    onToggleFullscreen,
    readOnly,
    renderAnnotation,
    renderBlock,
    renderBlockActions,
    renderChild,
    renderCustomMarkers,
    setPortalElement,
    setScrollContainerElement,
    value,
  } = props

  const editor = usePortableTextEditor()
  const ptFeatures = useMemo(() => PortableTextEditor.getPortableTextFeatures(editor), [editor])
  const {isTopLayer} = useLayer()

  // const handleOpenObjectHotkey = (
  //   event: React.BaseSyntheticEvent,
  //   ptEditor: PortableTextEditor
  // ) => {
  //   const selection = PortableTextEditor.getSelection(ptEditor)
  //   if (selection) {
  //     event.preventDefault()
  //     event.stopPropagation()
  //     const {focus} = selection
  //     const activeAnnotations = PortableTextEditor.activeAnnotations(ptEditor)
  //     const focusBlock = PortableTextEditor.focusBlock(ptEditor)
  //     const focusChild = PortableTextEditor.focusChild(ptEditor)
  //     if (activeAnnotations.length > 0) {
  //       onFocus([
  //         ...focus.path.slice(0, 1),
  //         'markDefs',
  //         {_key: activeAnnotations[0]._key},
  //         FOCUS_TERMINATOR,
  //       ])
  //       return
  //     }
  //     if (focusChild && PortableTextEditor.isVoid(ptEditor, focusChild)) {
  //       onFocus([...focus.path, FOCUS_TERMINATOR])
  //       return
  //     }
  //     if (focusBlock && PortableTextEditor.isVoid(ptEditor, focusBlock)) {
  //       onFocus([...focus.path.slice(0, 1), FOCUS_TERMINATOR])
  //     }
  //   }
  // }

  const customFromProps: HotkeyOptions = useMemo(
    () => ({
      custom: {
        'mod+enter': props.onToggleFullscreen,
        // TODO: disabled for now, enable when we agree on the hotkey
        // 'mod+o': handleOpenObjectHotkey,
        ...(props.hotkeys || {}).custom,
      },
    }),
    [props.hotkeys, props.onToggleFullscreen]
  )

  const defaultHotkeys = {marks: {}}
  ptFeatures.decorators.forEach((dec) => {
    switch (dec.value) {
      case 'strong':
        defaultHotkeys.marks['mod+b'] = dec.value
        break
      case 'em':
        defaultHotkeys.marks['mod+i'] = dec.value
        break
      case 'underline':
        defaultHotkeys.marks['mod+u'] = dec.value
        break
      case 'code':
        defaultHotkeys.marks["mod+'"] = dec.value
        break
      default:
      // Nothing
    }
  })

  const marksFromProps: HotkeyOptions = useMemo(
    () => ({
      marks: {
        ...defaultHotkeys.marks,
        ...(props.hotkeys || {}).marks,
      },
    }),
    [defaultHotkeys.marks, props.hotkeys]
  )

  const hotkeys: HotkeyOptions = useMemo(
    () => ({
      ...marksFromProps,
      ...customFromProps,
    }),
    [customFromProps, marksFromProps]
  )

  const hasMarkers = markers.length > 0
  const scClassName = classNames(
    styles.scrollContainer,
    renderBlockActions || hasMarkers ? styles.hasBlockExtras : styles.hasNoBlockExtras
  )

  const editorClassName = classNames(
    styles.editor,
    renderBlockActions || hasMarkers ? styles.hasBlockExtras : styles.hasNoBlockExtras
  )

  useEffect(() => {
    if (!isTopLayer || !isFullscreen) return undefined

    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        onToggleFullscreen()
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [isFullscreen, isTopLayer, onToggleFullscreen])

  return (
    <div className={classNames(styles.root, isFullscreen && styles.isFullscreen)}>
      <div className={styles.header}>
        <div className={styles.headerToolbarContainer}>
          <Toolbar
            isFullscreen={isFullscreen}
            hotkeys={hotkeys}
            onFocus={onFocus}
            renderBlock={renderBlock}
            readOnly={readOnly}
          />
        </div>

        <Card borderLeft padding={isFullscreen ? 2 : 1} style={{lineHeight: 0}}>
          <ExpandCollapseButton
            isFullscreen={isFullscreen}
            onToggleFullscreen={onToggleFullscreen}
          />
        </Card>
      </div>

      <div className={styles.content}>
        <ScrollContainer className={scClassName} ref={setScrollContainerElement}>
          <div className={styles.editorWrapper}>
            <div className={styles.blockExtras}>
              <BlockExtrasOverlay
                isFullscreen={isFullscreen}
                markers={markers}
                onFocus={onFocus}
                onChange={onFormBuilderChange}
                renderBlockActions={readOnly ? undefined : renderBlockActions}
                renderCustomMarkers={renderCustomMarkers}
                value={value}
              />
            </div>

            <div className={editorClassName}>
              <PortableTextEditable
                hotkeys={hotkeys}
                onCopy={onCopy}
                onPaste={onPaste}
                placeholderText={value ? undefined : 'Empty'}
                renderAnnotation={renderAnnotation}
                renderBlock={renderBlock}
                renderChild={renderChild}
                renderDecorator={renderDecorator}
                selection={initialSelection}
                spellCheck
              />
            </div>
          </div>
        </ScrollContainer>

        <div data-portal="" ref={setPortalElement} />
      </div>
    </div>
  )
}
