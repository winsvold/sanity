/* eslint-disable id-length */

// If the differ takes responsibility for the change in question
// --> return an array of summaries, empty array means no summary needed
// --> return null to "drop the ball" and rely on a default summary to be created

// import {Summarizers} from './bateson'

function extractText(blockContent) {
  return blockContent.children
    .map(item => (item._type == 'span' ? item.text : null))
    .filter(Boolean)
    .join('')
}

// const summarizers: Summarizers = {
const summarizers = {
  block: {
    resolve: (a, b) => {
      const aText = extractText(a)
      const bText = extractText(b)
      if (aText !== bText) {
        return [
          {
            op: 'editText',
            type: 'block',
            from: aText,
            to: bText
          }
        ]
      }
      return []
    }
  },
  string: {
    resolve: (a, b) => {
      return [
        {
          op: 'editText',
          type: 'string',
          from: a,
          to: b
        }
      ]
    }
  },
  image: {
    resolve: (a, b, summarize) => {
      const result = []
      if (!a.asset && b.asset) {
        result.push({op: 'addImage', field: 'asset', value: b.asset._ref})
      } else if (a.asset && !b.asset) {
        result.push({op: 'removeImage', from: a.asset._ref})
      } else if (a.asset && b.asset && a.asset._ref !== b.asset._ref) {
        result.push({op: 'replaceImage', from: a.asset._ref, to: b.asset._ref})
      }
      return summarize(['asset'], result)
    }
  }
}

export default summarizers
