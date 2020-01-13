## 多页应用打包
### 概念
打包时拥有多个入口和一个动态出口的
```js
entry {
  main: './src/main.js',
  other: './src/other.js'
},
output {
  path: path.join(__dirname, './dist/'), //出口路径
  filename: [name].bundle.js,   //打包后得文件名 [name]动态命名
  public: '/'
}
plugin: [
  new htmlWebpackPlugin({
    template: './src/index.html', //模板路径
    filename: 'index.html', //生成文件名
    chunks: ['main']
  })
  new htmlWebpackPlugin({
    template: './src/other.html', //模板路径
    filename: 'other.html', //生成文件名
    chunks: ['other']
  })
]

```
**htmlwebpackplugin**
一个template就是一个入口, 配对一个filename出口, 生成的页面只有一个
可以通过多次引入插件解决生成多个页面的目的
chunks 可以指定在生成得html中引入哪个入口js, 同入口文件一致即可
