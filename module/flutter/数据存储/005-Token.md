---
title: Token
date: 2026-05-09
tags:
  - flutter
  - app
  - web
---

# Token Storage vs `flutter_secure_storage`

Web 里 token 常被存到：

```text
localStorage
sessionStorage
cookie
memory
```

Flutter 里认证 token 更推荐存到：

```dart
flutter_secure_storage
```

它比 `shared_preferences` 更适合保存敏感信息。

可以这样映射：

| Web Token Storage      | Flutter                                                  |
| ---------------------- | -------------------------------------------------------- |
| localStorage token     | 不推荐；Flutter 对应别用 shared_preferences 存敏感 token |
| sessionStorage token   | Runtime memory state                                     |
| HttpOnly cookie        | 无完全等价；可用 secure storage + header                 |
| in-memory token        | Provider/Repository memory state                         |
| secure token storage   | `flutter_secure_storage`                                 |
| clear on logout        | `secureStorage.delete/deleteAll`                         |
| refresh token storage  | `flutter_secure_storage`                                 |
| token header injection | Dio auth interceptor                                     |

---

## 1. Web Token Storage

Web 中常见几种：

```text
localStorage：持久，但容易被 XSS 读取
sessionStorage：会话级，也能被 JS 读取
HttpOnly Cookie：JS 不能读，浏览器自动发送
memory：刷新后丢失，相对短期
```

不同方案安全模型不同。

---

## 2. Flutter secure storage

Flutter 中使用：

```yaml
flutter_secure_storage: ^x.x.x
```

写入：

```dart
const storage = FlutterSecureStorage();

await storage.write(
  key: 'access_token',
  value: accessToken,
);
```

读取：

```dart
final token = await storage.read(
  key: 'access_token',
);
```

删除：

```dart
await storage.delete(
  key: 'access_token',
);
```

清空：

```dart
await storage.deleteAll();
```

---

## 3. 为什么不用 shared_preferences 存 token

`shared_preferences` 适合：

```text
主题模式
语言
是否看过引导
轻量配置
```

不适合：

```text
access token
refresh token
密码
支付凭证
敏感用户信息
```

因为它不是为敏感数据安全存储设计的。

Token 更推荐：

```text
flutter_secure_storage
```

---

## 4. Access Token / Refresh Token

常见保存：

```dart
class TokenStorage {
  const TokenStorage(this.storage);

  final FlutterSecureStorage storage;

  static const _accessTokenKey = 'access_token';
  static const _refreshTokenKey = 'refresh_token';

  Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    await storage.write(key: _accessTokenKey, value: accessToken);
    await storage.write(key: _refreshTokenKey, value: refreshToken);
  }

  Future<String?> readAccessToken() {
    return storage.read(key: _accessTokenKey);
  }

  Future<String?> readRefreshToken() {
    return storage.read(key: _refreshTokenKey);
  }

  Future<void> clear() async {
    await storage.delete(key: _accessTokenKey);
    await storage.delete(key: _refreshTokenKey);
  }
}
```

---

## 5. 内存缓存

频繁请求时，不一定每次都从 secure storage 读 token。

可以组合：

```text
启动时从 secure storage 读取 token
放入 AuthState / memory cache
请求时从内存读
token 变化时同步写 secure storage
登出时同时清内存和 secure storage
```

这样兼顾：

```text
安全持久化
运行时读取效率
状态一致性
```

---

## 6. Dio Interceptor 中读取

```dart
dio.interceptors.add(
  InterceptorsWrapper(
    onRequest: (options, handler) async {
      final token = await tokenStorage.readAccessToken();

      if (token != null && token.isNotEmpty) {
        options.headers['Authorization'] = 'Bearer $token';
      }

      handler.next(options);
    },
  ),
);
```

更复杂项目会从 AuthState 或 TokenManager 读取，避免每个请求都访问持久化存储。

---

## 7. 登出清理

登出时要清理：

```text
access token
refresh token
auth state
用户信息缓存
可能的业务缓存
```

例如：

```dart
await tokenStorage.clear();
ref.invalidate(authProvider);
```

---

一句话理解：

```text
Web 里 token 可能放 localStorage、sessionStorage、cookie 或 memory；
Flutter 中认证 token 推荐放 flutter_secure_storage，
请求时由 Auth Interceptor 注入 Authorization header，
登出时清理 secure storage 和内存状态。
```
