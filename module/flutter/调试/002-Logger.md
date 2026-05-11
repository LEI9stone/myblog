---
title: Log
date: 2026-05-11
tags:
  - flutter
  - app
  - web
---

# Console Log vs `debugPrint` / logger

Web 里常用：

```ts
console.log;
console.warn;
console.error;
```

Flutter/Dart 里常用：

```dart
debugPrint
print
dart:developer log
logging package
自定义 logger
```

可以这样映射：

| Web Console        | Flutter / Dart                               |
| ------------------ | -------------------------------------------- |
| `console.log`      | `debugPrint` / `print`                       |
| `console.warn`     | logger.warning / `developer.log`             |
| `console.error`    | logger.severe / `developer.log(error: ...)`  |
| structured logger  | logging package / custom logger              |
| browser console    | IDE debug console / Flutter DevTools Logging |
| production logging | Crashlytics / Sentry / remote logger         |
| dev-only log       | `kDebugMode` guard                           |

---

## 1. console.log

Web：

```ts
console.log('product', product);
```

Flutter：

```dart
debugPrint('product: $product');
```

`debugPrint` 比 `print` 更适合 Flutter，因为它会对长日志做节流，减少日志被截断或刷屏的问题。

---

## 2. print vs debugPrint

Dart：

```dart
print('hello');
```

Flutter：

```dart
debugPrint('hello');
```

一般建议：

```text
Flutter App 中调试优先用 debugPrint。
```

如果输出很长的 JSON，仍然建议截断或格式化，不要无限打印。

---

## 3. developer.log

```dart
import 'dart:developer' as developer;

developer.log(
  'fetch product failed',
  name: 'ProductRepository',
  error: error,
  stackTrace: stackTrace,
);
```

适合：

```text
带模块名
带错误对象
带 stackTrace
在 DevTools 中查看
```

---

## 4. logger / logging package

更正式的项目会封装 logger：

```dart
abstract class AppLogger {
  void debug(String message);
  void info(String message);
  void warning(String message);
  void error(
    String message, {
    Object? error,
    StackTrace? stackTrace,
  });
}
```

或使用：

```text
package:logging
```

分级：

```text
debug
info
warning
error/severe
```

---

## 5. 开发日志 vs 生产日志

开发环境可以：

```dart
if (kDebugMode) {
  debugPrint('response: $data');
}
```

生产环境应该：

```text
少打本地日志
只上报必要错误
脱敏敏感字段
避免影响性能
避免泄露隐私
```

不要打印：

```text
access token
refresh token
密码
手机号
地址
支付信息
完整接口响应
```

---

## 6. Dio 日志

Web 常在 axios interceptor 里 log request/response。

Dio：

```dart
if (kDebugMode) {
  dio.interceptors.add(
    LogInterceptor(
      requestBody: true,
      responseBody: true,
    ),
  );
}
```

生产环境要谨慎关闭或脱敏。

---

## 7. 错误上报

Web：

```ts
Sentry.captureException(error);
```

Flutter：

```text
Sentry
Firebase Crashlytics
自建上报
```

通常接在：

```text
FlutterError.onError
PlatformDispatcher.instance.onError
runZonedGuarded
Repository catch
```

---

一句话理解：

```text
Web console.log 对应 Flutter debugPrint；
更正式的日志用 developer.log、logging package 或自定义 logger。
调试日志只在开发环境输出，
生产错误应走 Crashlytics/Sentry 等上报系统，并注意敏感信息脱敏。
```
