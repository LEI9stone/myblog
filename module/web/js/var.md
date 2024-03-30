---
title: 从3个for循环代码来理解javascript变量声明
date: 2022-07-14
categories:
tags:
  - JavaScript
---

:::tip 前情提要
在逛技术社区的过程中遇到这么一个问题：第一个`for`循环为什么只输出一次呢？看了题主贴的代码后，觉得比较简单所以就回答了一下。回答完之后就萌生了水一篇文章的想法。<br />
:::

## 3个考验js基本功的for循环

先来看第一个`for`循环：
```javascript
for (var i =0; i < 3; i++) {
  var i = 3;
  console.log(i)
}
```

思考一下，这段代码中，会打印几次？打印的内容分别是多少？

答案是只打印一次，打印的内容是 `3`。那么为什么会这样呢？其实是`js`的变量提升机制导致的。至于代码的详细执行步骤，后续给出。这里先不急，再来看第二个`for`循环。
```javascript
for (var i =0; i < 3; i++) {
  const i = 3;
  console.log(i)
}
```
思考一下，这段代码中，会打印几次？打印的内容分别是多少？
答案是打印`3`次，打印内容都是`3`。那么，这又是为什么呢？只是换了一个关键字来声明变量。竟有如此之区别？其实`const`声明的变量在代码块中有作用域，并且不存在变量提升机制。如果在`const`声明之前去使用该变量会导致`js`报错(阮一峰`es6`中讲的暂时性死区)。

<!-- more -->

来看正常的`for`循环代码
```javascript
let i =0;
for (; i < 3; i++) {
  console.log(i)
}
```
这段代码能打印几次？打印的内容分别是？我相信在座的各位大佬应该都能给出。大佬666呀，在此膜拜。

## 简单讲讲js中var、let、const三个关键字的区别

先谈谈在`es6`中新增的`let`和`const`这两个关键字。`var`算是`js`历史遗留的产品。都`2202`年了，不会还有人在用`var`吧？不会吧？不会吧？

### let 关键字的特性

`let`的使用和`var`是差不多，和`var`的区别是。

+ `let`只会在它所声明的块中生效。请看代码：
  ````javascript
  {
    let a = 10;
    var b = 1;
  }
  a // 代码块外访问a 会报错 ReferenceError: a is not defined.
  b // 代码块外访问b，可以拿到数据 1
  ````
+ `let`不存在变量提升。请看代码：
  ```javascript
  // var 的情况
  console.log(foo); // 输出undefined
  var foo = 2;

  // let 的情况
  console.log(bar); // 报错ReferenceError
  let bar = 2;
  ```
+ 在相同作用域内不允许重复声明同一变量。请看代码
  ```javascript
  // 报错
  {
  var a = 10;
  let a = 10;
  }
  // 报错
  {
  let a = 1;
  let a = 2;
  }
  ```
+ 不能在`let`变量声前使用(TDZ暂时性死区)。请看代码:
  ```javascript
    {
      // TDZ开始
      tmp = 'abc'; // 报错: ReferenceError
      console.log(tmp); // 报错： ReferenceError

      let tmp; // TDZ结束
      console.log(tmp); // undefined

      tmp = 123;
      console.log(tmp); // 123
    }
  ```
+ `let`声明的变量会绑定当前作用，不受外部变量影响
  ```javascript
  var tmp = 123;
  if (true) {
    console.log(tmp) // 报错(触发暂时性死区)：ReferenceError
    let tmp = 'abc';
    console.log(tmp) // abc
  }
  ```
### const 关键字的特性
`const`包含`let`的所有特性，但`const`声明的变量是常量，不能重复赋值。`let`声明的是变量，是可以给变量重复赋值的。
```javascript
const aa = 111;
console.log(aa) // 111
aa = 222; // 报错 TypeError: Assignment to constant variable.
console.log(aa) // 111
```
### var 关键字的特性
`var`算是历史问题，目前的开发中都基本不会使用该关键字来声明变量。所以就不贴代码了，只给总结。
1. `var` 存在变量提升
2. 对于`var`来讲，在`function`中才有作用域。如果不在`function`中那么就是全局作用域
3. `var` 可以重复声明同一变量
4. `var` 可以给变量重复赋值
5. `var` 可以在变量未声明之前去使用变量(变量提升导致的)

## 来看看这三个for循环在js执行过程中分别都做了哪些操作

### 存在变量提升的for循环
代码如下：
```javascript
for (var i =0; i < 3; i++) {
  var i = 3;
  console.log(i)
}
```
为什么存在变量提升的`for`循环只循环了一次？并且输出的内容是`3`？

:::theorem 那么就来看看，在JS中，变量提升是怎么一回事
+ 因为变量`i`是通过var 声明的。所以`i`会存在变量提升，`i`将会提升到全局作用域中。
+ 在循环体内重新声明了 `var i = 3`。那么`var`声明的变量作用域只有`function`和全局。所以这一步操作会将全局变量`i`重新赋值为`3`。
+ 进入第二次循环时，判断条件 `i < 3` 吗？不小于。所以循环结束了。
:::

文字描述可能不太容易理解，这里给各位大佬上个动图：

<!-- 动图解释变量提示机制 -->
![变量提升机制](https://cdn.jsdelivr.net/gh/AsherSun/image-host/blog-img/20220717103338.gif)

### 虽存在变量提升，但也包含了变量作用域的for循环
代码如下：
```javascript
for (var i =0; i < 3; i++) {
  const i = 3;
  console.log(i)
}
```
这段代码中，`var`声明的变量会存在变量提升操作。`const`声明的常量则是在`for`循环体内存在作用域，所以并不会影响到外部`var`声明的变量。

那么这段`for`循环执行了`3`次，并分别打印了`3`次`3`。这是为什么？

:::theorem 该for循环的执行步骤详解
+ 因为变量`var i = 0`是通过`var`声明的。所以`i`会存在变量提升，`i`将会提升到全局作用域中。
+ 在循环体内声明了`const i = 3`。对于`{}`内的代码，`const、let`声明的变量时存在作用域的，所以并不会提升到全局作用域中。
+ 在循环体内执行`console.log(i)`。因为是`const`在循环体内声明过`i`了，所以`i`会绑定到当前作用域中，那么使用的时候，只会从当前作用中找`i`。
:::

文字描述可能不太容易理解，这里给各位大佬上个动图：

<!-- 动图解释变量提示机制 -->
![变量提升机制](https://cdn.jsdelivr.net/gh/AsherSun/image-host/blog-img/20220717182327.gif)

## 结尾及勘误和说明
以上就是这篇文章的全部了，至于第三个for循环就不用展开说了，实在是日常开发中的基操。如果文章的内容有帮助到你，欢迎点赞、评论。如果有大佬发现文章内的一些错误，恳请大佬多多指点。在此多谢大佬🙇‍♀️。

+ 在社区内发现的这个问答在这里：[飞机票✈️](https://segmentfault.com/q/1010000042096268/a-1020000042099268)
+ 文章首发于个人博客：[飞机票✈️](https://ashersun.github.io/)
+ 文章的视频讲解：[飞机票✈️](https://www.bilibili.com/video/BV1Ee4y197sX?share_source=copy_web&vd_source=917c5ab26327dfe2e58dafd906a5d840)，求一键三连



