import {Alert, Spinner} from '@sanity/base/__legacy/components'
import {WarningOutlineIcon} from '@sanity/icons'
import {Dialog} from '@sanity/ui'
import React from 'react'
import enhanceWithReferringDocuments from './enhanceWithReferringDocuments'
import DocTitle from './DocTitle'
import ReferringDocumentsList from './ReferringDocumentsList'

interface ConfirmDeleteProps {
  onCancel: () => void
  onConfirm: () => void
  published?: {_id: string; _type: string}
  draft?: {_id: string; _type: string}
}

interface InnerConfirmDeleteProps extends ConfirmDeleteProps {
  referringDocuments: any[]
  isCheckingReferringDocuments: boolean
}

class ConfirmDelete extends React.PureComponent<InnerConfirmDeleteProps> {
  handleAction = action => {
    const {onCancel, onConfirm} = this.props
    if (action.name === 'confirm') {
      onConfirm()
    }
    if (action.name === 'cancel') {
      onCancel()
    }
  }

  render() {
    const {isCheckingReferringDocuments, referringDocuments, draft, published} = this.props

    const hasReferringDocuments = referringDocuments.length > 0

    const canContinue = !isCheckingReferringDocuments

    const actions = [
      canContinue && {
        name: 'confirm',
        title: hasReferringDocuments ? 'Try to delete anyway' : 'Delete now',
        color: 'danger'
      },
      {name: 'cancel', title: 'Cancel', inverted: true}
    ].filter(Boolean)

    const title = isCheckingReferringDocuments ? 'Checking…' : 'Confirm delete'

    const docTitle = <DocTitle document={draft || published} />

    return (
      <Dialog
        // cardClassName={styles.card}
        // isOpen
        // showHeader
        // color="danger"
        // centered
        header={title}
        id="confirm-delete-dialog"
        // onAction={this.handleAction}
        // actions={actions}
      >
        {isCheckingReferringDocuments && <Spinner message="Looking for referring documents…" />}

        {hasReferringDocuments && (
          <>
            <Alert color="warning" icon={WarningOutlineIcon}>
              Warning: Found{' '}
              {referringDocuments.length === 1 ? (
                <>a document</>
              ) : (
                <>{referringDocuments.length} documents</>
              )}{' '}
              that refer{referringDocuments.length === 1 ? <>s</> : ''} to “{docTitle}”.
            </Alert>

            <p>
              You may not be able to delete “{docTitle}” because{' '}
              {referringDocuments.length === 1 ? <>this document</> : <>these documents</>} refer
              {referringDocuments.length === 1 ? <>s</> : ''} to it:
            </p>

            <ReferringDocumentsList documents={referringDocuments} />
          </>
        )}
        {!isCheckingReferringDocuments && !hasReferringDocuments && (
          <>
            <p>
              Are you sure you want to delete <strong>“{docTitle}”</strong>?
            </p>
          </>
        )}
      </Dialog>
    )
  }
}

export default enhanceWithReferringDocuments(ConfirmDelete) as React.ComponentType<
  ConfirmDeleteProps
>
