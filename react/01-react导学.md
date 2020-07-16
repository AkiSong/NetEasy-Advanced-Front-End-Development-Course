# 什么是 react

用于构建用户界面的 javascript 库
利用 components（组建）来构建用户界面

# 为何选择 react

1. 组件化的开发构思， 项目便于维护
2. 只需要关注业务逻辑， 高效快速更新 DOM
3. 海量的周边生态， 友好地开发环境

# JSX

1. 不是模版引擎
2. 声明的方式创建 UI，处理 UI 逻辑
3. 遵循 javascript， 无学习门槛
4. 在 jsx 中嵌入表达式用{}
5. 大写开头作为定义组件， 小写 tag 为原始标签
6. jsx 标签可以有特定的属性和子元素
7. jsx 只能有一个根元素

# fragements

<React.Fragement />
<></>

1. 可以包含并列的子元素
2. 编写表格组件， 包裹子元素让 html 生效

# props

1. prop 是组件的固有属性
2. 不能在组件内部对 props 进行修改
3. 更新 props： 单向数据流， 通过父组件刷新 props 的值传入子组件

# 函数组件

1. 无状态组件
2. 组件内部没有 this
3. 没有生命周期
4. 性能高

# CSS in React

1. 行内样式
   `<div style={{fontSize: 18, color: red}}>xxx</div>`

2. className
   通过外链的方式引入的 css 文件， react 会将样式解析， 并运用到全局， 在某些情况可能会造成样式污染

3. css module
   - 解决全局污染 命名混乱 没有依赖管理
   - 不使用选择器 使用 class 名定义样式
   - 不层叠样式， 使用一个 class 定义样式
   - 通过 componse 来组合样式

# 事件绑定

1. 用 on 关键字 + 事件名 （驼峰）
2. 事件处理函数用 {} 包裹， 事件处理函数不要带()， 会造成 函数在调用前就自动执行
3. this 指向问题
   - 在 jsx 中使用 bind
   - 在构造函数中使用 bind
   - 箭头函数
4. 传参数
   - 通过 bind 传参
   - 匿名箭头函数参数传递 `()=>{ this.handler(this.props.data) }`
5. 事件对象
   - 事件对象是显示传递的， 需要在绑定事件时将事件对象传递给事件处理函数
6. 向父组件传参
   - 父组件通过 props 向子组件提供一个函数
   - 子组件调用这个函数， 并且将数据通过参数传递给父组件
   - 父组件拿到这个参数
7. react 事件要素
   - react 事件是合成事件， 不是原生 DOM 事件
   - 在 document 监听所有事件
   - 使用统一的分发函数 dispatchEvent

# State

## 定义一个 state

1. 是否通过 props 从父组件获取
2. 是否通过其他 state 和 props 计算得到
3. 是否在 render 方法中使用

## 修改 state

1. this.setState({
   count: this.state.count--
   })

2. 通过回调函数来获取改变后的状态
   this.setState({
   count: this.state.count--
   }, ()=>{
   console.log(this.state.count)
   })
3. setState 是一个异步的过程

4. state 的更新是一个浅合并的过程(shallow merge)

## state 和 props 的区别

- state

  1.  可变的
  2.  组件内部发生
  3.  交互或其他 UI 造成的数据更新

- props
  1.  在组件内部不可变
  2.  父组件传入
  3.  简单的数据流

## 状态更新是否渲染

1. shouldCompenentUpdate(nextProps, nextState){
   return true/false
   }
   钩子函数， 通过形参可以拿到更新后的 props 和 state， 返回值为 true， 执行 render， 返回值为 false， 不执行 render

2. import{PureComponent} from 'react'
   使用 react 自带 PureComponent 高阶组件， 内部自动判断 props 和 state 是否更新

# react 组件的设计模式

## 高阶组件 HOC

高阶组件就是通过一个函数接收一个 react 组件， 返回一个新的组件
`const newComponenet = hihgerOrderComponent(oldComponent)`

## render-prps

1. 定义子组件
2. 在父组件中将 render 作为 props 传递给子组件
