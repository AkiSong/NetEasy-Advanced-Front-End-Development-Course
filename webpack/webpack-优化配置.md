# webpack 进阶

## HMR 热模块更新

需要对某个模块进行热模块更新的时候, 可以通过`module.hot.accept`方法进行文件监视

只要模块内容发生变化, 就会发出回调函数, 从而重新读取模块内容

```js
if (module.hot) {
  module.hot.accpet("模块.js", function() {
    console.log("模块更新了");
    let str = require("模块.js");
    console.log(str);
  });
}
```

## Production 打包自带的优化

1.  tree shaking
    tree shaking 用于打包时移除 js 中未引入的代码, 依赖于 ES6 中的模块系统中 由`import`和`export` 的静态结构特新
    开发时引入一个模块后, 如果只使用其中一个功能, 上线打包时, 只会把使用到内容打包进来, 其他没用到的功能不会打包进来, 实现最基础的优化

2.  scope hosting (作用域提升)
    scope hosting 的作用是将模块之间的关系进行结果推测, 可以让 webpack 打包出来的代码体积更小, 运行更快.
    scope hosting 的原理是 分析模块之间的关系, 尽可能将打算的模块整合到一个函数中去, 前提是不能造成代码冗余. 因此, 只有那些被引用了一次的模块才能被合并, 由于 scope hosting 需要分析出模块之间的依赖关系, 源码必须采用 ES6 模块化语句, 不然无法生效
    webpack4 内部使用了 ModuleConcatenationPlugin 插件实现 scope hosting

3.  代码压缩
    webpack4 生产模式自动运行 UglifyjsPlugin 进行代码压缩, 不需要配置

## CSS 优化

1.  `mini-css-extract-plugin` 提取 css 到独立的文件中

    对每个包含 css 的 js 文件都会创建独立的 css 文件, 支持按需加载和 SourceMap
    特性:

    - 只能在 webpack4 中使用
    - 异步加载
    - 不重复编译
    - 更易使用
    - 只针对 CSS

```js
npm i mini-css-extract-plugin -D

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

new MiniCssExtractPlugin({
  filename: [name].js  //支持placeholder语法
})

//修改原来loader中的style-loader

{
  tset: /\.css$/
  use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
}
```

2.  `postcss` 自动添加 css 前缀

    使用 postcss, 用到`postcss-loader`和 `autoprefixer`

```js
  npm i postcss-loader autoprefixer -D

  // 修改loader , 将postcss-loader放在css-loader右边
  {
    test: /\.css$/,
    use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader']
  }
```

在项目根目录下添加 `postcss.config.js`文件
在 postcss 配置文件中添加配置

```js
module.export = {
  plugins: [require("autoprefixer")]
};
```

3.  CSS 压缩

    使用插件 `optimize-css-assets-webpack-plugin`
    由于配置 css 压缩会覆盖 webpack 默认优化配置, 导致 js 压缩失效, 所以需要手动压缩 js, 推荐插件 `terser-webpack-plugin`

    ```js
    npm i optimize-css-assets-webpack-plugin terser-webpack-plugin -D

    const OptimizeCssAssetsWebpackPlugin  = require('optimize-css-assets-webpack-plugin')
    const TerserWebpackPlugin = require('terser-webpack-plugin')

    // 层级和entry并列
    module.exports = {
      optimization: {
        minimizer: [ new TerserWebpackPlugin({}), new OptimizeCssAssetsWebpackPlugin({})]
      }
    }
    ```

## JS 代码分割

code spliting 是 webpack 打包时用到的重要优化特新之一, 使用代码分割可以将 js 代码分割到不同的 bundle 中. 然后可以按需加载或者并行加载这些文件, 极大的提高运行速度

三种常用的代码分割方案

1. 入口起点模式(entry points): 使用`entry`手动分离本地代码

使用方式就是多入口, 多出口方式
缺点: 入口 chunks 中含有重复的模块, 这些重复的模块都会被打包到 bundle 中

2. 防止重复(prevent duplication): 使用`SplitChunksPlugin`去重和分离 chunk

