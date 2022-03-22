const throttleFn = (fn, time, context = undefined) => {
  let timer = null
  return (...arg) => {
    if (timer) return
    fn.call(context, ...arg)
    timer = setTimeout(() => {
      timer = null
    }, time * 1000)
  }
}


