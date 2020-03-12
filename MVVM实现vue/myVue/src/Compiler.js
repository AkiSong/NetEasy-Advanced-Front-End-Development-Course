/*
专门解析模板内容
*/

class Compiler {
  constructor(el, vm){
    // new Vue时候传进的选择器
    this.el = el instanceof Sting ? document.querySelector(el) : el;
    // Vue实例
    this.vm = vm
    // 编译模板
    if(this.el){
      // 处于性能考虑, 将模板中所有子节点的编译放入内存中操作, 这样就不会编译完就渲染, 减少浏览器开销(重绘回流)
      this.node2fragment(this.el)

    }
  }
  /* 核心方法 */
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
   * @param {*} fragment
   * @memberof Compiler
   */
  compile(fragment){
    let childNodes = fragment.childNodes;
    this.toArray(childNodes).forEach(node=>{
      // 如果是元素, 需要解析属性
      if(this.isElementNode(node)){
        this.compileElement(node)
      }
      // 如果是文本节点, 需要解析插值表达式
      if(this.isTextNode(node)){
        this.compileText(node)
      }
    })
  }

  /* 工具方法 */
  toArray(likeArray){
    return [].slice.call(likeArray)
  }
  isElementNode(node){
    // nodeType: 节点类型 1: 元素节点 3: 文本节点
    return node.nodeType === 1
  }
  isTextNode(node){
    return node.nodeType === 3
  }
}