
const  deepClone = (()=> {
  const cache = new Map()
  return (source) => {
    if (source instanceof Object) {
      if (cache.has(source)) { return cache.get(source) }
      let copy
      if (source instanceof Function) {
        if (source.prototype) {
          copy = (...arguments) => {
            return source.call(this, ...arguments)
          }
        } else {
          copy = (...arguments) => {
            return source.call(undefined, ...arguments)
          }
        }
      } else if (source instanceof Array) {
        copy = new Array()
      } else if (source instanceof Date) {
        copy = new Date(source - 0)
      } else if (source instanceof RegExp) {
        copy = new RegExp(source.source, source.flags)
      } else {
        copy = {}
      }
      cache.set(source, copy)
      for (let key in source) {
        if (source.hasOwnProperty(key)) {
          copy[key] = deepClone(source[key])
        }
      }
      return copy
    }
    return source
  }
})()

module.exports = deepClone