# 后台贴纸技术方案

## 交互

贴纸的交互，一开始纠结于在 `Dom` 上操作还是使用 `Pixijs`来操作。最后沟通下来，前期用 `Dom` 会简单很多。所以交互方案是：

+ 限定交互区域的大小，比如宽最大 `800px` 高最大 `800px`
+ 单个贴纸不能拖到交互区域的外面
+ 单个贴纸也有最小宽高和最大宽高的处理
+ 单个贴纸可以拖动改变位置、拖动改变大小
+ 单个贴纸可以删除，删除时需要二次确认
+ 单个贴纸的编辑信息
  + 改变宽、高。宽和高是互相影响的，根据原图的宽高比来算另一边的信息。
  + 刀线图形状

对于上面的交互，其中踩坑的地方有：
1. 拖动改变位置
2. 拖动改变大小

### 拖动改变位置

我们需要定义鼠标的拖动交互，那么需要在拖动的 `Dom` 节点上绑定这三个事件来处理拖动交互：

1. `mousedown`
2. `mousemove`
3. `mouseup`

假如我们有一个贴纸元素，使用 id为 parser1 来显示该贴纸图片。

```html
<img id="parser1" style="width: 100px;height: 100px;" />
```

首先要做的是通过 Dom 对象获取该 img 元素。

```javascript
const parserImg = document.getElementById('parser1');
```

然后给 parserImg 绑定鼠标按下、移动、抬起的事件。

```JavaScript
const parserImg = document.getElementById('parser1');
parserImg.addEventListener('mousedown', onMousedown);
parserImg.addEventListener('mousemove', onMousemove);
parserImg.addEventListener('mouseup', onMouseup);

function onMousedown(e) {
  // todo
}

function onMousemove(e) {
  // todo
}

function onMouseup(e) {
  // todo
}
```

在鼠标按下的时候，我们需要记住当前鼠标按下时相对于贴纸元素的原始位置，也就是移动距离的原点。当鼠标移动时，才能根据原始位置计算从这儿移动到那儿。

```TypeScript
interface FixedInfo {
  startX: number;
  startY: number;
}
const parser: FixedInfo = {}
function onMousedown(e) {
  parser.startX = e.clientX - parserImg.left;
  parser.startY = e.clientY - parserImg.top;
}
```

其实`clientX`和`clientY`已经是鼠标相对于当前可视窗口的按下位置了。为什么还要再减去贴纸元素的`left`和`top`呢？

当我们看到在鼠标移动事件中的处理逻辑或许就会明白了。

在鼠标移动事件中，我们根据鼠标移动时的 `clientX` 和 `clientY` 减去鼠标按下时的原点位置后，得到的将是贴纸元素移动的距离。

```TypeScript
interface FixedInfo {
  startX: number;
  startY: number;
}
const parser: FixedInfo = {}
/** 鼠标按下 */
function onMousedown(e: MouseEvent) {
  parser.startX = e.clientX - parserImg.left;
  parser.startY = e.clientY - parserImg.top;
}

/** 鼠标移动 */
function onMousemove(e: MouseEvent) {
  const diffX = e.clientX - parser.startX;
  const diffY = e.clientY - parser.startY;
  parserImg.style.left = `${diffX}px`;
  parserImg.style.top = `${diffY}px`;
}
```

在鼠标移动事件中我们已经完成了贴纸元素跟着鼠标实时移动了。那我们来解答下为什么在鼠标按下时减去贴纸元素的位置。


1. 对于浏览器来讲，坐标系是以左顶点为原点（left,top）
2. 鼠标在贴纸元素上按下时并不一定就是贴纸元素的左顶点，这时如果拿鼠标按下的坐标点给贴纸元素的 `left,top`，那么贴纸元素将会瞬间定位到鼠标按下时的位置，人机交互非常怪异。
3. 鼠标按下时的位置减去贴纸元素的左顶点坐标，将得到鼠标按下时相对于贴纸元素左顶点的距离。
4. 在鼠标移动事件中拿到鼠标移动的坐标点后减去鼠标相对于贴纸左顶点距离的结果就等于贴纸跟着鼠标移动的位置了。

文字解释过于苍白且不易理解，我们根据这张图再来理解一次。

<!-- 图片内容 -->

这时贴纸元素已经跟着鼠标实时移动了，然后我们在鼠标抬起事件中处理边界等逻辑，或者其他逻辑。

