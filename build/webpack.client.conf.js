const { resolve, isProd } = require('./util')
const webpack = require("webpack");
const merge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.conf");

// css样式提取单独文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 服务端渲染用到的插件、默认生成JSON文件(vue-ssr-client-manifest.json)
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");

const clientWebpackConfig = {
    entry: resolve("entry-client.js"),
    plugins: [
        new VueSSRClientPlugin(),
        // 环境变量
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"client"'
        })
    ]
};

// isProd && clientWebpackConfig.plugins.push(new VueSSRClientPlugin());

module.exports = merge(baseWebpackConfig, clientWebpackConfig);
