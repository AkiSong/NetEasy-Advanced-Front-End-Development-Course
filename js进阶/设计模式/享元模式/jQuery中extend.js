/*
jQuery的extend
需要判断参数数量, 来进行不同的操作

*/
function extend() {
  let target = argument[0];
  let source;
  if (argument === 1) {
    target = this;
    source = argument[0];
  }
  if (argument === 2) {
    target = argument[0];
    source = argument[1];
  }
  for (var item in argument) {
    target[item] = source[item];
  }
}
