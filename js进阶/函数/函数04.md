# compose 函数和 pipe 函数

## compose 函数

- 将需要嵌套执行的函数平铺
- 嵌套执行指一个函数的返回值作为另一个函数的参数
- 特点: 实现函数式编程中的 Pointfree, 使我们专注于转换而不是数据

  ```js
  const compose = (...args) => x => args.reduceRight((res, cb) => cb(res), x); //es6简化写法

  const compose = function() {
    let args = [].slice.call(arguments);
    return function(x) {
      return args.reduceRight(function(res, cb) {
        return cb(res);
      }, x);
    };
  };

  let calculate = compose(muti, add);
  calculate(10);
  ```

## pipe 函数

```js
const pipe = (...args) => x => args.reduce((res, cb) => cb(res), x);

function pipe() {
  let args = [].slice.call(arguments);
  return function(x) {
    return args.reduce(function(res, cb) {
      return cb(res);
    }, x);
  };
}
```
