<template>
    <!-- <div id="app"> -->
        <!-- <h2 class="title">this is APP page.</h2>
        <router-link to="/">首页</router-link>
        <router-link to="/about">关于</router-link> -->
        <router-view id="app" ></router-view>
    <!-- </div> -->
</template>

<script>
export default {
    name: "App",
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
