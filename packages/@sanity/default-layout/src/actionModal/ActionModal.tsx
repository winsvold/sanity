import {DocumentIcon} from '@sanity/icons'
import React from 'react'
import DefaultDialog from 'part:@sanity/components/dialogs/default'
import CreateDocumentList from 'part:@sanity/components/lists/create-document'

interface Props {
  actions: {icon?: React.ComponentType<{}>; key: string}[]
  onClose: () => void
}

function ActionModal(props: Props) {
  const {actions, onClose} = props

  return (
    <DefaultDialog
      onClickOutside={onClose}
      onClose={onClose}
      size="large"
      title="Create new document"
    >
      {actions.length > 0 ? (
        <CreateDocumentList
          items={actions.map((action) => ({
            ...action,
            icon: action.icon || DocumentIcon,
            onClick: onClose,
          }))}
        />
      ) : (
        <h3>No initial value templates are configured.</h3>
      )}
    </DefaultDialog>
  )
}

export default ActionModal
