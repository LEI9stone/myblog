---
title: viewport
date: 2026-05-07
tags:
  - flutter
  - app
  - web
---

# viewport vs `MediaQuery` / `SafeArea`

Web 里的 viewport 是浏览器中页面可见区域。

Flutter 里没有浏览器 viewport 心智，常用：

```dart
MediaQuery
SafeArea
Scaffold
```

来理解屏幕尺寸、系统状态栏、底部手势区、键盘遮挡等可用空间。

可以这样映射：

| Web                      | Flutter                                      |
| ------------------------ | -------------------------------------------- |
| viewport                 | screen/window size                           |
| `window.innerWidth`      | `MediaQuery.sizeOf(context).width`           |
| `window.innerHeight`     | `MediaQuery.sizeOf(context).height`          |
| `100vw`                  | `MediaQuery.sizeOf(context).width`           |
| `100vh`                  | `MediaQuery.sizeOf(context).height`          |
| safe-area inset          | `MediaQuery.paddingOf(context)` / `SafeArea` |
| mobile browser toolbar   | 系统状态栏/导航栏/手势区域                   |
| keyboard viewport resize | `MediaQuery.viewInsetsOf(context)`           |
| fixed full screen layout | `Scaffold` / `SizedBox.expand`               |

---

## 1. Web viewport

Web：

```css
.hero {
  width: 100vw;
  height: 100vh;
}
```

或者：

```ts
const width = window.innerWidth;
const height = window.innerHeight;
```

核心是：

```text
当前浏览器窗口中页面可见区域有多大。
```

---

## 2. Flutter MediaQuery

Flutter 中读取屏幕尺寸：

```dart
final size = MediaQuery.sizeOf(context);
final width = size.width;
final height = size.height;
```

类似 Web 的：

```text
window.innerWidth / window.innerHeight
```

例如：

```dart
SizedBox(
  width: MediaQuery.sizeOf(context).width,
  height: MediaQuery.sizeOf(context).height,
  child: PageContent(),
)
```

不过 Flutter 页面里通常不需要频繁手动读取全屏尺寸，更多时候让父级约束自然传递。

---

## 3. SafeArea

移动端屏幕有状态栏、刘海、底部手势条。

Web 里可能写：

```css
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
```

Flutter 里通常写：

```dart
SafeArea(
  child: PageContent(),
)
```

`SafeArea` 会自动避开系统不可安全显示的区域。

也可以手动读取：

```dart
final padding = MediaQuery.paddingOf(context);
```

常见字段：

```dart
padding.top
padding.bottom
padding.left
padding.right
```

---

## 4. 键盘遮挡

Web 移动端里，软键盘会影响 viewport。

Flutter 中可以读取：

```dart
final bottomInset = MediaQuery.viewInsetsOf(context).bottom;
```

键盘弹起时：

```text
viewInsets.bottom 会变大。
```

常见表单页：

```dart
Scaffold(
  resizeToAvoidBottomInset: true,
  body: FormPage(),
)
```

`Scaffold` 默认会帮助 body 避开键盘。

---

## 5. `100vh` 的 Flutter 映射

Web：

```css
height: 100vh;
```

Flutter 可以写：

```dart
SizedBox(
  height: MediaQuery.sizeOf(context).height,
  child: child,
)
```

但很多情况下更推荐：

```dart
SizedBox.expand(
  child: child,
)
```

或者直接：

```dart
Scaffold(
  body: child,
)
```

因为 Flutter 的父级约束通常已经给了页面可用空间。

---

## 6. Page 可用区域 vs 屏幕总尺寸

要区分：

```text
屏幕总尺寸
安全区域内尺寸
Scaffold body 可用尺寸
某个组件父级给的尺寸
```

对应工具：

| 你想知道什么           | 用什么                             |
| ---------------------- | ---------------------------------- |
| 整个屏幕大小           | `MediaQuery.sizeOf(context)`       |
| 状态栏/刘海/底部手势区 | `MediaQuery.paddingOf(context)`    |
| 键盘遮挡区域           | `MediaQuery.viewInsetsOf(context)` |
| 安全显示区域           | `SafeArea`                         |
| 当前组件可用空间       | `LayoutBuilder`                    |
| 页面标准结构           | `Scaffold`                         |

---

一句话理解：

```text
Web viewport 是浏览器可见区域；
Flutter 里用 MediaQuery 读取屏幕和系统环境，
用 SafeArea 避开不可安全显示区域，
用 LayoutBuilder 理解当前组件真正拿到的布局空间。
```
