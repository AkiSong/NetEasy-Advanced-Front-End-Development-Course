/*
一系列自己的算法, 但是这恶鬼算法再不同的地方需要增加不同的操作

*/
function Counter() {
  this.beforeCount = [];
  this.afterCount = [];
}
Counter.prototype.addBefore = function (fn) {
  this.beforeCount.push(fn);
};
Counter.prototype.addAfter = function (fn) {
  this.afterCount.push(fn);
};
Counter.prototype.count = function (num) {
  let _baseNum = num;
  let _arr = [baseCount];
  _arr = this.beforeCount.concat(this.beforeCount);
  _arr = _arr.concat(this.afterCount);
  function baseCount(num) {
    return num;
  }

  while (_arr.length > 0) {
    _baseNum = _arr.shift()(_baseNum);
  }
  return _baseNum;
};

var objCounter = new Counter();
objCounter.addBefore(function (num) {
  num++;
  return num;
});
objCounter.addAfter(function () {
  num--;
  return num;
});
objCounter.count(10);
