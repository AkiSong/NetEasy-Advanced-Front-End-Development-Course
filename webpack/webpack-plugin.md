# webpack-plugin

## html-webpack-plugin

```js
npm i html-webpack-plugin -D

const HtmlWebpackPlugin = require('html-webpack-plugin')

plugins: [
    new HtmlWebpackPlugin({
        filename: 'index.html' // 生成后的文件名
        template: './index.html' // 模板html文件
    })
]
```

## clean-webpack-plugin

webpack 内置 plugin
在 build 的时候自动清除旧的 dist, 然后重新生成

```js
const webpack = require('webpack')

npm i clean-webpack-plugin -D

plugins: [
    new CleanWebpackPlugin()
]
```

## copy-webpack-plugin

主要作用, 将静态资源拷贝到 dist 目录

```js
npm i copy-webpack-plugin -D

plugins: [
    new CopyWebpackPlugin([
        {
            form: '从哪里来', //建议绝对路径
            to: '目标路径' // 建议相对路径
        }
    ])
]
```

## BannerPlugin

这是 webpack 内置插件
给打包 js 添加注释信息

```js
const webpack = require('webpack');

new webpack.BannerPlugin('注释信息');

new webpack.BannerPlugin(options);

options = {
  参考官网
};
```

## webpack.ProvidePlugin

自动将引入的库导入到每个模块
webpack 的内置插件

```js
const webpack = require('webpack');

new webpack.ProvidePlugin({
  $: 'jquery',
  Jquery: 'jquery' // 将node_modules中的jquery注入到每个模块, 挂载到变量$ Jquery下
});
```

## webpack.DefinePlugin

内置插件, 定义环境变量

```js
const webpack = require('webpack');

plugins: [
  new webpack.DefinePlugin({
    IS_DEV: 'true' // 该插件内部会将字符串当作js解析, 类似eval()函数, 如果需要字符串, 可以写 '"字符串"'
  })
];
```
