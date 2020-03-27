const { Tray, Menu, dialog } = require("electron");
const path = require("path");

function createTray(win) {
  // 创建系统托盘的上下文菜单
  const menu = Menu.buildFromTemplate([
    {
      label: "关闭",
      click() {
        dialog.showMessageBox(
          {
            type: "info",
            title: "退出",
            message: "是否退出?",
            buttons: ["确定", "取消"]
          },
          index => {
            if (index == 0) {
              tray.destory();
              win.destory();
            }
          }
        );
      }
    }
  ]);

  let tray = new Tray(path.join(__dirname, "../images/tray.png"));

  // 给系统托盘图标添加事件
  tray.on('click', ()=>{
    if(win.isVisible()){
      win.hide()
      win.setSkipTaskbar(true)
    }else{
      win.show()
      win.setSkipTaskbar(false)
    }
  })

  // 设置鼠标指针在托盘图标上悬停时显示的文本
  tray.setToolTip("hm计算器");

  // 设置这个图标的内容菜单
  tray.setContextMenu(menu);
}

module.exports = createTray;
