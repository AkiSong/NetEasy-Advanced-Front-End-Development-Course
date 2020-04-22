/*
多彩的弹窗
项目有一个弹窗需求, 弹窗有多种, 他们之间存在内容和颜色上的差异
*/
(function (window) {
  function pop(type, content, color) {
    if (this instanceof pop) {
      return new this[type](content, color);
    } else {
      return new pop(type, content, color);
    }

    pop.prototype.infoPop = function (content, color) {};
    pop.prototype.cancelPop = function (content, color) {};
    pop.prototype.warnPop = function (content, color) {};
  }
})(window);

var arr = [
  { type: "infoPop", content: "hello", color: "blue" },
  { type: "infoPop", content: "hello", color: "blue" },
  { type: "infoPop", content: "hello", color: "blue" },
];

arr.forEach((item) => window.pop(item));
