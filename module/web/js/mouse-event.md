---
title: 拼版功能实战之鼠标事件
date: 2024-04-07
categories:
tags:
  - JavaScript
---

你好，我是小磊。这次根据鼠标交互事件来写一个实战项目 —— 图片排版。

[[toc]]

我们要开发一个排版功能，首先需要明确需求点：

- 目标元素的放大、缩小
- 目标元素的位置移动
- 元素与元素之间的安全距离检测
- 边界处理
  - 不能拖出画布之外
  - 元素最大尺寸不能大于画布

从交互上看，需要借助鼠标事件来处理元素的放大缩小以及位置。从逻辑上，我们需要处理元素的边界问题以及元素之间的距离检测。

## 界面交互

<!-- 图片... 放大缩小的按钮，位置移动的图标 -->

通过鼠标的按下、移动、抬起这三个动作来处理元素的尺寸和位置。在元素的右下角，我们设置一个改变元素大小的按钮。除了右下角的按钮区域不会响应位置移动逻辑，而在元素自身范围中的任意位置都可以响应位置移动逻辑。

### 布局

先设定一个画布区域，画布的大小当由业务功能来决定，这里我们暂定画布宽 `100vh` 高 `100vh`，居中展示

:::details 画布区域

```vue
<template>
	<div class="templ"></div>
</template>

<style scoped lang="scss">
	.templ {
		position: relative;
		width: 100vh;
		height: 100vh;
		margin: 0 auto;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
	}
</style>
```

:::

在画布之中可以定义一个个排版元素，目前我们暂时先写一个 `div` 在上面。

:::details 排版元素

```vue{3-11,23-39}
<template>
	<div class="templ">
		<div class="parser">
			<div class="size">
				<a-button size="mini" shape="round" type="dashed" status="success" class="cursor-nwse-resize">
					<template #icon>
						<icon-expand />
					</template>
				</a-button>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.templ {
    position: relative;
		width: 100vh;
		height: 100vh;
		margin: 0 auto;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

		.parser {
      position: absolute;
			width: 100px;
			height: 100px;
			background-color: bisque;
			cursor: all-scroll;
		}

		.size {
			position: absolute;
			bottom: -5px;
			right: -5px;
			transform: rotate(90deg);
			.cursor-nwse-resize {
				cursor: nwse-resize;
			}
		}
	}
</style>
```

:::

这样便完成了基本的 `Dom` 布局，在这个布局的基础上我们还需要展示每个拼版元素的“安全距离辅助线”。这个安全距离辅助线的定义则是拼版元素四周的 10 像素范围内都属于该元素的安全距离。

:::details 安全距离辅助线的布局

```vue
<template>
	<div class="templ">
		<div> // [!code ++]
			<div class="parser">
				<div class="size">
					<a-button size="mini" shape="round" type="dashed" status="success" class="cursor-nwse-resize">
						<template #icon>
							<icon-expand />
						</template>
					</a-button>
				</div>
			</div>
			<div class="bordered"></div> // [!code ++]
		</div> // [!code ++]
	</div>
</template>

<style scoped lang="scss">
	.templ {
		position: relative;
		width: 100vh;
		height: 100vh;
		margin: 0 auto;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

		.parser {
			position: absolute;
			width: 100px;
			height: 100px;
			background-color: bisque;
			cursor: all-scroll;
		}

		.bordered { // [!code ++]
			position: absolute; // [!code ++]
			top: -10px; // [!code ++]
			left: -10px; // [!code ++]
			width: 120px; // [!code ++]
			height: 120px; // [!code ++]
			border: dashed 1px #e9e9e9; // [!code ++]
		} // [!code ++]

		.size {
			position: absolute;
			bottom: -5px;
			right: -5px;
			transform: rotate(90deg);

			.cursor-nwse-resize {
				cursor: nwse-resize;
			}
		}
	}
</style>
```

:::

在完成界面布局之后，便开始对拼版元素的交互进行处理。

### 浅入交互事件

想要跟着鼠标的拖动来改变元素的大小，需要绑定鼠标的按下、移动、抬起事件。而这些事件分别对应的绑定区域如下：

+ `mousedown`鼠标按下事件会绑定在元素自身上这是勿用质疑的
+ `mousemove`鼠标移动事件会绑定在浏览器窗口区域
+ `mouseup`鼠标抬起事件会绑定在浏览器窗口区域

`mousemove`和`mouseup`如果绑定在元素自身上，会出现的问题则是 `mousemove` 事件失去响应。对于 `mouseup` 也是同理。

