#!/usr/bin/env node
const path = require("path");
const fs = require('fs');
const { Folder, resolveRoot } = require('./utils')

let package = require('../package.json')
let name = package.name || 'Application'
let packageJson = {
    scripts : package.scripts || {},
    dependencies : package.dependencies || {}
}
let folder = new Folder({ base : path.resolve(__dirname, '../') })

// folder.clear( resolveRoot(name) )

// copy dist to server folder
folder.copy( resolveRoot('./dist') , resolveRoot(`./${name}/static`), ()=>{
    // create server package.json
    fs.writeFileSync(resolveRoot(`./${name}/package.json`), JSON.stringify(packageJson))

    // copy index.html template
    fs.copyFileSync( resolveRoot('./index.html'), resolveRoot(`./${name}/index.html`) )

    // copy server javscript
    folder.copy( resolveRoot('./server'), resolveRoot(`./${name}`))
})









