const path = require('path')

module.exports = {
  mode: 'development',

  entry: {
    index: './client/src/index.js'
  },

  output: {
    path: path.join(__dirname, 'client'),
    filename: '[name].js'
  },

  watch: false,
  watchOptions: {
    ignored: [
      '/node_modules/'
    ]
  }
}
