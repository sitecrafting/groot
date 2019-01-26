const path = require('path')
const AssetsVersionPlugin = require('./js/webpack-plugins/assets-version-plugin.js')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const sharedConfig = {
  mode: 'production',
  devtool: 'source-map',
}

const jsConfig = Object.assign({}, sharedConfig, {

  entry: {
    common: './js/src/common.js',
  },

  output: {
    filename: '[name].js',
  },

  plugins: [
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
    ],
  },

})

const cssConfig = Object.assign({}, sharedConfig, {

  entry: {
    style: './less/style.less',
    print: './less/style-print.less',
  },

  output: {
    path: path.resolve(__dirname, '.'),
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new OptimizeCssAssetsPlugin({}),
    new AssetsVersionPlugin([]),
  ],

  module: {
    rules: [
      {
        test: /\.(less|css)/,
        use: [{
          // Compile just the CSS as a non-JS asset
          loader: MiniCssExtractPlugin.loader
        }, {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          },
        }, {
          loader: 'less-loader',
          options: {
            sourceMap: true,
          },
        }],
      },
    ],
  },

})

module.exports = [jsConfig, cssConfig]
