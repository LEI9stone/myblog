---
title: 浏览器运行时 vs Flutter 渲染引擎
date: 2026-04-29
tags:
  - flutter
  - app
  - web
---

# 浏览器运行时 vs Flutter 渲染引擎

Web 应用运行在浏览器里。浏览器负责解析 HTML、CSS、JavaScript，并通过 DOM、CSSOM、布局引擎、绘制引擎把页面显示出来。

Flutter 应用不依赖浏览器的 DOM/CSS 渲染体系。Flutter 使用自己的渲染引擎，把 Widget 描述的界面直接绘制到屏幕上。

可以这样映射：

| Web                     | Flutter                            |
| ----------------------- | ---------------------------------- |
| 浏览器 Browser          | Flutter Engine                     |
| JavaScript Runtime      | Dart Runtime                       |
| DOM                     | Widget Tree / Element Tree         |
| CSSOM                   | Widget 参数 / Theme / RenderObject |
| 浏览器布局引擎          | Flutter Layout Pipeline            |
| 浏览器绘制引擎          | Flutter Paint / Skia / Impeller    |
| HTML/CSS/JS 共同驱动 UI | Dart + Widget 共同驱动 UI          |

核心区别是：

Web 开发时，你是在“告诉浏览器如何组织 DOM 和 CSS”，浏览器再决定怎么布局、绘制、合成。

Flutter 开发时，你是在“用 Dart 构建 Widget 树”，Flutter 自己完成布局、绘制和合成，不经过 DOM，也不使用 CSS。

所以 Web 开发者进入 Flutter 后，最重要的心智变化是：

```text
不是写 HTML + CSS 给浏览器渲染
而是写 Dart Widget 给 Flutter 引擎渲染
```

这也是为什么 Flutter 里没有真正的 `div`、`className`、CSS 选择器、DOM API。你不再操作页面节点，而是通过 Widget 组合声明 UI。
