 /**
 *获取VM中的数据
 *
 * @param {*} vm
 * @param {*} expr
 * @returns
 * @memberof Compiler
 */
export let getVMvalue = (vm, expr)=>{
  let data = vm.$data;
  expr.split('.').forEach(key => {
    data = data[key]
  })
  return data
}

export /**
 *设置vm中的值
 *
 * @param {*} vm
 * @param {*} expr
 * @param {*} value
 */
let setVMvalue = (vm, expr, value) =>{
  let data = vm.$data;
  let arr = expr.split('.')
  arr.forEach((key,index)=>{
    if(index < arr.length -1){
      data = data[key]
    }else{
      data[key] = value
    }
  })
}