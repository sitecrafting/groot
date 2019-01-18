const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const AssetsVersionPlugin = require('./js/webpack-plugins/assets-version-plugin.js')
const CopyDistFilesPlugin = require('./js/webpack-plugins/copy-dist-files-plugin.js')

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
