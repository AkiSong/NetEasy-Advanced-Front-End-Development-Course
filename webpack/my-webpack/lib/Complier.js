const path = require("path");
const fs = require("fs");
const parser = require("@babel/parser"); //引入babel/parser模块
const traverse = require("@babel/traverse").default; //引入Babel/traverse模块
const generator = require("@babel/generator").default; //引入babel/generator模块
const tem = require("art-template");
const {SyncHook} = require('tapable')

class Compiler {
  constructor(config) {
    this.config = config;
    this.entry = config.entry;
    this.root = process.cwd(); //进程执行的时候所在的路径
    this.modules = {}; //初始化一个对象, 存放所有模块
    // loader
    this.rules = this.config.module.rules;
    // 先有hooks, 才能调用apply, 绑定钩子
    this.hooks = {
      compile: new SyncHook(),
      afterCompile: new SyncHook(),
      emit: new SyncHook(),
      afterEmit: new SyncHook(),
      done: new SyncHook(['modules'])
    };
    // plugins 当Compiler这个对象初始化的时候, 就应该调用pulgins中每个插件实例的apply方法, 将钩子函数注册到Compiler实例中
    if(Array.isArray(this.config.plugins)){
      this.config.plugins.forEach(plugin => plugin.apply(this));
    }
  }
  // 读取文件
  getSource(path) {
    return fs.readFileSync(path, "utf-8");
  }
  depAnalyse(moudlePath) {
    // 读取模块内容
    let source = this.getSource(moudlePath);
    // 调用loader
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

    // 提供一个数组, 缓存当前模块的依赖
    let dependencies = [];
    // 使用babel/parser模块解析文件为抽象语法树
    // astexplore.net 抽象语法树资源管理器
    let ast = parser.parse(source, {
      sourceType: "module" //解析es6等高级语法
    });
    // 使用babel/traverse模块来替换抽象语法树
    // CallExpression函数可以去执行替换'require'调用
    traverse(ast, {
      CallExpression(p) {
        // 第一个形参, 代表抽象语法树中的节点
        if (p.node.callee.name === "require") {
          p.node.callee.name = "__webpack_require__";
          // 替换require引入文件的相对路径
          let oldValue = p.node.arguments[0].value;
          p.node.arguments[0].value = (
            "./" + path.join("src", oldValue)
          ).replace(/\\+/g, "/");

          dependencies.push(p.node.arguments[0].value);
        }
      }
    });
    // 使用babel/generator模块将替换好的ast转换为源码
    let sourceCode = generator(ast).code;
    // 获取当前模块的相对路径
    let modulePathRelative = (
      "./" + path.relative(this.root, moudlePath)
    ).replace(/\\+/g, "/");
    this.modules[modulePathRelative] = sourceCode;
    // 递归加载所有依赖
    dependencies.forEach(dep => this.depAnalyse(path.resolve(this.root, dep)));
  }
  // 输出打包后的代码
  emitFile() {
    // 读取模板字符串
    let template = this.getSource(path.join(__dirname, "../template/tpl.art"));
    // 使用模板引擎拼接代码
    let result = tem.render(template, {
      entry: this.entry,
      modules: this.modules
    });
    // 获取输出目录
    let outputPath = path.join(
      this.config.output.path,
      this.config.output.filename
    );
    fs.writeFileSync(outputPath, result);
  }
  // 项目开始打包
  start() {
    // 钩子
    this.hooks.compile.call()
    // 依赖分析
    // 找到项目路口的绝对路径要注意, __dirname表示的是 webpack 中Compiler.js所在的目录
    // 如果要获取执行 my-webpack 指令的目录, 需要使用process.cwd()
    this.depAnalyse(path.resolve(this.root, this.entry));
    // 钩子
    this.hooks.afterCompile.call()
    this.hooks.emit.call();
    this.emitFile();
    this.hooks.afterEmit.call();
    this.hooks.done.call(this.modules);
  }
}

module.exports = Compiler;
