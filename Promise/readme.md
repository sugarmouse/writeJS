# 为什么需要 Promsie
- 减少缩进，避免回调地狱
  - 把*函数里的函数*变成*then下面的then*，即链式调用
- 消灭 `if(err)`
  - 错误处理单独放到一个函数里
  - 如果不处理，就一直等到往后抛