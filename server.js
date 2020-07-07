const Koa = require("koa");
const fs = require("fs");
const serve = require("koa-static");
const { resolve, isProd, getIPv4 } = require('./build/util')
const setupDevServer = require("./build/setup-dev-server")
const { createBundleRenderer } = require("vue-server-renderer");

const app = new Koa();
app.use(serve(resolve("dist")));

let render,
readyPromise,
templatePath = resolve('index.html');

if (isProd) {
    const serverBundle = require("../dist/vue-ssr-server-bundle.json");
    const clientManifest = require("../dist/vue-ssr-client-manifest.json");

    let template = fs.readFileSync(templatePath, 'utf-8')
    // 生成环境
    render = createBundleRenderer(serverBundle, {
        runInNewContext: false,
        template,
        clientManifest
    })
} else {
    // 开发环境
    readyPromise = setupDevServer(app, templatePath, (bundle, options) => {
        render = createBundleRenderer(bundle, {
            ...options,
            runInNewContext: false,
        });
        // console.log( "render=", render.renderToString );
        // 写入文件
        fs.writeFile('./t.js', render.renderToString + '', ()=>{

        })
    })
}



app.use(async (ctx, next) => {
    const context = { url : ctx.url }
    await readyPromise.then(()=>{});
    await render.renderToString(context, (err, html) => {
        console.log("err=", err);
        if (err) {
            ctx.status = 500;
            ctx.body = "Internal Server Error" + err;
        } else {
            ctx.status = 200;
            ctx.body = html;
        }
    });
});

const port = process.env.PORT || 3000;
// app.listen(port, "0.0.0.0", () => {
app.listen(port, () => {
    console.log(`server started at \n -Local: http://localhost:${port} \n -Network: http://${getIPv4() || '[::]'}:${port}`);
});
