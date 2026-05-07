---
title: Animation
date: 2026-05-07
tags:
  - flutter
  - app
  - web
---

# CSS Animation vs `AnimationController`

Web 里用 CSS Animation 定义关键帧动画：

```css
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

Flutter 里更底层、更可控的动画通常用：

```dart
AnimationController
Tween
CurvedAnimation
AnimatedBuilder
```

可以这样映射：

| CSS Animation               | Flutter                                                |
| --------------------------- | ------------------------------------------------------ |
| `@keyframes`                | `Tween` / `TweenSequence` / 自定义插值                 |
| `animation-duration`        | `AnimationController.duration`                         |
| `animation-timing-function` | `Curve` / `CurvedAnimation`                            |
| `animation-delay`           | `Future.delayed` / controller timing                   |
| `animation-iteration-count` | `repeat()`                                             |
| `animation-direction`       | `reverse` / `repeat(reverse: true)`                    |
| `animation-fill-mode`       | controller value / status handling                     |
| `animation-play-state`      | `stop()` / `forward()` / `repeat()`                    |
| `transform` animation       | `Transform` / `RotationTransition` / `ScaleTransition` |
| opacity animation           | `FadeTransition`                                       |

---

## 1. CSS Animation 心智

Web：

```css
.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

核心是：

```text
定义 keyframes；
给元素绑定 animation；
浏览器按时间推进动画。
```

---

## 2. Flutter AnimationController 心智

Flutter：

```dart
class SpinnerState extends State<Spinner>
    with SingleTickerProviderStateMixin {
  late final AnimationController controller;

  @override
  void initState() {
    super.initState();

    controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 1),
    )..repeat();
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return RotationTransition(
      turns: controller,
      child: const Icon(Icons.refresh),
    );
  }
}
```

核心是：

```text
AnimationController 负责时间进度；
Widget 根据动画值绘制不同状态。
```

---

## 3. controller value

`AnimationController` 默认值范围是：

```text
0.0 → 1.0
```

可以理解为 CSS 动画进度：

```text
0% → 100%
```

例如：

```dart
controller.forward();
controller.reverse();
controller.repeat();
controller.stop();
```

---

## 4. Tween

CSS：

```css
from {
  opacity: 0;
}
to {
  opacity: 1;
}
```

Flutter：

```dart
final opacity = Tween<double>(
  begin: 0,
  end: 1,
).animate(controller);
```

使用：

```dart
FadeTransition(
  opacity: opacity,
  child: child,
)
```

颜色：

```dart
final color = ColorTween(
  begin: Colors.white,
  end: Colors.red,
).animate(controller);
```

---

## 5. Curve

CSS：

```css
animation-timing-function: ease-in-out;
```

Flutter：

```dart
final animation = CurvedAnimation(
  parent: controller,
  curve: Curves.easeInOut,
);
```

常用：

```dart
Curves.linear
Curves.ease
Curves.easeIn
Curves.easeOut
Curves.easeInOut
Curves.decelerate
```

---

## 6. 多阶段动画

CSS：

```css
@keyframes pulse {
  0% {
    scale: 1;
  }
  50% {
    scale: 1.1;
  }
  100% {
    scale: 1;
  }
}
```

Flutter：

```dart
final scale = TweenSequence<double>([
  TweenSequenceItem(
    tween: Tween(begin: 1, end: 1.1),
    weight: 50,
  ),
  TweenSequenceItem(
    tween: Tween(begin: 1.1, end: 1),
    weight: 50,
  ),
]).animate(controller);
```

使用：

```dart
ScaleTransition(
  scale: scale,
  child: child,
)
```

---

## 7. AnimatedBuilder

如果没有现成的 Transition Widget，可以用：

```dart
AnimatedBuilder(
  animation: controller,
  builder: (context, child) {
    return Transform.translate(
      offset: Offset(0, controller.value * 20),
      child: child,
    );
  },
  child: child,
)
```

这类似：

```text
每一帧根据动画进度重新计算样式。
```

---

## 8. 什么时候用 AnimationController

如果只是简单状态过渡，优先用：

```dart
AnimatedContainer
AnimatedOpacity
AnimatedSwitcher
```

如果需要这些能力，再用 `AnimationController`：

```text
循环动画
暂停/继续
手势驱动
多个动画编排
监听动画完成
精确控制进度
复杂 keyframe
```

---

一句话理解：

```text
CSS Animation 用 keyframes 声明动画并交给浏览器播放；
Flutter AnimationController 是一个可控的时间进度器，
配合 Tween、Curve 和 AnimatedBuilder/Transition Widget 驱动 UI 动画。
```
