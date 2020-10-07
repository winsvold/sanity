import {DiffComponentResolver} from '@sanity/field/diff'
import {GeopointFieldDiff} from './GeopointFieldDiff'

const diffResolver: DiffComponentResolver = function diffResolver({schemaType}) {
  return schemaType.name === 'geopoint' ? GeopointFieldDiff : undefined
}

export default diffResolver
