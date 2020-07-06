const { resolve, isProd, getIPv4 } = require('./util')
const Koa = require("koa");
const fs = require("fs");
const serve = require("koa-static");
const setupDevServer = require("./setup-dev-server")
const { createBundleRenderer } = require("vue-server-renderer");
// const { createApp } = require("../dist/server-bundle").default

const app = new Koa();
app.use(serve(resolve("dist")));
let render,readyPromise,templatePath = resolve('index.html');
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
    })
}

app.use(async (ctx, next) => {
    const context = { url : ctx.url }
    // 在渲染前是否完成promise异步
    // let app = await createApp(context);
    // 等待完成后执行
    await readyPromise.then(async (res)=>{
        await render.renderToString(context, (err, html) => {
            console.log("err=", err, html);
            if (err) {
                ctx.status = 500;
                ctx.body = "Internal Server Error" + err;
            } else {
                ctx.status = 200;
                ctx.body = html;
            }
        });
    })
    // console.log("===========================", render.renderToString);
    // 创建Vue 实例
    // await render.renderToString(app, (err, html) => {
    //     console.log("err=", err);
        
    //     if (err) {
    //         ctx.status = 500;
    //         ctx.body = "Internal Server Error" + err;
    //     } else {
    //         ctx.status = 200;
    //         ctx.body = html;
    //     }
    // });
});

const port = process.env.PORT || 3000;
// app.listen(port, "0.0.0.0", () => {
app.listen(port, () => {
    console.log(`server started at \n -Local: http://localhost:${port} \n -Network: http://${getIPv4() || '[::]'}:${port}`);
});
