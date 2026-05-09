---
title: Cookie
date: 2026-05-09
tags:
  - flutter
  - app
  - web
---

# Cookie vs Secure Storage / Headers

Web 里 Cookie 常用于保存会话标识，并由浏览器自动随请求发送。

Flutter App 里没有浏览器 Cookie 作为默认会话机制，常见做法是：

```text
把 token 存到 secure storage；
请求时通过 Authorization header 发送。
```

可以这样映射：

| Web Cookie           | Flutter                        |
| -------------------- | ------------------------------ |
| Cookie 存 session    | secure storage 存 token        |
| 浏览器自动带 Cookie  | Dio interceptor 自动加 header  |
| `Set-Cookie`         | 登录接口返回 token / cookie    |
| HttpOnly Cookie      | Flutter 端无法直接等价         |
| SameSite             | App 端通常不适用               |
| CSRF 防护            | Token header 场景通常不同      |
| cookie jar           | dio_cookie_manager / CookieJar |
| Authorization header | `Authorization: Bearer token`  |

---

## 1. Web Cookie

Web：

```http
Set-Cookie: session_id=abc; HttpOnly; Secure; SameSite=Lax
```

浏览器后续请求会自动带上：

```http
Cookie: session_id=abc
```

前端 JS 如果是 HttpOnly Cookie，不能读取它。

优点：

```text
浏览器自动管理
HttpOnly 可降低 XSS 窃取风险
适合传统 Web 会话
```

---

## 2. Flutter 常见 Token Header

Flutter 登录后拿到：

```json
{
  "access_token": "xxx",
  "refresh_token": "yyy"
}
```

保存：

```dart
await secureStorage.write(
  key: 'access_token',
  value: token,
);
```

请求时：

```http
Authorization: Bearer xxx
```

通常由 Dio interceptor 自动注入：

```dart
options.headers['Authorization'] = 'Bearer $token';
```

---

## 3. Secure Storage

Flutter 中敏感 token 通常用：

```text
flutter_secure_storage
```

而不是：

```text
shared_preferences
```

因为 `shared_preferences` 更适合非敏感配置。

Secure storage 通常基于平台安全能力：

```text
iOS Keychain
Android Keystore / encrypted storage
```

---

## 4. Cookie Jar 场景

如果后端强依赖 Cookie，也可以在 Flutter 中管理 Cookie：

```text
dio_cookie_manager
cookie_jar
```

这会让 Dio 像浏览器一样保存和发送 Cookie。

但移动 App 常见认证方案仍然是：

```text
Bearer Token + Authorization Header
```

---

## 5. HttpOnly Cookie 的差异

Web 的 HttpOnly Cookie 有个重要特点：

```text
前端 JS 不能读取；
浏览器自动发送。
```

Flutter App 中如果你把 token 存在 secure storage，App 代码需要读取它再放到 header。

所以它不是 HttpOnly Cookie 的完全等价物。

Flutter 的安全重点变成：

```text
安全存储 token
HTTPS
证书校验
token 过期和刷新
登出清理
避免日志泄露 token
```

---

## 6. CSRF 差异

Web Cookie 认证容易遇到 CSRF，因为浏览器会自动带 Cookie。

Token Header 认证通常要求 App 主动加 header，CSRF 风险模型不同。

但仍需要关注：

```text
XSS/日志泄露
抓包
token 过期
refresh token 保护
设备丢失
```

---

## 7. 推荐做法

Flutter App 常见认证链路：

```text
登录接口返回 access token / refresh token
→ secure storage 保存
→ Auth Interceptor 注入 Authorization header
→ 401 时 refresh token
→ refresh 失败清理 token
→ 跳登录
```

一句话理解：

```text
Web Cookie 是浏览器管理的会话机制；
Flutter App 通常不用浏览器 Cookie，
而是把 token 存到 secure storage，
再通过 Dio/Auth Interceptor 加到 Authorization header。
如果后端必须用 Cookie，可以用 CookieJar 管理。
```
