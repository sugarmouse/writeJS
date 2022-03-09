const chai = require("chai")
const sinon = require("sinon")
const sinonChai = require("sinon-chai")

const assert = chai.assert
chai.use(sinonChai)

const EventHub = require("../src/index.js")
describe("EventHub", () => {
  it("eventHub 是一个对象", () => {
    const eventHub = new EventHub()
    assert(eventHub instanceof Object === true)
  })
  it(".on 之后 .emit 会触发 .on 的函数", () => {
    const eventHub = new EventHub()
    let called = false
    // on emit
    eventHub.on('xxx', (data) => {
      called = true
      assert(data === 'data')
    })
    eventHub.emit('xxx', 'data')
    assert(called === true)
  })
  it(".off 可以注销 .on 的事件", () => {
    const eventHub = new EventHub()
    let called = false
    const fn1 = () => {
      called = true
    }
    eventHub.on('yyy', fn1)
    eventHub.off('yyy', fn1)
    eventHub.emit('yyy')
    assert(called === false)
  })
})