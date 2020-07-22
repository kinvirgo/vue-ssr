const fs = require("fs");
const Koa = require("koa");
const static = require("koa-static");
const Router = require("koa-router");
const LRU = require("lru-cache");
const { resolveRoot } = require("./server.util");
const serverBundle = require("../dist/vue-ssr-server-bundle.json");
const clientManifest = require("../dist/vue-ssr-client-manifest.json");


const app = new Koa();
const router = new Router();
const render = createBundleRenderer(serverBundle, {
    runInNewContext: false,
    template: fs.readFileSync(resolveRoot('index.html'), "utf-8"),
    clientManifest,
    cache: new LRU({
        max: 1000,
        maxAge: 1000 * 60 * 60,
    })
})

// 静态资源&设置缓存
app.use(
    static(resolveRoot("dist"), {
        maxage: 1 * 24 * 60 * 60 * 1000,
    })
);


router.get("/*", async (ctx, next) => {
    const context = { url: ctx.url }
    try {
        let html = await render.renderToString(context);
        ctx.set('expires', new Date(Date.now() - 1000).toUTCString())
        ctx.set('Cache-Control', 'no-cache')
        ctx.status = 200;
        ctx.body = html;
    } catch (error) {
        ctx.status = 500;
        ctx.body = "Internal Server Error.";
    }
})

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`server started at \n -Local: http://localhost:${port}`);
});