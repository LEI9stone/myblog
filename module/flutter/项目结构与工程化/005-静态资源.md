---
title: src/ 目录 vs lib/ 目录
date: 2026-04-29
tags:
  - flutter
  - app
  - web
---

# 静态资源管理：public/assets vs Flutter assets

Web 项目通常有两类静态资源：

| Web           | 说明                                        |
| ------------- | ------------------------------------------- |
| `public/`     | 原样复制到构建产物，可通过 URL 直接访问     |
| `src/assets/` | 被构建工具处理，可 import、hash、压缩、打包 |

Flutter 也有静态资源，但它不走浏览器 URL 访问模型，而是通过 `pubspec.yaml` 声明后，由 Flutter 打包进应用。

可以这样映射：

| Web            | Flutter                    |
| -------------- | -------------------------- |
| `public/`      | `assets/` + `pubspec.yaml` |
| `src/assets/`  | `assets/` + `pubspec.yaml` |
| 图片资源       | `Image.asset()`            |
| SVG 资源       | `SvgPicture.asset()`       |
| 字体资源       | `fonts:` 配置              |
| JSON 文件      | `rootBundle.loadString()`  |
| URL 访问资源   | asset key 访问资源         |
| 构建时复制资源 | Flutter asset bundle       |

典型 Web：

```text
public/
  logo.png
  favicon.ico

src/
  assets/
    banner.png
    icons/search.svg
```

典型 Flutter：

```text
assets/
  images/
    banner.png
  icons/
    ic_search.svg
```

并且必须在 `pubspec.yaml` 里声明：

```yaml
flutter:
  assets:
    - assets/images/
    - assets/icons/
```

否则资源不会被打包进应用。

常见使用方式：

```dart
Image.asset('assets/images/banner.png')
```

SVG：

```dart
SvgPicture.asset('assets/icons/ic_search.svg')
```

JSON：

```dart
final json = await rootBundle.loadString('assets/data/config.json');
```

Web 和 Flutter 的关键差异：

| Web                                        | Flutter                        |
| ------------------------------------------ | ------------------------------ |
| `public/logo.png` 可用 `/logo.png` 访问    | asset 不能直接按浏览器路径访问 |
| 构建工具可自动处理 `import image from ...` | 需要在 `pubspec.yaml` 声明     |
| 浏览器缓存静态资源                         | App 内 asset bundle            |
| URL 路径是核心                             | asset key 是核心               |
| favicon/manifest 属于 Web 平台             | Android/iOS 图标由平台目录管理 |

在 Flutter 中，资源路径更像一个“资源 key”：

```text
assets/icons/ic_search.svg
```

它不是 Web 里的公共 URL，而是 Flutter asset bundle 里的资源标识。

还有一个常见差异：

```text
Flutter assets 的缩进非常重要。
```

例如：

```yaml
flutter:
  assets:
    - assets/icons/
```

如果缩进错误，资源可能不会生效。

在当前项目里已经有类似配置：

```yaml
flutter:
  assets:
    - assets/icons/
    - assets/images/
```

因此可以这样使用：

```dart
SvgPicture.asset('assets/icons/ic_search.svg')
Image.asset('assets/images/xxx.png')
```

一句话理解：

```text
Web 的 public/assets 更像“给浏览器访问或构建工具打包的文件”；
Flutter assets 更像“声明后打包进 App 的资源清单”，通过 asset key 在代码中读取。
```
