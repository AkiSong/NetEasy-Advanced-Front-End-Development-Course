/*
Watcher模块负责将Compiler和Observer模块关联起来
*/
import {getVMvalue} from './utils.js'
import Dep from './Dep.js'
class Watcher{
  /**
   *Creates an instance of Watcher.
   * @param {*} vm 实例
   * @param {*} expr data中数据的名字
   * @param {*} cb 数据发生改变, 调用cb
   * @memberof Watcher
   */
  constructor(vm, expr, cb){
    this.vm = vm
    this.expr = expr
    this.cb = cb
    // 将watcher实例挂载到Dep.target上
    Dep.target = this
    // 将data中的旧值存起来
    this.oldValue = getVMvalue(vm, expr)
    // 清空Dep.target 方便下个watcher实例挂载到Dep
    Dep.target = null
  }

  /**
   *对外暴露一个方法, 这个方法用于更新页面
   *对比expr是否发生变化, 如果发生变化, 需要调用cb
   * @memberof Watcher
   */
  update(){
    let oldValue = this.oldValue;
    let newValue = getVMvalue(this.vm, this.expr)
    if(oldValue != newValue){
      this.cb(newValue, oldValue)
    }
  }
}

export default Watcher