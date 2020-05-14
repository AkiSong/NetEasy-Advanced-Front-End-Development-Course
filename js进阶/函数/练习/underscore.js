(function (root) {
  function _(obj) {
    if (!(this instanceof _)) {
      return new _(obj);
    }
    this.wrap = obj;
  }
  // 静态成员 自定义方法
  _.map = function (arr, callback) {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
      let target = callback ? callback(arr[i]) : arr[i];
      result.push(target);
    }
    return result;
  };
  _.max = function(args) {
    args.push(4);
    return args;
  }
  _.each = function (arr, callback) {
    for (let i = 0; i < arr.length; i++) {
      callback(arr[i]);
    }
  };
  _.functions = function (obj) {
    let result = [];
    for (let key in obj) {
      result.push(key);
    }
    return result;
  };
  _.chain = function (obj) {
    // 创建一个新的实例对象
    let instance = _(obj);
    instance._chain = true;
    return instance;
  };
  _.prototype.value = function() {
     return this.wrap
  }
  var result = function (instance, obj) {
    if (instance._chain) {
      instance.wrap = obj;
      return instance;
    }
    return obj;
  };
  // 静态成员 混入
  _.mixin = function (obj) {
    _.each(_.functions(obj), function (key) {
      let func = obj[key];
      _.prototype[key] = function () {
        let args = [this.wrap];
        Array.prototype.push.apply(args, arguments);
        return result(this, func.apply(this, args));
      };
    });
  };
  _.mixin(_);
  root._ = _;
})(this);
