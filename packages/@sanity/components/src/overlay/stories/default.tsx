import {OverlayProvider, OverlayRegion, useOverlay} from 'part:@sanity/components/overlay'
// import {action} from 'part:@sanity/storybook/addons/actions'
// import {boolean, select} from 'part:@sanity/storybook/addons/knobs'
import React, {useRef} from 'react'

import styles from './default.css'

export function DefaultStory() {
  return <OverlayExample />
}

function OverlayExample() {
  // const rootRef = useRef(null)
  // const scrollRef = useRef(null)

  return (
    <OverlayProvider>
      {(scrollRef, wrapperRef) => (
        <div className={styles.scrollContainer} ref={scrollRef}>
          <div className={styles.root} ref={wrapperRef}>
            <OverlayRegion id="foo" params={{title: 'Hello'}}>
              <div>Region</div>
            </OverlayRegion>
            <Overlay />
          </div>
        </div>
      )}
    </OverlayProvider>
  )
}

function Overlay() {
  const {regions} = useOverlay()

  return (
    <div className={styles.overlay}>
      <pre>{JSON.stringify(regions, null, 2)}</pre>
    </div>
  )
}
