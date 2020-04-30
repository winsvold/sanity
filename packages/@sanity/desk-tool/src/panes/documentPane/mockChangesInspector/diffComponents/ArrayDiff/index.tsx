import * as React from 'react'
import BlockArrayDiff from './BlockArrayDiff'
import DefaultArrayDiff from './DefaultArrayDiff'
import OptionArrayDiff from './OptionArrayDiff'
import TagArrayDiff from './TagArrayDiff'
import PrimitiveArrayDiff from './PrimitiveArrayDiff'
import {hasBlocks, hasOptionsList, isArrayOfPrimitives, isTagsArray} from './helpers'

function ArrayDiff({diff, field}: any) {
  console.log('ArrayDiff', {diff, field})

  // Schema provides predefines list
  if (hasOptionsList(field)) {
    return <OptionArrayDiff diff={diff} field={field} />
  }

  if (isTagsArray(field)) {
    return <TagArrayDiff diff={diff} field={field} />
  }

  // Special component for array of primitive values
  if (isArrayOfPrimitives(field)) {
    return <PrimitiveArrayDiff diff={diff} field={field} />
  }

  // Use block editor if its an array that includes blocks
  if (hasBlocks(field)) {
    return <BlockArrayDiff diff={diff} field={field} />
  }

  return <DefaultArrayDiff diff={diff} field={field} />
}

export default ArrayDiff
