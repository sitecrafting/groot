const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

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
