const fs = require('fs')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// Simple plugin to write to assets.version file for cache-busting
class AssetsVersionPlugin {
  apply() {
    fs.writeFile('assets.version', Date.now().toString(), (err) => {
      if (err) {
        console.log("Error writing assets.version: ", err)
      }
    })
  }
}

module.exports = {

  entry: {
    common: './js/src/common.js',
    style: './less/style.less',
  },

  output: {
    filename: '[name].js',
  },

  plugins: [
    // extract CSS to a separate stylesheet, rather than
    // bundling into a JS module
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),

    new AssetsVersionPlugin([]),

  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(less|css)/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'less-loader',
        ],
      },
    ],
  },

  mode: 'production',

}
