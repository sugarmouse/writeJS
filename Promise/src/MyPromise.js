
const process = require('process')

class MyPromise {
  callbacks = []
  state = "pending"
  resolve(result) {
    if (this.state !== 'pending') return
    this.state = "fullfilled"
    nextTick(() => {
      this.callbacks.forEach(handle => {
        if (typeof handle[0] === "function") {
          let x
          try {
            x = handle[0].call(undefined, result)
          } catch (e) {
            return handle[2].reject(e)
          }
          handle[2].resolveWith(x)
        }
      })
    })
  }
  reject(reason) {
    if (this.state !== 'pending') return
    this.state = "rejected"
    nextTick(() => {
      this.callbacks.forEach(handle => {
        if (typeof handle[1] === "function") {
          let x
          try {
            x = handle[1].call(undefined, reason)
          } catch (e) {
            return handle[2].reject(e)
          }
          handle[2].resolveWith(x)
        }
      })
    })
  }
  constructor(fn) {
    if (typeof fn !== "function") {
      throw new Error("只能接收一个函数作为参数 ")
    }
    fn(this.resolve.bind(this), this.reject.bind(this))
  }
  then(onFullfilled, onRejected) {
    const handle = []
    if (typeof onFullfilled === "function") {
      handle[0] = onFullfilled
    }
    if (typeof onRejected === "function") {
      handle[1] = onRejected
    }

    handle[2] = new MyPromise(() => { })

    this.callbacks.push(handle)
    return handle[2]
  }
  resolveWith(x) {
    // 次方法主要是处理 onFullfilled 或者 onRjected 回调返回值与 then() 返回的新的 Promise 的关系
    // 也就是把 返回值 x 处理到一个新的 Priomise 里，从而实现真正的链式调用
    // this 
    //   -> then() 返回的 new Promise(()=>{})
    // x 
    //   -> then(onFullfilled,onRejected)注册的 onFullfilled 或者 onRejected 回调函数返回值
    // console.log(`-------this--------`)
    // console.log(this)
    // console.log(`-------x--------`)
    // console.log(x)

    if (this === x) {
      console.log('--------ooops--------')
      this.reject(new TypeError())
    } else if (x instanceof MyPromise) {
      x.then(result => {
        this.resolve(result)
      }, reason => {
        this.reject(reason)
      })
    } else if (x instanceof Object) {
      // x 为对象但是不是 MyPromise 实例
      // 找 x 对象中有没有 x.then 方法
      let then
      try {
        then = x.then
      } catch (e) {
        this.reject(e)
      }
      if (then instanceof Function) {
        x.then((y) => {
          this.resolveWith(y)
        }, (r) => {
          this.reject(r)
        })
      } else {
        this.resolve(x)
      }
    }
    else {
      this.resolve(x)
    }
  }

  static all(myPromiseList) {
    return new MyPromise((resolve, reject) => {
      const result = []
      let successIndex = 0
      myPromiseList.map(myPromise => {
        myPromise.then((res) => {
          // result.push(res)
          result[index] = res
          successIndex += 1
          if (successIndex === myPromiseList.length-1){
            console.log(successIndex)
            console.log(length)
            resolve(result)
          }
        }, (err) => {
          reject(err)
        })
      })
    })
  }
}

// 兼顾 浏览器 和 node 运行环境的微任务封装
function nextTick(fn) {
  if (typeof window !== 'undefined') {
    // 浏览器环境用 MutationObserver() 
    let counter = 1
    var observer = new MutationObserver(fn)
    let textNode = document.createTextNode(String(counter))
    observer.observe(textNode, {
      characterData: true
    })
    counter = counter + 1
    textNode.data = String(counter)
  } else {
    process.nextTick(fn)
  }
}


module.exports = MyPromise


