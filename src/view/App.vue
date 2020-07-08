<template>
    <div id="app">
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
                {
                    vmid: "description",
                    name: "description",
                    content: "my standard description",
                },
            ],
        };
    },
};
</script>

<style lang="scss">
.title {
    color: aquamarine;
}
</style>

<style>
.title {
    color: red;
}
</style>
