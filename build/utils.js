const fs = require("fs");
const os = require("os")
const path = require("path");
const resolve = (dir = "/") => path.resolve(__dirname, "../", dir);
const env = process.env.NODE_ENV;
const isProd = env === "production";

const getIPv4 = () => {
    //同一接口可能有不止一个IP4v地址，所以用数组存
    let ipv4s = [];
    //获取网络接口列表对象
    let interfaces = os.networkInterfaces();
    Object.keys(interfaces).forEach(function (key) {
        interfaces[key].forEach(function (item) {
            //跳过IPv6 和 '127.0.0.1'
            if ('IPv4' !== item.family || item.internal !== false) return;
            ipv4s.push(item.address); //可用的ipv4s加入数组
        })
    })
    return ipv4s[0]; //返回一个可用的即可
}


module.exports = {
    resolve,
    isProd,
    env,
    getIPv4
};
