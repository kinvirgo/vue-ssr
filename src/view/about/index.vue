<template>
<div>
  <router-link to="/">首页→</router-link>
  <h2>this is about page. url =>{{ url }}</h2>
</div>
</template>

<script>
export default {
  name : "About",
    data(){
      return {
        url : null,
        route : null
      }
    },
    // 服务器处理的逻辑
    // asyncData({ route }){
    //   console.log('in asyncData:About');
    //   // this.route = route;
    // }
}
</script>

<style>

</style>