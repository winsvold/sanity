import * as React from 'react'
import {
  DiffComponent,
  ObjectDiff,
  DiffProps as GenericDiffProps,
  FromTo,
  DiffCard,
  getAnnotationAtPath,
  DiffTooltip,
  useAnnotationColor
} from '@sanity/field/diff'
import {UserColor} from '@sanity/base/user-color'
import {GoogleMapsLoadProxy} from '../loader/GoogleMapsLoadProxy'
import {GoogleMap} from '../map/Map'
import {Marker} from '../map/Marker'
import {Geopoint} from '../types'
import styles from './GeopointFieldDiff.css'

export type DiffProps = GenericDiffProps<ObjectDiff<Geopoint>>

export const GeopointFieldDiff: DiffComponent<ObjectDiff<Geopoint>> = ({diff}) => {
  const {fromValue, toValue} = diff
  const annotation =
    getAnnotationAtPath(diff, ['lat']) ||
    getAnnotationAtPath(diff, ['lng']) ||
    getAnnotationAtPath(diff, [])

  const userColor = useAnnotationColor(annotation)

  let action = 'Unchanged'
  if (fromValue && toValue) {
    action = 'Moved'
  } else if (fromValue) {
    action = 'Removed'
  } else if (toValue) {
    action = 'Added'
  }

  const from = fromValue ? (
    <DiffCard className={styles.annotation} annotation={annotation}>
      <div className={styles.root}>
        <GoogleMapsLoadProxy>
          {api => (
            <GeopointMarker
              api={api}
              point={fromValue}
              userColor={userColor}
              opacity={fromValue && toValue ? 0.75 : 1}
            />
          )}
        </GoogleMapsLoadProxy>
      </div>
    </DiffCard>
  ) : (
    <NoGeopointPreview />
  )

  const to = toValue ? (
    <DiffCard className={styles.annotation} annotation={annotation}>
      <div className={styles.root}>
        <GoogleMapsLoadProxy>
          {api => <GeopointMarker api={api} point={toValue} userColor={userColor} />}
        </GoogleMapsLoadProxy>
      </div>
    </DiffCard>
  ) : (
    <NoGeopointPreview />
  )

  return (
    <DiffTooltip annotations={annotation ? [annotation] : []} description={action}>
      <FromTo align="center" from={from} to={to} layout="grid" />
    </DiffTooltip>
  )
}

function GeopointMarker({
  api,
  point,
  opacity = 1,
  userColor
}: {
  api: typeof window.google.maps
  point: Geopoint
  opacity?: number
  userColor?: UserColor
}) {
  return (
    <GoogleMap
      api={api}
      location={point}
      mapTypeControl={false}
      controlSize={20}
      scrollWheel={false}
    >
      {map => <Marker api={api} map={map} position={point} opacity={opacity} color={userColor} />}
    </GoogleMap>
  )
}

function NoGeopointPreview() {
  return (
    <div className={styles.noGeoPoint}>
      <div>(no geopoint)</div>
    </div>
  )
}
