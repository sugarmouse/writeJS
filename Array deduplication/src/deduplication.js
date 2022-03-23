const a = ()=>{}
let b = a

let c = {}
let d = c

const arr = [1, 2, 3,undefined, 4, 4, 5,a,b,c,d]
function deduplicate(arr) {
  let map = new Map()
  for (let i in arr) {
    if (map.has(arr[i]) || arr[i] === undefined)  continue 
    map.set(arr[i], true)
  }
  return [...map.keys()]
}
console.log(deduplicate(arr))