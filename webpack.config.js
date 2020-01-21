/**
 * Welcome to the Groot webpack config.
 *
 * This file describes, in JavaScript, how frontend code is compiled to be
 * served in all WordPress environments. There are three main parts:
 *
 * 1. The shared configuration, which forms a basis for the other two parts
 * 2. The JavaScript configuration, which builds JS from /js/src/ and outputs
 *    the compiled code to /dist
 * 3. The LESS/CSS configuration, which builds CSS from /less and also outputs
 *    the compiled code to /dist
 *
 * Learn more: https://webpack.js.org/concepts/
 */
const path = require('path')
const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const DeleteAfterBuildPlugin = require('./js/webpack-plugins/delete-after-build-plugin.js')
const AssetsVersionPlugin = require('./js/webpack-plugins/assets-version-plugin.js')

const sharedConfig = {
  mode: 'production',
  devtool: 'source-map',
  stats: 'errors-only',
}

const jsConfig = Object.assign({}, sharedConfig, {

  /*
   * This tells Webpack where to find the main JS file for your bundles.
   * By default, there is only one bundle, called `common`. You can add more
   * by adding a key pointing to your file below.
   */
  entry: {
    common: './js/src/common.js',
    /*
     * Adding this here:
     *
     *   example: './js/src/example.js',
     *
     * will tell Webpack to parse js/src/example.js when you run
     * `webpack` and compile it to dist/example.js.
     */
  },

  output: {
    /*
     * Here, the [name] part corresponds to the `common` and `example` keys
     * in the `entry` object above. In most cases you shouldn't have to change
     * this part to add new bundles.
     */
    filename: '[name].js',
  },

  /*
   * Webpack plugins are special pieces of code that run at various times
   * during Webpack's bundling process.
   *
   * Learn more: https://webpack.js.org/concepts/plugins/
   */
  plugins: [
    /*
     * The AssetsVersionPlugin produces an extra file called assets.version
     * which WordPress uses to tell end-users' browsers to load new versions
     * of our frontend code using a technique called cache-busting.
     *
     * Learn more: https://www.sitecrafting.com/issues-cached-css-js-files-wordpress/
     */
    new AssetsVersionPlugin([]),
    /*
     * Tell Webpack that jQuery is a thing that exists globally.
     */
    new webpack.ProvidePlugin({
      '$':             'jquery',
      'jQuery':        'jquery',
      'window.jQuery': 'jquery',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,

        /*
         * NOTE ABOUT TYPESCRIPT SUPPORT:
         *
         * To add TypeScript support, run `yarn add --dev ts-loader`.
         * Then add:
         *
         * {
         *   loader: 'ts-loader'
         * }
         *
         * to the array below.
         */

        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        }],
      },
    ],
  },

})

const cssConfig = Object.assign({}, sharedConfig, {

  /*
   * Same deal as the `entry` object above. Tells Webpack where to find your
   * main LESS file and what its bundle is called.
   */
  entry: {
    style: './less/style.less',
    'editor-style': './less/editor-style.less',
    print: './less/style-print.less',
  },

  /*
   * WordPress expects CSS files to go in the theme directory, not dist.
   * To do that, we need to tell it explicitly to put CSS files in the same
   * directory as this file, AKA `__dirname`.
   */
  output: {
    path: path.resolve(__dirname, '.'),
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    // Tell optimizer explicitly to generate source maps.
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {
        map: {
          inline: false,
          annotation: true,
        },
      },
    }),
    new AssetsVersionPlugin([]),
    new DeleteAfterBuildPlugin({
      paths: ['print.js*', 'style.js*', 'editor-style.js*'],
    }),
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
