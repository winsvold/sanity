import ArrayDiff from './ArrayDiff'
import BooleanDiff from './BooleanDiff'
import ColorDiff from './ColorDiff'
import DateDiff from './DateDiff'
import FileDiff from './FileDiff'
import GeopointDiff from './GeopointDiff'
import NumberDiff from './NumberDiff'
import ObjectDiff from './ObjectDiff'
import ReferenceDiff from './ReferenceDiff'
import SlugDiff from './SlugDiff'
import StringDiff from './StringDiff'

export default {
  array: ArrayDiff,
  boolean: BooleanDiff,
  color: ColorDiff,
  date: DateDiff,
  datetime: DateDiff,
  email: StringDiff,
  file: FileDiff,
  geopoint: GeopointDiff,
  number: NumberDiff,
  object: ObjectDiff,
  reference: ReferenceDiff,
  slug: SlugDiff,
  string: StringDiff,
  text: StringDiff,
  url: StringDiff
}
