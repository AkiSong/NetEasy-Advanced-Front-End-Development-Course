/*
项目有一系列的弹窗, 每个弹窗的行为, 大小, 文字都不一样

*/

function basePop(word, size) {
  this.word = word;
  this.size = size;
}
basePop.prototype.init = function () {
  var dom = document.createElement("div");
  dom.innerText = this.word;
  dom.style.width = this.size.width + "px";
  dom.style.height = this.size.height + "px";
  this.dom = div;
};
basePop.prototype.hidden = function () {
  this.dom.style.display = "none";
};
basePop.prototype.confirm = function () {
  this.dom.style.display = "none";
};

function ajaxPop(word, size) {
  basePop.call(this, word, size);
}
var hidden = basePop.prototype.hidden;
ajaxPop.prototype.hidden = function () {
  hidden.call(this);
  console.log("自己的操作");
};
var confirm = basePop.prototype.confirm;
ajaxPop.prototype.confirm = function () {
  confirm.call(this);
  $.ajax();
};
