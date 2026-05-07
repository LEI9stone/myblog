---
title: package.json vs pubspec.yaml
date: 2026-04-29
tags:
  - flutter
  - app
  - web
---

# `package.json` vs `pubspec.yaml`

`package.json` 是 Web/Node 项目的核心配置文件。

`pubspec.yaml` 是 Dart/Flutter 项目的核心配置文件。

可以这样映射：

| Web / Node                                           | Flutter / Dart                |
| ---------------------------------------------------- | ----------------------------- |
| `package.json`                                       | `pubspec.yaml`                |
| `package-lock.json` / `yarn.lock` / `pnpm-lock.yaml` | `pubspec.lock`                |
| npm / yarn / pnpm                                    | pub / flutter pub             |
| npm scripts                                          | Flutter/Dart CLI 命令         |
| dependencies                                         | dependencies                  |
| devDependencies                                      | dev_dependencies              |
| peerDependencies                                     | Flutter 中较少直接对应        |
| engines                                              | environment                   |
| name                                                 | name                          |
| version                                              | version                       |
| description                                          | description                   |
| private                                              | publish_to: "none"            |
| files                                                | assets / package include 规则 |
| workspaces                                           | Flutter monorepo / melos      |

典型 `package.json`：

```json
{
  "name": "web-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^19.0.0",
    "axios": "^1.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vite": "^6.0.0"
  }
}
```

典型 `pubspec.yaml`：

```yaml
name: flutter_app
description: A Flutter app
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'
  flutter: '>=3.0.0'

dependencies:
  flutter:
    sdk: flutter
  dio: ^5.0.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  build_runner: ^2.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/
```

几个关键映射：

### 1. 项目元信息

| `package.json`  | `pubspec.yaml`       |
| --------------- | -------------------- |
| `name`          | `name`               |
| `version`       | `version`            |
| `description`   | `description`        |
| `private: true` | `publish_to: "none"` |

Flutter 的版本号通常是：

```yaml
version: 1.0.0+1
```

可以理解为：

```text
1.0.0 = 对用户展示的版本号
+1 = 构建号
```

---

### 2. 依赖管理

Web 中：

```json
"dependencies": {
  "axios": "^1.6.0"
}
```

Flutter 中：

```yaml
dependencies:
  dio: ^5.0.0
```

对应关系：

```text
npm install axios
flutter pub add dio
```

开发依赖：

```text
npm install -D typescript
flutter pub add dev:build_runner
```

---

### 3. 脚本命令

`package.json` 里经常写：

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "test": "vitest",
  "lint": "eslint ."
}
```

Flutter 默认不通过 `pubspec.yaml` 定义脚本，而是直接使用 CLI：

```bash
flutter run
flutter build apk
flutter test
dart analyze
dart format .
```

所以这里不是一一对应，而是：

| Web              | Flutter                     |
| ---------------- | --------------------------- |
| `npm run dev`    | `flutter run`               |
| `npm run build`  | `flutter build apk/ios/web` |
| `npm run test`   | `flutter test`              |
| `npm run lint`   | `dart analyze`              |
| `npm run format` | `dart format .`             |

---

### 4. 运行环境约束

`package.json`：

```json
"engines": {
  "node": ">=20"
}
```

`pubspec.yaml`：

```yaml
environment:
  sdk: '>=3.11.4 <4.0.0'
  flutter: '>=3.41.0'
```

这里声明 Dart SDK 和 Flutter SDK 的版本要求。

---

### 5. 静态资源

Web 项目通常依赖：

```text
public/
src/assets/
```

Flutter 需要在 `pubspec.yaml` 显式声明资源：

```yaml
flutter:
  assets:
    - assets/icons/
    - assets/images/
```

否则代码里即使写了资源路径，也可能加载不到。

---

### 6. 平台与 Flutter 配置

`pubspec.yaml` 还有 Web 项目里没有的 Flutter 专属配置：

```yaml
flutter:
  uses-material-design: true
  assets:
    - assets/icons/
    - assets/images/
```

常见内容包括：

```text
Material 图标
图片资源
字体资源
插件资源
平台构建相关配置
```

一句话理解：

```text
package.json 管 Web/Node 项目的依赖、脚本和元信息；
pubspec.yaml 管 Flutter/Dart 项目的依赖、SDK、资源和 Flutter 配置。
```
