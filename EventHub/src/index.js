
class EventHub {
  cache = {

  };
  // {
  // 'name1':[fn1, fn2, fn3],
  // 'name2':[fn1, fn2, fn3],
  // 'name3':[fn1, fn2, fn3],
  // ...
  // }

  on(eventName, fn) {
    //把 fn 推进 this.cache[eventName] 数组
    this.cache[eventName] = this.cache[eventName] || []
    this.cache[eventName].push(fn)
  }

  emit(eventName, data) {
    (this.cache[eventName] || []).forEach(fn => fn(data))
  }
  off(eventName, fn) {
    //把 fn 从 this.cache[eventName] 数组删掉

    this.cache[eventName] = this.cache[eventName] || []
    // 可以用 array.prototype.indexOf() 替换
    let index = -1
    for (let i = 0; i < this.cache[eventName].length; i++) {
      if (this.cache[eventName][i] === fn) {
        index = i
        break
      }
    }
    if (index === -1) {
      return
    } else {
      this.cache[eventName].splice(index, 1)
    }

  }
}

module.exports = EventHub