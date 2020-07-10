
export const env = process.env.VUE_ENV

export const isProd = env === "production"

export const isClient = env === "client"

export const isServer = env === "server"

export const isObject = val => val !== null && typeof val === 'object'

export const isFunction = val => typeof val === 'function'

export const isPromise = (val)=>{
    return isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

export const isBrowser = this === window