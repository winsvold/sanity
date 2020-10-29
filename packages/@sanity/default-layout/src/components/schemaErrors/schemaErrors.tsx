import generateHelpUrl from '@sanity/generate-help-url'
import {ErrorOutlineIcon, WarningOutlineIcon} from '@sanity/icons'
import React from 'react'

import styles from './schemaErrors.css'

type ProblemGroupPath = {
  kind: string
  type: string
  name: string
}[]

interface SchemaErrorsProps {
  problemGroups: {
    path: ProblemGroupPath
    problems: {
      helpId?: string
      message: string
      severity: string
    }[]
  }[]
}

function renderPath(path: ProblemGroupPath) {
  return path
    .map((segment, i) => {
      const key = `s_${i}`
      if (segment.kind === 'type') {
        return (
          <span className={styles.segment} key={key}>
            <span key="name" className={styles.pathSegmentTypeName}>
              {segment.name}
            </span>
            &ensp;
            <span key="type" className={styles.pathSegmentTypeType}>
              {segment.type}
            </span>
          </span>
        )
      }
      if (segment.kind === 'property') {
        return (
          <span className={styles.segment} key={key}>
            <span className={styles.pathSegmentProperty}>{segment.name}</span>
          </span>
        )
      }
      if (segment.kind === 'type') {
        return (
          <span className={styles.segment} key={key}>
            <span key="name" className={styles.pathSegmentTypeName}>
              {segment.name}
            </span>
            <span key="type" className={styles.pathSegmentTypeType}>
              {segment.type}
            </span>
          </span>
        )
      }
      return null
    })
    .filter(Boolean)
}

export function SchemaErrors(props: SchemaErrorsProps) {
  const {problemGroups} = props

  return (
    <div className={styles.root}>
      <h2 className={styles.title}>Uh oh… found errors in schema</h2>
      <ul className={styles.list}>
        {problemGroups.map((group, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={`g_${i}`} className={styles.listItem}>
            <h2 className={styles.path}>{renderPath(group.path)}</h2>
            <ul className={styles.problems}>
              {group.problems.map((problem, j) => (
                // eslint-disable-next-line react/no-array-index-key
                <li key={`g_${i}_p_${j}`} className={styles[`problem_${problem.severity}`]}>
                  <div className={styles.problemSeverity}>
                    <span className={styles.problemSeverityIcon}>
                      {problem.severity === 'error' && <ErrorOutlineIcon />}
                      {problem.severity === 'warning' && <WarningOutlineIcon />}
                    </span>
                    <span className={styles.problemSeverityText}>{problem.severity}</span>
                  </div>
                  <div className={styles.problemContent}>
                    <div className={styles.problemMessage}>{problem.message}</div>
                    {problem.helpId && (
                      <a
                        className={styles.problemLink}
                        href={generateHelpUrl(problem.helpId)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View documentation
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
