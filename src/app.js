import Vue from "vue"
import App from './view/App'
import { createRouter } from './router'

export function createApp(context) {
    const router = createRouter()
    
    const app = new Vue({
        router,
        data: {
            url: context ? context.url : "--",
        },
        components : {
            App
        },
        // template: "<div id='app'><App /></div>",
        render: h => h(App)
    });
    return { app, router };
}
