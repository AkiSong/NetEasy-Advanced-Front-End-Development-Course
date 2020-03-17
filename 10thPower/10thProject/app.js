const express = require('express')

const app = express()

app.get('/', (req, res, next) => {
  res.status(200).send('Hello Express')
})

app.listen(3000, ()=>{
  console.log('http://localhost:3000', '服务启动成功')
})