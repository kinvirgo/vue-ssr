#!/usr/bin/env node
const fs = require('fs')
const package = require('../package.json')

console.log( package.dependencies );
// console.log('node 自定义命令');

if(!!package){
    const { dependencies, scripts} = package
    fs.writeFileSync('./package2.json', JSON.stringify({ scripts, dependencies }))
}