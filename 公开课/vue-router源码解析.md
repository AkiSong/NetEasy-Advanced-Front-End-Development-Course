# 探究 vue-router 源码

## hash 和 history

1. 前端路由和后端路由的区别

- 后端路由: 输入 url -> 请求发送到服务器 -> 服务器解析请求的路径 -> 拿取对应的页面 -> 返回响应

- 前端路由: 输入 url -> js 解析地址 -> 找到对应地址的页面 -> 执行页面生成的 js -> 渲染页面

2. vue-router 工作流

url 改变 -> 触发监听事件 -> 改变 vue-router 里的 current 变量 -> 监视 current 变量的监视者 -> 获取最新的组件 -> render 新组件

## 路由原理

1. hash
   hash 的值改变不会去触发请求
   通过 location.hash 获取
   通过 onhashchange 方法监听 hash 变化

2. history
   history 是正常的 url 路径
   通过 location.pathname 获取
   通过 onpopstate 监听 history 变化

3. vue 插件实现原理

```js
var a = function() {
  console.log(1);
}
Vue.use(a); // console.log(1)
a.install = function(){
    console.log('install')
}
Vue.use(a) // console.log('install')
//vue.use接收一个方法, 会去执行这个方法;
//vue.use接收的参数上有install, vue就只会执行install, 不再执行其他的方法;

Vue.mixin() 该方法往vue中混入自定义操作
Vue.mixin({ // mixin参数为一个对象
  data(){ // 混入data
    return{
      变量
    }
  },
  methods:{
    // 混入常用的方法
  },
  computed:{
    // 混入计算属性
  },
  // 自定义生命周期中的操作
  created(){
    // 混入的生命周期, 在每个实例中都会生效
    // 在生命周期钩子函数中, this指向当前的实例/组件
  }
})

Vue.util() // vue中的工具类
// 包含 warn, extend, mergeOptions, defineReactive 这4个方法
// Vue.util.defineReactive(对象, 属性)
var test ={
  testa: '1'
}
Vue.util.defineReactive(test, 'testa')
// 这个方法将一个window下的变量挂载到了vue, 能被vue监管

Vue.util.extend(to, from)  //该方法实现了对象深拷贝

const Constructor = Vue.extend(传入一个组件) // 返回值是这个组件的构建函数
const vm = new Constructor().$mount() // 通过构建函数创建组件实例
```

## 实现简单的 vue-router 插件

```js
class HistoryRouter(){
  constructor(){
    this.current = null // 储存当前路由
  }
}

class vueRouter(){
  constructor(options){
    this.mode = options.mode || 'hash',
    this.routes =  options.routes || [],
    this.routesMap = this.createMap(this.routes)
    this.history = new HistoryRoute();
    this.init() // 监听url, 改变current
  }
  init(){
    if(this.mode === 'hash'){
      location.hash ? '': location.hash='/' //当初始输入url没有hash的时候, 添加 #/
      window.addEventListener('load', ()=>{
        this.history.current = location.hash.slice(1)
      })
      window.addEventListener('hashchange', ()=>{
        this.history.current = location.hash.slice(1)
      })
    }
  }
  createMap(routes){ // 创建路径path和组件component的对应关系
    return routes.reduce((memo, current)=>{
      memo[current.path] = current.component  //  { '/' : index.vue }
      return memo
    }, {})
  }
}

vueRouter.install = function(Vue){
  if(vueRouter.install.installed) return
  vueRouter.install.installed = true
  Vue.minxin({
    beforeCreate(){
      if(this.$options && this.options.router){ // this.$options是new Vue 实例化的时候传给Vue的参数, 这条判断语句判断Vue初始化的时候是否传入了router
        this._root = this; // 当前this指向vue实例
        this._router = this.$options.router;
        Vue.util.defineReactive(this, 'current', this._router.history) // 第三个参数起到了children的作用, defineReactive会先去this里面找到_router.history, 然后在history中找到current变量
      }else{
        this._root = this.$parent._root
      }
      Object.defineProperty(this, '$router', {  // 定义一个变量, 在this中获取路由对象 this.$router, 这么做的好处是不能直接修改this.$router, 因为只有get, 没有set
        get(){
          return this._root._router
        }
      })
    }
  })
  Vue.component('router-view', {
    render(h){
      let current = this._self._root._router.history.current; //获取到当前current
      let routesMap = this._self._root._router.history.routesMap //获取对应关系
      return h(routesMap[current]) //渲染组件
    }
  })
}

export default vueRouter
```
