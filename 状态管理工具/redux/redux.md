# redux

## 基本使用

## redux 中间件

1. 基本雏形

```js
import rootReducer from "./reducers";
import { createStore } from "redux";

const store = createStore(rootReducer);

let dispatch = store.dispatch;

store.dispatch = function() {
  console.log("开始执行dispatch");
  dispatch("action");
  console.log("action执行完毕");
};
```

2. 第三方中间件

- 日志中间件 `redux-logger`

```js
import {applyMiddleware, createStore} from 'redux'
import logger from 'redux-logger'
const store = createStore({
  rootReducer,
  applyMiddleware(logger)
})

```

- 简单实现异步 action`redux-thunk`

```js
npm  i redux-thunk

imort thunk from 'redux-thunk'

const store = createStore(rootReducer, applyMiddleware(thunk))

const Counter = (prop) => {
  return (
    <div>
      <p>{prop.value}</p>
      <button onClick={prop.increment}>Increment</button>
    </div>
  )
}

function increment(){
  return {
    type: 'increment'
  }
}

ReactDom.render(<Counter value={store.getState()} increatment={()=>store.dispatch(increment())} />, document.getElementById('app'))
```
