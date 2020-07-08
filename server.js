const Koa = require("koa");
const fs = require("fs");
const static = require("koa-static");
const Router = require("koa-router");
const LRU = require("lru-cache");
const { resolve, isProd, getIPv4 } = require("./build/util");
const setupDevServer = require("./build/setup-dev-server");
const { createBundleRenderer } = require("vue-server-renderer");

let router = new Router();
const app = new Koa();
const serve = (root) => static(root, isProd ? {
    // 缓存30天
    maxage: 1000 * 60 * 60 * 24 * 30
} : {})

// 静态资源
app.use(serve(resolve("dist")));

let render,
    readyPromise,
    templatePath = resolve("index.html"),
    cache = new LRU({
        max: 1000,
        maxAge: 1000 * 60 * 60,
    });

if (isProd) {
    const serverBundle = require("./dist/vue-ssr-server-bundle.json");
    const clientManifest = require("./dist/vue-ssr-client-manifest.json");

    let template = fs.readFileSync(templatePath, "utf-8");
    // 生成环境
    render = createBundleRenderer(serverBundle, {
        runInNewContext: false,
        template,
        clientManifest,
        cache
    });
} else {
    // 开发环境
    readyPromise = setupDevServer(app, templatePath, (bundle, options) => {
        render = createBundleRenderer(bundle, {
            ...options,
            runInNewContext: false,
        });
    });
}

// router.get("/*", async (ctx, next)=>{
//     const { t } = ctx.request.query;
//     if(t == 123){
//         ctx.status = 301;
//         ctx.redirect("/ssr/about")
//     }else{
//         await next();
//     }
// })

router.get("/*", async (ctx, next) => {
    // router.get("*", async (ctx, next)=>{
    console.log("in get=", ctx.url);
    const context = { url: ctx.url };
    !!readyPromise && (await readyPromise.then(() => { }));
    try {
        let html = await render.renderToString(context);
        ctx.status = 200;
        ctx.body = html;
    } catch (error) {
        console.log(error);
        if (error && error.status == 404) {
            ctx.redirect(error.url);
        } else {
            ctx.status = 500;
            ctx.body = "Internal Server Error.";
        }
    }
});
app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 3000;
// app.listen(port, "0.0.0.0", () => {
app.listen(port, () => {
    console.log(
        `server started at \n -Local: http://localhost:${port} \n -Network: http://${getIPv4() ||
        "[::]"}:${port}`
    );
});
