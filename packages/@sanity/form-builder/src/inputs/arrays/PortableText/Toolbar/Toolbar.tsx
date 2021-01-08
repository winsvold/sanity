import {
  HotkeyOptions,
  RenderBlockFunction,
  usePortableTextEditor,
  usePortableTextEditorSelection,
} from '@sanity/portable-text-editor'
import {Path} from '@sanity/types'
import {Card, Flex, Stack} from '@sanity/ui'
import React, {forwardRef, useCallback} from 'react'
import {ActionMenu} from './ActionMenu'
import {BlockStyleSelect} from './BlockStyleSelect'
import {getBlockStyleSelectProps, getInsertMenuItems, getPTEToolbarActionGroups} from './helpers'
import {InsertMenu} from './InsertMenu'

interface ToolbarProps {
  hotkeys: HotkeyOptions
  isFullscreen: boolean
  readOnly: boolean
  renderBlock: RenderBlockFunction
  onFocus: (path: Path) => void
}

export const Toolbar = forwardRef((props: ToolbarProps, ref: React.Ref<HTMLDivElement>) => {
  const {hotkeys, isFullscreen, readOnly, onFocus, renderBlock} = props
  const editor = usePortableTextEditor()
  const selection = usePortableTextEditorSelection()
  const disabled = !selection
  const actionGroups = React.useMemo(
    () => (editor ? getPTEToolbarActionGroups(editor, selection, onFocus, hotkeys) : []),
    [editor, selection, onFocus, hotkeys]
  )

  const actionsLen = actionGroups.reduce((acc, x) => acc + x.actions.length, 0)

  const blockStyleSelectProps = React.useMemo(
    () => (editor ? getBlockStyleSelectProps(editor) : null),
    // @todo: Make `usePortableTextEditor` update its value when selection changes
    // Workaround: include `selection` to update active block style in block style menu
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editor, selection]
  )

  const insertMenuItems = React.useMemo(
    () => (editor ? getInsertMenuItems(editor, selection, onFocus) : []),
    [editor, onFocus, selection]
  )

  const handleMouseDown = useCallback((event) => event.preventDefault(), [])
  const handleKeyPress = useCallback((event) => event.preventDefault(), [])

  return (
    <Flex
      align="center"
      // Ensure the editor doesn't lose focus when interacting
      // with the toolbar (prevent focus click events)
      onMouseDown={handleMouseDown}
      onKeyPress={handleKeyPress}
      ref={ref}
      style={{lineHeight: 0}}
    >
      {blockStyleSelectProps && blockStyleSelectProps.items.length > 1 && (
        <Stack padding={isFullscreen ? 2 : 1} style={{minWidth: '8em'}}>
          <BlockStyleSelect
            {...blockStyleSelectProps}
            disabled={disabled}
            readOnly={readOnly}
            renderBlock={renderBlock}
          />
        </Stack>
      )}

      {actionsLen > 0 && (
        <Card borderLeft flex={1} padding={isFullscreen ? 2 : 1}>
          <ActionMenu disabled={disabled} groups={actionGroups} readOnly={readOnly} />
        </Card>
      )}

      {insertMenuItems.length > 0 && (
        <Card borderLeft padding={isFullscreen ? 2 : 1}>
          <InsertMenu disabled={disabled} items={insertMenuItems} readOnly={readOnly} />
        </Card>
      )}
    </Flex>
  )
})

Toolbar.displayName = 'Toolbar'
