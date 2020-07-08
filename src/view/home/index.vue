<template>
    <div>this is home page.</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: "Home",
    metaInfo(){
        return {
            title : this.title
        }
    },
    // 自定义的服务器渲染方法。会在路由访问时候调用
    asyncData() {
        // 通过store来处理数据
        console.log("in asyncData:Home", process.env.VUE_ENV);
    },
    data() {
        return {
            title : "HOME",
            VUE_ENV : process.env.VUE_ENV,
        };
    },
    computed:{
        ...mapState(["route"])
    },
};
</script>

<style></style>
