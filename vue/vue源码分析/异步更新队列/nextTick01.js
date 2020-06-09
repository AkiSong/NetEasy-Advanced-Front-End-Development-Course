let ref = (initValue) => {
  let value = initValue;
  let dep = new Dep(); //  创建响应式对象的时候， 初始化依赖收集对象
  return Object.defineProperty({}, "value", {
    get() {
      dep.depend();
      return value;
    },
    set(newValue) {
      value = newValue;
      dep.notify();
    },
  });
};

let active; // 执行函数

// 监听执行函数
let watchEffect = (cb) => {
  active = cb;
  active();
  active = null;
};

// 依赖收集
class Dep {
  constructor() {
    this.deps = new Set();
  }
  depend() {
    if (active) {
      this.deps.add(active);
    }
  }
  notify() {
    this.deps.forEach((dep) => queueJob(dep));
  }
}

// 定义异步队列
let queue = [];
let nextTick = (cb) => {
  // nextTick 方法返回一个微任务， 目的是等待所有异步操作结束， 再更新视图
  return Promise.resolve().then(cb);
};

let flushJob = () => {
  // 执行队列中每一项依赖
  let job;
  while (queue.length > 0) {
    job = queue.shift();
    job && job();
  }
};

// 定义job收集函数
let queueJob = (job) => {
  if (!queue.includes(job)) {
    queue.push(job);
    nextTick(flushJob);
  }
};

let x = ref(1);
let y = ref(1);
let z = ref(1);

let str;
watchEffect(() => {
  str = `value ${x.value}-${y.value}-${z.value}<br />`;
  document.write(str);
});

x.value = 2;
x.value = 3;
x.value = 5;
x.value = 5;
x.value = 7;
y.value = 7;
z.value = 7;
y.value = 9;

nextTick(() => {
  x.value = 1;
});
