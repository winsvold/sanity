import generateHelpUrl from '@sanity/generate-help-url'
import {Box, Card, Code, Container, Heading, Inline, Label, Stack, Text} from '@sanity/ui'
import React from 'react'
import {ProblemGroupPath} from './types'

import styles from './schemaErrors.css'

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
          <Card as="span" key={key} padding={2} tone="transparent" style={{display: 'block'}}>
            <Code as="span">
              <strong>{segment.name}</strong>: {segment.type}
            </Code>
          </Card>
        )
      }

      if (segment.kind === 'property') {
        return (
          <Card as="span" key={key} padding={2} tone="transparent" style={{display: 'block'}}>
            <Code as="span">
              <strong>{segment.name}</strong>
            </Code>
          </Card>
        )
      }

      if (segment.kind === 'type') {
        return (
          <Card as="span" key={key} padding={2} tone="transparent" style={{display: 'block'}}>
            <Code as="span">
              <strong>{segment.name}</strong>: {segment.type}
            </Code>
          </Card>
        )
      }

      return null
    })
    .filter(Boolean)
}

export function SchemaErrors(props: SchemaErrorsProps) {
  const {problemGroups} = props

  return (
    <Container>
      <Box padding={4} paddingTop={[5, 5, 6, 7]}>
        <Heading as="h1">The schema has errors</Heading>
      </Box>

      <Box padding={4}>
        <Stack as="ul" space={4} style={{listStyle: 'none'}}>
          {problemGroups.map((group, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <Card as="li" key={`g_${i}`} radius={2} shadow={1}>
              <Box
                as="h2"
                padding={3}
                style={{borderBottom: '1px solid var(--card-hairline-soft-color)'}}
              >
                <Inline as="span" space={1}>
                  {renderPath(group.path)}
                </Inline>
              </Box>

              <Box padding={4}>
                <Stack space={3} style={{listStyle: 'none'}}>
                  {group.problems.map((problem, j) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Stack
                      as="li"
                      key={`g_${i}_p_${j}`}
                      className={styles[`problem_${problem.severity}`]}
                      space={3}
                    >
                      <Label>{problem.severity}</Label>

                      <Text>{problem.message}</Text>

                      {problem.helpId && (
                        <Text>
                          <a
                            href={generateHelpUrl(problem.helpId)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View documentation
                          </a>
                        </Text>
                      )}
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Card>
          ))}
        </Stack>
      </Box>
    </Container>
  )
}
