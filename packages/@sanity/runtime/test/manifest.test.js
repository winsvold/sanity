'use strict'

const path = require('path')
const {resolveTree} = require('../src/manifest/tree')

const FIXTURES_PATH = path.resolve(__dirname, 'fixtures')

describe('manifest/tree', () => {
  it('should resolve tree of sanity modules', async () => {
    const basePath = path.resolve(FIXTURES_PATH, 'root')
    const tree = await resolveTree({basePath})

    expect(tree).toEqual({
      path: basePath,
      name: null,
      manifest: {
        plugins: ['./plugins/a', './plugins/b'],
        parts: [
          {
            name: 'part:@sanity/base/root',
            path: 'root'
          }
        ]
      },
      plugins: [
        {
          path: path.resolve(basePath, 'plugins/a'),
          name: './plugins/a',
          manifest: {
            parts: [
              {
                name: 'part:@sanity/a/a',
                path: 'a'
              },
              {
                name: 'part:@sanity/a/b',
                path: 'b'
              },
              {
                name: 'part:@sanity/a/c',
                path: 'c'
              }
            ]
          },
          plugins: []
        },
        {
          path: path.resolve(basePath, 'plugins/b'),
          name: './plugins/b',
          manifest: {
            parts: []
          },
          plugins: []
        }
      ]
    })
  })
})
