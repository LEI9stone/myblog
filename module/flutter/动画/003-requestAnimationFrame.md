---
title: requestAnimationFrame
date: 2026-05-07
tags:
  - flutter
  - app
  - web
---

# `requestAnimationFrame` vs `Ticker`

Web 里 `requestAnimationFrame` 用来在浏览器下一帧绘制前执行回调，常用于自定义动画、游戏循环、Canvas 绘制。

Flutter 里对应的底层概念是 `Ticker`。`Ticker` 会跟随 Flutter 的帧调度，在每一帧回调，通常由 `AnimationController` 间接使用。

可以这样映射：

| Web                     | Flutter                             |
| ----------------------- | ----------------------------------- |
| `requestAnimationFrame` | `Ticker`                            |
| browser frame callback  | Flutter frame callback              |
| frame timestamp         | elapsed `Duration`                  |
| cancelAnimationFrame    | `Ticker.stop()` / dispose           |
| animation loop          | `AnimationController` / `Ticker`    |
| Canvas custom draw      | `CustomPainter` + ticker/controller |
| game loop               | Ticker / game engine loop           |
| HMR frame update        | Flutter frame scheduling            |

---

## 1. Web requestAnimationFrame

Web：

```ts
let frameId: number;

function tick(time: number) {
  update(time);
  render();
  frameId = requestAnimationFrame(tick);
}

frameId = requestAnimationFrame(tick);
```

停止：

```ts
cancelAnimationFrame(frameId);
```

核心是：

```text
浏览器每一帧绘制前调用 tick；
你根据时间更新状态和绘制。
```

---

## 2. Flutter Ticker

Flutter 中：

```dart
late final Ticker ticker;

@override
void initState() {
  super.initState();

  ticker = createTicker((elapsed) {
    // 每帧回调
  });

  ticker.start();
}

@override
void dispose() {
  ticker.dispose();
  super.dispose();
}
```

通常需要 mixin：

```dart
with SingleTickerProviderStateMixin
```

或者：

```dart
with TickerProviderStateMixin
```

---

## 3. Ticker 更常被 AnimationController 使用

大多数 Flutter 业务动画不直接写 `Ticker`，而是写：

```dart
AnimationController(
  vsync: this,
  duration: const Duration(milliseconds: 300),
)
```

这里的：

```dart
vsync: this
```

就是给 `AnimationController` 提供 `TickerProvider`。

可以理解为：

```text
AnimationController 内部使用 Ticker 推进动画时间。
```

---

## 4. vsync 是什么

Flutter 中动画常写：

```dart
class _PageState extends State<Page>
    with SingleTickerProviderStateMixin {
  late final AnimationController controller;

  @override
  void initState() {
    super.initState();

    controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
  }
}
```

`vsync` 的作用是：

```text
当 Widget 不可见或不需要绘制时，避免无意义地 tick。
```

类似 Web 中浏览器对后台 tab 的动画降频，但 Flutter 通过 `TickerProvider` 明确管理。

---

## 5. timestamp vs elapsed

Web rAF 回调拿到：

```ts
time: DOMHighResTimeStamp;
```

Flutter Ticker 回调拿到：

```dart
elapsed: Duration
```

示例：

```dart
ticker = createTicker((elapsed) {
  final seconds = elapsed.inMilliseconds / 1000.0;
});
```

---

## 6. 什么时候直接用 Ticker

通常不直接用 Ticker，优先级是：

```text
简单过渡：AnimatedContainer / AnimatedOpacity
可控动画：AnimationController
极底层每帧驱动：Ticker
```

直接用 Ticker 的场景：

```text
自定义物理模拟
游戏循环
手写 Canvas 动画
持续传感器/时间驱动效果
不适合用 Tween 描述的动画
```

---

## 7. CustomPainter 场景

如果 Web 中是：

```text
requestAnimationFrame + canvas
```

Flutter 中可能是：

```text
Ticker/AnimationController + CustomPainter
```

例如：

```dart
AnimatedBuilder(
  animation: controller,
  builder: (context, child) {
    return CustomPaint(
      painter: MyPainter(controller.value),
    );
  },
)
```

---

一句话理解：

```text
requestAnimationFrame 是浏览器的逐帧回调；
Ticker 是 Flutter 的逐帧回调。
实际开发中，Flutter 多数动画不会直接操作 Ticker，
而是通过 AnimationController 间接使用它。
```
