import Vue from 'vue'
import { createApp } from "./src/app";
import { isFunction, isPromise } from "@/util";

const { app, router, store } = createApp();

if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__);
}

Vue.mixin({
    beforeRouteUpdate(to, from, next) {
        // 防止重复
        if(to.name !== from.name ){
            const { asyncData } = this.$options
            if (isFunction(asyncData)) {
                let res = asyncData({ store: this.$store, context: {}, route: to });
                if (isPromise(res)) {
                    res.then(next).catch(next)
                }
            } else {
                next()
            }
        }else{
            next()
        }
    }
})

router.onReady(() => {
    // 路由通过router-link切换时候触发
    router.beforeResolve((to, from, next) => {
        const matched = router.getMatchedComponents(to);
        const prevMatched = router.getMatchedComponents(from);

        let diffed = false;
        const activeated = matched.filter((c, i) => {
            return diffed || (diffed = prevMatched[i] !== c);
        });

        if (!activeated.length) {
            return next();
        }
        // 这里如果有加载指示器 (loading indicator)，就触发
        Promise.all(
            activeated.map(({ asyncData }) => {
                // 处理asyncData请求
                if (isFunction(asyncData)) {
                    let res = asyncData({ axios, store, context: {}, route: to });
                    // 如果是promise就处理，如果不是就创建一个返回
                    // return isPromise(res) ? res : new Promise(r=>r())
                    return isPromise(res) ? res : false;
                }
            })
        )
            .then(() => {
                // 停止加载指示器(loading indicator)
                next();
            })
            .catch(next);
    });

    // 这里假定 App.vue 模板中根元素具有 `id="app"`
    app.$mount("#app");
});