多入口打包抽取公共代码
webpack4 使用了`SplitChunksPlugin`插件, 用来做代码拆分.

基础用法: 在`optimization`节点下添加`splitChunks`属性即可

```js
  optimization{
    splitChunks: {
      chunks: 'all'
    }
  }
```

高级用法
在`optimization`节点下添加`splitChunks`属性, 如果对`splitChunks`不作修改, 则会使用默认配置.
默认的`splitChunks`配置适用绝大多数用户
webpack 会基于以下默认原则分割代码 {
公共代码块或者 node_modules 中的模块
打包的代码块大小超过 30kb
按需加载代码块时, 同时发送的请求数量不大于 5
页面初始化时, 同时发送请求的最大数量不应该超过 3
}

```js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: "async", // 只对异步加载的模块(动态导入的模块)进行拆分, 可选值还有all | initial (all动态导入和静态导入都切割, initial会切割静态)
      minSize: 30000, // 模块最小大于30kb才拆分
      maxSize: 0, // 0代表模块最大无上限, 设置具体值时, 会在模块超过上限值时候会再次拆分
      minChunks: 1, // 模块最少引用一次才会被拆分
      maxAsyncRequests: 5, // 异步加载时同时发送的请求数量最大值不超过5, 超过5的部分不拆分
      maxInitialRequests: 3, //页面初始化时同时发送的请求数量不超过3, 超过的部分不拆分
      automaticNameDelimiter: "~", // 拆分出来的chunk名的连接符
      automaticNameMaxLength: 30, // 拆分chunk名字长度
      name: true, // 拆分的chunk名, 设为true表示根据模块名和cacheGroups的key来自动生成
      cacheGroups: {
        //缓存组, 上面配置读取完成后进行拆分, 如果需要把多个模块拆分到一个文件中, 就需要缓存, 所以命名为缓存组
        vendors: {
          //自定义缓存组名字
          test: /[\\/]node_modules[\\/]/, // 检查node_modules目录, 只要模块在该目录下就使用上面配置拆分到缓存组
          priority: -10, // 权重-10, 哪个组权重大, 优先匹配
          filename: "XX" // 自定义拆分块名称
        },
        default: {
          //默认缓存组名
          minChunks: 2, //最少引用2次才会被拆分
          priority: -20,
          reuseExistingChunk: true // 如果主入口中引入了2个模块, 其中一个模块正好引入了另一个模块, 开启这个配置就不会导致重复分割
        }
      }
    }
  }
};
```

3. 动态导入(dynamic imports): 通过模块的内联函数来调用模块

使用`import`静态导入, 只能在 top level 层级, 即使代码分离, 也会在一开始就加载进来, 这就需要使用动态导入, 实现按需加载

webpack4 允许`import`进行动态导入, 但需要 babel 插件语法支持. `@babel/plugins-syntax-dymaic-import`
动态导入会自动进行代码分割, 所以不需要配置`SplitChunksPlugin`

动态导入最大优点是可以实现懒加载, 提高 SPA 应用的首屏加载速度

```js
  npm i @babel/plugins-syntax-dymaic-import -D

  // 在babelrc文件中修改配置
  presets: ['@babel/env'], //预设语法,
  plugins: [
    '@babel/plugin-proposal-class-properties',  //使用class高级语法
    '@babel/plugin-fransform-runtime', // 使用generator插件
    '@babel/plugins-syntax-dymaic-import'
  ]

  // main.js
  function getComponent(){
    return import('jquery').then(({default: $})=>{
      return $('<div><div>').html('main')
    })
  }

  // 只有执行这个函数, 才会导入jquery模块
```

由于 import 动态加载是基于 promise 的,如果浏览器不支持 promise 的时候需要添加 promise 插件

```js
// main.js
import "core-js/modules/es6.promise";
import "core-js/modules/es6.array.iterator";
```

## noParse (提高构建性能)

