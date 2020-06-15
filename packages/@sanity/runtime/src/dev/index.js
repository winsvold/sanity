'use strict'

const childProcess = require('child_process')
const path = require('path')
const {Observable} = require('rxjs')

exports.dev = function dev(params) {
  return Observable.create(observer => {
    const proc = childProcess.fork(path.join(__dirname, 'worker'))

    proc.on('message', event => {
      if (event.type === 'next') {
        observer.next(event.data)
      }

      if (event.type === 'error') {
        observer.error(event.error)
      }
    })

    proc.send({type: 'init', params})

    return () => {
      proc.kill('SIGINT')
    }
  })
}
