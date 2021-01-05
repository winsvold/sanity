import React, {useCallback} from 'react'
// import {Path} from '@sanity/types'
import {PortableTextBlock, Type} from '@sanity/portable-text-editor'
import DropDownButton from 'part:@sanity/components/buttons/dropdown'
import {EditIcon, LinkIcon, TrashIcon, EyeOpenIcon} from '@sanity/icons'

import Preview from '../../../../Preview'
import {MenuItem, DropDownMenuItemProps} from './BlockObjectMenuItem'

import styles from './BlockObject.css'

type Props = {
  type: Type
  value: PortableTextBlock
  // path: Path
  readOnly: boolean
  // onFocus: (path: Path) => void
  onClickingEdit: () => void
  onClickingDelete: () => void
}

export function BlockObjectPreview({
  value,
  type,
  readOnly,
  onClickingEdit,
  onClickingDelete,
}: Props) {
  const menuItems: DropDownMenuItemProps[] = []
  if (value._ref) {
    menuItems.push({
      title: 'Go to reference',
      icon: LinkIcon,
      intent: 'edit',
      params: {id: value._ref},
    })
  }
  if (readOnly) {
    menuItems.push({
      title: 'View',
      icon: EyeOpenIcon,
      name: 'view',
    })
  } else {
    menuItems.push({
      title: 'Edit',
      icon: EditIcon,
      name: 'edit',
    })
    menuItems.push({
      title: 'Delete',
      icon: TrashIcon,
      name: 'delete',
      color: 'danger',
    })
  }

  const handleHeaderMenuAction = useCallback(
    (item: DropDownMenuItemProps) => {
      if (item.name === 'delete') {
        onClickingDelete()
      }
      if (item.name === 'edit') {
        onClickingEdit()
      }
      if (item.name === 'view') {
        onClickingEdit()
      }
    },
    [onClickingDelete, onClickingEdit]
  )

  return (
    <div className={styles.preview}>
      <Preview type={type} value={value} layout="block" />
      <div className={styles.header}>
        <DropDownButton
          items={menuItems}
          kind="simple"
          onAction={handleHeaderMenuAction}
          padding="small"
          placement="bottom-end"
          renderItem={MenuItem}
        >
          {type ? type.title || type.name : 'Unknown'}
        </DropDownButton>
      </div>
    </div>
  )
}
