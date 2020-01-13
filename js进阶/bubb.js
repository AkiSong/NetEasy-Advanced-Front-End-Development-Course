function bubbleSort(src) {
  let arr = [...src];
  for (var i = 0; i < arr.length - 1; i++) {
    for (var j = 0; j < arr.length - i - 1; j++) {
      let tmp = arr[j];
      if (arr[j] > arr[j + 1]) {
        arr[j] = arr[j + 1];
        arr[j + 1] = tmp;
      }
    }
  }
  return arr;
}

// 冒泡优化版
function bubbleSort(src) {
  let arr = [...src];
  for (var i = 0; i < arr.length - 1; i++) {
    var flag = true;
    for (var j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        flag = false;
        let tmp = arr[j + 1];
        arr[j + 1] = arr[j];
        arr[j] = tmp;
      }
    }
    if (flag) {
      break;
    }
  }
  return arr;
}

let src = [1, 3, 2, 6, 4, 5, 9, 8, 7];

console.log(bubbleSort(src));
