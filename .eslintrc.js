'use strict'

const common = {
  env: {
    node: true,
    browser: true
  },
  rules: {
    'newline-per-chained-call': 'off',
    'prettier/prettier': 'error',
    'react/jsx-no-bind': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'sort-imports': 'off'
  },
  globals: {
    __DEV__: true
  },
  settings: {
    react: {version: 'detect'}
  }
}

module.exports = {
  ...common,
  root: true,
  overrides: [
    // JavaScript only:
    {
      files: ['**/*.js', '**/*.jsx', '**/*.mjs'],
      parser: 'babel-eslint',
      extends: [
        './packages/eslint-config-sanity/index.js',
        './packages/eslint-config-sanity/react.js',
        './packages/eslint-config-sanity/import.js',
        'prettier',
        'prettier/react'
      ],
      rules: {
        ...common.rules,
        'import/no-extraneous-dependencies': 'off',
        'import/no-unresolved': [
          'error',
          {
            ignore: ['.*:.*']
          }
        ],
        'import/order': ['error', {alphabetize: {order: 'asc', caseInsensitive: true}}],
        'import/prefer-default-export': 'off',
        'import/unambiguous': 'off'
      },
      plugins: ['import', 'prettier', 'react', 'react-hooks'],
      settings: {
        'import/ignore': ['\\.css$', '.*node_modules.*', '.*:.*'],
        'import/resolver': 'webpack'
      }
    },
    // TypeScript only:
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: [
        // './packages/eslint-config-sanity/index.js',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'prettier',
        'prettier/react'
      ],
      rules: {
        ...common.rules,
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        'react/jsx-filename-extension': ['error', {extensions: ['.tsx']}]
      },
      plugins: ['@typescript-eslint', 'prettier', 'react', 'react-hooks']
    }
  ]
}
