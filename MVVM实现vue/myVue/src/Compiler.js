/*
专门解析模板内容
*/
import CompileUtils  from './CompileUtils.js'
class Compiler {
  constructor(el, vm){
    // new Vue时候传进的选择器
    this.el = typeof(el) === 'string' ? document.querySelector(el) : el;
    // Vue实例
    this.vm = vm
    // 编译模板
    if(this.el){
      // 处于性能考虑, 将模板中所有子节点的编译放入内存中操作, 这样就不会编译完就渲染, 减少浏览器开销(重绘回流)
      let fragment = this.node2fragment(this.el)
      // 在内存中编译fragment
      this.compile(fragment)
      // 将fragment添加到dom
      this.el.appendChild(fragment)
    }
  }
  /**
   * 核心方法
   * @param {*} node
   * @returns fragment
   * @memberof Compiler
   */
  node2fragment(node){
    // 使用 fragment, 详见MDN fragment, fragment是空白文档碎片, 简单说就是 不存在于 dom树 的dom对象
    // 编译完成后, 将fragment一次性加载到页面
    let fragment = document.createDocumentFragment()
    // 获取所有子节点, 这是个伪数组
    let childNodes = node.childNodes;
    // 借用数组方法遍历子节点, 添加到fragment
    this.toArray(childNodes).forEach(childNode => {
      fragment.appendChild(childNode)
    })
    return fragment
  }
  /**
   * 编译文档碎片
   *
   * @param {*} fragment
   * @memberof Compiler
   */
  compile(fragment){
    let childNodes = fragment.childNodes;
    this.toArray(childNodes).forEach(node=>{
      // 如果是元素, 需要解析指令
      if(this.isElementNode(node)){
        this.compileElement(node)
      }
      // 如果是文本节点, 需要解析插值表达式
      if(this.isTextNode(node)){
        this.compileText(node)
      }
      // 如果节点有子节点, 需要递归解析
      if(node.childNodes && node.childNodes.length > 0){
        this.compile(node)
      }
    })
  }

  /**
   * 元素节点, 解析指令
   *
   * @param {*} node
   * @memberof Compiler
   */
  compileElement(node){
    let attributes = node.attributes;
    if(!attributes) return false
    this.toArray(attributes).forEach(attr => {
      let attrName = attr.name;
      if(this.isDirective(attrName)){
        let type = attrName.slice(2)
        let expr = attr.value;
        if(this.isEventDirective(type)){
          CompileUtils['eventHandler'](node, this.vm, expr, type)
        }else{
          CompileUtils[type] && CompileUtils[type](node, this.vm, expr)
        }
      }
    })
  }

  /**
   *文本节点, 解析插值表达式
   *
   * @param {*} node
   * @memberof Compiler
   */
  compileText(node){
    // console.dir(node)
  }

  /* 工具方法 */
  toArray(likeArray){
    if(likeArray) return [].slice.call(likeArray)
    else return []
  }
  isElementNode(node){
    // nodeType: 节点类型 1: 元素节点 3: 文本节点
    return node.nodeType === 1
  }
  isTextNode(node){
    return node.nodeType === 3
  }
  isDirective(attrname){
    return attrname.startsWith("v-")
  }
  isEventDirective(type){
    return type.split(':')[0] === 'on'
  }
}

export default Compiler