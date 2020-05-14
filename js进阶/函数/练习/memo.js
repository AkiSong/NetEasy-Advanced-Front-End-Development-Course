function memo(func, hasher) {
  var memo = function(key) {
    var cache = memo.cache;
    var address = "" + (hasher ? hasher.apply(this, arguments) : key);
    console.log(address);
    console.log(cache[address]);
    if (!cache[address]) cache[address] = func.apply(this, arguments);
    return cache[address];
  };
  memo.cache = {};
  return memo;
}

const fibnacci = i => {
  if (i === 0 || i === 1) {
    return 1;
  }
  return fibnacci(i - 1) + fibnacci(i - 2);
};

let res = memo(fibnacci);

res(30);

res(30);
