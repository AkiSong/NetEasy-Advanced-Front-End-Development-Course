# ssr 怎么做

## 什么是 ssr

1. server-side-render 服务端渲染
   解决 seo 和 首屏加载

## ssr + vue

1. 特性
   每次访问都会创建一个新的 vue 实例
   在服务端只会触发组件的 beforeCreate 和 created 钩子, 所以在客户端需要 js 操作

2. 核心库
   vue + vue-server-render

3. 实现

```js
// 服务层
const fs = require('fs')
const renderer = require('vue-server-renderer')
const express = require('express');
const server = express();

function createApp(url){
  if(url === '/'){
    url = 'index'
  }

  const app = new Vue({
    template: fs.readFileSync(`template${url}.html`),
  })

  return app
}


server.get("*". (req,res)=>{
  const app =  createApp(req.url);
  renderer.renderToString(app).then(html => {
    res.end(html)
  })
})

server.listen(8080)

```

```js
// 改造vue-cli2实现ssr
```

## nuxt
