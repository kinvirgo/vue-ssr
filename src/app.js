import Vue from "vue"
import App from './view/App'
import { createRouter } from './router'
import { createStore } from './store'
import { sync } from 'vuex-router-sync'

export function createApp(context) {
    const router = createRouter()
    const store = createStore()

    sync(store, router)
    
    const app = new Vue({
        router,
        store,
        data: {
            url: context ? context.url : "--",
        },
        components : {
            App
        },
        // template: "<div id='app'><App /></div>",
        render: h => h(App)
    });
    return { app, router, store };
}
