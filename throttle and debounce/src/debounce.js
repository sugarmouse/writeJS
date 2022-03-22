function debounceFn(fn, time) {
  let timer = null
  return (context = undefined,...rest) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.call(context, ...rest)
      timer = null
    }, time * 1000)
  }
}