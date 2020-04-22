/*
编写一个编辑器插件
有一个编辑器插件, 初始化的时候配置大量参数, 内部功能很多
*/

function Editor(params) {
  this.htmlControl = new htmlControl();
  this.fontControl = new fontControl();
  this.stateControl = new stateControl();
}
function htmlControl(params) {}
function fontControl(params) {}
fontControl.prototype.changeColor = function (params) {};
fontControl.prototype.changeSize = function (params) {};
function stateControl() {
  this.state = [];
  this.nowStep = 0;
}
stateControl.prototype.stateBack = function () {
  var state = this.state[this.nowStep - 1];
  this.fontControl.changeColor(state.color);
  this.fontControl.changeSize(state.fontSize);
};
stateControl.prototype.saveSate = function () {};
window.Editor = Editor;
