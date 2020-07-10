const { resolve, isProd } = require("./util")
const webpack = require("webpack");
const {merge} = require("webpack-merge");
const nodeExternals = require("webpack-node-externals");
const baseWebpackConfig = require("./webpack.base.conf");
const VueServerPlugin = require("vue-server-renderer/server-plugin");

const serverWebpackConfig = {
    target: 'node',
    devtool: '#source-map',
    entry: resolve("entry-server.js"),
    output: {
        libraryTarget: "commonjs2",
        filename: "server-bundle.js",
    },
    externals: nodeExternals({
        whitelist: /\.css$/,
    }),
    plugins: [
        new VueServerPlugin(),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
            "process.env.VUE_ENV": '"server"',
        })
    ],
};

module.exports = merge(baseWebpackConfig, serverWebpackConfig);
