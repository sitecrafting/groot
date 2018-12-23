const path = require('path')

module.exports = {

  entry: './js/src/common.js',

  output: {
    filename: 'common.min.js',
    path:     path.resolve(__dirname, 'js/dist'),
  },

  mode: 'production',

}
