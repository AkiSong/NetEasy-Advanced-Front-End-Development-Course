const express = require('express')
const nunjucks = require('nunjucks')
const path = require('path')

const app = express()

nunjucks.configure(path.join(__dirname, './view/'), {
    autoescape: true,
    express: app,
    watch: true //禁用模板文件缓存
});
app.use('/public/', express.static(path.join(__dirname, './public/')))
app.get('/', (req, res, next) => {
  res.render('index.html')
})
app.get('/people/home', (req, res, next) => {
  res.render('people-home.html')
})

app.listen(3000, ()=>{
  console.log('http://localhost:3000', '服务启动成功')
})