---
title: src/ 目录 vs lib/ 目录
date: 2024-04-29
tags:
  - flutter
  - app
  - web
---

# `src/` 目录 vs `lib/` 目录

在 Web 项目里，`src/` 通常是前端应用源码目录。

在 Flutter 项目里，`lib/` 是 Dart 应用源码目录，也是主要业务代码所在位置。

可以这样映射：

| Web               | Flutter                                     |
| ----------------- | ------------------------------------------- |
| `src/`            | `lib/`                                      |
| `src/main.tsx`    | `lib/main.dart`                             |
| `src/App.tsx`     | `lib/app.dart`                              |
| `src/pages/`      | `lib/features/*/presentation/pages/`        |
| `src/components/` | `lib/core/widgets/` / `features/*/widgets/` |
| `src/hooks/`      | `lib/*/application/` / providers            |
| `src/store/`      | `lib/*/application/`                        |
| `src/services/`   | `lib/*/data/`                               |
| `src/types/`      | `lib/*/domain/` / models                    |
| `src/utils/`      | `lib/core/utils/`                           |
| `src/assets/`     | `assets/`                                   |

典型 Web：

```text
src/
  main.tsx
  App.tsx
  pages/
  components/
  hooks/
  store/
  services/
  types/
  utils/
  assets/
```

典型 Flutter：

```text
lib/
  main.dart
  app.dart
  core/
    router/
    theme/
    widgets/
    network/
    storage/
    utils/
  features/
    home/
      presentation/
        pages/
        widgets/
      application/
      domain/
      data/
```

核心区别是：

```text
src/ 是 Web 构建工具约定的源码目录；
lib/ 是 Dart/Flutter 包的正式源码目录。
```

在 Dart 生态里，`lib/` 有特殊意义：

```text
lib/ 下的代码可以被当前包内部使用；
如果是可发布 package，lib/ 下的公开文件也可以被其他 Dart 包 import。
```

Flutter App 虽然一般不作为库发布，但仍然遵循 Dart 包结构。

常见入口对应：

```text
Web:
src/main.tsx -> 挂载 App

Flutter:
lib/main.dart -> main() -> runApp()
```

Web 里：

```ts
import App from './App';
```

Flutter 里：

```dart
import 'app.dart';
```

如果跨目录引用，Dart 常见两种写法：

```dart
import 'package:rouzao_app/app.dart';
```

或：

```dart
import '../../core/widgets/product_card.dart';
```

大型 Flutter 项目通常更推荐稳定的 package import：

```dart
import 'package:rouzao_app/core/widgets/product_card.dart';
```

一句话理解：

```text
Web 的 src/ 是前端源码入口；
Flutter 的 lib/ 是 Dart 包源码入口；
业务代码、页面、组件、状态和数据层主要都放在 lib/。
```
