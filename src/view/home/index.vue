<template>
    <div v-if="initialState">
        <ul>
            <li v-for="(item, index) in initialState" :key="index">
                <img :src="item.imgUrl" alt="">
            </li>
        </ul>
    </div>
</template>
<script>
import AnimationNumber from '@/util/animationNumber'
import { mapState, mapGetters } from 'vuex'
import API from '@/axios/api'
export default {
    name: "Home",
    metaInfo(){
        return {
            title : this.title
        }
    },
    // 自定义的服务器渲染方法。会在路由访问时候调用
    asyncData({ axios, store }) {
        let data = { lotteryCenterCode : 'WL0270003', platformCode : 'ztc-wl-wxpub' }
        return store.dispatch('GET_BANNER_LIST', data)
        // 通过store来处理数据
        // axios.POST(API.BANNER_LISTBANNERNEW, data).then(res=>{
        //     console.log("result:", JSON.stringify(res));
        //     const { code, msg, data } = res;
        //     if(code === "000"){
        //         return store.commit('UPDATE_INITIAL_STATE', data)
        //     }else{
        //         // 异常处理
        //     }
        // }).catch(()=>{
        //     // 异常处理
        // })
    },
    data() {
        return {
            title : "HOME",
            VUE_ENV : process.env.VUE_ENV,
        };
    },
    computed:{
        // ...mapState(["route"])
        ...mapGetters(['initialState'])
    },
};
</script>

<style lang="scss">
ul,li{
    list-style: none;
    margin: 0;
    padding: 0;
}
img{
    max-width: 100%;
}
</style>
