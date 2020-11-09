import {
  ButtonColor,
  DefaultSnackbar,
  DialogAction,
  PopoverDialog
} from '@sanity/base/__legacy/components'
import {Dialog} from '@sanity/ui'
import React, {useCallback} from 'react'

// Todo: move these to action spec/core types
interface ConfirmDialogProps {
  type: 'confirm'
  color: ButtonColor
  message: React.ReactNode
  onConfirm: () => void
  onCancel: () => void
}

// Todo: move these to action spec/core types
interface ModalDialogProps {
  type: 'modal'
  content: React.ReactNode
  onClose: () => void
  showCloseButton: true
}

// Todo: move these to action spec/core types
interface PopoverDialogProps {
  type: 'popover'
  content: React.ReactNode
  onClose: () => void
}

interface LegacyDialogProps {
  type: 'legacy'
  content: React.ReactNode
  onClose: () => void
}

interface ErrorDialogProps {
  type: 'error'
  title: string
  content: React.ReactNode
  onClose: () => void
}

interface SuccessDialogProps {
  type: 'success'
  title: string
  content: React.ReactNode
  onClose: () => void
}

interface Props {
  dialog:
    | ConfirmDialogProps
    | LegacyDialogProps
    | ModalDialogProps
    | PopoverDialogProps
    | ErrorDialogProps
    | SuccessDialogProps
  referenceElement: HTMLElement | null
}

export function ActionStateDialog(props: Props) {
  const {dialog, referenceElement} = props

  const handleDialogAction = useCallback(
    (action: DialogAction) => {
      if (dialog.type === 'confirm') {
        if (action.key === 'cancel') {
          dialog.onCancel()
        }

        if (action.key === 'confirm') {
          dialog.onConfirm()
        }
      }
    },
    [dialog]
  )

  if (dialog.type === 'legacy') {
    return <>{dialog.content}</>
  }

  if (dialog.type === 'confirm') {
    return (
      <PopoverDialog
        actions={[
          {
            key: 'confirm',
            color: dialog.color || 'danger',
            title: 'Confirm'
          },
          {
            key: 'cancel',
            kind: 'simple',
            title: 'Cancel'
          }
        ]}
        hasAnimation
        onAction={handleDialogAction}
        onClickOutside={dialog.onCancel}
        onEscape={dialog.onCancel}
        placement="auto-end"
        referenceElement={referenceElement}
        size="small"
        useOverlay={false}
      >
        <div>{dialog.message}</div>
      </PopoverDialog>
    )
  }

  if (dialog.type === 'modal') {
    return (
      <Dialog
        onClose={dialog.onClose}
        // onClickOutside={dialog.onClose}
        // showCloseButton={dialog.showCloseButton}
        width={2}
      >
        {dialog.content}
      </Dialog>
    )
  }

  if (dialog.type === 'popover') {
    return (
      <PopoverDialog
        onClickOutside={dialog.onClose}
        onEscape={dialog.onClose}
        placement="auto-end"
        useOverlay={false}
        hasAnimation
        referenceElement={referenceElement}
      >
        {dialog.content}
      </PopoverDialog>
    )
  }

  if (dialog.type === 'success') {
    return (
      <DefaultSnackbar
        kind="success"
        isPersisted={false}
        isCloseable
        timeout={2000}
        onClose={dialog.onClose}
        title={dialog.title}
      >
        {dialog.content}
      </DefaultSnackbar>
    )
  }

  if (dialog.type === 'error') {
    return (
      <DefaultSnackbar isCloseable kind="error" onClose={dialog.onClose} title={dialog.title}>
        {dialog.content}
      </DefaultSnackbar>
    )
  }

  const unknownDialog: any = dialog

  // eslint-disable-next-line no-console
  console.warn(`Unsupported dialog type ${unknownDialog.type}`)

  return (
    <Dialog
      onClose={unknownDialog.onClose}
      // onClickOutside={unknownDialog.onClose}
    >
      {unknownDialog.content || (
        <>
          Unexpected dialog type (<code>{unknownDialog.type}</code>)
        </>
      )}
    </Dialog>
  )
}
