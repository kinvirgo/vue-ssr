import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter() {
    return new Router({
        mode: 'history',
        // base: "/ssr",
        routes: [{
            path: '/',
            name: 'home',
            component: () => import(/* webpackChunkName: "home" */ '@/view/home/index.vue')
        }, {
            path: '/about',
            name: 'about',
            component: () => import(/* webpackChunkName: "about" */ '@/view/about/index.vue')
        }, {
            path: '/404',
            name: 'not-find',
            component: () => import(/* webpackChunkName: "404" */ '@/view/not-find/index.vue')
        }]
    })
}
