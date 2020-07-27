/* 发布打包工具 */
const fs = require("fs");
const path = require("path");
const { resolve } = require("path");
const isAbsolute = path.isAbsolute;
const isObject = (val) => val !== null && typeof val === "object";
const resolveRoot = (dir = "/") => resolve(__dirname, "../", dir);

// 文件操作类
class Folder {
    options = {
        debug: true,
    };
    count = 0;
    copyStack = [];
    constructor(options) {
        let arg = arguments;
        this.options = this._initOptions(options, arg.length);
    }
    _logger(msg, type = 'info') {
        let info = console[type] || console.log
        this.options.debug && info(`[${new Date()}]:${msg}`)
    }
    _initOptions(options, len) {
        let basePath = process.cwd()
        if (len === 0) {
            // 没有参数
            return {
                debug: true,
                base: basePath,
                cb : ()=>{}
            };
        } else if (options && isObject(options)) {
            // 参数处理
            let { debug, base, cb } = options;
            return {
                debug: !!debug || true,
                base: base && isAbsolute(base) ? base : basePath,
                cb : cb && typeof cb === 'function' ? cb : (()=>{})
            };
        } else {
            // 参数错误
            this._logger(`"options" parameter is an object.`)
            return null;
        }
    }
    _copyRun(from, to, options, l) {
        let level = l || 1;
        this.copyStack.push(level); // 入栈
        fs.readdir(from, (err, files) => {
            if (err) {
                this._logger(`"fs.readdir" error:${err}`)
            } else {
                files &&
                    files.forEach((file, index, array) => {
                        this.count += 1;
                        let fromPath = path.join(from, file);
                        let toPath = path.join(to, file);
                        let stat = this._getStat(fromPath);
                        if (stat) {
                            if (stat.isDirectory()) {
                                this._logger(`[${level}-${this.count}] directory : ${fromPath}`)
                                // 目录-递归处理
                                fs.mkdirSync(toPath, { recursive: true }); // 创建目录
                                this._copyRun(fromPath, toPath, options, level + 1);
                            } else if (stat.isFile()) {
                                this._logger(`[${level}-${this.count}] file : ${fromPath}`)
                                // 普通文件
                                fs.copyFileSync(fromPath, toPath);
                            }
                        }
                    });
            }
            // 出栈
            this.copyStack.pop() && this.copyStack.length === 0 && options.cb();
        });
    }
    _getStat(path) {
        let stats;
        try {
            stats = fs.statSync(path);
        } catch (error) {
            stats = false;
        }
        return stats;
    }
    _initCopy(from, to, cb) {
        const { _logger } = this;
        const { debug, base } = this.options;
        if (typeof from !== "string") {
            _logger(`"from" parameter is an sting.`)
            return null;
        }
        from = isAbsolute(from) ? from : resolve(base, from);
        let stats = this._getStat(from);
        if (stats && !stats.isDirectory()) {
            _logger(`"from" is not a directory or does not exist.`)
            return null;
        }
        if (typeof to !== "string") {
            _logger(`"to" parameter is an sting.`)
            return null;
        }
        if (cb && typeof cb !== "function") {
            _logger(`[error]: "to" parameter is an sting.`)
            return null;
        }
        return {
            from,
            to: isAbsolute(to) ? to : resolve(base, to),
            cb: cb || (() => { }),
        };
    }
    _initClear(path, options){
        const { _logger } = this;
        const { base } = this.options;
        if (typeof path !== "string") {
            _logger(`"path" parameter is an sting.`)
            return null;
        }
        path = isAbsolute(path) ? path : resolve(base, path);
        if(options && !isObject(options) ){
            this._logger(`"options" parameter is an object.`)
            return null;
        }
        return {
            path,
            options
        }
    }
    copy(from, to, callback) {
        let time = Date.now()
        if (!this.options) return;
        const { debug, base, cb } = this.options;
        let opt = this._initCopy(from, to, callback);
        if (!opt) return;
        let stats = this._getStat(opt.to);
        if (!stats || !stats.isDirectory()) {
            // 创建目录
            fs.mkdirSync(opt.to, { recursive: true });
        }
        this.count = 0;
        // 遍历读取
        this._copyRun(opt.from, opt.to, {
            debug,
            cb : ()=>{
                console.log( `\nTotal:${(Date.now() - time)/1000}s\n` );
                // 复制完成处理
                cb();
                typeof callback === 'function' && callback();
            }
        });
    }
    // 删除目录 或者 文件
    clear(dir, options){
        let time = Date.now()
        if (!this.options) return;
        let opt = this._initClear(dir, options)
        if(!opt) return;
        let dirs = [];
        const rmFun = (dir, level)=>{
            level = level || 1;
            this.copyStack.push(level); // 入栈
            let stats = this._getStat(dir);
            if(stats && stats.isDirectory()){
                dirs.unshift(dir)
                // 目录
                fs.readdir(dir, (err, files)=>{
                    files.forEach((file)=>{
                        // 递归处理
                        rmFun( path.join(dir, file), level+1);
                    })
                    // 出栈
                    this.copyStack.pop() && this.copyStack.length === 0 && dirs.forEach((el)=>{
                        this._logger(`rmdir ${el}`)
                        // 删除收集的目录
                        fs.rmdirSync(el);
                    })
                })
            }else if(stats && stats.isFile()){
                // 文件
                fs.unlinkSync(dir);
            }
        }
        rmFun(opt.path);
    }
}

module.exports = {
    Folder,
    resolveRoot
};
