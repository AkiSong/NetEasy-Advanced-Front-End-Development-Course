import {getVMvalue, setVMvalue} from './utils.js'
import Watcher from './Watcher.js'
let CompileUtils =  {
  // 处理 v-text
  text(node, vm, expr){
    node.textContent = getVMvalue(vm, expr)
    new Watcher(vm, expr, newValue=> node.textContent = newValue )
  },
  html(node, vm, expr){
    node.innerHTML = getVMvalue(vm, expr)
    new Watcher(vm, expr, newValue=> node.innerHTML = newValue )
  },
  model(node, vm, expr){
    node.value = getVMvalue(vm, expr)
    // 实现数据双向绑定
    node.addEventListener('input', function(){
      setVMvalue(vm, expr, this.value)
    })
    new Watcher(vm, expr, newValue=> node.value = newValue )
  },
  eventHandler(node, vm, expr, type){
    // 获取事件类型
    let eventType = type.split(':')[1]
    // 注册事件, 同时要改变事件函数中this指向, 指向Vue实例
    let fn = vm.$methods && vm.$methods[expr]
    if(eventType && fn){
      node.addEventListener(eventType, fn.bind(vm))
    }
  },
  mustache(node, vm){
    let txt = node. textContent
    let reg = /\{\{(.+)\}\}/
    if(reg.test(txt)){
      let expr = RegExp.$1
      node.textContent = txt.replace(reg, getVMvalue(vm, expr))
      new Watcher(vm, expr, newValue => node.textContent = txt.replace(reg, newValue))
    }
  }
}

export default CompileUtils