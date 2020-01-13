# webpack 配置不同环境下的打包文件

项目开发时一般需要 2 套环境, development (不压缩, 不优化, 增加编译效率) 和 production (代码压缩, 代码优化, 打包后上线运行),

1. 抽取三个文件

- webpack.base.js
- webpack.prod.js
- webpack.dev.js

2. 步骤

- 将 prod 和 dev 中共有的部分抽离到 base 中, 不同的部分放在各自的配置文件中
- 在 prod 和 dev 中使用`webpack-merge`与 base 中的配置合并后导出
- 在 package.json 中指定 script 脚本, 运行 webpack 是使用`--config 配置文件`指定配置文件

3. webpack-merge

```js
npm i webpack-merge -D

const merge = require('webpack-merge')

const baseConfig = require('webpack.base.js')

export default = merge(baseConfig,{自己的配置})

```

4. 环境变量

- 方法一
  定义全局变量, 通过内置插件`webpack.DefinePlugin`

```js
const webpack = require('webpack');

plugins: [
  new webpack.DefinePlugin({
    IS_DEV: 'true' // 该插件内部会将字符串当作js解析, 类似eval()函数, 如果需要字符串, 可以写 '"字符串"'
  })
];
```
