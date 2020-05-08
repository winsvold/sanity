const webpack = require('webpack')
const webpackProdConfig = require('../webpack.prod.config.js')

const compiler = webpack(webpackProdConfig)

compiler.run((err, stats) => {
  // Stats Object
  if (err) {
    console.log(err)
    process.exit(1)
  }

  console.log('built successfully')
})
