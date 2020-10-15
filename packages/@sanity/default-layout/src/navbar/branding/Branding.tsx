import React, {createElement} from 'react'
import styles from 'part:@sanity/default-layout/branding-style'
import BrandLogo from 'part:@sanity/base/brand-logo?'

interface BrandingProps {
  logo?: React.ComponentType
  projectName: string
}

export function Branding(props: BrandingProps) {
  const projectName = props.projectName || 'Sanity'
  const logo = props.logo || BrandLogo

  return (
    <div className={styles.root}>
      {logo && <div className={styles.brandLogoContainer}>{createElement(logo)}</div>}

      {!logo && (
        <div>
          <h1 className={styles.projectName}>{projectName}</h1>
        </div>
      )}
    </div>
  )
}
