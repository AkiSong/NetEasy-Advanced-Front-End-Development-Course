/*
dep对象用于管理所有订阅者和通知这些订阅者
*/
class Dep{
  /**
   *Creates an instance of Dep.
   * @memberof Dep
   * subs 将所有订阅者存储进来, 管理订阅者
   */
  constructor(){
    this.subs = []
  }

  /**
   *添加订阅者
   *
   * @param {*} watcher
   * @memberof Dep
   */
  addSub(watcher){
    this.subs.push(watcher)
  }

  notify(){
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}

export default Dep