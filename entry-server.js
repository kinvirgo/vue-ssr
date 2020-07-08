import { createApp } from "./src/app";
import { isFunction, isPromise } from '@/util'

export default (context) => {
    return new Promise((resolve, reject) => {
        const { app, router, store } = createApp(context);
        const { url } = context;
        const { fullPath } = router.resolve(url).route;
        // console.log( "url-fullPath=", url, fullPath);

        if (fullPath !== url) {
            return reject({ url: fullPath });
        }

        // context.renderState
        context.__INITIAL_TIME__ = Date.now();
        // 扩展context.meta()
        context.meta = app.$meta(); // function

        router.push(context.url);
        // 等到 router 将可能的异步组件和钩子函数解析完
        router.onReady(() => {
            const matchedComponents = router.getMatchedComponents();
            // 匹配不到的路由，执行 reject 函数，并返回 404
            if (!matchedComponents.length) {
                return reject({ code: 404 });
            }

            Promise.all(
                matchedComponents.map(({ asyncData }) => {
                    // 处理asyncData请求
                    if (isFunction(asyncData)) {
                        let res = asyncData({ store, context, route: router.currentRoute });
                        // 如果是promise就处理，如果不是就创建一个返回
                        // return isPromise(res) ? res : new Promise(r=>r())
                        return isPromise(res) ? res : false
                    }
                })
            ).then(() => {
                resolve(app);
            })
            .catch(reject);
            // 注入window.__INITIAL_STATE__
            context.state = store.state
            // Promise 应该 resolve 应用程序实例，以便它可以渲染
            resolve(app);
        }, reject);
    });
};
