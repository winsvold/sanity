import {Box, Card, Code, Dialog, Stack, Text} from '@sanity/ui'
import React from 'react'
import styled from 'styled-components'
import {Package} from './types'

import styles from './updateNotifierDialog.css'

declare const __DEV__: boolean

interface Props {
  onClose: () => void
  severity: string
  outdated: Package[]
}

const PackageTableBox = styled(Box)`
  -webkit-overflow-scrolling: touch;
  overflow-x: auto;
`

const PackageTable = styled.table`
  border-collapse: collapse;
  margin: 0;
  width: 100%;
  white-space: nowrap;

  & td,
  & th {
    padding: var(--small-padding);
    text-align: left;

    &:first-child {
      padding-left: var(--medium-padding);
    }

    &:last-child {
      padding-right: var(--medium-padding);
    }
  }

  & tr:hover td {
    background: color(var(--gray-lightest) alpha(50%));
  }
`

const upperFirst = (str: string) => `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`

function UpdateNotifierTable(props: {outdated: Package[]}) {
  const {outdated} = props

  return (
    <>
      <PackageTableBox padding={3}>
        <PackageTable>
          <thead>
            <tr>
              <th>
                <Box padding={2}>
                  <Text size={1}>
                    <strong>Module</strong>
                  </Text>
                </Box>
              </th>
              <th>
                <Box padding={2}>
                  <Text size={1}>
                    <strong>Installed</strong>
                  </Text>
                </Box>
              </th>
              <th>
                <Box padding={2}>
                  <Text size={1}>
                    <strong>Latest</strong>
                  </Text>
                </Box>
              </th>
              <th>
                <Box padding={2}>
                  <Text size={1}>
                    <strong>Importance</strong>
                  </Text>
                </Box>
              </th>
            </tr>
          </thead>
          <tbody>
            {outdated.map(pkg => (
              <tr key={pkg.name}>
                <td>
                  <Box padding={2}>
                    <Code>{pkg.name}</Code>
                  </Box>
                </td>
                <td>
                  <Box padding={2}>
                    <Code>{pkg.version}</Code>
                  </Box>
                </td>
                <td>
                  <Box padding={2}>
                    <Code>{pkg.latest}</Code>
                  </Box>
                </td>
                <td>
                  <Box padding={2}>
                    <Text>{upperFirst(pkg.severity || 'low')}</Text>
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </PackageTable>
      </PackageTableBox>

      <Box padding={4}>
        <Stack space={3}>
          <Text as="p">
            Run the{' '}
            <a href="https://www.sanity.io/docs/reference/cli" rel="noreferrer" target="_blank">
              Sanity CLI
            </a>{' '}
            upgrade command in your project folder from a terminal:
          </Text>

          <Card padding={3} radius={2} tone="transparent">
            <Code language="bash">sanity upgrade</Code>
          </Card>
        </Stack>
      </Box>
    </>
  )
}

function ContactDeveloper(props: {outdated: Package[]; severity: string}) {
  const {outdated, severity} = props

  return (
    <>
      <Box padding={4}>
        {severity === 'high' ? (
          <Text as="p">
            This Studio should be updated. Please get in touch with the developers and ask them to
            upgrade it for you.
          </Text>
        ) : (
          <Text as="p">
            This Studio has available upgrades. Consider getting in touch with the developers and
            ask them to upgrade it for you.
          </Text>
        )}
      </Box>

      <details className={styles.details}>
        <summary className={styles.summary}>Developer info</summary>
        <UpdateNotifierTable outdated={outdated} />
      </details>
    </>
  )
}

export function UpdateNotifierDialog(props: Props) {
  const {outdated, severity, onClose} = props

  return (
    <Dialog
      id="update-notifier"
      onClose={onClose}
      header={severity === 'low' ? 'Upgrades available' : 'Studio is outdated'}
      width={1}
    >
      {__DEV__ && (
        <>
          <Box padding={4}>
            <Text as="p">
              This Studio is no longer up to date{' '}
              {severity === 'high' ? 'and should be upgraded.' : 'and can be upgraded.'}
            </Text>
          </Box>

          <UpdateNotifierTable outdated={outdated} />
        </>
      )}

      {!__DEV__ && <ContactDeveloper outdated={outdated} severity={severity} />}
    </Dialog>
  )
}
