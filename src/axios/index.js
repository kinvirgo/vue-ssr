/* 服务端 */
import { isObject, isServer } from "@/util"
import axios from 'axios'

axios.default.timeout = 20000;
isServer && (axios.defaults.baseURL = "http://ztc-ioms-tx.sit.sf-express.com")
// 请求拦截
axios.interceptors.request.use(function (config) {
    return config;
}, function (err) {
    return Promise.reject(err)
})
// 响应拦截
axios.interceptors.response.use(function (res) {
    const { data, config } = res
    return config && config.isNative ? res : data;
}, function (err) {
    if (err && err.response && err.response.status === 401) {
        // 没有权限访问
        const { data } = err.response
        if (data.msg === "invalid token") {
            // token 无效
            return Promise({ status: 401, msg: "invalid token." })
        } else if (data.msg === "permission denied") {
            // 没有访问权限
            return Promise({ status: 401, msg: "permission denied." })
        }
    }
    return Promise.reject(err)
})
/* ===test=== */
let token = "123456"
/* ===test=== */
function mergeData(data = {}, isOverwrite) {
    return isOverwrite ? data : {
        reqId: Date.now(),
        token,
        data,
    }
}

// 默认配置信息
const defaultConfig = {
    headers: {
        'content-Type': 'application/json;charset=UTF-8'
    },
    // 是否响应原始输出
    isNative: false,
    // 是否加载中
    // nprogress: true
};
/**
 * [mergeConfig 合并配置信息]
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
function mergeConfig(config) {
    return isObject(config) ? {
        ...defaultConfig,
        ...config
    } : defaultConfig;
}


export const GET = function (url, data, config = {}) {
    config = isObject(config) ? config : {};
    config.params = mergeData(data, config.isOverwrite);
    return axios.get(url, mergeConfig(config))
}

export const POST = function (url, data, config = {}) {
    config = isObject(config) ? config : {};
    return axios.post(url, mergeData(data, config.isOverwrite), mergeConfig(config))
}

export default {
    install(Vue) {
        Vue.prototype.$get = GET;
        Vue.prototype.$post = POST;
        // Vue.prototype.$delete = DELETE;
        // Vue.prototype.$put = PUT;
        // Vue.prototype.$patch = PATCH;
        // Vue.prototype.$all = ALL;
    }
}
