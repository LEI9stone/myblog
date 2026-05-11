---
title: Source Map
date: 2026-05-11
tags:
  - flutter
  - app
  - web
---

# Source Map vs Dart Debug Symbols

Web 里 Source Map 用来把压缩、转译、打包后的 JavaScript 映射回 TypeScript/源码。

Dart/Flutter 中对应的是调试符号、source information、stack trace 映射，以及 release 构建中的 split debug info / symbol files。

可以这样映射：

| Web Source Map             | Flutter / Dart                   |
| -------------------------- | -------------------------------- |
| `.map` file                | debug symbols / split debug info |
| minified JS stack          | Dart obfuscated stack trace      |
| TS 源码映射                | Dart source stack trace          |
| bundle debug               | Dart VM debug info               |
| production error mapping   | symbolication / deobfuscation    |
| upload sourcemap to Sentry | upload Flutter symbols           |
| source path mapping        | package/source URI               |
| obfuscation                | `--obfuscate`                    |
| hidden source map          | split debug info files           |

---

## 1. Web Source Map

Web 生产构建后，代码可能变成：

```js
function a(b) {
  return b + 1;
}
```

错误堆栈可能指向：

```text
main.8f3a.js:1:20394
```

Source Map 可以映射回：

```text
src/features/product/ProductPage.tsx:42
```

常见做法：

```text
生成 source map
上传到 Sentry/监控平台
线上不公开 source map 或受控访问
```

---

## 2. Dart Debug Stack Trace

Flutter debug/profile 开发时，Dart stack trace 通常能直接指向源码：

```text
package:app/features/product/product_page.dart:42
```

因为 debug 模式保留了足够调试信息。

---

## 3. Release + Obfuscation

Flutter release 构建可以开启混淆：

```bash
flutter build apk \
  --obfuscate \
  --split-debug-info=build/debug-info
```

这会让 release 代码符号被混淆，同时把调试符号输出到指定目录。

可以类比：

```text
生产 JS 被 minify/obfuscate；
source map 单独保存。
```

---

## 4. split-debug-info

```bash
--split-debug-info=path/to/symbols
```

作用：

```text
把调试信息分离出来；
用于后续还原混淆后的 stack trace；
减少包内可读符号信息。
```

生成的 symbol files 要妥善保存，并和对应构建版本匹配。

---

## 5. Crash 上报还原

Web：

```text
上传 source map 到 Sentry
线上错误堆栈还原成 TS 源码行号
```

Flutter：

```text
上传 Flutter debug symbols / mapping files
线上 crash 堆栈 symbolicate/deobfuscate
```

如果用 Sentry、Crashlytics 等，需要按平台文档上传对应符号文件。

---

## 6. 不要丢符号文件

如果 release 构建使用：

```bash
--obfuscate --split-debug-info
```

一定要保存对应版本的 debug info。

否则线上 crash 堆栈可能只能看到混淆后的符号，很难定位问题。

建议按版本归档：

```text
symbols/
  1.0.0+100/
  1.0.1+101/
```

---

## 7. Flutter Web 的 Source Map

如果构建 Flutter Web，也会涉及 Web 端 source map / dart2js 输出映射。

但移动端 Flutter 的主线调试心智更多是：

```text
Dart stack trace
native crash symbols
split debug info
obfuscation mapping
```

---

一句话理解：

```text
Web Source Map 把压缩后的 JS 错误映射回 TS/源码；
Flutter/Dart 中对应的是 debug symbols、split-debug-info 和 crash symbolication。
如果 release 开启 obfuscate，必须保存并上传对应版本的符号文件，否则线上堆栈很难还原。
```
