---
title: Build
date: 2026-05-11
tags:
  - flutter
  - app
  - web
---

# Web Build vs Flutter Build

Web Build 通常把 TypeScript/JavaScript、CSS、图片等资源打包成浏览器可部署的静态产物。

Flutter Build 则根据目标平台构建不同产物：

```text
Android APK / AAB
iOS app / IPA
Web build
macOS / Windows / Linux desktop
```

可以这样映射：

| Web Build            | Flutter Build                        |
| -------------------- | ------------------------------------ |
| `npm run build`      | `flutter build ...`                  |
| Vite/Webpack/Rollup  | Flutter tool + platform build system |
| `dist/`              | `build/`                             |
| JS/CSS/assets bundle | platform-specific app bundle         |
| environment mode     | flavor / dart-define                 |
| sourcemap            | debug symbols / source maps          |
| minification         | release optimization / obfuscation   |
| static hosting       | App Store / Play Store / Web hosting |
| CI build             | Flutter CI build                     |

---

## 1. Web Build

Web：

```bash
npm run build
```

常见输出：

```text
dist/
  index.html
  assets/
    main.xxx.js
    style.xxx.css
    logo.xxx.png
```

最终部署到：

```text
CDN
Nginx
Vercel
Netlify
S3
静态服务器
```

---

## 2. Flutter Build

Flutter 根据目标平台构建：

```bash
flutter build apk
flutter build appbundle
flutter build ios
flutter build ipa
flutter build web
flutter build macos
flutter build windows
flutter build linux
```

输出都在：

```text
build/
```

但每个平台产物不同。

---

## 3. Android

调试包：

```bash
flutter build apk --debug
```

发布 APK：

```bash
flutter build apk --release
```

应用商店更常用 AAB：

```bash
flutter build appbundle --release
```

产物大致在：

```text
build/app/outputs/flutter-apk/
build/app/outputs/bundle/release/
```

---

## 4. iOS

构建 iOS：

```bash
flutter build ios --release
```

构建 IPA：

```bash
flutter build ipa --release
```

iOS 构建还涉及：

```text
Xcode
CocoaPods
Provisioning Profile
Signing Certificate
Bundle ID
App Store Connect
```

这比普通 Web Build 多了平台签名和分发步骤。

---

## 5. Flutter Web

Flutter 也可以构建 Web：

```bash
flutter build web
```

输出：

```text
build/web/
```

可以像 Web 静态资源一样部署。

但 Flutter Web 和普通 React/Vite Web 不同：

```text
Flutter Web 是把 Flutter 渲染体系跑在浏览器里；
不是 HTML/CSS DOM 应用。
```

---

## 6. 环境变量

Web：

```bash
VITE_API_URL=... npm run build
```

Flutter：

```bash
flutter build apk \
  --dart-define=APP_ENV=prod \
  --dart-define=API_BASE_URL=https://api.example.com
```

如果区分平台环境，还可能用：

```bash
--flavor prod
```

---

## 7. Release 优化

Web Build 常见：

```text
minify
tree-shaking
code splitting
hash assets
source maps
```

Flutter Release Build 常见：

```text
tree shaking
AOT compilation
asset bundling
icon/font tree shaking
obfuscate
split debug info
platform signing
```

混淆：

```bash
flutter build apk \
  --release \
  --obfuscate \
  --split-debug-info=build/debug-info
```

---

## 8. CI 中的 Build

Web CI：

```bash
npm ci
npm run build
```

Flutter CI：

```bash
flutter pub get
dart analyze
flutter test
flutter build apk --release
```

或：

```bash
flutter build appbundle --release
flutter build ipa --release
```

---

一句话理解：

```text
Web Build 输出给浏览器运行的静态资源；
Flutter Build 根据目标平台输出原生应用包或 Web 产物。
Web 主要关注打包和部署，
Flutter 还要关注平台构建、签名、flavor、dart-define 和应用商店分发。
```
