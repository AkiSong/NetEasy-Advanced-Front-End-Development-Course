# 从三道面试题看 js 底层机制

## 微任务与宏任务

- 微任务: promise process.nextTick

- 宏任务: 整体代码 script, setTimeout, setInterval

- 微任务会先于宏任务执行, 微任务队列执行完毕, 才会去执行宏任务
