let defineReactive = (obj, key, value) => {
  let dep = new Dep();
  return Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      Dep.target && dep.addSub(Dep.target);
      return value;
    },
    set(newValue) {
      if (value === newValue) return;
      value = newValue;
      reactive(newValue);
      dep.notify();
    },
  });
};

let reactive = (data) => {
  if (!data || typeof data != "object") {
    return;
  }
  Object.keys(data).forEach((key) => {
    defineReactive(data, key, data[key]);
    reactive(data[key]);
  });
  return data
};

let watch = (cb) => {
  Dep.target = cb;
  console.log(Dep.target);
  Dep.target();
  Dep.target = null;
};

class Dep {
  constructor() {
    this.subs = [];
  }

  /**
   *添加订阅者
   *
   * @param {*} watcher
   * @memberof Dep
   */
  addSub(watcher) {
    this.subs.push(watcher);
  }

  /**
   * 通知订阅者
   *
   * @memberof Dep
   */
  notify() {
    this.subs.forEach((sub) => {
      sub();
    });
  }
}
