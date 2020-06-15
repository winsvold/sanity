'use strict'

/* eslint-disable no-console */

const path = require('path')

// @todo: make this configurable
const MONOREPO_PATH = path.resolve(__dirname, '../../../../../')

require('@babel/register')({
  cache: false,
  cwd: MONOREPO_PATH,
  extensions: ['.jsx', '.js', '.mjs', '.ts', '.tsx']
})

// process.stderr.write = () => {
//   // void
// }

// process.stdout.write = () => {
//   // void
// }

const {getServer$} = require('./server')

let isInitialized = false
// let sub

process.on('message', msg => {
  if (msg.type === 'init') {
    if (isInitialized) {
      console.warn('dev worker is already initialized')
      return
    }

    isInitialized = true

    getServer$(msg.params).subscribe({
      next(serverMsg) {
        process.send({type: 'next', data: serverMsg})
      },
      error(serverError) {
        process.send({
          type: 'error',
          error: {
            code: serverError.code,
            message: serverError.message,
            stack: serverError.stack
          }
        })
      }
    })

    // @todo: unsubscribe?
  }
})
