const chai = require("chai")
const sinon = require("sinon")
const sinonChai = require("sinon-chai")

chai.use(sinonChai)

const assert = chai.assert
const deepClone = require("../src/index")

describe("deepClone", () => {
  it("是个函数", () => {
    assert.isFunction(deepClone)
  })
  it("能够复制基本类型", () => {
    const n = 1323
    const n2 = deepClone(n)
    assert(n === n2)
    const s = "tanghao"
    const s2 = deepClone(s)
    assert(s === s2)
    const b = true
    const b2 = deepClone(b)
    assert(b === b2)
    const u = undefined
    const u2 = deepClone(u)
    assert(u === u2)
    const empty = null
    const empty2 = deepClone(empty)
    assert(empty === empty2)
    const sym = Symbol()
    const sym2 = deepClone(sym)
    assert(sym === sym2)
  })
  describe("引用类型", () => {
    it("能够复制普通对象", () => {
      const a = { name: "xiaofang", age: 30, child: { name: "xiaofangfang", age: 8 } }
      const a2 = deepClone(a)
      assert(a !== a2)
      assert(a.name === a2.name)
      assert(a.age === a2.age)
      assert(a.child !== a2.child)
      assert(a.child.name === a2.child.name)
    })
    it("能够复制数组", () => {
      const a = [[11, 12], [21, 22], [31, 32]]
      const a2 = deepClone(a)
      assert(a !== a2)
      assert(a[0] !== a2[0])
      assert(a[1] !== a2[1])
      assert(a[2] !== a2[2])
      assert.deepEqual(a, a2)
    })
    it("能够复制函数", () => {
      const a = function (x, y) {
        return x + y
      }
      a.x = { y: { z: 1 } }
      const a2 = deepClone(a)
      assert(a !== a2)
      assert(a.x !== a2.x)
      assert(a.x.y !== a2.x.y)
      assert(a.x.y.z === a2.x.y.z)
      assert(a(1, 2) === a2(1, 2))
    })
    it("能复制箭头函数",()=>{
      const a=(x,y)=>{
        return x+y
      }
      const a2 = deepClone(a)
      assert(a!==a2)
      assert(a(2,3)===a2(2,3))
    })
    it("能复制环状结构", () => {
      const a = { name: "tanghao" }
      a.self = a
      const a2 = deepClone(a)
      assert(a.name === a2.name)
      assert(a.self !== a2.self)
      assert(a.self === a)
      assert(a2.self === a2)
    })
    it("能复制Date", () => {
      const a = new Date()
      const a2 = deepClone(a)
      assert(a !== a2)
      assert(a.getTime() === a2.getTime())
    })
    it("能复制RegExp", () => {
      const a = /test/gi
      const a2 = deepClone(a)
      assert(a !== a2)
      assert(a.source === a2.source)
      assert(a.flags === a2.flags)
    })
    it("不会复制原型上的属性", () => {
      const a = Object.create({ name: "sugarmouse" })
      const a2 = deepClone(a)
      assert(a2.name === undefined)
    })
  })
}) 