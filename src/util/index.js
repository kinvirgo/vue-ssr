

export const isObject = val => val !== null && typeof val === 'object'
export const isFunction = val => typeof val === 'function'

export const isPromise = (val)=>{
    return isObject(val) && isFunction(val.then) && isFunction(val.catch)
}