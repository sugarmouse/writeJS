const chai = require("chai")
const sinon = require("sinon")
const sinonChai = require("sinon-chai")
const MyPromise = require("../src/MyPromise.js")
const assert = chai.assert
chai.use(sinonChai)



describe("MyPromise", () => {
  it("MyPromise是一个class", () => {
    assert(/^class\b/.test(MyPromise))
    assert.isObject(MyPromise.prototype)
    assert.isFunction(MyPromise)
  })
  it("new MyPromise()必须接收一个函数作为参数", () => {
    assert.throw(() => {
      new MyPromise()
    })
    assert.throw(() => {
      new MyPromise(2)
    })
    assert.throw(() => {
      new MyPromise("what")
    })
    assert.throw(() => {
      new MyPromise(ture)
    })
  })
  it("MyPromise实例需要有then方法", () => {
    const myPromise = new MyPromise(() => { })
    assert.isFunction(myPromise.then)
  })
  it("new MyPromise(fn)中的fn立即执行", () => {
    let fn = sinon.fake()
    new MyPromise(fn)
    assert(fn.called)
  })
  it("new MyPromise(fn)中的 fn 接收 resolve 和 reject 两个函数", (done) => {
    new MyPromise((resolve, reject) => {
      assert.isFunction(resolve)
      assert.isFunction(reject)
      done()
    })
  })
  it("promise.then(onFullfilled, onRejected)中的 onFullfilled 会在 resolve 被调用，且状态变为 fullfilled 之后执行", done => {
    const onFullfilled = sinon.fake()
    const myPromise = new MyPromise((resolve, reject) => {
      // onFullfilled 没有执行

      assert.isFalse(onFullfilled.called)
      resolve()
      // onFullfilled 执行了
      setTimeout(() => {
        assert(myPromise.state === "fullfilled")
        assert.isTrue(onFullfilled.called)
        done()
      }, 0)
    })
    myPromise.then(onFullfilled, null)
  })
  it("promise.then(onFullfilled, onRejected)中的 onRejected 会在 reject 被调用,且状态变为 rejected 之后执行", done => {
    const onRejected = sinon.fake()
    const myPromise = new MyPromise((resolve, reject) => {
      // onRejected 没有执行
      assert.isFalse(onRejected.called)

      reject()
      // onRejected 执行了
      setTimeout(() => {
        assert(myPromise.state === "rejected")
        assert.isTrue(onRejected.called)
        done()
      }, 0)
    })
    myPromise.then(null, onRejected)
  })
  it("onFullfilled 和 onRejected 必须是函数，不是函数则忽略,且不报错", () => {
    const myPromise = new MyPromise((resolve, reject) => {
      resolve()
    })
    myPromise.then(false, null)
  })
  it("resolve 的第一个参数作为 onFullfilled 的第一个参数", () => {
    const onFullfilled = sinon.fake()
    const myPromise = new MyPromise((resolve, reject) => {
      resolve('data')
      setTimeout(() => {
        onFullfilled.calledWith('data')
      })
    })
    myPromise.then(onFullfilled)
  })
  it("reject 的第一个参数作为 onRejected 的第一个参数", done => {
    const onRejected = sinon.fake()
    const myPromise = new MyPromise((resolve, reject) => {
      reject('data')
      setTimeout(() => {
        onRejected.calledWith('data')
        done()
      })
    })
    myPromise.then(null, onRejected)
  })
  it("onFullfilled 和 onRejected 函数只能被调用一次", done => {
    const onFullfilled = sinon.fake()
    const onRejected = sinon.fake()
    const myPromise = new MyPromise((resolve, reject) => {
      resolve('result')
      resolve('second onFullfilled')
      setTimeout(() => {
        assert.isTrue(onFullfilled.calledOnce)
        assert.isTrue(onFullfilled.calledWith('result'))
      })
    })
    const myPromise2 = new MyPromise((resolve, reject) => {
      reject('reason')
      reject('second onRejected')
      setTimeout(() => {
        assert.isTrue(onRejected.calledOnce)
        assert.isTrue(onRejected.calledWith('reason'))
        done()
      })
    })
    myPromise.then(onFullfilled, null)
    myPromise2.then(null, onRejected)
  })
  it("在执行上下文堆栈仅包含平台代码之前，不能调用 onFullfilled", () => {
    const onFullfilled = sinon.fake()
    const myPromise = new MyPromise((resolve, reject) => {
      resolve()
      setTimeout(() => {
        assert.isTrue(onFullfilled.called)
      }, 0)
    })
    myPromise.then(onFullfilled)
    assert.isFalse(onFullfilled.called)
  })
  it("在执行上下文堆栈仅包含平台代码之前，不能调用 onRejected", () => {
    const onRejected = sinon.fake()
    const myPromise = new MyPromise((resolve, reject) => {
      reject()
      setTimeout(() => {
        assert.isTrue(onRejected.called)
      }, 0)
    })
    myPromise.then(null, onRejected)
    assert.isFalse(onRejected.called)
  })
  it("保证 onFullfilled 调用时不带有 this 的值, this 为 undefined", () => {
    const myPromise = new MyPromise((resolve, reject) => {
      resolve()
    })
    myPromise.then(function () {
      "use strict"
      assert.isTrue(this === undefined)
    }, null)
  })
  it("then 可以在一个 promise 里被多次调用, 且各个 onFullfilled 根据最原始的 .then 顺序执行", () => {
    const myPromise = new MyPromise((resolve) => {
      resolve()
    })
    const fn = [sinon.fake(), sinon.fake(), sinon.fake()]
    myPromise.then(fn[0])
    myPromise.then(fn[1])
    myPromise.then(fn[2])
    setTimeout(() => {
      assert(fn[0].called)
      assert(fn[1].called)
      assert(fn[2].called)
      assert(fn[1].calledAfter(fn[0]))
      assert(fn[2].calledAfter(fn[1]))
    }, 0)
  })
  it("then 可以在一个 promise 里被多次调用, 且各个 onRejected 根据最原始的 .then 顺序执行", () => {
    const myPromise = new MyPromise((resolve, reject) => {
      reject()
    })
    const fn = [sinon.fake(), sinon.fake(), sinon.fake()]
    myPromise.then(0, fn[0])
    myPromise.then(0, fn[1])
    myPromise.then(0, fn[2])
    setTimeout(() => {
      assert(fn[0].called)
      assert(fn[1].called)
      assert(fn[2].called)
      assert(fn[1].calledAfter(fn[0]))
      assert(fn[2].calledAfter(fn[1]))
    }, 0)
  })
  it(".then()必须返回一个Promise", () => {
    const myPromise = new MyPromise((resolve, reject) => {
      resolve()
    })
    const myPromise2 = myPromise.then(() => { }, () => { })
    assert(myPromise2 instanceof MyPromise)
  })
  describe("如果 then(onFullfilled, onRejected) 中的 onFullfilled 或者 onRejected 返回一个值 x ,运行 [[Resolve]](promise2, x)", () => {
    it("x 为非引用类型，可以传递给下一个then()", done => {
      const myPromise1 = new MyPromise(resolve => {
        resolve()
      })
      myPromise1
        .then(() => "success", () => { })
        .then(result => {
          assert.equal(result, "success")
          done()
        })
    })
    it("x 为 onFullfilled 返回的一个 MyPromise ，且 x fullfilled", (done) => {
      // onFullfilled 返回 x 为 MyPromise 实例
      const myPromise1 = new MyPromise((resolve, reject) => {
        resolve()
      })
      const fn = sinon.fake()
      myPromise1
        .then(() => new MyPromise((resolve, reject) => { resolve() }), () => { })
        .then(fn, null)
      setTimeout(() => {
        assert(fn.called)
        done()
      })
    })

    it("x 为 onFullfilled 返回的一个 MyPromise ，且 x rejected", done => {
      // onFullfilled 返回 x 为 MyPromise 实例
      const myPromise1 = new MyPromise((resolve, reject) => {
        resolve()
      })
      const fn = sinon.fake()
      myPromise1
        .then(() => new MyPromise((resolve, reject) => { reject() }), () => { })
        .then(null, fn)
      setTimeout(() => {
        assert(fn.called)
        done()
      })
    })
    it("x 为 onRjected 返回的一个 MyPromise 实例，且 x fullfilled", done => {
      // onFullfilled 返回 x 为 MyPromise 实例
      const myPromise1 = new MyPromise((resolve, reject) => {
        reject()
      })
      const fn = sinon.fake()
      myPromise1
        .then(null, () => new MyPromise((resolve, reject) => { resolve() }))
        .then(fn, null)
      setTimeout(() => {
        assert(fn.called)
        done()
      })
    })

    it("x 为 onRjected 返回的一个 MyPromise 实例，且 x rejected", done => {
      const myPromise1 = new MyPromise((resolve, reject) => {
        reject()
      })
      const fn = sinon.fake()
      myPromise1
        .then(null, () => new MyPromise((resolve, reject) => { reject() }))
        .then(null, fn)
      setTimeout(() => {
        assert(fn.called)
        done()
      })
    })

    it("如果 onFullfilled  抛出一个异常，then() 返回的 MyPromise 必须拒绝", done => {
      const myPromise1 = new MyPromise((resolve, reject) => {
        resolve()
      })
      const fn = sinon.fake()
      const error = new Error()
      const myPromise2 = myPromise1.then(() => {
        throw error
      })
      myPromise2.then(null, fn)
      setTimeout(() => {
        assert(fn.called)
        assert(fn.calledWith(error))
        done()
      })
    })

    it("如果 onRejected 抛出一个异常，then() 返回的 MyPromise 必须拒绝", done => {
      const myPromise1 = new MyPromise((resolve, reject) => {
        reject()
      })
      const fn = sinon.fake()
      const error = new Error()
      const myPromise2 = myPromise1.then(null, () => {
        throw error
      })
      myPromise2.then(null, fn)
      setTimeout(() => {
        assert(fn.called)
        assert(fn.calledWith(error))
        done()
      })
    })

    it("如果 onFullfilled 返回一个包含 then 方法的 对象", () => {
      const fn = sinon.fake()
      const myPromise1 = new MyPromise((resolve)=>{
        resolve()
      })
      myPromise1.then(()=>{
        return {
          then:fn
        }
      })
      setTimeout(()=>{
        assert(fn.called)
      })
    })

  })
})  