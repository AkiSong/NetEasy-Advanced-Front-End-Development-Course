# webpack basic
## 安装
`npm i webpack-cli -g`
`npm i webpack-cli -D` 推荐！

## npx
npx是npm5.2以上提供的工具， 可以调用项目颞部安装的模块。
`npx webpack`
通过npx可以实现webpack4.x版本可以进行0配置安装
- 原理： 在node_modules中有bin目录， bin目录中有webpack的执行文件， 这和在全局中的用法一样

## 基础配置
1. 核心概念
- 入口
    + 项目的入口文件， webpack会根据入口文件中引入的依赖， 递归查找同类型文件， 打包处理
- 出口
    + 打包后的出口必须要是绝对路径
- loader
- 插件
2. mode
`mode: development` 开发模式， 不会压缩混淆代码
`mode: production` 生产模式， 会压缩混淆代码
3. 在package.json中执行webpack命令
`dev: webpack --config webpack.config.js`
4. 开发时自动编译工具
- watch模式(自带)
    + `webpack --watch`
- webpack-dev-server
    + 配置 --contentBase 文件路径
    + --open 自动打开
    + --port 端口号 指定端口号
    + --hot 热更新
    配置常用在webpack.config.js中的devServer
- webpack-dev-middleware

## loader
[webpack-loader]('./webpack-loader.md)
## plugin
[webpack-plugin]('./webpack-plugin.md')