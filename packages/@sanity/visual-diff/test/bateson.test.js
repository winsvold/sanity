/* eslint-disable id-length */
import bateson, {isSameType} from '../src/differs/bateson'
import defaultSummarizers from '../src/differs/defaultSummarizers'

describe('when adding field', () => {
  test('should generate add operation', () => {
    const docA = {
      _type: 'book'
    }

    const docB = {
      _type: 'book',
      author: 'J. K. Rowling'
    }

    const result = bateson(docA, docB, {summarizers: defaultSummarizers})
    expect(result).toMatchSnapshot()
  })
})

describe('when removing field', () => {
  test('should generate remove operation', () => {
    const docA = {
      _type: 'book',
      author: 'J. R. R. Tolkien'
    }

    const docB = {
      _type: 'book'
    }

    const result = bateson(docA, docB, {summarizers: defaultSummarizers})
    expect(result).toMatchSnapshot()
  })
})

describe('when modifying strings', () => {
  test('should generate editText operation', () => {
    const docA = {
      _type: 'book',
      author: 'J. R. R. Tolkien'
    }

    const docB = {
      _type: 'book',
      author: 'J. K. Rowling'
    }

    const result = bateson(docA, docB, {summarizers: defaultSummarizers})
    expect(result).toMatchSnapshot()
  })
})

describe('when modifying numbers', () => {
  test('should generate edit operation', () => {
    const docA = {
      _type: 'movie',
      rating: 1
    }

    const docB = {
      _type: 'movie',
      rating: 2
    }

    const result = bateson(docA, docB, {summarizers: defaultSummarizers})
    expect(result).toMatchSnapshot()
  })
})

describe('when modifying booleans', () => {
  test('should generate edit operation', () => {
    const docA = {
      _type: 'movie',
      isPublished: false
    }

    const docB = {
      _type: 'movie',
      isPublished: true
    }

    const result = bateson(docA, docB, {summarizers: defaultSummarizers})
    expect(result).toMatchSnapshot()
  })
})

describe('when providing custom summarizer for built-in type', () => {
  test('should use the provided one', () => {
    const docA = {
      _type: 'book',
      author: 'J. R. R. Tolkien'
    }

    const docB = {
      _type: 'book',
      author: 'J. K. Rowling'
    }

    const summarizers = {
      string: {
        resolve: (a, b) => {
          return [{op: 'changeText', from: a, to: b}]
        }
      }
    }

    const result = bateson(docA, docB, {summarizers: {...defaultSummarizers, ...summarizers}})
    expect(result).toMatchSnapshot()
  })
})

describe('when diffing', () => {
  const zooA = {
    _type: 'zoo',
    keeper: {
      _type: 'keeper',
      name: 'Steve Irwin'
    }
  }

  const zooB = {
    _type: 'zoo',
    keeper: {
      _type: 'keeper',
      name: 'Bindi Irwin 😭'
    }
  }

  test('given no summarizer for object, should use default summarizers', () => {
    const result = bateson(zooA, zooB, {summarizers: defaultSummarizers})
    expect(result).toMatchSnapshot()
  })

  test('given summarizer for object, should use custom summarizer', () => {
    const summarizers = {
      keeper: {
        resolve: (a, b) => {
          return [{op: 'keeperNameChanged', from: a.name, to: b.name}]
        }
      }
    }
    const result = bateson(zooA, zooB, {
      summarizers: {...defaultSummarizers, ...summarizers}
    })
    expect(result).toMatchSnapshot()
  })

  test('given summarizer for object, should defer execution of un-handled fields to the algorithm', () => {
    const docA = {
      _type: 'zoo',
      profile: {
        _type: 'image',
        asset: {
          _type: 'asset',
          _ref: 'ref-123'
        },
        source: 'my-fancy-source'
      }
    }

    const docB = {
      _type: 'zoo',
      profile: {
        _type: 'image',
        asset: {
          _type: 'asset',
          _ref: 'ref-456'
        },
        source: 'my-fancy-source-2'
      }
    }

    const summarizers = {
      image: {
        resolve: (a, b, summarize) => {
          const operations = []
          if (a.asset && b.asset && a.asset._ref !== b.asset._ref) {
            operations.push({op: 'my-custom-action', from: a.asset._ref, to: b.asset._ref})
          }
          return summarize(['asset'], operations)
        }
      }
    }

    const result = bateson(docA, docB, {
      summarizers: {...defaultSummarizers, ...summarizers}
    })
    expect(result).toMatchSnapshot()
  })
})

