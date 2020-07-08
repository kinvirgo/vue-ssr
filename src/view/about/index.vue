<template>
    <div>
        <span>this is about</span>
    </div>
</template>

<script>
export default {
    name: "About",
    metaInfo() {
        return {
            title: this.title,
        };
    },
    data() {
        return {
            title: "ABOUT",
            url: null,
            route: null,
        };
    },
    // 服务器处理的逻辑
    // asyncData({ route }){
    //   console.log('in asyncData:About');
    //   // this.route = route;
    // }
};
</script>

<style></style>
