---
title: sessionStorage
date: 2026-05-09
tags:
  - flutter
  - app
  - web
---

# `sessionStorage` vs Runtime State

Web 里的 `sessionStorage` 是会话级存储：同一个浏览器 tab 会话内持久，关闭 tab 后清除。

Flutter 没有完全等价的 `sessionStorage`。最接近的是：

```text
Runtime State
```

也就是 App 进程内存中的状态，例如：

```dart
StatefulWidget State
Riverpod Provider State
Repository memory cache
Singleton/Service memory state
```

可以这样映射：

| Web sessionStorage         | Flutter Runtime State            |
| -------------------------- | -------------------------------- |
| tab session storage        | app process memory state         |
| close tab clears           | app 被杀进程后丢失               |
| per-tab state              | per-app-instance state           |
| temporary persisted data   | in-memory provider/cache         |
| `sessionStorage.getItem()` | provider/repository memory field |
| refresh page may keep      | Flutter 热重启/进程重启会丢      |
| not secure for secrets     | memory state 也不等于安全存储    |

---

## 1. Web sessionStorage

Web：

```ts
sessionStorage.setItem('checkout_step', '2');
const step = sessionStorage.getItem('checkout_step');
```

特点：

```text
仅当前 tab 有效
刷新页面仍在
关闭 tab 清除
同源隔离
只存字符串
```

常用于：

```text
临时表单草稿
流程步骤
一次性页面状态
临时筛选条件
```

---

## 2. Flutter Runtime State

Flutter 中临时状态通常放内存：

```dart
class CheckoutState {
  const CheckoutState({
    required this.step,
  });

  final int step;
}
```

Riverpod：

```dart
final checkoutStepProvider = StateProvider<int>((ref) => 0);
```

或 Notifier：

```dart
class CheckoutNotifier extends Notifier<CheckoutState> {
  @override
  CheckoutState build() {
    return const CheckoutState(step: 0);
  }

  void setStep(int step) {
    state = CheckoutState(step: step);
  }
}
```

这类状态：

```text
App 运行时存在；
App 进程被杀后消失。
```

---

## 3. sessionStorage 和 Runtime State 的差异

最大差异：

```text
sessionStorage 刷新页面后仍保留；
Flutter Runtime State 在进程内保留，但 App 重启后丢失。
```

Flutter mobile 没有“刷新页面”这个浏览器行为，但有：

```text
App 进入后台
系统回收
冷启动
热启动
路由返回
```

如果状态只需要在 App 活着时保留，runtime state 足够。

如果 App 重启后也要保留，应使用：

```text
shared_preferences
drift
secure storage
```

---

## 4. 页面流程状态

Web：

```ts
sessionStorage.setItem('checkout_step', 'address');
```

Flutter：

```dart
final checkoutFlowProvider =
    NotifierProvider<CheckoutFlowNotifier, CheckoutFlowState>(
  CheckoutFlowNotifier.new,
);
```

或者如果只在页面内：

```dart
class CheckoutPageState extends State<CheckoutPage> {
  var step = CheckoutStep.address;
}
```

---

## 5. Repository Memory Cache

类似 session-level cache：

```dart
class ProductRepository {
  List<Product>? _memoryCache;

  Future<List<Product>> fetchProducts() async {
    if (_memoryCache != null) {
      return _memoryCache!;
    }

    final products = await remote.fetchProducts();
    _memoryCache = products;
    return products;
  }

  void clearCache() {
    _memoryCache = null;
  }
}
```

只要 repository 实例还活着，缓存就还在。

---

## 6. 什么时候用 Runtime State

适合：

```text
当前 App 会话内的筛选条件
页面临时状态
流程步骤
内存缓存
短期 token 状态镜像
未提交的 UI 状态
临时搜索关键词
```

不适合：

```text
需要 App 重启恢复的数据
用户偏好
登录 token 的唯一来源
离线数据
重要草稿
```

---

## 7. 如果需要“类似 sessionStorage 但可恢复”

可以用：

```text
shared_preferences + 清理策略
本地数据库临时表
启动时判断过期时间
登录退出时清理
```

例如存一个带过期时间的临时草稿：

```text
draft_value
draft_expire_at
```

启动时过期就清除。

---

一句话理解：

```text
sessionStorage 是 Web tab 会话级存储；
Flutter 没有直接等价物，通常用 Runtime State 表达 App 运行期临时状态。
如果需要 App 重启后仍保留，就应该使用 shared_preferences、drift 或其他持久化存储。
```
