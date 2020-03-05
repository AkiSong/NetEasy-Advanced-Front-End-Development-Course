# webpack 原理

## 学习目标

1. 了解 webapck 打包原理
2. 了解 webpack 的 loader 原理
3. 了解 webpack 的 plugin 原理
4. 了解 ast 抽象语法树的应用
5. 了解 tapable 的原理
6. 手写一个简单的 webpack

## 准备工作

1. 新建一个项目
2. 新建 bin 目录, 将打包工具主程序放入其中
   主程序的顶部应当有 `#!/usr/bin/env node`标识, 指定程序的执行环境为 node
3. 在 package.json 中配置 bin 脚本

```js
{
   "bin": {
    "my-webpack": "./bin/main-webpack.js"
  },
}
```

4. 使用`npm link`在全局链接本地包
   注意: package.json 中的 bin 脚本需要指定相对路径, 没有路径, npm link 会报错

## 分析 bundle 文件

### **webpack_require**函数分析

```js
(function(modules) {
  // The module cache webpack缓存
  var installedModules = {};

  // The require function
  function __webpack_require__(moduleId) {
    // Check if module is in cache
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    // Create a new module (and put it into the cache)
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    });

    // Execute the module function
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );

    // Flag the module as loaded
    module.l = true;

    // Return the exports of the module
    return module.exports;
  }

  // Load entry module and return exports
  return __webpack_require__((__webpack_require__.s = "./src/index.js"));
})({
  "./src/index.js": function(module, exports, __webpack_require__) {
    eval(
      'const news = __webpack_require__(/*! ./news.js */ "./src/news.js");\r\n\r\nmodule.exports = {\r\n  content: "今天是个好日子!!" + news.content\r\n};\r\n\n\n//# sourceURL=webpack:///./src/index.js?'
    );
  },

  "./src/message.js": function(module, exports) {
    eval(
      'module.exports = {\r\n  content: "巴扎嘿!!"\r\n};\r\n\n\n//# sourceURL=webpack:///./src/message.js?'
    );
  },

  "./src/news.js": function(module, exports, __webpack_require__) {
    eval(
      'const message = __webpack_require__(/*! ./message.js */ "./src/message.js")\r\n\r\nmodule.exports = {\r\n  content: "祖国的花园大又圆!!" + message.content\r\n};\n\n//# sourceURL=webpack:///./src/news.js?'
    );
  }
});
```

### 依赖分析

1. 读取需要打包项目的配置文件

```js
//读取需要打包项目的配置文件, 先不考虑指定配置文件的路径, 默认配置文件在根目录
let config = require(path.resolve("webpack.config.js"));
```

2. 通过面向对象的方式来推进项目

```js
// main-webpack.js
let Compiler = require("../lib/Compiler.js");
new Compiler(config).start();

//Compiler.js
class Compiler {
  constructor(config) {
    this.config = config;
  }
  depAnalyse(){

  }
  // 项目打包启动函数
  start() {
    // 依赖分析
    this.depAnalyse();
  }
}
```
