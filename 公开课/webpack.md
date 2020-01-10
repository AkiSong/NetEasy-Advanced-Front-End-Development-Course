# 网易的 webpack 配置

## 环境

### 环境分类

1. 开发环境
2. 测试环境
3. 预发环境
4. 线上环境

## plugins

1. webpack.DefinePlugin
   在打包阶段定义全局变量
2. webpack.HashedModuleIdsPlugin
   保持 webpack 打包时 module.id 的稳定
   长缓存优化
3. webpack.NoEmitOnErrorsPlugin
   屏蔽错误
   出现错误的时候不会中断开发模式的服务
4. webpack.ProvidePlugin
   提第三方供库

```js
new webpack.ProvidePlugin({
  $: "jquery"
});
```

5. copy-webpack-plugin
   打包时, 拷贝静态资源

6. DLL 优化
   优化打包速度
   第三方包基本不会变, 每次 webpack 打包都会去打包第三方包
   先处理第三方包, 以后打包就不会打包第三方包

```js
webpack.dll.js;
const webpack = require("webpack");
module.export = {
  entry: {
    vendor: ["jquery", "lodash"]
  },
  output: {
    path: __dirname + "/dll",
    filename: "[name].dll.js",
    library: "[name]_library"
  },
  plugins: [
    new webpack.DllPlugin({
      path: __dirname + "/dll/[name]-manifest.json",
      name: "[name]_library"
    })
  ]
};
______________________________________________________________________________;
webpack.config.js;
module.exports = {
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: require("./dll/vendor-manifest.json")
    })
  ]
};
```

7. happypack
   利用 node 的 webWorker 开多线程处理文件打包

```js
const os = require("os");
const happyPack = require("happypack");
const happyPackThreadPool = HappyPack.ThreadPoll({ size: os.cpus().length }); //有几个cpu开几个线程

module: {
  rules: [
    {
      test: /\.js$/,
      use: {
        loader: 'happyPack?loader="babel-loader"'
      }
    }
  ];
},
plugins:[
  new happyPack({
    id: 'babel-loader',
    threadPoll: happyPackThreadPool
  })
]
```

## webpack 解决什么问题

1. 对模块内容进行处理
   loader 是第一解决方案

   ```js
   //自定义loader;
   // loader的本质就是一个方法
   //myloader.js
   module.exports = function(context) {
     return context.replace("bind", "on");
   };
   // webpack.config.js
   module: {
     rules: [
       {
         test: /\.js$/,
         loader: "myloader"
       }
     ];
   }
   ```

2. 如果要添加一些特殊功能
   plugin 是第一解决方案

   ```js
   const fs = reuqire("fs");
   const path = require("path");
   // 自定义plugin
   // plugin内部定义了一个构造函数
   // plugin执行的时候回去调用它原型链上的 apply 方法
   module.exports = a;
   function a() {}
   a.prototype.apply = function(compiler) {
     // compiler是webpack提供给plugin的编译过程
     // apply方法对打包的某个周期进行监听
     // done 打包完成, emit 刚进行打包
     compiler.hooks.done.tap("changeStatic", function(compilation) {
       let context = compiler.options.context; // 获取当前文件的路径
       let publicPath = path.reslove(context, "dist");
       compilation.toJson().assets.froEach(ast => {
         // ast是通过compilation获取打包后的资源信息
         const filePath = path.resolve(publicPath, ast.name);
         fs.readFile(filePath, function(err, file) {
           var newcontext = file.toString().replace("./static", "www.xxx.com");
           fs.writeFile(filePath, newcontext, function() {});
         });
       });
     });
   };
   ```

   3. 项目上用好 webpack
      不要只把 webpack 当成一个配置文件, 它其实更像一个程序, 可以有很多操作
