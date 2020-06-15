'use strict'

const path = require('path')
const {resolveParts} = require('../src/manifest')

const FIXTURES_PATH = path.resolve(__dirname, 'fixtures')

describe('manifest/part', () => {
  it('should resolve sanity parts', async () => {
    const basePath = path.resolve(FIXTURES_PATH, 'root')
    const parts = await resolveParts({basePath})

    expect(parts).toEqual({
      defs: {
        'part:@sanity/a/a': {
          plugin: './plugins/a',
          path: `${basePath}/plugins/a`,
          isAbstract: false
        },
        'part:@sanity/a/b': {
          plugin: './plugins/a',
          path: `${basePath}/plugins/a`,
          isAbstract: false
        },
        'part:@sanity/a/c': {
          plugin: './plugins/a',
          path: `${basePath}/plugins/a`,
          isAbstract: false
        },
        'part:@sanity/base/root': {
          plugin: null,
          path: `${basePath}`,
          isAbstract: false
        }
      },
      impl: {
        'part:@sanity/a/a': [
          {
            plugin: './plugins/a',
            source: `${basePath}/plugins/a/a`,
            compiled: `${basePath}/plugins/a/a`,
            isLib: false
          }
        ],
        'part:@sanity/a/b': [
          {
            plugin: './plugins/a',
            source: `${basePath}/plugins/a/b`,
            compiled: `${basePath}/plugins/a/b`,
            isLib: false
          }
        ],
        'part:@sanity/a/c': [
          {
            plugin: './plugins/a',
            source: `${basePath}/plugins/a/c`,
            compiled: `${basePath}/plugins/a/c`,
            isLib: false
          }
        ],
        'part:@sanity/base/root': [
          {
            plugin: null,
            source: `${basePath}/root`,
            compiled: `${basePath}/root`,
            isLib: false
          }
        ]
      },
      plugins: [
        {
          name: './plugins/b',
          path: `${basePath}/plugins/b`
        },
        {
          name: './plugins/a',
          path: `${basePath}/plugins/a`
        },
        {
          name: null,
          path: `${basePath}`
        }
      ]
    })
  })
})
