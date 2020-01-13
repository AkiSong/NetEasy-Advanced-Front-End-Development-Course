# webpack-loader

## css-loader style-loader

```
npm i css-loader style-loader -D
css样式loader解析时是从右向左的
css-loader会解析css文件
style-loader会将解析好的css文件样式注入到style中, 并在内存中的html文件上引入这个样式

module:{
    rules:[
        {
            test: /\*.css$/,
            use: ['style-loader','css-loader']
        }
    ]
}
```

## less-loader sass-loader

```
npm i less less-loader -D
npm i node-sass sass-loader -D

module: {
    rules: [
        {
            test: /\*.less$/,
            use: ['style-loader','css-loader','less-loader']
        },
        {
            test: /\*.(scss|sass)$/,
            use: ['style-loader','css-loader','sass-loader']
        }

    ]
}
```

## file-loader url-loader

```
打包图片 字体等文件资源
npm i file-loader -D

module:{
    rules: [
        {
            test: /\*.(jpg|jpeg|gif|bmp)$/,
            use: ['file-loader']
        }
    ]
}

url-loader 是对file-loader的封装
npm i url-loader file-loader -D

module: {
    rules: [
        {
            test: /\*.(jpg|jpeg|gif|bmp)$/,
            use: {
                options: {
                    limit: 5*1024,   //对于小于5kb的文件会自动转码为base64
                    outputPath: 目录名，  // 会将图片自动保存在该目录下， 目录路径在dist下
                    name: '[name][hash:6].[ext]' // url-loader会自动检测[]号内的变量， name为原文件名， hash为哈希值 hash:数字为截取几位哈希值， ext为原文件后缀名
                },
                loader: url-loader
            }
        }
    ]
}
```

## JS 转译插件 babel-loader

```
npm i babel-loader @babel/core @babel/present-env -D
@babel/core babel核心包
@babel/present-env 语法包

module: {
    rules: [
        {
            tset: /\*.js$/,
            use:{
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/env'], //预设语法,
                    plugins: [
                        '@babel/plugin-proposal-class-properties',  //使用class高级语法
                        '@babel/plugin-fransform-runtime' // 使用generator插件
                    ] // babel插件
                }
            },
            exclude: /node_modules/  // 打包时排除node_modules
        }
    ]
}

使用generator需要安装 2个插件 '@babel/plugin-transform-runtime -D' '@babel/runtime -S'

更推荐使用 .babelrc 文件来配置babel参数



babel 处理高版本原型转义
js是一门动态语言, 可以随时在原型上添加属性或者方法
babel在看到对象调用方法是默认不会进行转换, 因为babel不知道该对象调用的是高级语法还是自己添加加的方法
类似这种情况, 解决方案
npm i @babel/polyfill -S

在文件中引入 @babel/polyfill
```

## sourceMap
```
在webpack中配置source map即可,
source map 有多种配置, 常用 cheap
devtool: cheap-module-eval-source-map
```

## img中图片资源处理 html-withimg-loader
```
html-webpack-plugin 插件是不会对img标签内部引用的资源做处理的, 背景图是写在css内的, 是通过url-loader处理打包的

通过 html-withimg-loader可以解决相关问题
npm i html-withimg-loader -D
module: {
    rules: [
        {
            test: /\.(html|htm)$/,
            loader: 'html-withimg-loader'
        }
    ]
}

打包规则和url-loader的配置一样
```

## expose-loader 全局引入
webpack第三方库是在局部注入, 每个模块都是一个闭包文件
通过`expose-loader`插件可以实现全局变量得注入, 将库引入到全局作用域
```js
npm i expose-loader -D
module: {
  rules: [
    {
      test: require.resolve('juqery') // require.resolve('XX') 解析XX的绝对路径
      use: {
        loader: 'expose-loader',
        options: '$' //挂载到全局的变量
      },

    }
  ]
}
```
