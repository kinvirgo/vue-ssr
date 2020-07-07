const fs = require("fs");
const path = require("path");
const MFS = require('memory-fs')
const webpack = require("webpack")
const chokidar = require('chokidar')
const clientWebpackConfig = require("./webpack.client.conf");
const serverWebpackConfig = require("./webpack.server.conf");

// webpack热加载需要
const webpackDevMiddleware = require('koa-webpack-dev-middleware')
// 配合热加载实现模块热替换
const webpackHotMiddleware = require('koa-webpack-hot-middleware')

const readFile = (fs, file) => {
    try {
        return fs.readFileSync(path.join(clientWebpackConfig.output.path, file), "utf-8");
    } catch (e) { }
};
// console.log( "clientWebpackConfig=", clientWebpackConfig.entry);

module.exports = function setupDevServer(app, templatePath, cb) {
    let bundle, template, clientManifest,ready;
    const readyPromise = new Promise(r => { ready = r })
    // 监听改变后更新函数
    const update = () => {
        if (bundle && clientManifest) {
            // 准备完毕
            ready()
            cb(bundle, { clientManifest, template });
        }
    };
    // 检测template修改
    template = fs.readFileSync(templatePath, 'utf-8')
    chokidar.watch(templatePath).on('change', () => {
        template = fs.readFileSync(templatePath, 'utf-8')
        update()
    })

    // 修改webpack配合模块热替换使用
    clientWebpackConfig.entry.app = ["webpack-hot-middleware/client?reload=true", clientWebpackConfig.entry.app];
    clientWebpackConfig.output.filename = "js/[name].js";
    clientWebpackConfig.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    );

    // 编译clinetWebpack 插入Koa中间件
    const clientCompiler = webpack(clientWebpackConfig);
    const devMiddleware = webpackDevMiddleware(clientCompiler, {
        publicPath: clientWebpackConfig.output.publicPath,
        noInfo: true,
    });
    // 使用中间件
    app.use(devMiddleware);

    clientCompiler.plugin('done', stats => {
        stats = stats.toJson()
        stats.errors.forEach(err => console.error(err))
        stats.warnings.forEach(err => console.warn(err))
        if (stats.errors.length) return
        clientManifest = JSON.parse(readFile(
            devMiddleware.fileSystem,
            'vue-ssr-client-manifest.json'
        ))
        update()
    })

    // 插入Koa中间件(模块热替换)
    app.use(webpackHotMiddleware(clientCompiler))
    // app.use(webpackHotMiddleware(clientCompiler, { reload : true, heartbeat: 2000 }))

    const serverCompiler = webpack(serverWebpackConfig)
    const mfs = new MFS()
    serverCompiler.outputFileSystem = mfs
    serverCompiler.watch({}, (err, stats) => {
        if (err) throw err
        stats = stats.toJson()
        if (stats.errors.length) return

        //  vue-ssr-webpack-plugin 生成的bundle
        bundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'))
        update()
    })

    return readyPromise
};
