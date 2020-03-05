#! /usr/bin/env node
const path = require("path");

// 1.读取需要打包项目的配置文件
let config = require(path.resolve("webpack.config.js"));
// 2.通过面向对象的方式推进项目
let Compiler = require("../lib/Complier.js");
new Compiler(config).start();
