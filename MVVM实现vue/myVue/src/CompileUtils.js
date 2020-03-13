let CompileUtils =  {
  // 处理 v-text
  text(node, vm, expr){
    node.textContent = vm.$data[expr]
  },
  html(node, vm, expr){
     node.innerHTML = vm.$data[expr]
  },
  model(node, vm, expr){
    node.value = vm.$data[expr]
  },
  eventHandler(node, vm, expr, type){
    // 获取事件类型
    let eventType = type.split(':')[1]
    // 注册事件, 同时要改变事件函数中this指向, 指向Vue实例
    node.addEventListener(eventType, vm.$methods[expr].bind(vm))
  }
}

export default CompileUtils