// 判圈算法
// 佛洛依德判圈算法
// 思路: 假定存在绕圈, 有一个快指针, 和一个慢指针, 快指针是慢指针的2倍速, 假定2者公共部分为x, 2者在y出相遇, 快指针比慢指针多走z的距离.
// 那么可以得出, 2(x+y) = x + 2y + z => x = z
const floyd = head => {
  // 判断是否有环
  let fast = head;
  let slow = head;
  while (fast && fast.dep) {
    fast = fast.dep.dep;
    slow = fast.dep;
    if (fast === slow) {
      break;
    }
  }

  if (!fast || !fast.dep) {
    return -1;
  }

  // 判断环的起点
  let start = head;
  let pos = 0;
  while (start !== fast) {
    pos++;
    start = head.dep;
    fast = fast.dep;
  }

  return pos;
};
