---
title: 组件间通讯总结及应用场景
date: 2020-04-01
tags:
  - vue
---


![vue基础——组件通讯.svg](https://cdn.jsdelivr.net/gh/AsherSun/image-host/blog-img/01_base.svg)

## 父传子通讯

### props

props 是vue组件通讯中最基础，应用最广泛的一种方式。在这里不做过多阐述。

::: tip 数据流传输提示

- 单向数据流, 数据的更改只能通过父组件来修改，子组件只负责接收数据
- 写props最好是使用对象方式写法，而不使用数组方式

:::

<!-- more -->

::: details

```javascript
// 对象方式：
{
  props: {
    size: {
      type: String,
        validator (value) {
        return oneOf(value, ['small', 'large', 'default']);
      },
        default: 'default'
    },
      disabled: {
        type: Boolean,
          default: false
      }
  }
}

// 数组方式：
{
  props: ['size', 'disabled']
}
```



:::

**示例** 



### $refs

$refs 可以拿到一个组件的示例或者DOM元素，在使用的过程中需要注意。用法比较基础，不做过多阐述

::: danger $refs使用建议

refs 使用很方便，但后续业务维护会增加很多成本。在业务代码场景中：通过refs来修改子组件内部数据状态或调用子组件内部方法。如果后续子组件需要修改，但是你根本不清楚有谁会调用子组件中的数据或者方法

::: 

### $children

$children 可以拿到所有子组件实例。用法比较基础，不做过多阐述

::: danger $children使用建议

不建议在业务代码中使用$children。会遇 \$refs 一样的问题

::: 

## 子传父通讯

### 自定义事件：$emit、$on

- $emit 为事件触发器，第一个参数为事件名，之后参数为需要通知父组件的数据
- $on 为事件监听器，第一个参数为为事件名，第二个参数为回调函数



::: details

```javascript
// 子组件
export default class Child exteds Vue {
  created() {
    this.$emit('created', '进入created函数了')
  }
  render(h) {
    return h('div', {} '我是子组件')
  }
}

// 父组件
export default class Parent exteds Vue {
  childCreated(...params) {
    console.log(...params)
  }
  render(h) {
    return h(Child, {
      on: {
        created: this.childCreated
      }
    }, '')
  }
}
```



:::

### $parent

$parent 可以拿到父组件的实例，这里用法比较简单, 不做过多阐述.

::: danger $parent使用建议

不建议在业务代码中使用$parent。会遇 \$refs 一样的问题

::: 

## 兄弟组件通讯

适用场景：组件A与组件B为兄弟关系。当组件A中的数据状态改变，组件B需要响应组件A的数据状态改变。

**思考几个问题**

- 组件A应该通过什么方式来通知组件B我的状态改变了？换句话说就是：组件B应该通过什么方式来感知组件A的变化
- 全局通讯方式：vuex/Bus来处理兄弟组件间的数据通讯是否有大才小用之嫌？



::: tip 提示

我们很清楚子组件数据传给父组件，我们会用`$emit`、`$on` 来通讯。所以是否可以通过某一个组件实例的`$emit`、`$on` 来做桥接呢？

:::

::: details

```javascript
// 兄弟组件A
export default class BortherA exteds Vue {
	public clickMe() {
		this.$parent.$emit('borther-a-click', '组件A触发了事件')
	}
	public render(h) {
		return h('div', {
			on: {
				click: this.clickMe
			}
		}, '我是兄弟组件A')
	}
}

// 兄弟组件B
export default class BortherB extends Vue {
	public msg = '';
	public created() {
		this.$parent.on('borther-a-click', this.bortherAHandle)
	}
	public bortherAHandle(msg) {
		this.msg = msg;
	}
	render(h) {
		return h('div', {}, `我是兄弟组件B ${this.msg}`)
	}
}

// 共同父组件
export default class ParentComponent extends Vue {
	render(h) {
		return h('div', {}, [
			h('div', {}, '我是父组件'),
			h(BortherA),
			h(BortherB)
		])
	}
}
```



:::

上面的示例展示了兄弟组件通讯比较方便快捷的一种方式。虽然 Vuex/Bus 也适用于兄弟组件通讯。但是用于兄弟组件通讯确实有大才小用之嫌。

## 祖先 ===> 后代通讯

### provide/inject

`provide/inject` 属于Vue高级API，大多数应用于UI组件库中。基础概念以及语法这里不做过多阐述，请自行文档。使用时请注意以下几点：

- `provide`用于给后代组件传递数据
- `inject` 用于接收祖先组件传递过来的数据
- 单项数据流，在祖先组件中可以更改数据状态。而后代组件不能更改数据状态

### boradcast

在 Vue 1.x 版本中有` $broadcast `方法。不过在Vue 2.x 中被废弃了。所以我们可以实现一个类似Vue 1.x 版本中的 boradcast 功能。在实现之前请思考一下问题：

- `boradcast` 是什么？
- `boradcast` 既然是解决祖先向后代通讯的。那么后代是如何得知祖先需要传递数据了？

1. `boradcast` 的定义：用于向后代广播祖先组件中的数据状态
1. `boradcast` 向后代传递数据，那么首先要明确是传给哪个后代组件，所以要先找到用于接收祖先数据的后代组件。然后派发一个事件给后代组件。其次在后代组件中需要监听祖先组件的 boradcast

::: details

```javascript
// 祖先组件
export default class Parent extends Vue {
	broadcast(comonentName, eventNane, params) {
		this.$children.forEach(child => {
	   		const name = child.$options.name;
	
	   		if (name === componentName) {
	   			child.$emit.apply(child, [eventName].concat(params));
	    	} else {
	      		this.broadcast.apply(child, [componentName, eventName].concat([params]));
	    	}
		});
	}
	// ... 省略后续代码

}
```



:::

## 后代 ===> 祖先通讯

### listeners

`$listeners` 拿到是当前组件实例的事件监听列表。之后可以通过 `v-on="$listeners"` 继续往下传递

首先，我们清楚在子组件中定义一个事件`this.$emit('test1')`。在父组件中,监听这个组件的事件`v-on:test1="test1handle"`

如果这样的方式用于后代向祖先派发事件，一旦后代组件派发的事件非常多。那么所有的祖先组件都需要监听这个子组件派发出来的事件。这样写虽然可以，但是比较繁琐。

`listeners` 可以省略中间祖先组件的事件显式绑定。可以在需要的祖先组件中显式监听后代组件的派发事件，从而提升了一点工作效率

::: details

```html
<!-- // 祖先组件 -->
<template>
	<div>
		<test
			@child1="child1Handle1"
			@child2="child2Handle2"
			@test1="testHandle1"
			@test2="testHandle2"
		></test>
	</div>
</template>
<!-- 省略祖先组件中部分代码... -->

<!-- // test 组件 -->
<template>
	<div>
		<child
			v-on="$listeners"
		></chil>
	</div>
</template>
<script>
	export default {
		created() {
			this.$emit('test1', this.test1Hndle)
			this.$emit('test2', this.test2Hndle)
		},
		methods: {
			test1Handle() {
			},
			test2Handle() {
			}
		}
	}
</script>

<!-- // 后代组件 -->
<script>
	export default {
		created() {
			this.$emit('child1', this.child1Handle)
			this.$emit('child2', this.child2Handle)
		},
		methods: {
			child1Handle() {
			},
			child2Handle() {
			}
		}
	}
</script>
```



:::

### dispatch

`dispatch` 方法与` boradcast`  方法实现原理相似。`dispatch` 是向上找目标组件，`boradcast`是向下找目标组件。同样，`dispatch` 方法在vue 1.x 版本中有实现过，在 vue 2.x 版本中被废弃了。

::: details

```javascript
export default class Child extends Vue {
	dispatch(componentName, eventName, params) {
  		let parent = this.$parent || this.$root;
  		let name = parent.$options.name;

  		while (parent && (!name || name !== componentName)) {
    		parent = parent.$parent;

    		if (parent) {
      			name = parent.$options.name;
    		}
  		}
  		if (parent) {
    		parent.$emit.apply(parent, [eventName].concat(params));
  		}
	}
```



:::

## Vue 全局通讯

### Vuex

这里不做过多解释，请自行Vuex 文档

### Bus

实现思路：创建一个对象对事件进行派发、监听调用

::: tip 提示

`vue`的本身已经实现了这个思路，所以如果想要在全局使用简单通讯塔可以示例化一个vue实例

:::

::: details

```javascript
import Vue from 'vue';
Vue.prototype.$bus = new Vue();
```



:::

### Global Object

Global Object 虽然是一种方式。可以说基本没有团队使用这种方式. 以下是：Global Object 对比 Vuex

- 维护性：由于Global Object 可以被随时随地的更改，并且很难追踪是被谁更改的。Vuex有明确的输入输出分工处理。
- 数据安全性：因为 Global Object 可以被随时随地的更改。在团队开发中任何开发人员不需要任何成本就能修改整个 Global Object。所以没有任何安全可言...

## Vue组件插槽

**提示：** Vue 2.6.0之后采用全新v-slot语法取代之前的slot、slot-scope

### 默认插槽

内容过于简单。请自行文档

### 具名插槽

内容过于简单。请自行文档

### 插槽作用域

插槽作用域在组件开发中使用时非常频繁的。主要解决的场景为：父组件将数据传给子组件，但是在父组件作用域中需要使用子组件内部的数据状态。所以使用插槽作用域对于这种场景来说非常简单。

::: details

```html
<!-- 子组件 -->
<div>
	<slot :foo="foo"></slot>
</div>

<!-- 父组件 -->
<Comp3> 
	<!-- 把v-slot的值指定为作用域上下文对象 --> 
	<template v-slot:default="ctx">
		来自子组件数据：{{ctx.foo}}   
	</template>
</Comp3>
```
:::


## 最后

### 勘误

以上是对Vue组件通讯的一个总结，文中如有错误请指出，谢谢

### 后续

Vue基础——组件通讯基本介绍到这里，如有还有其他组件通讯方式欢迎补充。后面会有一篇文章来实战Vue组件通讯。实战内容包含上述中的大多数组件通讯方式，比如：provide/inject、插槽作用域...

实战内容有

- 表单验证组件
- 全局提示组件
- 递归组件：树形菜单