```TypeScript
interface FixedInfo {
  startX: number;
  startY: number;
}
const parser: FixedInfo = {}
/** 鼠标按下 */
function onMousedown(e: MouseEvent) {
  parser.startX = e.clientX - parserImg.left;
  parser.startY = e.clientY - parserImg.top;
}

/** 鼠标移动 */
function onMousemove(e: MouseEvent) {
  const diffX = e.clientX - parser.startX;
  const diffY = e.clientY - parser.startY;
  parserImg.style.left = `${diffX}px`;
  parserImg.style.top = `${diffY}px`;
}

/** 鼠标抬起 */
function onMouseup() {
  // 边界逻辑或其他逻辑
}
```

对于以上代码，看着没有问题。但是，对于复杂的世界业务场景，由于性能、事件响应丢失等问题。我们的鼠标移动和抬起事件并不会在贴纸元素上监听。而是在整个文档元素上监听，所以我们会在鼠标按下时将鼠标移动和抬起的事件绑定在文档上。

在鼠标抬起的事件中移除对文档元素的鼠标移动和抬起事件的监听。

```TypeScript
const parserImg = document.getElementById('parser1');
parserImg.addEventListener('mousedown', onMousedown);
/** 鼠标按下 */
function onMousedown(e: MouseEvent) {
  document.body.addEventListener('mousemove', onMousemove);
  document.body.addEventListener('mouseup', onMouseup);
  parser.startX = e.clientX - parserImg.left;
  parser.startY = e.clientY - parserImg.top;
}

function onMousemove(e) { /** todo */ }
function onMouseup(e) { 
  document.body.removeEventListener('mouseup', onMouseup);
  document.body.removeEventListener('mousemove', onMousemove);
}
```

当我们把鼠标事件绑定到文档上之后，随着而来的问题就是我们鼠标在文档中的任意位置滑动时都会触发鼠标移动事件，那么我们如何处理只有当贴纸元素的鼠标按下事件响应后再触发鼠标移动事件的中逻辑呢？

对于这个问题，我们会定义一个开关来表示人机交互时，用户是否有在贴纸元素上按下。然后在鼠标移动事件中根据这个开关的状态来决定是否要处理贴纸的移动逻辑。

随着鼠标抬起后，我们再把开关的状态重置为关闭状态。

```TypeScript
interface FixedInfo {
  startX: number;
  startY: number;
  isDragging: boolean;
}
const parser: Partial<FixedInfo> = {}
/** 鼠标按下 */
function onMousedown(e: MouseEvent) {
  document.body.addEventListener('mousemove', onMousemove);
  document.body.addEventListener('mouseup', onMouseup);
  parser.startX = e.clientX - parserImg.left;
  parser.startY = e.clientY - parserImg.top;
  parser.isDragging = true;
}

/** 鼠标移动 */
function onMousemove(e: MouseEvent) {
  if (parser.isDragging) {
    const diffX = e.clientX - parser.startX;
    const diffY = e.clientY - parser.startY;
    parserImg.style.left = `${diffX}px`;
    parserImg.style.top = `${diffY}px`;
  }
}

/** 鼠标抬起 */
function onMouseup() {
  parser.isDragging = false;
  document.body.removeEventListener('mouseup', onMouseup);
  document.body.removeEventListener('mousemove', onMousemove);
}
```

至此，贴纸元素拖拽移动逻辑已打完收工

### 边界校验

因为贴纸移动的区域并不是整个窗口的可视区域。而是在一个限定区域中移动，那么我们应该如何处理贴纸移出该区域后的逻辑呢？

不能移出限定区域，我们可以从以下条件判断：

1. 贴纸的坐标不能小于限定区域的左顶点
2. 贴纸的坐标不能大于限定区域的右下角减去贴纸的宽高

```TypeScript
function fixedCorrect() {
  // 不能小于限定区域的左顶点
  if (parser.x < 0) {
    parser.x = 0;
  }
  if (parser.y < 0) {
    parser.y = 0;
  }
  // 不能大于限定区域的右下角减去贴纸的宽高
  if (parser.x + parser.w > 1) {
    parser.x = 1 - parser.w;
  }
  if (parser.y + parser.h > 1) {
    parser.y = 1 - parser.h;
  }
}
```

以上逻辑时根据百分比来计算的。限定区域的左顶点对于贴纸元素来讲自然是 `(0,0)`。限定区域的右下角，如果根据百分比来计算，那么就是 `(1,1)`。

贴纸的右下角为什么是 `(1,1)`？ 因为 100% 是 1，50% 是 0.5。

我们把贴纸的边界矫正放到鼠标抬起事件中处理。

```TypeScript
/** 鼠标抬起 */
function onMouseup() {
  parser.isDragging = false;
  document.body.removeEventListener('mouseup', onMouseup);
  document.body.removeEventListener('mousemove', onMousemove);
  // 边界矫正
  fixedCorrect();
}
```
