import Compiler from './Compiler.js'
import Observer from './Observer.js'
class Vue {
  constructor(options = {}){
    this.$el = options.el;
    this.$data = options.data;
    this.$methods = options.methods
    // 监视data中的数据
    new Observer(this.$data)
    // 代理
    this.proxy(this.$data)
    this.proxy(this.$methods)

    if(this.$el){
      // 负责解析vue模板中的内容
      // 将模板和数据都传给compiler
      new Compiler(this.$el, this)
    }
  }
  proxy(data){
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable:true,
        configurable: true,
        get(){
          return data[key]
        },
        set(newValue){
          if(data[key] === newValue) return
          data[key] = newValue
        }
      })
    })
  }
}

export default Vue