import {
  OverlayProvider,
  OverlayRegion,
  OverlayRegionInterface
} from 'part:@sanity/components/overlay'
// import {action} from 'part:@sanity/storybook/addons/actions'
// import {boolean, select} from 'part:@sanity/storybook/addons/knobs'
import React, {useState} from 'react'

import styles from './connectors.css'

export function ConnectorsStory() {
  return <OverlayExample />
}

function OverlayExample() {
  const [leftRegions, setLeftRegions] = useState<OverlayRegionInterface[]>([])
  const [rightRegions, setRightRegions] = useState<OverlayRegionInterface[]>([])

  return (
    <>
      <div className={styles.example}>
        <OverlayProvider onChange={setLeftRegions}>
          {(scrollRef, wrapperRef) => (
            <div className={styles.scrollContainer} ref={scrollRef}>
              <div className={styles.root} ref={wrapperRef}>
                <OverlayRegion id="foo-left" params={{title: 'Hello'}}>
                  Region: foo-left
                </OverlayRegion>
              </div>
            </div>
          )}
        </OverlayProvider>

        <OverlayProvider onChange={setRightRegions}>
          {(scrollRef, wrapperRef) => (
            <div className={styles.scrollContainer} ref={scrollRef}>
              <div className={styles.root} ref={wrapperRef}>
                <OverlayRegion id="foo-right" params={{title: 'Hello'}}>
                  Region: foo-right
                  <br />
                  alksdma
                  <br />
                </OverlayRegion>
              </div>
            </div>
          )}
        </OverlayProvider>
      </div>
      <Overlay leftRegions={leftRegions} rightRegions={rightRegions} />
    </>
  )
}

function Overlay(props: any) {
  return (
    <div className={styles.overlay}>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  )
}
