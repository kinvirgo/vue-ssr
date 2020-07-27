const path = require("path");
const env = process.env;
const mode = env.mode || "production"
const isProd = env.NODE_ENV === "production";
const resolveRoot = (dir = "/") => path.resolve(__dirname, "../", dir);

module.exports = {
    resolveRoot,
    isProd,
    env,
    mode
};
