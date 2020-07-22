#!/usr/bin/env node
const path = require("path");
const { Folder } = require('./deploy.util')

let folder = new Folder({ base : path.resolve(__dirname, '../') })


// copyFolder()

folder.copy('./node_modules/axios','./html', ()=>{
    console.log("复制完成。");
})