因为元素的可响应区域是有限的，这个区域并不是整个浏览器窗口的范围。万一鼠标快速移动，那么 `mousemove` 事件就会失去响应，`mouseup` 也是同理。效果如下：

<iframe src="https://code.juejin.cn/pen/7360241123706863643"></iframe>

在我们处理了 `mousemove` 等事件的响应丢失问题后，其实还会发现另外一个问题：如果鼠标拖出浏览器窗口再回到浏览器窗口中，会发现 `mousemove` 事件中的逻辑被触发了。这种现象是不对的，那么阻止这种现象，则需要在浏览器窗口区域绑定 `mouseleve` 事件。

当我们了解以上的相关知识，那么对于一个元素的事件绑定应该如下：

<<< @/../snippets/mouse-event/src/MouseBind.vue

## 排版功能

想要实现一个排版功能，那么需要实现最基本的功能有：

+ 单个元素的放大缩小
+ 单个元素的位移
+ 元素之间的距离检测

### 放大缩小

对于放大缩小的实现还是比较简单，我们只需要记录鼠标的起始位置信息，并在鼠标移动的过程中计算鼠标的移动距离，然后用这段距离加上元素自身的大小就等于鼠标拖动后的大小。

用公式来表示：`鼠标移动的距离 + 元素自身的尺寸 = 鼠标拖动时的尺寸`;

对于这个计算公式来讲，需要注意的是`元素自身的尺寸`。这个信息一定要在鼠标按下时记录下来，然后在鼠标移动过程中使用记录下来的尺寸。如果不在鼠标按下时记录元素的自身尺寸，而是在鼠标移动的时候实时从元素自身上获取它的尺寸信息，那么就会出现不跟手的现象。具体的错误代码如下：

```JavaScript
const parser = {
	width: 100,
	height: 100,
}
const size = {
	startX: 0,
}
function onMousedown(event) {
	const {clientX} = event;
	Object.assign(size, {
		startX: clientX,
	})
}
function onMousemove(event) {
	const {clientX} = event;
	const {startX} = size;
	parser.width += clientX - startX;
}
```

对于这个问题的修正，则只需要在鼠标按下时记录元素尺寸然后根据这个记录的信息来计算元素尺寸的变化。

```JavaScript
const parser = {
	width: 100,
	height: 100,
}
const size = {
	startX: 0,
}
function onMousedown(event) {
	const {clientX} = event;
	Object.assign(size, {
		startX: clientX,
		...parser, // [!code ++]
	})
}
function onMousemove(event) {
	const {clientX, width} = event;
	const {startX} = size;
	parser.width += clientX - startX; // [!code --]
	parser.width = (clientX - startX) + width; // [!code ++]
}
```

单个宽度或者高度的尺寸改变逻辑还是挺简单的，具体的逻辑如下：

:::details 单个宽度尺寸变化
<<< @/../snippets/mouse-event/src/ChangeWidth.vue
:::

:::details 单个宽度尺寸变化
<<< @/../snippets/mouse-event/src/ChangeHeight.vue
:::

如果我们想要一起改变这两个值，具体的计算应该怎么处理呢？这时候就需要来算一道小学的计算题了：

已知矩形的宽是6cm，高是3cm。现将矩形的宽度在原有的 6cm 基础上再加 2cm，在等比缩放后，那么高应该是几厘米？

这题的计算公式如下：

1. 求宽高比
2. 根据宽高比来算另一边

**答：**

```js
width = 6; // 原始宽度
height = 3; // 原始高度
ratio = 6 / 3; // 宽、高比
resize_width = 6 + 2; // 缩放后的宽度
resize_height = resize_width / ratio; // 缩放后的高度：4cm
```

把这个简单的数学题转为代码逻辑后，那么就是答案，代码如下：

:::details 
<<< @/../snippets/mouse-event/src/ChangeSize.vue
:::

### 位移

### 边界处理

### 距离检测


## 总结

在这里我们梳理了事件的绑定逻辑，哪些事件是需要绑定在元素自身上，哪些是需要绑定在浏览器的窗口区域上。对于那些在浏览器窗口区域上的事件，是为了处理事件响应丢失的问题。

绑定在元素自身上的事件：
+ `mousedown`

绑定浏览器窗口区域上的事件：

+ `mousemove`
+ `mouseup`
+ `mouseleve`

而对于拼版功能的实现，则是更偏向业务逻辑上的处理。根据具体功能来书写相关代码逻辑。对于这部分代码也有一些小的知识点需要记住：

+ 鼠标移动的距离 + 元素自身原始的大小 = 鼠标移动后元素自身的大小
+ 鼠标移动的距离 + 元素自身原始的位置 = 鼠标移动后元素自身的位置




