const { resolve, isProd } = require("./util");
const webpack = require("webpack");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const hashedChunkIdPlugin = require("webpack-hashed-chunk-id-plugin");

const baseWebpackConfig = {
    mode: isProd ? "production" : "development",
    devtool: isProd ? false : '#cheap-module-source-map',
    output: {
        path: resolve("dist"),
        filename: isProd ? "js/[name].[chunkhash].js" : "js/[name].js",
        chunkFilename: isProd ? "js/[name].[chunkhash].js" : "js/[name].js",
        publicPath: "/",
    },
    resolve: {
        extensions: [".js", ".vue"],
        alias: {
            "vue$": "vue/dist/vue.js",
            "@": resolve("src"),
            "@@": resolve(),
        },
    },
    module: {
        rules: [
            // .vue 单文件
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    compilerOptions: {
                        preserveWhitespace: false,
                    },
                },
            },
            // .jsx、.js
            {
                test: /\.(jsx|js)$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            //如果有这个设置则不用再添加.babelrc文件进行配置
                            babelrc: false, // 不采用.babelrc的配置
                            plugins: ["dynamic-import-webpack"],
                        },
                    },
                ],
            },
            // 静态资源
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 10000,
                            name: "[name].[ext]?[hash]",
                        },
                    },
                ],
            },
            // scss 处理
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    "vue-style-loader",
                    "css-loader",
                    "postcss-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            // 全局处理scss变量
                            // prependData :
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        // vue-loader loader处理
        new VueLoaderPlugin(),
        // 用文件名的hash替换打包时候的ModulesID
        new webpack.HashedModuleIdsPlugin({ hashDigestLength: 6 }),
        // 用文件名的hash替换打包时候的ChunkId
        new hashedChunkIdPlugin({ length: 6 }),
    ],
};
// 添加压缩css
isProd && baseWebpackConfig.plugins.push(new MiniCssExtractPlugin());

module.exports = baseWebpackConfig;
