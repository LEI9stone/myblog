---
title: Flutter Plugins
date: 2026-05-11
tags:
  - flutter
  - app
  - web
---

# Web APIs vs Flutter Plugins

Web 里浏览器提供 Web APIs：

```text
fetch
localStorage
Geolocation
Camera
Clipboard
Notification
WebSocket
Canvas
IndexedDB
```

Flutter 里没有浏览器 API。对应能力通常通过：

```text
Flutter framework
Dart libraries
Flutter plugins
Platform Channels
```

实现。

可以这样映射：

| Web APIs              | Flutter                               |
| --------------------- | ------------------------------------- |
| `fetch`               | `dio` / `http`                        |
| `localStorage`        | `shared_preferences`                  |
| `IndexedDB`           | `drift` / SQLite                      |
| `WebSocket`           | `web_socket_channel` / Dart WebSocket |
| `Geolocation API`     | `geolocator`                          |
| `MediaDevices camera` | `camera` / `image_picker`             |
| `Clipboard API`       | `Clipboard`                           |
| `Notification API`    | `flutter_local_notifications` / FCM   |
| `Canvas API`          | `CustomPainter` / Canvas              |
| `File API`            | `file_picker` / `path_provider`       |
| `Web Workers`         | `Isolate` / `compute`                 |
| `Service Worker`      | 无直接等价，靠 App 架构/后台能力      |

---

## 1. Web APIs 的心智

Web：

```ts
navigator.geolocation.getCurrentPosition(...)
localStorage.setItem(...)
fetch('/api/products')
navigator.clipboard.writeText(...)
```

这些 API 来自浏览器宿主环境。

前端代码运行在浏览器里，所以可以直接调用。

---

## 2. Flutter 没有浏览器宿主

Flutter App 运行在：

```text
Dart Runtime
Flutter Framework
Flutter Engine
iOS/Android 原生宿主
```

所以没有：

```text
window
document
localStorage
navigator.geolocation
DOM
CSSOM
```

对应能力要用 Flutter/Dart 生态里的库或插件。

---

## 3. Flutter Plugin

Flutter plugin 是连接 Dart 和平台原生能力的包。

例如：

```text
image_picker
camera
geolocator
permission_handler
flutter_secure_storage
shared_preferences
firebase_messaging
```

Dart 代码调用插件，插件底层通过 iOS/Android 原生 API 实现能力。

---

## 4. Platform Channel

如果现成插件不够，可以通过 Platform Channel 自己接原生能力：

```text
Dart ↔ MethodChannel ↔ Android Kotlin/Java
Dart ↔ MethodChannel ↔ iOS Swift/Objective-C
```

常见于：

```text
公司内部 SDK
特殊硬件能力
定制原生模块
第三方平台 SDK
```

---

## 5. 常见映射

网络：

```text
fetch/axios → dio/http
```

存储：

```text
localStorage → shared_preferences
IndexedDB → drift/sqlite
Cookie/Token → flutter_secure_storage + headers
```

设备能力：

```text
Geolocation → geolocator
Camera → camera/image_picker
Clipboard → Clipboard
Notification → FCM/local_notifications
File picker → file_picker
```

绘制：

```text
Canvas → CustomPainter
WebGL/Three.js → Flutter 3D 插件或原生/自绘方案
```

---

## 6. 插件使用要注意

使用 Flutter plugin 时通常要关注：

```text
平台支持 iOS/Android/Web/桌面
权限配置
最低系统版本
原生配置文件
初始化时机
错误处理
CI 构建
App Store/Play Store 审核要求
```

这比 Web API 多了平台工程复杂度。

---

## 7. Web API 与 Flutter Web

如果 Flutter target 是 Web，部分插件会有 Web 实现。

但 Flutter Web 仍不等同于普通 Web App：

```text
你通常仍通过 Flutter plugin API 调能力，
而不是直接写 DOM/Web API。
```

如果必须调用浏览器 API，需要针对 Web 平台单独处理。

---

一句话理解：

```text
Web APIs 是浏览器直接提供给 JavaScript 的能力；
Flutter 没有浏览器 API，
对应能力通常通过 Dart package、Flutter plugin 或 Platform Channel 实现。
从 Web 迁移到 Flutter 时，要把“调用 Web API”的心智换成“选择插件并配置平台权限”。
```
