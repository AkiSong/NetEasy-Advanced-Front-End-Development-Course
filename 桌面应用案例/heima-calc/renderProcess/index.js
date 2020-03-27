const { icpRenderer } = require("electron");
const math = require("mathjs");

let resultTxt = document.querySelector(".result-text");

resultTxt.style.color = localStorage.getItem("sysFontColor");
resultTxt.style.fontSize = localStorage.getItem("sysFontSize") + "px";

icpRenderer.on("hm_setColorToRender", (e, data) => {
  resultTxt.style.color = data;
  localStorage.setItem("sysFontColor", color);
});

icpRenderer.on("add", (e, data) => {
  let size = window.getComputedStyle(resultTxt, null).fontSize;
  let newSize = size.replace("px", "") - 0 + 1;
  resultTxt.style.fontSize = newSize + "px";
  localStorage.setItem("sysFontSize", newSize);
});

icpRenderer.on("sub", (e, data) => {
  let size = window.getComputedStyle(resultTxt, null).fontSize;
  let newSize = size.replace("px", "") - 0 - 1;
  resultTxt.style.fontSize = newSize + "px";
  localStorage.setItem("sysFontSize", newSize);
});

// 定义一个变量存储用户当前的输入
let result = "";
let main = {
  isEqual: false,
  isOpt: false,
  clickNum(num) {
    if (this.isEqual && !this.isOpt) {
      result = "";
      resultTxt.innerHTML = result;
      this.isEqual = false;
    }

    let ipPoint = num === ".";
    if (result.indexOf(".") !== -1 && ipPoint) {
      return false;
    }

    result = result.toString();
    result = result + num;
    resultTxt.innerHTML = result;
  },
  // 重置输入
  reset() {
    resultTxt.innerHTML = "0";
    result = "";
  },
  // 实现计算功能
  clickopt(opt) {
    this.opt = true;
    switch (opt) {
      case "+/-":
        result = math.eval(result + "*-1");
        break;
      case "%":
        result = math.format(math.eval(result + "/100", 4));
        break;
      default:
        result = result + opt;
        break;
    }
    resultTxt.innerHTML = result;
  },
  calc() {
    result = math.eval(result).toString();
    resultTxt.innerHTML = result;
    this.isEqual = true;
    this.isOpt = false;
  }
};

// 单机右键展示上下文菜单
document.oncontextmenu = () => {
  // 渲染进程向主进程发送消息
  icpRenderer.send('hm_showContextMenu')
}
