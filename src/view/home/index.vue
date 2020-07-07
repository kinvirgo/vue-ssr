<template>
    <div>
        <router-link to="/about">关于→</router-link>
        <h3>this is home page.{{ VUE_ENV }}, {{ route ? route.fullPath : '' }}</h3>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: "Home",
    data() {
        return {
            VUE_ENV : process.env.VUE_ENV,
        };
    },
    computed:{
        ...mapState(["route"])
    },
    // 自定义的服务器渲染方法。会在路由访问时候调用
    asyncData() {
        // 通过store来处理数据
        console.log("in asyncData:Home", process.env.VUE_ENV);
    },
};
</script>

<style></style>
