let x;
let y;
let fn = (v) => v * 100;
let active
let onExchange = (cb) => {
  active = cb;
  active();
  active = null
};

class Dep {
  deps = new Set();
  depend() {
    if (active) {
      this.deps.add(active);
    }
  }
  notify() {
    this.deps.forEach((dep) => dep());
  }
}

let ref = (initValue) => {
  let value = initValue;
  let dep = new Dep();
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

x = ref(1);
onExchange(()=>{
  y = fn(x.value)
  console.log(y)
})

x.value = 2
x.value = 3
x.value = 4;