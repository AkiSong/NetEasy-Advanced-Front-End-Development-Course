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

### webpack_require 函数分析

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
const path = require("path");
const fs = require("fs");
class Compiler {
  constructor(config) {
    this.config = config;
    this.root = process.cws();
    this.modules = {};
    this.entry = config.entry;
  }
  getSource(path) {
    return fs.readFileSync(path, "utf-8");
  }
  depAnalyse(modulePath) {
    // 读取模块内容
    let info = this.getSource(modulePath);
    // 定义模块内引入其他模块的路径缓存
    let cacheList = [];
    // 将模块内容转换为ast
    let ast = parser.parse(info, {
      parseType: "module" //可以解析es6
    });
    // 将ast中的reuire转换为__webpack_require__
    traverse(ast, {
      CallExpression(p) {
        if (p.node.callee.name === "require") {
          p.node.callee.name = "__webpack_require__";
          let oldValue = p.node.arguments[0].value;
          p.node.arguments[0].value = (
            "./" + path.join("src", oldValue)
          ).replace(/\\+/g, "/");
          cacheList.push(p.node.arguments[0].value);
        }
      }
    });
    // 将ast转换为内容
    let sourceCode = generator(ast);

    let moduleRelativePath = (
      "./" + path.relative(this.root, modulePath)
    ).replace(/\\+/g, "/");
    this.moudles[moduleRelativePath] = sourceCode;

    cacheList.forEach(dep => this.depAnalyse(path.join(this.root, dep)));
  }
  emitFile() {
    let tpl = require("./template/tpl.ast");
    let result = tmp.render(tpl, {
      entry: this.entry,
      modules: this.modules
    });

    let output = path.join(
      this.config.output.path,
      this.config.output.filename
    );
    fs.writeFileSync(output, result);
  }
  // 项目打包启动函数
  start() {
    // 依赖分析
    this.depAnalyse(path.resolve(this.root, this.entry));
    this.emitFile();
  }
}
```

## loader

### 自定义 loader

loader 主要功能将一段匹配规则的代码进行加工处理, 生成最终的代码后输出, 是 webpack 打包环节中非常重要的一环

```js
// webpack.config.js
modules: {
  rules: [{ test: /\.js$/, use: "./loaders/loader1.js" }];
}

// loader1.js
// loader就是一个函数
let loaderUtils = require("loader-utils");
module.exports = function(source) {
  // loader配置属性option, 可以通过this.query获取, 但是this.query已经废弃, 不建议使用, 最新的loader-utils中的getOptions方法获取
  const options = loaderUtils.getOptions(this);
  // loader处理完了需要把代码返回
  return source;
};
```

### 实现 loader 功能

1. 读取 webpack.config.js 中的 module.rules 配置, 进行倒叙遍历
2. 根据正则匹配到对应的文件类型, 同时再批量导入 loader 函数
3. 倒叙迭代调用所有的 loader 函数
4. 最后返回处理后的代码

```js
// 调用loaderf
let useLoader = (usePath, query) => {
  let loader = require(path.join(this.root, usePath));
  source = loader.call(query, source);
};
// 读取rules规则, 进行倒叙遍历
for (let i = this.rules.length - 1; i >= 0; i--) {
  let { use, test } = this.rules[i];
  if (test.test(moudlePath)) {
    if (use instanceof String) {
      useLoader(use);
    } else if (use instanceof Array) {
      for (let j = use.length - 1; j >= 0; j--) {
        useLoader(use[j]);
      }
    } else if (use instanceof Object) {
      useLoader(use.loader, { query: use.options });
    }
  }
}
```

## plugin

### 自定义插件

插件接口可以帮助用户直接接触到编译过程. 插件可以将处理函数注册到编译过程中的不同事件点上运行的生命周期钩子函数上. 当执行每个钩子时, 插件能够完全访问到编译的当前状态
简单理解, 自定义插件就是在 webpack 编译过程的生命周期钩子中, 进行编码开发, 实现一些功能

#### 插件的组成

1. 一个 javascript 命名函数
2. 在插件函数 prototype 上定义一个 apply 方法
3. 指定一个绑定到 webpack 自身的钩子
4. 处理 webpack 内部实例的特定数据
5. 功能完成后调用 webpack 提供的回调

#### webpack 的生命周期钩子

[https://www.baidu.com]

**helloworldPlugin.js**

```js
// webpack.config.js
plugins: [new helloworldPlugin()];

// helloworldPlugin.js
module.exports = class HelloworldPlugin {
  apply(compiler) {
    compiler.hooks.done.tap("HelloworldPlugin", function() {
      console.log("done 整个webpack打包结束");
    });
  }
};
```

#### 自定义实现 webpack-html-webpack-plugin

`Compiler` 和 `Compilation` 区别

- compiler 对象标识不变的 webpack 环境, 是针对 webpack 的
- compilation 对象正对的是随时可变的项目文件, 只要文件有改动, compilation 就会被重新创建

```js
// html-plugin.js
module.export = class HTMLPLUGIN {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    // 如果使用done钩子, 则需要使用done.compilation.assets获取bundle.js, 所以直接使用afterEmit更方便
    compiler.hooks.afterEmit.tap("HTMLPLUGIN", compilation => {
      // 读取html模板
      let result = fs.readFileSync(this.options.template, "utf-8");
      // 使用cheerio, 可以使用jquery api
      let $ = cherrio.load(result);
      Object.keys(compilation).forEach(item => {
        $("<script></script>")
          .attr("src", "/" + item)
          .appendTo("body");
      });
      // 输出最新的html到dist
      fs.writeFileSync("./dist/" + this.options.filename, $.html());
    });
  }
};
```

### 添加 plugin 功能

1. tapable 简介

在 webpack 内部实现事件流机制的核心, 有了它可以通过事件流的形式, 将各个插件串联起来, tabpable 类似于 node 中的 events 库, 核心原理也是发布订阅模式

2. 再 Compiler 构造函数中, 创建 tapable 生命周期钩子函数

```js
const { SyncHook } = require("tapable");
// 先有hooks, 才能调用apply, 绑定钩子
this.hooks = {
  compile: new SyncHook(),
  afterCompile: new SyncHook(),
  emit: new SyncHook(),
  afterEmit: new SyncHook(),
  done: new SyncHook(["modules"])
};
// plugins 当Compiler这个对象初始化的时候, 就应该调用pulgins中每个插件实例的apply方法, 将钩子函数注册到Compiler实例中
if (Array.isArray(this.config.plugins)) {
  this.config.plugins.forEach(plugin => plugin.apply(this));
}
```
