<template>
    <div id="app">
        <h2 class="title">this is ssr render.</h2>
        <router-view></router-view>
    </div>
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
