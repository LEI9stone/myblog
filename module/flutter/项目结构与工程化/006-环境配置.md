---
title: .env vs Flutter 环境配置
date: 2026-04-30
tags:
  - flutter
  - app
  - web
---

# `.env` vs Flutter 环境配置

Web 项目里常用 `.env` 管理环境变量，例如：

```text
.env.development
.env.production
.env.local
```

Flutter 也可以做环境配置，但它没有一个完全等价、官方统一的 `.env` 机制。Flutter 更常见的是用 `--dart-define`、flavor、配置文件或构建脚本组合实现。

可以这样映射：

| Web                | Flutter                                      |
| ------------------ | -------------------------------------------- |
| `.env`             | `--dart-define` / 配置 Dart 文件 / JSON 配置 |
| `.env.development` | dev flavor / dev define                      |
| `.env.production`  | prod flavor / prod define                    |
| `import.meta.env`  | `String.fromEnvironment()`                   |
| `process.env`      | `String.fromEnvironment()` / 构建注入        |
| Vite mode          | Flutter flavor / dart-define                 |
| build-time env     | compile-time environment declarations        |
| runtime config     | 本地配置文件 / 远程配置 / 存储               |

---

## 1. Web 的 `.env` 心智

Vite 中常见写法：

```env
VITE_API_BASE_URL=https://api.example.com
```

代码中读取：

```ts
const baseUrl = import.meta.env.VITE_API_BASE_URL;
```

Next.js 中常见写法：

```env
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

代码中读取：

```ts
process.env.NEXT_PUBLIC_API_BASE_URL;
```

核心特点是：

```text
构建工具读取 .env
把变量注入前端代码
前端代码通过 env API 访问
```

---

## 2. Flutter 的 `--dart-define`

Flutter 最接近 `.env` 的机制是：

```bash
flutter run --dart-define=API_BASE_URL=https://api.example.com
```

代码中读取：

```dart
const apiBaseUrl = String.fromEnvironment('API_BASE_URL');
```

也可以提供默认值：

```dart
const apiBaseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'https://dev-api.example.com',
);
```

对应关系：

| Web                            | Flutter                             |
| ------------------------------ | ----------------------------------- |
| `.env` 里的变量                | `--dart-define` 传入的变量          |
| `import.meta.env.VITE_API_URL` | `String.fromEnvironment('API_URL')` |
| 构建时注入                     | 编译时注入                          |
| 未定义时为空/undefined         | 未定义时默认空字符串或 defaultValue |

---

## 3. Flutter Flavor

如果 Web 里有：

```text
development
staging
production
```

Flutter 里通常会映射成：

```text
dev flavor
staging flavor
prod flavor
```

常见命令：

```bash
flutter run --flavor dev
flutter run --flavor staging
flutter run --flavor prod
```

也经常和 `--dart-define` 一起使用：

```bash
flutter run \
  --flavor dev \
  --dart-define=APP_ENV=dev \
  --dart-define=API_BASE_URL=https://dev-api.example.com
```

可以理解为：

```text
flavor 负责平台层环境；
dart-define 负责 Dart 代码里的环境变量。
```

---

## 4. 配置文件方式

Flutter 也可以用 Dart 文件维护环境配置：

```dart
class AppConfig {
  static const apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://dev-api.example.com',
  );
}
```

或者按环境拆文件：

```text
lib/core/config/
  app_config.dart
  app_config_dev.dart
  app_config_prod.dart
```

也可以使用 JSON：

```text
assets/config/dev.json
assets/config/prod.json
```

但 JSON 配置需要注意：

```text
assets 配置通常是运行时读取；
dart-define 是编译时注入。
```

---

## 5. 敏感信息不要放进前端环境变量

这一点和 Web 一样重要。

无论是：

```text
.env
--dart-define
assets/config.json
```

都不应该放真正的敏感密钥，例如：

```text
数据库密码
后端私钥
支付平台 secret
管理员 token
```

因为客户端应用最终都可能被反编译或抓包分析。

Flutter 中可以放：

```text
API base URL
APP_ENV
Sentry DSN
功能开关
公开的第三方 app id
```

不应该放：

```text
后端 secret
私有 API key
长期有效 token
```

---

## 6. 推荐实践

对 Web 开发者来说，最容易理解的 Flutter 环境配置方式是：

```text
用 --dart-define 管 Dart 层变量；
用 flavor 区分 dev/staging/prod 平台构建；
用 AppConfig 集中读取环境配置；
不要把敏感密钥写进客户端。
```

推荐结构：

```text
lib/
  core/
    config/
      app_config.dart
```

示例：

```dart
class AppConfig {
  static const appEnv = String.fromEnvironment(
    'APP_ENV',
    defaultValue: 'dev',
  );

  static const apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://dev-api.example.com',
  );

  static bool get isProd => appEnv == 'prod';
}
```

一句话理解：

```text
Web 用 .env 让构建工具注入变量；
Flutter 常用 --dart-define 让编译器注入变量，
再用 flavor 区分不同平台环境。
```
