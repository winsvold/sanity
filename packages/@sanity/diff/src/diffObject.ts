import {SanityObject, Path, ObjectDiff, Diff} from './types'
import {diffItem} from './diffItem'
import {isNullish} from './getType'

const ignoredFields = ['_id', '_type', '_createdAt', '_updatedAt', '_rev']

export function diffObject(
  fromValue: SanityObject | null | undefined,
  toValue: SanityObject | null | undefined,
  path: Path = []
  //schemaType?: SchemaType
): ObjectDiff {
  function getFields(): ObjectDiff['fields'] {
    const fields: ObjectDiff['fields'] = {}
    if (fromValue === toValue || (isNullish(fromValue) && isNullish(toValue))) {
      return fields
    }

    const atRoot = path.length === 0
    const from = fromValue || {}
    const to = toValue || {}
    const cache: {[fieldName: string]: Diff | undefined} = {}

    // If schema type is passed, extract the field names from it to get the correct order
    //const definedFields = schemaType ? schemaType.fields.map(field => field.name) : []
    const definedFields = []

    // Find all the unique field names within from and to
    const allFields = [...definedFields, ...Object.keys(from), ...Object.keys(to)].filter(
      (fieldName, index, siblings) => siblings.indexOf(fieldName) === index
    )

    // Create lazy differs for each field within the object
    allFields.forEach(fieldName => {
      if (
        // Don't diff _rev, _createdAt etc
        (atRoot && ignoredFields.includes(fieldName)) ||
        // Don't diff two nullish values (null/undefined)
        (isNullish(from[fieldName]) && isNullish(to[fieldName]))
      ) {
        return
      }

      // Create lazy getter/differ for each field
      Object.defineProperty(fields, fieldName, {
        configurable: true,
        enumerable: true,
        get() {
          if (fieldName in cache) {
            return cache[fieldName]
          }

          /* const fieldType = schemaType
          ? schemaType.fields.find(field => field.name === fieldName)?.type
          : undefined */

          const fieldDiff = diffItem(
            from[fieldName],
            to[fieldName],
            path.concat(fieldName)
            //fieldType
          )

          const diff = fieldDiff && fieldDiff.isChanged ? fieldDiff : undefined
          cache[fieldName] = diff

          if (!diff) {
            delete fields[fieldName]
          }

          return cache[fieldName]
        }
      })
    })

    return fields
  }

  return {
    type: 'object',
    path,
    fromValue,
    toValue,

    // Discouraged: prefer looping over children unless you need to check every field!
    get isChanged(): boolean {
      return (
        (isNullish(fromValue) && isNullish(toValue) && fromValue !== toValue) ||
        Object.keys(this.fields).some(
          key => typeof this.fields[key] !== 'undefined' && this.fields[key].isChanged
        )
      )
    },

    get fields(): ObjectDiff['fields'] {
      delete this.fields
      this.fields = getFields()
      return this.fields
    }
  }
}
