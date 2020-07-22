import {Diff} from '../types'

// export interface Presenter<T> {
//   field(title: string[], body: T): T
//   changed(typfrom: unknown, to: unknown): T
//   unchangedText(text: string): T
//   addedText(text: string, annotation: Annotation): T
//   removedText(text: string, annotation: Annotation): T
//   addedValue(value: unknown): T
//   removedValue(value: unknown): T
//   textList(items: T[]): T
//   list(items: T[]): T
// }

type Presenter<T> = any

function PresentFlatInto<A, T>(diff: Diff<A>, presenter: Presenter<T>, result: T[], title: string[]) {
  if (diff.state === 'unchanged') return

  switch (diff.type) {
    case 'boolean':
    case 'number':
    case 'typeChange': {
      let value = presenter.changed(diff.fromValue, diff.toValue)
      result.push(presenter.field(title, value))
      break
    }

    case 'string': {
      let items = diff.segments.map(seg => {
        switch (seg.type) {
          case 'unchanged':
            return presenter.unchangedText(seg.value)
          case 'added':
            return presenter.addedText(seg.value, seg.annotation)
          case 'removed':
            return presenter.removedText(seg.value, seg.annotation)
        }
      })

      let value = presenter.textList(items)
      result.push(presenter.field(title, value))
      break
    }
    case 'object': {
      // TODO: How to resolve properly?
      // We want to look into the schema to find the correct schema
      // Let's do the schema-less version first
      for (let [key, field] of Object.entries(diff.fields)) {
        let newTitle = [...title, key]

        switch (field.type) {
          case 'unchanged': {
            PresentFlatInto(field.value, presenter, result, newTitle)
            break
          }
          case 'added': {
            let value = presenter.addedValue(field.value)
            result.push(presenter.field(newTitle, value))
            break
          }
          case 'removed': {
            let value = presenter.removedValue(field.value)
            result.push(presenter.field(newTitle, value))
            break
          }
        }
      }

      break
    }
    case 'array': {
      let newPosition = 0
      let oldPosition = 0

      for (let element of diff.elements) {
        switch (element.type) {
          case 'unchanged': {
            let newTitle = [...title, `${oldPosition}`]
            PresentFlatInto(element.value, presenter, result, newTitle)
            newPosition++
            break
          }
          case 'added': {
            let newTitle = [...title, `${newPosition}`]
            let value = presenter.addedValue(element.value)
            result.push(presenter.field(newTitle, value))
            newPosition++
            break
          }
          case 'removed': {
            let newTitle = [...title, `${oldPosition}`]
            let value = presenter.removedValue(element.value)
            result.push(presenter.field(newTitle, value))
            oldPosition++
            break
          }
        }
      }
    }
  }
}

export function PresentFlat<A, T>(diff: Diff<A>, presenter: Presenter<T>): T {
  let items: T[] = []
  PresentFlatInto(diff, presenter, items, [])
  return presenter.list(items)
}
