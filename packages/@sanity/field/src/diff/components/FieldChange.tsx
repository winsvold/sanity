import {DialogAction} from '@sanity/components'
import {useDocumentOperation} from '@sanity/react-hooks'
import {usePathStatus, useHoverReporter} from '@sanity/base/lib/datastores/paths'
import classNames from 'classnames'
import PopoverDialog from 'part:@sanity/components/dialogs/popover'
import React, {useCallback, useContext, useState} from 'react'
import {undoChange} from '../changes/undoChange'
import {DiffContext} from '../contexts/DiffContext'
import {FieldChangeNode, OperationsAPI} from '../../types'
import {ChangeBreadcrumb} from './ChangeBreadcrumb'
import {DiffErrorBoundary} from './DiffErrorBoundary'
import {DiffInspectWrapper} from './DiffInspectWrapper'
import {DocumentChangeContext} from './DocumentChangeContext'
import {FallbackDiff} from './FallbackDiff'
import {RevertChangesButton} from './RevertChangesButton'
import {ValueError} from './ValueError'

import styles from './FieldChange.css'

const pathStatusOptions = {filter: ['isDangerous']}

export function FieldChange({change}: {change: FieldChangeNode}) {
  const DiffComponent = change.diffComponent || FallbackDiff
  const {
    documentId,
    schemaType,
    rootDiff,
    isComparingCurrent,
    FieldWrapper = React.Fragment
  } = useContext(DocumentChangeContext)
  const docOperations = useDocumentOperation(documentId, schemaType.name) as OperationsAPI
  const [confirmRevertOpen, setConfirmRevertOpen] = React.useState(false)
  const [revertButtonElement, setRevertButtonElement] = useState<HTMLDivElement | null>(null)

  const handleRevertChanges = useCallback(() => {
    undoChange(change, rootDiff, docOperations)
  }, [change, rootDiff, docOperations])

  const handleRevertChangesConfirm = useCallback(() => {
    setConfirmRevertOpen(true)
  }, [])

  const closeRevertChangesConfirmDialog = React.useCallback(() => {
    setConfirmRevertOpen(false)
  }, [])

  const handleConfirmDialogAction = useCallback((action: DialogAction) => {
    if (action.action) action.action()
  }, [])

  const {isDangerous} = usePathStatus(change.path, pathStatusOptions)
  const {onEnter, onLeave, onEnterDanger, onLeaveDanger} = useHoverReporter(change.path)
  const revertHovered = isDangerous

  const rootClass = classNames(
    change.error ? styles.error : styles.root,
    revertHovered && styles.revertHovered
  )

  return (
    <div className={rootClass} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {change.showHeader && (
        <div className={styles.header}>
          <ChangeBreadcrumb change={change} titlePath={change.titlePath} />
        </div>
      )}

      <FieldWrapper path={change.path} hasHover={revertHovered}>
        <DiffInspectWrapper change={change} className={styles.change}>
          {change.error ? (
            <ValueError error={change.error} />
          ) : (
            <DiffErrorBoundary>
              <DiffContext.Provider value={{path: change.path}}>
                <DiffComponent diff={change.diff} schemaType={change.schemaType} />
              </DiffContext.Provider>
            </DiffErrorBoundary>
          )}

          {isComparingCurrent && (
            <>
              <div className={styles.revertChangesButtonContainer}>
                <RevertChangesButton
                  onClick={handleRevertChangesConfirm}
                  onMouseEnter={onEnterDanger}
                  onMouseLeave={onLeaveDanger}
                  ref={setRevertButtonElement}
                  selected={confirmRevertOpen}
                />
              </div>

              {confirmRevertOpen && (
                <PopoverDialog
                  portal
                  actions={[
                    {
                      color: 'danger',
                      action: handleRevertChanges,
                      title: 'Revert change'
                    },
                    {
                      kind: 'simple',
                      action: closeRevertChangesConfirmDialog,
                      title: 'Cancel'
                    }
                  ]}
                  onAction={handleConfirmDialogAction}
                  // portal
                  referenceElement={revertButtonElement}
                  size="small"
                >
                  Are you sure you want to revert the changes?
                </PopoverDialog>
              )}
            </>
          )}
        </DiffInspectWrapper>
      </FieldWrapper>
    </div>
  )
}
