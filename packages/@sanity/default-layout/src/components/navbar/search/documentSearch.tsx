import {Autocomplete, AutocompleteOption, Box, Card, Text} from '@sanity/ui'
import Preview from 'part:@sanity/base/preview?'
import {IntentLink} from 'part:@sanity/base/router'
import schema from 'part:@sanity/base/schema?'
import {getPublishedId} from 'part:@sanity/base/util/draft-utils'
import React, {useCallback, useState} from 'react'
import {useSearch} from './hooks'

const EMPTY_RESULTS = []

export function DocumentSearch() {
  const [value, setValue] = useState('')
  const {data, error, isLoaded, query} = useSearch()
  const results = (isLoaded && data) || EMPTY_RESULTS
  const options = results.map(result => ({value: result.hit._id}))

  const handleInputChange = useCallback(
    (v: string) => {
      query(v)
      setValue(v)
    },
    [query]
  )

  const renderOption = useCallback(
    (option: AutocompleteOption) => {
      const result = results.find(r => r.hit._id === option.value)

      if (!result) {
        return null
      }

      const type = schema.get(result.hit._type)

      const intent = {
        intent: 'edit',
        params: {id: getPublishedId(result.hit._id), type: type.name}
      }

      return (
        <Card as={IntentLink as any} onClick={() => handleInputChange('')} {...(intent as any)}>
          <Box paddingX={3} paddingY={2}>
            <Preview
              value={result.hit}
              layout="default"
              type={type}
              status={<Text size={0}>{type.title}</Text>}
            />
          </Box>
        </Card>
      )
    },
    [handleInputChange, results]
  )

  return (
    <>
      <Autocomplete
        border={false}
        id="navbar-search"
        name="searchTerm"
        onChange={handleInputChange}
        options={options}
        placeholder="Search documents"
        renderOption={renderOption}
        value={value}
      />

      {error && <div>{error.message}</div>}
    </>
  )
}
