// electron入口文件
const path = require('path')
// 引入app
const {app, BrowserWindow} = require('electron')
// 启动main.js, 自动触发app的ready事件
app.on('ready', function() {
  // 需要一个应用窗口
  hm_createWindow()
})

function hm_createWindow(params) {
  let win = new BrowserWindow({
    width: 300,
    height: 560,
    title: 'hm计算器'
  })
  // 在窗口中加载页面
  win.loadURL(path.join(__dirname, './views/index.html'))

  // 打开调试工具
  win.webContents.openDevTools()

  // 窗口关闭事件
  win.on('close', function(params) {
    // 销毁win实例
    win = null;
    // 应用程序退出
    app.quit()
  })

  // 窗口加载完毕后, 准备显示的时候触发
  win.on('ready-to-show', function(params) {
    win.show()
    // 窗口激活
    win.focus()
  })

  require('./mainProcess/menu')
}