import React from 'react'
import Details from './common/Details'
import styles from './Warning.css'

type Props = {
  heading?: React.ReactNode
  message?: React.ReactNode
  values?: any[]
  children?: React.ReactNode
}

export default function Warning({heading, message, values = [], children}: Props) {
  const len = values.length

  return (
    <div className={styles.root}>
      <h2 className={styles.heading}>
        {heading ? (
          heading
        ) : (
          <>
            Found {len === 1 ? <>a</> : len} {len === 1 ? <>value</> : <>values</>} with{' '}
            {len === 1 && <>an</>} unknown {len === 1 ? <>type</> : <>types</>}
          </>
        )}
      </h2>

      <div className={styles.content}>
        <Details>
          <div>
            {message ? (
              message
            ) : (
              <>
                <p>
                  These are not defined in the current schema as valid types for this array. This
                  could mean that the type has been removed, or that someone else has added it to
                  their own local schema that is not yet deployed.
                </p>

                {values.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    <pre>{JSON.stringify(item)}</pre>
                  </div>
                ))}
              </>
            )}
          </div>

          <div>{children}</div>
        </Details>
      </div>
    </div>
  )
}