在引入一些第三方库时, 列如`jquery` `bootstrap` 这种不依赖其他库的情况下. 此时再用 webpack 去解析其内部关系是非常浪费时间的, 我们需要阻止 webpack 浪费资源去解析这些没有依赖的库
可以在 webpack 的`module`节点下配置`noparse`, 配置正则确定哪些不需要依赖的模块

```js
module: {
  noParse: /jquery|bootstrap/;
}
```

## IgnorePlugin (提高构建性能)

在引入一些第三方模块时, 例如 moment, 内部会用到 i18n 国际化语言包, 这些语言包在打包时会占用很大空间, 而项目中可能只用到语言包一小部分功能, 这时候就需要`IgnorePlugin`在打包时忽略第三方库中的某些依赖项, 这样打包生成的体积会更小

忽略第三方模块内部依赖项步骤

1. 首先找到第三库中的依赖项是什么
2. 使用`IgnorePlugin`忽略第三方依赖
3. 需要某些依赖项时手动引入

```js
// IgnorePlugin 是webpack内置plugin
plugins: [
  new Webpack.IgnorePlugin(/\.\/locale/, /moment/)
  // 传参, 第一个参数是在第三方库中依赖项引入的路径, 第二个参数是第三方库的上下文路径
];
```

## DllPlugin (提高构建性能)

在引入一些第三方库时, 例如 vue, react, angular 等框架, 这些框架文件一般是不会被修改的. 但是每次打包都会解析他们, 极大的影响打包速度. 即使做了代码拆分, 也只是提高了首屏加载, 上线后的用户体验. 并不会提高构建速度.
借助`DllPlugin`插件可以将这些框架生成为动态连接库, 只需要构建一次, 以后每次构建都只生成自己的业务代码, 大大提高构建效率

主要思想: 将一些不修改的依赖项提前打包, 这样我们发布代码的时候, 就不用再对这部分代码进行打包

插件

1. DllPlugin
   使用一个单独的 webpack 配置创建一个 dll, 并且还创建了一个 manifest.json. DllReferencePlugin 会使用该 json 文件来做映射依赖性(这个文件会告诉 webpack 哪些文件已经提前打包好了)
   配置参数:
   - context(可选): manifest 文件中的请求上下文, 默认为该 webpack 文件上下文
   - name: 公开的 dll 函数的名称, 和 output.library 保持一致即可
   - path: manifest.json 生成的文件夹及名字

## 在 vue 项目中使用 DllPlugin

1. 新建 vue 的 dll webpack 配置文件
   webpack.vue.js

```js
const path = require('path')
const webpack = require('webpack')
module.export = {
  mode: 'production',
  entry: {
    vue: ['vue/dist/vue.js', 'vue-router']
  },
  output: {
    path: path.resolve(__dirname, '..', './dist')
    filename: '[name]_dll.js',
    library: '[name_dll]' // 在全局暴露一个对象, 将这个dll暴露出去, 之后其他模块就能引用这个dll包
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_dll.js', // dll文件名, 和output一致即可
      path: path.resolve(__dirname, '../dist/manifest.json') // 生成的清单文件的路径
    })
  ]
};
```

2. 在 webpack.base.js 中使用`DllReferencePlugin`

在 webpack.base.js 中使用插件指定 manifest 文件的位置

```js
new Webpack.DllReferencePlugin({
  manifest: path.resolve(__dirname, "../dist/manifest.json")
});
```

3. 使用`add-asset-html-webpack-plugin`

因为打包后的 dll 并不能动态引入到 html 中, 导致模块并没有加载, 这是就需要这个插件去引入 dll

```js
plugins: [
  new AddAssetHtmlWebpackPlugin({
    filepath: path.resolve(__dirname, "../dist/vue_dll.js")
  })
];
```

## 合理利用浏览器缓存

项目代码发生改变, web 服务器没有重启的情况下, 浏览器请求相同资源的时候, 会去缓存里拿, 并不会刷新资源.
这个情况下, 就需要在 webpack 里配置输出文件名

```js
output: {
  filename: "[name].[contenthash].bundle.js";
  // contenthash 只针对输出文件的内容, 如果文件内容并没有发生改变, 哈希值不会改变
}
```
