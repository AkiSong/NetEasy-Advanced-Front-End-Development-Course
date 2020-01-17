/**
 * 请试着实现一个可以解决 deepCopyJson 中不能拷贝的Symbol、循环引用问题的拷贝函数，
 * 并且保证copy.test.js中的单元测试顺利通过。
 */

function isObject(obj) {
  return typeof obj === "object" && obj != null;
}
function find(arr, item) {
  for (let key in arr) {
    if (arr[key].source === item) {
      return arr[key];
    }
  }
  return null;
}
function forEvery(source, uniqueList, output, objectSymbols, origin) {
  if (objectSymbols && objectSymbols.length > 0) {
    forEvery(objectSymbols, uniqueList, output, [], source);
  }
  for (let p in source) {
    if (origin) {
      if (origin.hasOwnProperty(origin[source[p]])) {
        if (isObject(origin[source[p]])) {
          output[source[p]] = deepCopy(origin[source[p]]);
        } else {
          output[source[p]] = origin[source[p]];
        }
      }
    } else {
      if (source.hasOwnProperty(p)) {
        if (isObject(source[p])) {
          output[p] = deepCopy(source[p], uniqueList);
        } else {
          output[p] = source[p];
        }
      }
    }
  }
  return output;
}
function deepCopy(source, uniqueList) {
  if (!isObject(source)) return source;
  if (!uniqueList) uniqueList = [];
  let output = Array.isArray(source) ? [] : {};
  var uniqueData = find(uniqueList, source);
  if (uniqueData) return uniqueData.source;
  uniqueList.push({ source });
  if (Object.getOwnPropertySymbols(source).length > 0) {
    const objectSymbols = Object.getOwnPropertySymbols(source);
    return forEvery(source, uniqueList, output, objectSymbols);
  }
  return forEvery(source, uniqueList, output);
}

const x = {
  a: [1, 2, 3],
  b: {
    a: 3,
    b: 3
  }
};

const ar = [1, 2, 3];

const y = {
  a: "z",
  [Symbol("z")]: "d"
};

const z = {
  a: "z",
  z: () => "d"
};

var r = {
  a: "z"
};
r.r = r;

console.log(deepCopy(r));
console.log(deepCopy(z));
console.log(deepCopy(y));
console.log(deepCopy(x));
console.log(deepCopy(ar));
