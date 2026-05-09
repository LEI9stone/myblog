---
title: localStorage
date: 2026-05-09
tags:
  - flutter
  - app
  - web
---

# `localStorage` vs `shared_preferences`

Web 里 `localStorage` 用来保存轻量键值数据。

Flutter 中对应最接近的是：

```dart
shared_preferences
```

它也适合保存轻量、本地、非敏感的键值配置。

可以这样映射：

| Web localStorage         | Flutter shared_preferences |
| ------------------------ | -------------------------- |
| `localStorage.setItem()` | `prefs.setString()`        |
| `localStorage.getItem()` | `prefs.getString()`        |
| `removeItem()`           | `prefs.remove()`           |
| `clear()`                | `prefs.clear()`            |
| string key-value         | typed key-value            |
| 持久化本地存储           | 持久化本地存储             |
| 非敏感配置               | 非敏感配置                 |
| 浏览器域名隔离           | App 沙盒隔离               |
| 同步 API                 | 异步初始化 + typed API     |

---

## 1. localStorage

Web：

```ts
localStorage.setItem('theme', 'dark');

const theme = localStorage.getItem('theme');

localStorage.removeItem('theme');
```

特点：

```text
简单键值存储
持久化
容量有限
只适合字符串
不适合敏感信息
```

---

## 2. shared_preferences

Flutter：

```dart
final prefs = await SharedPreferences.getInstance();

await prefs.setString('theme', 'dark');

final theme = prefs.getString('theme');

await prefs.remove('theme');
```

支持的常见类型：

```dart
setString
setInt
setDouble
setBool
setStringList
```

读取：

```dart
getString
getInt
getDouble
getBool
getStringList
```

---

## 3. 适合存什么

适合：

```text
主题模式
语言偏好
是否看过引导页
轻量配置
搜索历史
非敏感开关
上次选择的 tab/filter
```

不适合：

```text
access token
refresh token
密码
支付信息
大量结构化数据
复杂对象列表
离线数据库
```

敏感数据应使用：

```text
flutter_secure_storage
```

结构化数据应考虑：

```text
drift / sqlite
```

---

## 4. 和 localStorage 的差异

Web localStorage 值是字符串：

```ts
localStorage.setItem('count', String(1));
```

Flutter shared_preferences 有基础类型：

```dart
await prefs.setInt('count', 1);
final count = prefs.getInt('count');
```

但如果存复杂对象，仍然需要手动 JSON encode：

```dart
await prefs.setString(
  'user_settings',
  jsonEncode(settings.toJson()),
);
```

读取：

```dart
final raw = prefs.getString('user_settings');
final settings = raw == null
    ? null
    : UserSettings.fromJson(jsonDecode(raw) as Map<String, dynamic>);
```

---

## 5. 封装 Storage Service

不要在 UI 里到处直接写 key：

```dart
prefs.setString('theme', 'dark');
```

更推荐封装：

```dart
class PreferencesStorage {
  PreferencesStorage(this.prefs);

  final SharedPreferences prefs;

  static const _themeModeKey = 'theme_mode';

  Future<void> setThemeMode(String value) {
    return prefs.setString(_themeModeKey, value);
  }

  String? getThemeMode() {
    return prefs.getString(_themeModeKey);
  }
}
```

好处：

```text
key 集中管理
减少拼写错误
方便迁移
方便测试
避免 UI 依赖存储细节
```

---

## 6. Riverpod 注入

```dart
final sharedPreferencesProvider =
    Provider<SharedPreferences>((ref) {
  throw UnimplementedError();
});
```

App 初始化时覆盖：

```dart
final prefs = await SharedPreferences.getInstance();

runApp(
  ProviderScope(
    overrides: [
      sharedPreferencesProvider.overrideWithValue(prefs),
    ],
    child: const App(),
  ),
);
```

这样 repository/storage service 可以通过 provider 读取。

---

一句话理解：

```text
localStorage 是 Web 的轻量本地键值存储；
shared_preferences 是 Flutter 中最接近的方案。
它适合保存非敏感、轻量配置，
不适合 token、密码和大量结构化数据。
```
