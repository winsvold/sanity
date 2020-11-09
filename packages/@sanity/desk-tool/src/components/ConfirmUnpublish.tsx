import {Alert, Spinner} from '@sanity/base/__legacy/components'
import {WarningOutlineIcon} from '@sanity/icons'
import {Dialog} from '@sanity/ui'
import React from 'react'
import enhanceWithReferringDocuments from './enhanceWithReferringDocuments'
import DocTitle from './DocTitle'
import ReferringDocumentsList from './ReferringDocumentsList'

interface ConfirmPublishUnpublishProps {
  onCancel: () => void
  onConfirm: () => void
  published?: {_id: string; _type: string}
  draft?: {_id: string; _type: string}
}

interface InnerConfirmPublishUnpublishProps extends ConfirmPublishUnpublishProps {
  referringDocuments: any[]
  isCheckingReferringDocuments: boolean
}

class ConfirmUnpublish extends React.PureComponent<InnerConfirmPublishUnpublishProps> {
  handleAction = action => {
    const {onCancel, onConfirm} = this.props

    if (action.name === 'confirm') {
      onConfirm()
    }

    if (action.name === 'cancel') {
      onCancel()
    }
  }

  // eslint-disable-next-line complexity
  render() {
    const {
      isCheckingReferringDocuments,
      referringDocuments,
      draft,
      published,
      onCancel
    } = this.props

    const hasReferringDocuments = referringDocuments.length > 0

    const canContinue = !isCheckingReferringDocuments

    const actions = [
      canContinue && {
        color: 'danger',
        name: 'confirm',
        title: hasReferringDocuments ? 'Try to unpublish anyway' : 'Unpublish now'
      },
      {
        inverted: true,
        name: 'cancel',
        title: 'Cancel'
      }
    ].filter(Boolean)

    const title = isCheckingReferringDocuments ? 'Checking…' : 'Confirm unpublish'

    const docTitle = <DocTitle document={draft || published} />

    return (
      <Dialog
        // cardClassName={styles.card}
        // isOpen
        // showHeader
        // centered
        header={title}
        id="confirm-unpublish-dialog"
        onClose={onCancel}
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
              that refers to “{docTitle}”
            </Alert>

            <p>
              You may not be able to unpublish “{docTitle}” because the following document
              {referringDocuments.length !== 1 && <>s</>} refers to it:
            </p>
            <ReferringDocumentsList documents={referringDocuments} />
          </>
        )}

        {!isCheckingReferringDocuments && !hasReferringDocuments && (
          <>
            <Alert color="warning" icon={WarningOutlineIcon} title="Careful!">
              If you unpublish this document, it will no longer be available for the public.
              However, it will not be deleted and can be published again later.
            </Alert>

            <p>
              Are you sure you want to unpublish the document <strong>“{docTitle}”</strong>?
            </p>
          </>
        )}
      </Dialog>
    )
  }
}

export default enhanceWithReferringDocuments(ConfirmUnpublish) as React.ComponentType<
  ConfirmPublishUnpublishProps
>
