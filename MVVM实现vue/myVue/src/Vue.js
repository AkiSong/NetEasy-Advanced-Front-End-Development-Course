import Compiler from './Compiler.js'
class Vue {
  constructor(options = {}){
    this.$el = options.el;
    this.$data = options.data;
    this.$methods = options.methods

    if(this.$el){
      // 负责解析vue模板中的内容
      // 将模板和数据都传给compiler
      new Compiler(this.$el, this)
    }
  }
}

export default Vue