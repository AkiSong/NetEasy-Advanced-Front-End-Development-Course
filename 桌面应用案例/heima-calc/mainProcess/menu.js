const { Menu, BrowserWindow, dialog, icpMain } = require("electron");
const path = require('path')

function hm_aboutWindow(params) {
  let win = new BrowserWindow({
    width: 250,
    height: 250,
    title: '关于hm计算器'
  })

  win.loadURL(path.join(__dirname, '../views/about.html'))

  // 设置当前窗口不显示菜单项
  win.setMenu(null)
}

function hm_colorWindow(params) {
  let win = new BrowserWindow({
    width: 250,
    height: 100,
    title: '选择颜色'
  })
  win.loadURL(path.join(__dirname, '../views/color.html'))
  win.setMenu(null)
}

// 菜单项
let template = [
  {
    label: "黑马计算器",
    submenu: [
      {
        label: "关于",
        click: function(params) {
          hm_aboutWindow();
        }
      },
      {
        label: "退出",
        // role: 'quit', //有click时会忽略role
        click(item, win, e) {
          dialog.showMessageBox(
            {
              // 消息框类型
              type: "info",
              title: "退出提示",
              message: "请问是否真的需要退出",
              buttons: ["确定", "取消"]
            },
            function(index) {
              if (index == 0) {
                win.destroy(); //销毁窗体
              }
              if (index == 1) {
                // 关闭对话框
              }
            }
          );
        }
      }
    ]
  },
  {
    label: "格式",
    submenu: [
      {
        label: "颜色",
        // 快捷键
        acceletator() {
          if (process.platform == "darwin") return "Command + shift + F11";
          else return "control + shift + F11";
        },
        click(params) {
          hm_colorWindow();
        }
      },
      {
        label: "字体增大",
        click(item, win, e) {
          win.webContents.send("add");
        }
      },
      {
        label: "字体减小",
        click(item, win, e) {
          win.webContents.send("sub");
        }
      }
    ]
  }
];

// 为应用程序构建菜单项
let menu = Menu.buildFromTemplate(template)

// 将构建好的菜单项添加到应用程序
Menu.setApplicationMenu(menu)

// 在主进程中监听渲染进程发送的右键菜单消息
icpMain.on("hm_showContextMenu", event => {
  let win = BrowserWindow.fromWebContents(event.sender);
  menu.popup(win);
});