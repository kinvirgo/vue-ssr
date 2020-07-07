import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter(){
    return new Router({
        mode : 'history',
        routes : [{
            path : '/',
            name : 'home',
            component : ()=>import(/* webpackChunkName: "home" */ '@/view/home/index.vue')
        },{
            path : '/about',
            name : 'about',
            component : ()=>import(/* webpackChunkName: "about" */ '@/view/about/index.vue')
        },{
            path : '/*',
            name : 'not-find',
            component : ()=>import(/* webpackChunkName: "404" */ '@/view/404/index.vue')
        }]
    },)
}
