/*
创建不同的选中效果
有一组菜单, 上面每种选项都有不同的选中效果
*/

var menuItem = function (word, color) {
  this.word = word;
  this.dom = document.querySelector(div);
  this.dom.innerText = this.word;
  this.color = color;
};

menuItem.prototype.bind = function () {
  var self = this;
  this.dom.onmouseover = function () {
    this.style.color = self.colorOver;
  };
  this.dom.onmouseout = function () {
    this.style.color = self.colorOut;
  };
};

function menuColor(colorOver, colorOut) {
  this.colorOver = colorOver;
  this.colorOut = colorOut;
}

var data = [
  { word: "menu1", color: ["black", "red"] },
  { word: "menu2", color: ["black", "red"] },
  { word: "menu3", color: ["black", "red"] },
];

data.forEach((item) => {
  new menuItem(item.word, new menuColor(item.color[0], item.color[1])).bind();
});
