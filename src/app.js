import Vue from "vue"
import App from './view/App'
import Meta from 'vue-meta'
import { sync } from 'vuex-router-sync'
import { createRouter } from './router'
import { createStore } from './store'

Vue.use(Meta, {
    // keyName: 'metaInfo',
    // attribute: 'data-vue-meta',
    // ssrAttribute: 'data-vue-meta-server-rendered',
    // tagIDKeyName: 'vmid',
    refreshOnceOnNavigation: true
})

export function createApp(context) {
    const router = createRouter()
    const store = createStore()

    sync(store, router)

    const app = new Vue({
        router,
        store,
        render: h => h(App)
    });
    return { app, router, store };
}
