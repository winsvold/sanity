import schema from 'part:@sanity/base/schema'
import client from '../sanityClient'
import {getSearchableTypes} from './common/utils'
import {createWeightedSearch} from './weighted/createWeightedSearch'

export default createWeightedSearch(getSearchableTypes(schema), client)
