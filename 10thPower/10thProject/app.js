const express = require('express')
const nunjucks = require('nunjucks')
const path = require('path')
const router = require('./router/index.js')

const app = express()

nunjucks.configure(path.join(__dirname, './view/'), {
    autoescape: true,
    express: app,
    watch: true //禁用模板文件缓存
});
// 开放public目录资源
app.use('/public/', express.static(path.join(__dirname, './public/')))
// 开放node_modules 资源
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))
// 解析 application/json 格式数据
app.use(express.json())
// 解析 application/x-www-form-urlencode 格式数据
app.use(express.urlencoded(
  {extended: true}
))

app.use(router)

app.listen(3000, ()=>{
  console.log('http://localhost:3000', '服务启动成功')
})