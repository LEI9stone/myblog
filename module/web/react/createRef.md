---
title: 从createRef方法来理解js的内存操作
date: 2022-07-18
tags:
  - React
  - JavaScript
---

:::tip 前情提要
在逛技术社区的过程中遇到这么一个问题：为什么获取`createRef`的结果需要多一层`current`呢？再回答完题主的问题后，便决定水一篇文章。<br />
注：文中所有观点都是我个人理解，没有查阅`ECMAScript`官方文档。欢迎大佬在评论区内指点交流。
:::

先看下题主的问题：

```tsx
// 一直搞不明白这个API的设计，这里要多一层current是什么用意，
// 难道除了current外还有别的用法吗？
// 如果只有获取值的用法，为什么不直接简化成myRef1.value拿呢？
const Test: React.FC = () => {
  const myRef1 = React.useRef();
  const onClick = React.useCallback(() => {
    console.log('myRef1', myRef1.current.value)
  }, [])
  return <>
    <input ref={myRef1} type="text" placeholder='点击提示createRef'/>
    <button onClick={onClick}>点击获取ref</button>
  </>
}
```

题主的核心问题是为什么要多一层`current`？把`current`去掉，直接用`myRef1.value`不行吗？要想聊明白这个问题，就得聊聊`JavaScript`中的基本数据类型和引用数据类型。

<!-- more -->

## 基本数据类型

我们先定义一个变量，叫`baseType`

```javascript
let baseType = 10
```

后续的操作中，改变了变量`baseType`中的数据

```javascript
baseType = 20
```

那么这时候，变量`baseType`的内存指向是谁？指向的是内存中有`20`这个值的具体地址。如果不太理解的，我们可以根据JavaScript的执行步骤走一下：

:::info 基本数据类型的内存指向
+ 当js执行到`baseType = 10`这行逻辑的时候，会在内存中开辟一个空间，空间中存储的值是10
+ 这时候将内存空间的地址赋值给`baseType`变量
+ 当前JS继续执行到`baseType = 20`这行逻辑的时候，也会在内存中开辟一个空间，空间中存储的值是20
+ 然后再将20这个内存空间的地址赋值给`baseType`变量
:::

上述JavaScript的执行步骤可以理解吗？暂时还没有理解的没关系，给大佬上动图：
<!-- 动图解释 -->
## 引用数据类型

如果是引用数据类型呢？引用数据类型的地址是如何指向的？

首先，我们先定义一个变量，名称叫做`referencedType`，然后给它加一个字段

```javascript
let referencedType = { }
referencedType.a = '我是老A'
```

后续操作中改变了变量`referencedType`中字段`a`的数据：

```javascript
referencedType.a = '我发生了变异'
```

执行完上述操作，并没有改变`referencedType`的内存指向。那么是改变了谁的内存指向呢？改变的是`referencedType`中字段`a`的内存指向。

所以，上述操作中，对于js来讲它的执行步骤是什么样子的？

:::info 引用数据类型中字段值的改变
+ 当js执行到`referencedType = { }`这行逻辑的时候，会在内存中开辟一个空间，空间中存储的值是一个空对象`{}`
+ 这时候将内存空间的地址赋值给`referencedType`变量
+ 当前JS继续执行到`referencedType.a = '我是老A'`这行逻辑的时候，js发生了如下的操作
  + 首先会开辟一个内存空间，空间中存储的值是`我是老A`
  + 然后在`referencedType`变量上新增一个字段`a`并将`我是老A`这个内存地址赋值给字段`a`
  + 这时候`referencedType`变量的具体值是：`{a: '我是老A'}`
+ 当前JS继续执行到`referencedType.a = '我发生了变异'`这行逻辑的时候，js发生了如下的操作
  + 首先会开辟一个内存空间，空间中存储的值是`我发生了变异`
  + 然后将`我发生了变异`这个内存地址重新赋值给`referencedType`变量上的字段`a`
  + 这时候`referencedType`变量的具体值是：`{a: '我发生了变异'}`
:::

上述JavaScript的执行步骤可以理解吗？暂时还没有理解的没关系，给大佬上动图：

<!-- 动画效果 -->

这是引用数据类型中字段值的改变，如果我想直接改变`referencedType`这个引用数据类型的内存指向呢？

其实很简单，直接给变量`referencedType`重新赋值一个新的数据(可以是任意数据类型)。看代码：

```javascript
//  重新赋值一个新的对象
referencedType = { six: '我是老6' }
// 重新赋值一个字符串给变量 referencedType
referencedType = '我是变量referencedType'
```

那就有人说了，如果我不想修改变量`referencedType`的内存地址，也不想让其他人修改。这时候应该怎么办呢？

其实`ES6`已经给出了答案：`const`。使用`const`声明一个常量，如果后续在代码中直接给`referencedType`赋值，是会抛错的。看代码：

```javascript
const referencedType = { a: '我是老A' }
// 后续代码中想要修改referencedType的引用地址
referencedType = { six: '我是老6' } // js执行到这一步的时候将抛错。
```

如果有大佬想知道`const`、`let` 、`var` 这三个关键字声明变量的区别可以移步看下这篇文章：[从三个for循环来理解js变量声明](https://ashersun.github.io/js/%E4%BB%8E3%E4%B8%AAfor%E5%BE%AA%E7%8E%AF%E6%9D%A5%E7%90%86%E8%A7%A3JS%E5%8F%98%E9%87%8F%E5%A3%B0%E6%98%8E.html)

## createRef为什么需要多一层current

如果大佬们有理解上文所说的内容，那么看到这里其实就不用看了，所有的答案都在上文中。当然，在大佬们离开前卑微求一个赞

OK，回归正题。

### 场景复现

当我们给一个`DOM`节点绑定`ref`的时候，该语法是这样的:

```tsx
function TestRef() {
  const ref = React.useRef()
  return (
    <div ref={ref}>
     // 其他业务逻辑...
    </div>
  )
}
export default TestRef
```

那么在`react`中，`ref`的绑定大致可以这样描述(只是伪代码，不可较真)：

```JavaScript
const ref = {current: void 0}
function TestRef() {
  ref.current = new HTMLDivElement() 
}
```

如果`TestRef`这个组件内部有`useState`的操作，那么就会触发`render`函数的重新执行。可以这样理解：

```JavaScript
// 触发了一次 useState操作，执行一次TesetRef方法
TestRef()
// 又触发了一次 useState操作，又执行了一次TestRef方法
TestRef()
```

根据上面的场景复现，我们可以这样理解：

每当`render`重新渲染，我们拿到的其实都是一个新的`DOM`对象，那么也就是一个新的内存地址。这就是为什么会多一层`current`的原因。如果没有这一层`current`，那么在`render`更新的时候就会导致`ref`绑定的丢失。

## 结尾及勘误和说明
以上就是这篇文章的全部了，如果文章的内容有帮助到你，欢迎点赞、评论。如果有大佬发现文章内的一些错误，恳请大佬多多指点。在此多谢大佬🙇‍♀️。

+ 在社区内发现的这个问答在这里：[飞机票✈️](https://segmentfault.com/q/1010000041928218/a-1020000041933961)
+ 文章首发于个人博客：[飞机票✈️](https://ashersun.github.io/)
<!-- + 文章中的内容已制作成视频，放在`b`站上了。[飞机票✈️](https://www.bilibili.com/video/BV1Ee4y197sX?share_source=copy_web&vd_source=917c5ab26327dfe2e58dafd906a5d840)，求一键三连 -->

