function insertionSort(src) {
  let arr = [...src];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) {
      let tmp = arr[i];
      let j = i - 1;
      arr[i] = arr[j];
      while (j >= 0 && tmp < arr[j]) {
        arr[j + 1] = arr[j];
        j--;
      }
      arr[j + 1] = tmp;
    }
  }
  return arr;
}

// insert简易版
function insertionSort(src) {
  let arr = [...src];
  let newArr = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    for (let j = i; j > 0; j--) {
      newArr[j] = newArr[j - 1];
      if (arr[i] < newArr[j]) {
        newArr[j - 1] = arr[i];
      }
      if (arr[i] > newArr[j]) {
        newArr[j] = arr[i];
        break;
      }
    }
  }
  return newArr;
}
