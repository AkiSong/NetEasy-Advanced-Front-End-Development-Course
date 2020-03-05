const path = require("path");
const fs = require("fs");
const parser = require("@babel/parser"); //引入babel/parser模块
const traverse = require("@babel/traverse").default; //引入Babel/traverse模块
const generator = require("@babel/generator").default; //引入babel/generator模块
class Compiler {
  constructor(config) {
    this.config = config;
    this.entry = config.entry;
    this.root = process.cwd(); //进程执行的时候所在的路径
  }
  // 读取文件
  getSource(path) {
    return fs.readFileSync(path, "utf-8");
  }
  depAnalyse(moudlePath) {
    let source = this.getSource(moudlePath);

    // 使用babel/parser模块解析文件为抽象语法树
    // astexplore.net 抽象语法树资源管理器
    let ast = parser(source, {
      sourceType: "module" //解析es6等高级语法
    });
    // 使用babel/traverse模块来替换抽象语法树
    // CallExpression函数可以去执行替换'require'调用
    traverse(ast, {
      CallExpression(p) {
        // 第一个形参, 代表抽象语法树中的节点
        if (p.node.callee.name === "require") {
          p.node.callee.name = "__webpack_require__";
        }
      }
    });
    // 使用babel/generator模块将替换好的ast转换为源码
    generator(ast).code
  }
  // 项目开始打包
  start() {
    // 依赖分析
    // 找到项目路口的绝对路径要注意, __dirname表示的是 webpack 中Compiler.js所在的目录
    // 如果要获取执行 my-webpack 指令的目录, 需要使用process.cwd()
    this.depAnalyse(path.resolve(this.root, this.entry));
  }
}

module.exports = Compiler;
