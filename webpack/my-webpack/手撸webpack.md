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
  "bin": "./bin/my-webpack.js"
}
```

4. 使用`npm link`在全局链接本地包
   注意: package.json 中的 bin 脚本需要指定相对路径, 没有路径, npm link 会报错
