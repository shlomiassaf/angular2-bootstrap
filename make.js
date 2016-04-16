#!/usr/bin/env node
/*eslint no-console: 0, no-sync: 0*/
'use strict';


const fs = require('fs');
const del = require('del');
const path = require('path');
const async = require('async');
const Builder = require('systemjs-builder');

const pkg = require('./package.json');
const name = pkg.name;

const COMPONENT_DIR = path.resolve('./dist/cjs');
const TARGET_DIR = path.resolve('./dist/sjs');


const components = fs.readdirSync(COMPONENT_DIR);

async.forEach(components, (file) => {
    async.waterfall([
        async.apply(getSystemJsBundleConfig, file),
        buildSystemJs({mangle: false}),
        async.apply(getSystemJsBundleConfig, file),
        buildSystemJs({minify: true, sourceMaps: true, mangle: false})
    ], function (err) {
        if (err) {
            throw err;
        }
    });
});


function getSystemJsBundleConfig(name, cb) {
    try {
        let config = {
            baseURL: `./dist/cjs/${name}`,
            transpiler: 'typescript',
            typescriptOptions: {
                module: 'cjs'
            },
            packages: {
                '@angular2-bootstrap/core': {
                    defaultExtension: 'js'
                }
            },
            map: {
                typescript: 'node_modules/typescript/lib/typescript.js',
                angular2: 'node_modules/angular2',
                rxjs: 'node_modules/rxjs',
                '@angular2-bootstrap/core': 'dist/build/core'
            },
            paths: {
                '*': '*.js'
            },
            meta: {
                'node_modules/angular2/*': { build: false },
                'node_modules/rxjs/*': { build: false },
                'dist/build/core/*': { build: false }
            },
        };


        cb(null, config, name);
    }
    catch (ex) {
        cb(ex);
    }
}



function buildSystemJs(options) {
    return function (config, name, cb) {
        let fileName = `${name}-${pkg.version}` + (options && options.minify ? '.min' : '') + '.js';
        let dest = path.resolve(__dirname, TARGET_DIR, fileName);
        console.log('Bundling system.js file:', fileName, options);

        let builder = new Builder();
        builder.config(config);
        return builder
                .bundle([name].join('/'), dest, options)
                .then(()=>cb()).catch(cb);
    };
}
