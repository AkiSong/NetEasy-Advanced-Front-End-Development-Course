# vue 数据响应式原理

## vue2 的数据响应式原理

1. 什么是 defineProperty
   Object.defineProperty 这个方法原本功能是定义对象的属性
   defineProerty 并不是核心的为一个对象做数据双向绑定, 而是给对象做属性标签, 只不过属性里的 get 和 set 实现了响应式
   |属性名|默认值|
   |value|属性的值|
   |get|获取属性的值|
   |set|设置属性的值|
   |writable|这个属性是否可以被重写|
   |enumerable|属性是否可以被枚举|
   |configurable|属性是否可以被 delete|

```js
// 需要在外层定义下get的返回值, 不然返回的是undefined
var _value = xxxx;
Object.defineProerty(设置的对象, 对象的某个属性, {
  set: function(newValue) {
    // 设置新值
    _value = newValue;
  },
  get: function() {
    // 取值
    return _value;
  }
});
```

2. vue 中一个数据发生改变的过程
   数据改变触发 set(数据劫持监听到数据改变触发 set) ---> set 部分触发 notify(notify 触发视图更新)(set 不会马上触发 notify, get 部分会收集依赖) ---> 更改对应的虚拟 dom(更改 ast 语法树) ---> 重新 render

3. 简单实现数据双向绑定

```js
function Vue() {
  this.$data = { a: 1 };
  this.el = document.getElementById("app");
  this.vm = "";
  this.observe(this.$data);
  this.render()
}
Vue.prototype.observe = function(obj) {
  var self = this;
  var value;
  for(var key in obj){
    value = obj[key];
    if(typeof value === 'object){
      this.observe(value)
    }else{
      Object.defineProerty(this.$data, key, {
        get: function(){
          // 真正的vue里面会进行依赖收集
          return value
        },
        set: function(newValue){
          // 真正的vue里面会触发依赖更新
          value = newValue;
          self.render()
        }
      })
    }
  }
};
// 渲染方法
Vue.prototype.render = function(){
  // 真正的vue 会在render函数内读取视图模板, 生成ast语法树
  this.vm = 'i am' + this.$data.a;
  this.el.innerHTML = this.vm
}
```

4. vue 中数组的响应式
   在 vue 中数组触发双向绑定更新, 需要使用数组的 push shift 等方法, 直接更新下标是无法实现更新的

```js
var arraypro = Array.prototype
var arrayob = Object.create(arraypro) // 创建一个新对象, 防止污染Array原型上的方法
var arrMethods = ['push', 'pop', ....]
arrMethods.forEach((method)=>{
  arrayob[method] = functuon(){ //重写数组方法
    var ret = arraypro[method].apply(this, arguments) //数据更新
    dep.notify() //视图更新
    return ret
  }
})
```

## vue3 的数据响应式原理

1. proxy 是什么
   proxy 是对象用于定义基本操作的自定义行为
   和 defineProerty 类似, 功能几乎一样, 不过用法不一样
   defineProerty 是对原对象做劫持, 修改原对象上的属性标签, 其实是污染了原对象, 而 proxy 是对对象作代理, 返回一个新对象, 不会污染原对象

2. proxy 用法
   优势: 1. 不会污染原对象 2. 省去外层的一个 for in 循环 3. 代码更优雅

```js
  var obj = {a: 1},
  var obj1 = new Proxy(obj, {
    get: function(target, key, receiver){
      /*
        target 原对象
        key 属性
        receiver Proxy对象
      */
      return Reflect.set(target, key)
      // Reflect.get 相当于 target[key]
    },
    set: function(target, key, value, receiver){
      Reflect.set(target, key, value)
      // Reflect.set 相当于 target[key] = value
    }
  })
```

3. 使用 proxy 实现数据双向绑定

```js
function vue() {
  this.$data = { a: 1 };
  this.el = document.getElementById("app");
  this.vm = "";
  this.observe(this.$data);
  this.render();
}
vue.prototype.observe = function() {
  var self = this;
  this.$data = new Proxy(this.$data, {
    get: function(target, key) {
      return Reflect.get(target, key);
    },
    set: function(target, key, value) {
      return Reflect.set(target, key, value);
      self.render();
    }
  });
};
// 渲染方法
vue.prototype.render = function() {
  // 真正的vue 会在render函数内读取试图模板, 生成ast语法树
  this.vm = "i am" + this.$data.a;
  this.el.innerHTML = this.vm;
};
```

4. proxy 其他作用

- 类型校验

```js
var valiob = {
  name: function(value) {
    var reg = /^[\u4e00-\u9fa5]+$/;
    if (typeof value === "string" && reg.test(value)) {
      return true;
    }
    return false;
  },
  age: function(value) {
    if (typeof value === "number" && value >= 18) {
      return true;
    }
    return false;
  }
};
function Person() {
  this.age = age;
  this.name = name;
  return new Proxy(this, {
    get: function(target, key) {
      return target[key];
    },
    set: function(target, key, value) {
      // 策略模式来解决if else过多, 代码不优雅
      if (valiob[key](value)) {
        return Reflect.set(target, key, value);
      }
    }
  });
}

let p = new Person({ age: 19 });
p.age = 18; // 这样修改属性的时候就会经过proxy, 来校验属性是否符合
```

## diff 算法和 virtual dom

1. vm 是一个虚拟层, 并不是真实存在
   通过一个对象, 这个对象描述了一个 dom 的结构和属性
2. diff 算法会比对虚拟 dom 树, 数据发生变化,diff 只会更新对应的地方
3. vue3 diff 的优化
   vue2 当一个父节点发生变化, diff 会遍历比对父节点下的所有子节点
   vue3 在生成 vm 树的时候, 会找出哪些节点是动态节点, 哪些节点是静态节点, 先进行一个分层, 之后 diff 遍历的时候只会去比对动态节点
