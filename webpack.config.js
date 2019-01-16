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

// Plugin for copying compiled stylesheets to theme directory
class CopyDistFilesPlugin {
  constructor(files) {
    this.files = files
  }

  apply() {
    for (const distFile in this.files) {
      fs.readFile(distFile, (err, contents) => {
        if (err) {
          console.log(`Error reading ${distFile} `, err);
        } else {
          const dest = this.files[distFile];
          fs.writeFile(dest, contents, (err) => {
            if (err) {
              console.log('Error writing to ${dest}: ', err);
            }
          })
        }
      })
    }
  }
}

module.exports = {

  entry: {
    common: './js/src/common.js',
    style: './less/style.less',
    print: './less/style-print.less',
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

    new CopyDistFilesPlugin({
      'dist/style.css': 'style.css',
      'dist/print.css': 'print.css',
    }),

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
