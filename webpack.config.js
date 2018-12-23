const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {

  entry: {
    common: './js/src/common.js',
    style: './less/style.less',
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'js/dist'),
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
        test: /\.(less|css)/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: path.resolve(__dirname)
            },
          },
          'css-loader',
          'less-loader',
        ],
      },
    ],
  },

  mode: 'production',

}
