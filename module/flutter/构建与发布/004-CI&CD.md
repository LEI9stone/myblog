---
title: CI/CD
date: 2026-05-11
tags:
  - flutter
  - app
  - web
---

# CI/CD for Web vs CI/CD for Flutter

Web CI/CD 通常是：

```text
安装依赖 → lint/test/build → 部署静态资源到服务器/CDN
```

Flutter CI/CD 通常是：

```text
安装 Flutter SDK → pub get → analyze/test/build → 签名 → 上传 App Store / Play Store / 内测平台
```

可以这样映射：

| Web CI/CD       | Flutter CI/CD                                |
| --------------- | -------------------------------------------- |
| `npm ci`        | `flutter pub get`                            |
| ESLint          | `dart analyze` / `flutter analyze`           |
| Prettier check  | `dart format --set-exit-if-changed`          |
| Jest/Vitest     | `flutter test`                               |
| `npm run build` | `flutter build ...`                          |
| deploy `dist/`  | upload APK/AAB/IPA/Web build                 |
| env vars        | `--dart-define` / flavor                     |
| source maps     | debug symbols / split debug info             |
| CDN deploy      | App Store / Play Store / TestFlight          |
| preview deploy  | internal testing / Firebase App Distribution |

---

## 1. Web CI/CD

典型 Web pipeline：

```bash
npm ci
npm run lint
npm test
npm run build
```

部署：

```text
dist/ → CDN / 静态服务器 / Vercel / Netlify
```

特点：

```text
构建快
部署快
回滚快
无需应用商店审核
用户刷新即可拿到新版本
```

---

## 2. Flutter CI

Flutter 基础检查通常是：

```bash
flutter pub get
dart format --set-exit-if-changed .
dart analyze
flutter test
```

构建 Android：

```bash
flutter build appbundle --release
```

构建 iOS：

```bash
flutter build ipa --release
```

如果是 Flutter Web：

```bash
flutter build web
```

---

## 3. Flutter CD

Android 发布可能是：

```text
生成 AAB
签名
上传 Google Play
发布 internal/closed/open/production track
```

iOS 发布可能是：

```text
生成 IPA
签名
上传 App Store Connect
TestFlight
提交审核
发布
```

常用工具：

```text
fastlane
Codemagic
GitHub Actions
Bitrise
Firebase App Distribution
TestFlight
Play Console
```

---

## 4. 签名差异

Web 通常不用处理平台签名。

Flutter 移动端必须处理：

```text
Android keystore
iOS certificate
Provisioning profile
Bundle ID
App ID
Team ID
```

这些通常通过 CI secrets 管理。

不要把签名私钥、证书密码直接提交到仓库。

---

## 5. 环境配置

Web：

```bash
VITE_API_URL=https://api.example.com npm run build
```

Flutter：

```bash
flutter build appbundle \
  --flavor prod \
  --dart-define=APP_ENV=prod \
  --dart-define=API_BASE_URL=https://api.example.com
```

常见环境：

```text
dev
staging
prod
```

Flutter 中经常用：

```text
flavor + dart-define
```

组合区分。

---

## 6. 符号文件 / Source Map

Web：

```text
上传 sourcemap 到 Sentry
```

Flutter：

```text
上传 debug symbols / split-debug-info / dSYM / mapping files
```

如果开启：

```bash
--obfuscate --split-debug-info=...
```

要保存并上传对应版本符号文件，否则线上 crash 难定位。

---

## 7. 推荐 Flutter Pipeline

基础质量门禁：

```bash
flutter pub get
dart format --set-exit-if-changed .
dart analyze
flutter test
```

Android build：

```bash
flutter build appbundle --release --flavor prod --dart-define=APP_ENV=prod
```

iOS build：

```bash
flutter build ipa --release --flavor prod --dart-define=APP_ENV=prod
```

发布前还应处理：

```text
版本号
签名
环境变量
符号文件
release notes
上传渠道
测试账号
```

---

一句话理解：

```text
Web CI/CD 主要是构建静态资源并部署；
Flutter CI/CD 除了 analyze/test/build，
还要处理 Android/iOS 签名、flavor、dart-define、应用商店上传、TestFlight/内测分发和符号文件归档。
```
