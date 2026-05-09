---
title: Error Boundary
date: 2026-05-09
tags:
  - flutter
  - app
  - web
---

# Error Boundary vs Flutter `ErrorWidget` / Zone

React 里 Error Boundary 用来捕获组件树中的渲染错误，避免整个应用白屏。

Flutter 中没有完全同名机制，常见对应是：

```dart
ErrorWidget
FlutterError.onError
runZonedGuarded
PlatformDispatcher.instance.onError
```

可以这样映射：

| React Error Boundary          | Flutter                               |
| ----------------------------- | ------------------------------------- |
| Error Boundary                | `ErrorWidget.builder`                 |
| render error fallback         | ErrorWidget fallback UI               |
| component tree error          | Flutter framework error               |
| global error handler          | `FlutterError.onError`                |
| async uncaught error          | `runZonedGuarded`                     |
| platform-level uncaught error | `PlatformDispatcher.instance.onError` |
| error reporting               | Sentry / Crashlytics / custom logger  |
| fallback UI                   | Error page / ErrorView                |

---

## 1. React Error Boundary

React：

```tsx
<ErrorBoundary fallback={<ErrorView />}>
  <ProductPage />
</ErrorBoundary>
```

它主要捕获：

```text
render 阶段错误
生命周期错误
子组件树错误
```

但通常不捕获：

```text
事件回调里的 async error
Promise rejection
setTimeout 里的错误
服务端错误
```

---

## 2. Flutter ErrorWidget

Flutter 中，如果 Widget build/layout/paint 阶段出错，框架会显示一个错误 Widget。

开发环境里常见红色错误页：

```text
A RenderFlex overflowed...
Exception caught by widgets library...
```

可以自定义：

```dart
ErrorWidget.builder = (FlutterErrorDetails details) {
  return const ErrorView(
    message: '页面渲染失败',
  );
};
```

它更接近：

```text
React Error Boundary 的 fallback UI
```

但它是全局 builder，不是像 React 那样天然按组件树局部包裹。

---

## 3. FlutterError.onError

Flutter 框架错误可以通过：

```dart
FlutterError.onError = (FlutterErrorDetails details) {
  FlutterError.presentError(details);
  // report error
};
```

适合处理：

```text
Widget build 错误
layout 错误
paint 错误
Flutter framework 捕获到的异常
```

通常会在这里接入：

```text
Crashlytics
Sentry
自定义日志系统
```

---

## 4. runZonedGuarded

异步未捕获错误可以用：

```dart
runZonedGuarded(() {
  runApp(const App());
}, (error, stackTrace) {
  // report uncaught async error
});
```

它类似给 Dart async zone 加一个全局错误边界。

适合捕获：

```text
未处理的 Future 错误
Timer 中抛出的错误
异步任务中的 uncaught error
```

---

## 5. PlatformDispatcher.instance.onError

还可以处理平台分发层面的未捕获错误：

```dart
PlatformDispatcher.instance.onError = (error, stackTrace) {
  // report error
  return true;
};
```

常和 `runZonedGuarded`、`FlutterError.onError` 一起配置，形成全局错误上报链路。

---

## 6. UI 错误态不是 Error Boundary

接口失败、空数据、权限不足这类不是框架异常，不应该依赖 `ErrorWidget`。

它们应该由业务状态渲染：

```dart
switch (state) {
  case AsyncLoading():
    return const LoadingView();
  case AsyncError(:final error):
    return ErrorView(error: error);
  case AsyncData(:final value):
    return Content(value);
}
```

也就是说：

```text
ErrorWidget 处理“程序异常”；
ErrorView 处理“业务错误状态”。
```

---

一句话理解：

```text
React Error Boundary 用组件边界捕获渲染错误并显示 fallback；
Flutter 用 ErrorWidget.builder 定制渲染异常 UI，
用 FlutterError.onError、runZonedGuarded 和 PlatformDispatcher.onError 做全局错误捕获与上报。
业务接口错误仍应通过 AsyncValue/ErrorView 正常渲染。
```
