---
title: DevTools
date: 2026-05-11
tags:
  - flutter
  - app
  - web
---

# Browser DevTools vs Flutter DevTools

Web 开发常用 Browser DevTools 调试 DOM、CSS、网络请求、性能、存储和控制台。

Flutter 对应的是 Flutter DevTools，用来调试 Widget Tree、布局、性能、内存、网络、日志和 Provider 状态等。

可以这样映射：

| Browser DevTools      | Flutter DevTools                       |
| --------------------- | -------------------------------------- |
| Elements              | Widget Inspector                       |
| Styles / Computed     | Widget properties / Layout Explorer    |
| Console               | Logging / Debug Console                |
| Network               | Network view / Dio logs                |
| Performance           | Performance view / Timeline            |
| Memory                | Memory view                            |
| Application / Storage | App storage 手动检查 / logs / DB tools |
| React DevTools        | Flutter Inspector / Riverpod tools     |
| Lighthouse            | Flutter performance profiling          |
| Source debugger       | Dart debugger                          |

---

## 1. Browser DevTools

Web 中常用：

```text
Elements：看 DOM 和 CSS
Console：看日志和执行 JS
Network：看请求
Performance：看渲染和 JS 执行
Application：看 localStorage、cookie、IndexedDB
Sources：断点调试
```

这些都围绕浏览器运行环境。

---

## 2. Flutter DevTools

Flutter DevTools 常用：

```text
Flutter Inspector
Performance
CPU Profiler
Memory
Network
Logging
Debugger
App Size
```

它围绕 Flutter App、Dart VM 和 Flutter 渲染管线。

---

## 3. Elements vs Widget Inspector

Web Elements：

```text
查看 DOM 节点
查看 CSS 样式
修改 class/style
```

Flutter Widget Inspector：

```text
查看 Widget Tree
查看 Widget 属性
定位对应源码
查看布局边界
分析 Row/Column/Stack 结构
```

Web 看的是：

```text
DOM Tree
```

Flutter 看的是：

```text
Widget / Element / RenderObject 相关信息
```

---

## 4. CSS 调试 vs Layout Explorer

Web CSS 调试：

```text
盒模型
computed style
flex/grid overlay
```

Flutter 中对应：

```text
Layout Explorer
constraints
size
padding
alignment
RenderFlex overflow
```

Flutter 调布局时重点看：

```text
父级 constraints
child size
Row/Column mainAxis/crossAxis
Expanded/Flexible
overflow 提示
```

---

## 5. Network

Browser DevTools Network 可以直接看 fetch/XHR。

Flutter DevTools 也有 Network view，但实际项目里还常配合：

```text
Dio LogInterceptor
代理抓包工具
Charles / Proxyman
后端日志
```

Dio 中：

```dart
dio.interceptors.add(LogInterceptor(...));
```

注意脱敏 token 和隐私数据。

---

## 6. Performance

Web Performance 看：

```text
JS 执行
layout
paint
recalculate style
long task
FPS
```

Flutter Performance 看：

```text
UI thread
Raster thread
Frame rendering time
Jank
Shader compilation
Rebuild cost
Paint cost
```

Flutter 重点是每帧是否超过预算：

```text
60fps ≈ 16.6ms/frame
120fps ≈ 8.3ms/frame
```

---

## 7. Storage 调试差异

Browser DevTools 可以直接看：

```text
localStorage
sessionStorage
cookies
IndexedDB
Cache Storage
```

Flutter 没有统一可视化 Storage 面板。通常通过：

```text
日志
数据库查看工具
测试代码
调试页面
平台文件查看
drift inspection 工具
```

来检查本地存储。

---

## 8. React DevTools vs Flutter/Riverpod

React DevTools：

```text
组件树
props
state
hooks
render profiler
```

Flutter Inspector：

```text
Widget tree
properties
layout
rebuild hints
```

如果用 Riverpod，也可以使用相关调试工具或日志观察 provider 状态变化。

---

一句话理解：

```text
Browser DevTools 面向浏览器、DOM、CSS 和 Web APIs；
Flutter DevTools 面向 Widget Tree、Dart VM、Flutter 渲染管线和 App 性能。
Web 调样式看 Elements/Computed，
Flutter 调布局看 Widget Inspector、Layout Explorer 和 constraints。
```
