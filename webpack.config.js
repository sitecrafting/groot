/**
 * Welcome to the themes webpack config.
 *
 * This file describes, in JavaScript, how frontend code is compiled to be
 * served in all WordPress environments. There are three main parts:
 *
 * 1. The sharedConfig, which forms a basis for the other two parts
 * 2. The jsCssConfig, which builds JS from /js/src/ and outputs
 *    the compiled code to /dist, this will include any imported css
 * 3. The LESS/CSS configuration, which builds CSS from /less and also outputs
 *    the compiled code to /dist
 * */
const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const AssetsVersionPlugin = require("./js/webpack-plugins/assets-version-plugin.js");

const sharedConfig = {
    mode: "production",
    devtool: "source-map",
    stats: "errors-only",
};

const jsCssConfig = {
    ...sharedConfig,
    entry: {
        common: "./js/src/common.js",
        slideshows: "./js/src/slideshows.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js"
    },
    /* 
    * Tell webpack that jQuery is a thing that exists already
    */
    externals: {
        jquery: "jQuery"
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css"
        }),
        new AssetsVersionPlugin({
            versionFile: "scripts.version",
            useHash: true
        })
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
                            presets: ["@babel/preset-env"]
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: { sourceMap: true }
                    }
                ]
            }
        ]
    },
    optimization: {
        minimizer: [new CssMinimizerPlugin(), new TerserPlugin()]
    }
};

const lessConfig = {
    ...sharedConfig,
    entry: {
        style: "./less/style.less",
        "editor-style": "./less/editor-style.less",
        print: "./less/style-print.less"
    },
    output: {
        path: path.resolve(__dirname, ".")
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css"
        }),
        new AssetsVersionPlugin({
            versionFile: "styles.version",
            useHash: true
        }),
        {
            /*
                * Remove the js files genereated by webpack for the pattern-matched CSS entries
                * We only want the CSS files, as these are enqueued in WordPress
                * The JS files are empty and not needed
            */
            apply: (compiler) => {
                compiler.hooks.thisCompilation.tap("RemovePatternJsFiles", (compilation) => {
                    compilation.hooks.processAssets.tap(
                        {
                            name: "RemovePatternJsFiles",
                            stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
                        },
                        (assets) => {
                            Object.keys(assets)
                                .filter(asset => asset.match(/^(style|editor-style|print)\.js$/))
                                .forEach(asset => {
                                    delete compilation.assets[asset];
                                });
                        }
                    );
                });
            }
        },
    ],
    module: {
        rules: [
            {
                test: /\.(less)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: { sourceMap: true, url: false }
                    },
                    {
                        loader: "less-loader",
                        options: { sourceMap: true }
                    }
                ]
            }
        ]
    },
    optimization: {
        minimizer: [new CssMinimizerPlugin()]
    }
};

module.exports = [jsCssConfig, lessConfig];