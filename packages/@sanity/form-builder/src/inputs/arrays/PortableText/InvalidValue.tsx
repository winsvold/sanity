import {InvalidValueResolution, PortableTextBlock} from '@sanity/portable-text-editor'
import {Button} from '@sanity/ui'
import React, {useCallback} from 'react'
import {Warning} from '../../../components/Warning'
import styles from '../../ObjectInput/styles/UnknownFields.css'

interface InvalidValueProps {
  onChange: (...args: any[]) => any
  onIgnore: () => void
  resolution: InvalidValueResolution
  // eslint-disable-next-line react/no-unused-prop-types
  value: PortableTextBlock[]
}

export function InvalidValue(props: InvalidValueProps) {
  const {onChange, onIgnore, resolution} = props

  const handleAction = useCallback(() => {
    if (resolution) {
      const {patches} = resolution
      onChange({type: 'mutation', patches})
    }
  }, [onChange, resolution])

  const message = (
    <>
      <p>{resolution.description}</p>

      <p>
        <pre className={styles.inspectValue}>{JSON.stringify(resolution.item, null, 2)}</pre>
      </p>

      {resolution.action && (
        <>
          <div className={styles.buttonWrapper}>
            <Button tone="primary" onClick={handleAction} text={resolution.action} />
            <Button mode="ghost" onClick={onIgnore} text="Ignore" />
          </div>

          <p>
            It’s generally safe to perform the action above, but if you are in doubt, get in touch
            with those responsible for configuring your studio.
          </p>
        </>
      )}
    </>
  )

  return <Warning heading="Invalid portable text value" message={message} />
}