describe('bateson tests', () => {
  test('simple object stuff', () => {
    const humanA = {
      _type: 'human',
      head: {
        face: {
          nose: 'slim'
        }
      }
    }
    const humanB = {
      _type: 'human',
      head: {
        face: {
          nose: 'big',
          eyes: 2
        }
      }
    }

    const summarizers = {
      human: {
        // eslint-disable-next-line complexity
        resolve: (a, b, summarize) => {
          const result = []
          if (
            a &&
            b &&
            a.head &&
            a.head.face &&
            !a.head.face.eyes &&
            b.head &&
            b.head.face &&
            b.head.face.eyes
          ) {
            result.push({op: 'eyesAdded', from: a, to: b})
          }
          if (
            a &&
            b &&
            a.head &&
            a.head.face &&
            a.head.face.nose &&
            b.head &&
            b.head.face &&
            b.head.face.nose
          ) {
            result.push({op: 'noseChanged', from: a, to: b})
          }

          return summarize(['head'], result)
        }
      }
    }

    const result = bateson(humanA, humanB, {summarizers: {...defaultSummarizers, ...summarizers}})
    expect(result).toMatchSnapshot()
  })

  test('google maps example', () => {
    const venueA = {
      _type: 'venue',
      location: {
        lat: 23.23,
        long: 40.4
      }
    }

    const venueB = {
      _type: 'venue',
      location: {
        lat: 24.0,
        long: 30.3
      }
    }

    const summarizers = {
      venue: {
        resolve: (a, b, summarize) => {
          const result = []
          if (
            a &&
            b &&
            a.location &&
            b.location &&
            a.location.lat !== b.location.lat &&
            a.location.long !== b.location.long
          ) {
            result.push({op: 'venueLocationChanged', from: a.location, to: b.location})
          }

          return summarize(['location'], result)
        }
      }
    }

    const result = bateson(venueA, venueB, {summarizers: {...defaultSummarizers, ...summarizers}})
    expect(result).toMatchSnapshot()
  })

  test('bateson stuff', () => {
    const zooA = {
      _type: 'zoo',
      keeper: {
        _type: 'keeper',
        face: {
          _type: 'face',
          nose: 'slim'
        }
      },
      zebra: {
        _type: 'zebra',
        face: {
          _type: 'face',
          nose: 'long',
          eyes: 2
        }
      }
    }

    const zooB = {
      _type: 'zoo',
      keeper: {
        _type: 'keeper',
        face: {
          _type: 'face',
          nose: 'big'
        }
      },
      zebra: {
        _type: 'zebra',
        face: {
          _type: 'face',
          nose: 'longandbig',
          eyes: 3
        }
      }
    }

    // TODO: When zebra is defined as a summarizer, it "takes over" the processing of
    //  everything deeper in the structure. By introducing `fields` (as below), bateson can
    //  keep track of what has been processed already and not. We could also potentially
    //  make 'zebra.face.nose' take prescedence over 'face.nose' as 'zebra.face.nose'
    //  is more specific.
    const summarizers = {
      zebra: {
        resolve: (a, b) => {
          return [{op: 'only-zebra-stuff', from: a, to: b}]
        }
      },
      face: {
        resolve: (a, b) => {
          return [{op: 'wut', from: a, to: b}]
        }
      }
    }

    const result = bateson(zooA, zooB, {summarizers})
    expect(result).toMatchSnapshot()
  })
})

describe('when diffing ignored fields', () => {
  test('should not generate diff entries', () => {
    const zooA = {
      _type: 'zoo',
      _id: '123',
      _updatedAt: '2019-02-02T00:00:00.000Z',
      _createdAt: '2019-02-01T00:00:00.000Z',
      _rev: '123',
      _weak: false
    }

    const zooB = {
      _type: 'zoo',
      _id: '456',
      _updatedAt: '2019-02-04T00:00:00.000Z',
      _createdAt: '2019-02-03T00:00:00.000Z',
      _rev: '456',
      _weak: true
    }

    const result = bateson(zooA, zooB, {summarizers: defaultSummarizers})
    expect(result).toEqual([])
  })
})

describe('when checking if two objects are of same Sanity type', () => {
  test.each([
    [null, null, true],
    [null, {_type: 'zoo'}, false],
    [{_type: 'zoo'}, null, false],
    [{}, {}, true],
    [[], [], true],
    [{_type: 'zoo'}, {_type: 'zoo'}, true]
  ])('isSameType(%o, %o)', (a, b, expected) => {
    const result = isSameType(a, b)
    expect(result).toBe(expected)
  })
})
