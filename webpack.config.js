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
const path = require("path");
const webpack = require("webpack");

const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //extracts css from js into css
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const DeleteAfterBuildPlugin = require("./js/webpack-plugins/delete-after-build-plugin.js");
const AssetsVersionPlugin = require("./js/webpack-plugins/assets-version-plugin.js");
const getThemePath = require("./js/webpack-plugins/get-theme-path.js");

const sharedConfig = {
  mode: "production",
  devtool: "source-map",
  stats: "errors-only",
};

const jsConfig = Object.assign({}, sharedConfig, {
  entry: {
    /*
     * will tell Webpack to parse js/src/common.js when you run
     * `webpack` and compile it to dist/common.js.
     */
    common: "./js/src/common.js",
  },
  output: {
    /*
     * Here, the [name] part corresponds to the `common` keys
     * in the `entry` object above. In most cases you shouldn't have to change
     * this part to add new bundles.
     */
    filename: "[name].js",
  },
  /*
   * Tell Webpack that jQuery is a thing that exists globally.
   */
  externals: {
    jquery: "jQuery",
  },
  plugins: [
    /*
     * The AssetsVersionPlugin produces an extra file called assets.version
     * which WordPress uses to tell end-users' browsers to load new versions
     * of our frontend code using a technique called cache-busting.
     *
     * Learn more: https://www.sitecrafting.com/issues-cached-css-js-files-wordpress/
     */
    new AssetsVersionPlugin({
      versionFile: "scripts.version",
      useHash: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
    ],
  },
});

const cssConfig = Object.assign({}, sharedConfig, {
  /*
   * Tells Webpack where to find your LESS file and what its bundle is called.
   */
  entry: {
    style: "./less/style.less",
    "editor-style": "./less/editor-style.less",
    print: "./less/style-print.less",
  },

  /*
   * WordPress expects CSS files to go in the theme directory, not dist.
   * To do that, we need to tell it explicitly to put CSS files in the same
   * directory as this file, AKA `__dirname`.
   */
  output: {
    path: path.resolve(__dirname, "."),
  },

  plugins: [
    new MiniCssExtractPlugin(),
    new AssetsVersionPlugin({
      versionFile: "styles.version",
      useHash: true,
    }),
    new DeleteAfterBuildPlugin({
      paths: ["print.js*", "style.js*", "editor-style.js*"],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(less)/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "less-loader",
            options: {
              sourceMap: true,
              additionalData: `@theme-path: ${getThemePath()};`,
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
  },
});

module.exports = [jsConfig, cssConfig];
