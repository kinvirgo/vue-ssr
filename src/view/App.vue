<template>
    <div id="app">
        <p>
            <router-link to="/">首页-></router-link>
        </p>
        <p>
            <router-link to="/about">关于-></router-link>
        </p>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: "App",
    // vue-meta 优化seo
    metaInfo() {
        return {
            title: "首页",
            titleTemplate: "%s | vue-ssr",
            meta: [
                { vmid: "description", name: "description", content: "my standard description" },
            ],
            link: [
                {
                    rel: "icon",
                    type: "image/x-icon",
                    href: "http://ztc-ioms-tx.sit.sf-express.com/platform/dist/favicon.ico",
                },
            ],
        };
    },
};
</script>

<style lang="scss">
body {
    margin: 0;
}
.title {
    color: aquamarine;
}
</style>

<style>
.title {
    color: red;
}
</style>
