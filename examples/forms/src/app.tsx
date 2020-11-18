import {
  DocumentProvider,
  DocumentFieldProvider,
  FormField,
  Schema,
  StringSchema,
  Studio,
  TextSchema,
} from '@sanity/base'
import {
  Box,
  Card,
  Container,
  Flex,
  Inline,
  Radio,
  Select,
  Stack,
  Text,
  TextArea,
  TextInput,
} from '@sanity/ui'
import React, {createElement} from 'react'
import {GlobalStyle} from './globalStyle'

function StringFieldInput(props: {id: string; schema: StringSchema | TextSchema}) {
  const {id, schema} = props

  let input: React.ReactNode = null

  if (schema.type === 'text') {
    input = <TextArea id={id} rows={4} />
  }

  if (schema.type === 'string') {
    const options = schema.options?.options

    if (options) {
      if (schema.options?.layout === 'radio') {
        input = (
          <Card border padding={3} radius={1}>
            <Inline space={4}>
              {options.map((option) => (
                <Flex as="label" align="center" key={option.value}>
                  <Box>
                    <Radio name="radio" style={{display: 'block'}} value={option.value} />
                  </Box>
                  <Box marginLeft={2}>
                    <Text>{option.title}</Text>
                  </Box>
                </Flex>
              ))}
            </Inline>
          </Card>
        )
      } else {
        input = (
          <Select id={id}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.title}
              </option>
            ))}
          </Select>
        )
      }
    } else {
      input = <TextInput id={id} />
    }
  }

  return (
    <FormField description={schema.description} inputId={id} title={schema.title}>
      {input}
    </FormField>
  )
}

const plugins = [
  {
    type: 'document/field',
    resolve: (schema: Schema) => {
      if (schema.type === 'string' || schema.type === 'text') {
        return {input: StringFieldInput}
      }

      return null
    },
  },
]

function resolveDocumentField(schema: Schema) {
  const documentFieldPlugins = plugins.filter((plugin) => plugin.type === 'document/field')

  for (const plugin of documentFieldPlugins) {
    const result = plugin.resolve(schema)
    if (result) return result
  }

  return null
}

function DocumentFieldInput(props: {path?: string[]; schema: Schema}) {
  const {path: pathProp = [], schema} = props

  const documentField = resolveDocumentField(schema)

  if (!documentField || !documentField.input) {
    return (
      <div>
        Unknown field type: <code>{schema.type}</code>
      </div>
    )
  }

  const path = pathProp.concat([schema.name])
  const id = path.join('_')

  return (
    <DocumentFieldProvider id={id} path={path} schema={schema}>
      {createElement(documentField.input, {id, schema})}
    </DocumentFieldProvider>
  )
}

export function App() {
  return (
    <Studio>
      <GlobalStyle scheme="light" />

      <DocumentProvider id="foo">
        <Container width={1}>
          <Box padding={[4, 4, 5, 6]}>
            <Stack space={5}>
              <DocumentFieldInput
                schema={{
                  type: 'string',
                  name: 'title',
                  title: 'Title',
                  description: 'Example of a plain string field',
                }}
              />

              <DocumentFieldInput
                schema={{
                  type: 'text',
                  name: 'text',
                  title: 'Text',
                  description: 'Example of a text field',
                }}
              />

              <DocumentFieldInput
                schema={{
                  type: 'string',
                  name: 'select',
                  title: 'Select',
                  description: 'Example of a selectable string field',
                  options: {
                    options: [
                      {value: 'foo', title: 'Foo'},
                      {value: 'bar', title: 'Bar'},
                      {value: 'baz', title: 'Baz'},
                    ],
                  },
                }}
              />

              <DocumentFieldInput
                schema={{
                  type: 'string',
                  name: 'radio',
                  title: 'Radio',
                  description: 'Example of a selectable string field (radio)',
                  options: {
                    layout: 'radio',
                    options: [
                      {value: 'foo', title: 'Foo'},
                      {value: 'bar', title: 'Bar'},
                      {value: 'baz', title: 'Baz'},
                    ],
                  },
                }}
              />
            </Stack>
          </Box>
        </Container>
      </DocumentProvider>
    </Studio>
  )
}
