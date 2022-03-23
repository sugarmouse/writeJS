# 数组去重
## 简单方法
- 过于简单就不单独写成代码文件
```javascript
function deduplicate (arr){
  return [...new Set(arr)]
}
```
## map遍历方法
- 思路
1. 用 map 记录数组数据
2. 不重复记录
3. 对于稀疏数组去除undefined
4. 返回 map 的 key 构成的数组
