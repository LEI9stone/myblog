---
title: Transition
date: 2026-05-07
tags:
  - flutter
  - app
  - web
---

# CSS Transition vs `AnimatedContainer` / `AnimatedOpacity`

Web 里用 CSS Transition 给属性变化加过渡：

```css
.card {
  transition:
    opacity 200ms ease,
    transform 200ms ease;
}
```

Flutter 里常用隐式动画 Widget：

```dart
AnimatedContainer
AnimatedOpacity
AnimatedPadding
AnimatedAlign
AnimatedScale
AnimatedSlide
```

它们会在参数变化时自动补间动画。

可以这样映射：

| CSS Transition                         | Flutter                    |
| -------------------------------------- | -------------------------- |
| `transition`                           | implicit animation widgets |
| `opacity` transition                   | `AnimatedOpacity`          |
| `width/height/color/radius` transition | `AnimatedContainer`        |
| `padding` transition                   | `AnimatedPadding`          |
| `align` transition                     | `AnimatedAlign`            |
| `transform: scale`                     | `AnimatedScale`            |
| `transform: translate`                 | `AnimatedSlide`            |
| `duration`                             | `duration`                 |
| `ease`                                 | `curve`                    |
| state class change                     | state change + rebuild     |

---

## 1. CSS Transition 心智

Web：

```css
.card {
  opacity: 0;
  transition: opacity 200ms ease;
}

.card.active {
  opacity: 1;
}
```

React：

```tsx
<div className={active ? 'card active' : 'card'} />
```

核心是：

```text
状态改变 class；
CSS 负责属性过渡。
```

---

## 2. Flutter 隐式动画

Flutter：

```dart
AnimatedOpacity(
  opacity: active ? 1 : 0,
  duration: const Duration(milliseconds: 200),
  curve: Curves.ease,
  child: child,
)
```

核心是：

```text
状态改变 Widget 参数；
AnimatedOpacity 自动在旧值和新值之间过渡。
```

---

## 3. AnimatedContainer

适合多个视觉属性一起过渡：

```dart
AnimatedContainer(
  duration: const Duration(milliseconds: 200),
  curve: Curves.ease,
  width: active ? 120 : 80,
  height: active ? 48 : 40,
  padding: EdgeInsets.all(active ? 16 : 8),
  decoration: BoxDecoration(
    color: active ? Colors.black : Colors.white,
    borderRadius: BorderRadius.circular(active ? 16 : 8),
  ),
  child: child,
)
```

类似 Web：

```css
.card {
  transition:
    width 200ms ease,
    height 200ms ease,
    padding 200ms ease,
    background-color 200ms ease,
    border-radius 200ms ease;
}
```

---

## 4. 状态变化驱动动画

React：

```tsx
setActive(true);
```

Flutter：

```dart
setState(() {
  active = true;
});
```

或 Riverpod 状态变化。

只要 `AnimatedContainer` / `AnimatedOpacity` 的参数变了，它就会自动动画到新值。

---

## 5. duration 和 curve

Web：

```css
transition: opacity 200ms ease-in-out;
```

Flutter：

```dart
AnimatedOpacity(
  opacity: visible ? 1 : 0,
  duration: const Duration(milliseconds: 200),
  curve: Curves.easeInOut,
  child: child,
)
```

常见曲线：

```dart
Curves.ease
Curves.easeIn
Curves.easeOut
Curves.easeInOut
Curves.linear
```

---

## 6. 常见隐式动画 Widget

| 需求                   | Flutter              |
| ---------------------- | -------------------- |
| 透明度                 | `AnimatedOpacity`    |
| 尺寸、颜色、圆角、边距 | `AnimatedContainer`  |
| 内边距                 | `AnimatedPadding`    |
| 对齐位置               | `AnimatedAlign`      |
| 缩放                   | `AnimatedScale`      |
| 平移                   | `AnimatedSlide`      |
| 旋转                   | `AnimatedRotation`   |
| 切换 child             | `AnimatedSwitcher`   |
| 位置变化               | `AnimatedPositioned` |

---

## 7. 什么时候不用隐式动画

CSS Transition 适合简单属性变化。Flutter 隐式动画也一样。

如果动画需要：

```text
手动控制进度
暂停/恢复
循环播放
多个动画精确编排
根据手势拖动
监听动画状态
```

就应该用：

```dart
AnimationController
Tween
AnimatedBuilder
```

---

一句话理解：

```text
CSS Transition 是属性变化时由 CSS 自动补间；
Flutter 的 AnimatedContainer、AnimatedOpacity 等隐式动画 Widget，
是在 Widget 参数变化时自动从旧值过渡到新值。
```
