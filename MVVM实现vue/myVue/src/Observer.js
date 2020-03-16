import Dep from "./Dep.js"

class Observer {
  constructor(data){
    this.data = data
    this.walk(data)
  }

  // 核心方法
  /**
   *遍历data中的数据, 给其添加getter和setter
   *
   * @param {*} data
   * @memberof Observer
   */
  walk(data){
    if(!data || typeof data != 'object'){
      return
    }
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
      this.walk(data[key])
    })
  }

  /**
   *数据劫持
   *data中的每一个数据都应该管理一个dep对象(发布者)
   *dep保存了所有订阅该数据的订阅者
   * @param {*} obj
   * @param {*} key
   * @param {*} value
   * @returns
   * @memberof Observer
   */
  defineReactive(obj, key, value){
    let that = this
    let dep = new Dep()
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get(){
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      set(newValue){
        if(value === newValue) return
        value = newValue
        that.walk(newValue)
        dep.notify()
      }
    })
  }
}

export default Observer