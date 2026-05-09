---
title: API Error
date: 2026-05-09
tags:
  - flutter
  - app
  - web
---

# API Error State vs `AsyncValue.error`

Web 里 API 请求失败后，通常会进入 error state：

```text
loading: false
error: someError
data: null
```

Flutter + Riverpod 中对应的是：

```dart
AsyncError
AsyncValue.error(...)
```

它是 `AsyncValue<T>` 的错误状态，用来驱动 UI 显示错误页、重试按钮或错误提示。

可以这样映射：

| Web API Error State | Riverpod                                      |
| ------------------- | --------------------------------------------- |
| `error`             | `AsyncError`                                  |
| `setError(error)`   | `state = AsyncValue.error(error, stackTrace)` |
| query error         | `AsyncValue<T>` error state                   |
| catch API error     | `AsyncValue.guard`                            |
| error UI            | `AsyncError` branch                           |
| retry               | `ref.invalidate` / notifier reload            |
| global toast        | `ref.listen` + SnackBar                       |
| error mapping       | Repository converts exception                 |

---

## 1. Web API Error State

React：

```tsx
try {
  setLoading(true);
  const data = await fetchProducts();
  setData(data);
} catch (error) {
  setError(error);
} finally {
  setLoading(false);
}
```

UI：

```tsx
if (error) return <ErrorView error={error} />;
```

---

## 2. AsyncValue.error

Riverpod：

```dart
state = AsyncValue.error(error, stackTrace);
```

通常出现在 `AsyncNotifier` 中：

```dart
Future<void> reload() async {
  state = const AsyncLoading();

  try {
    final data = await repository.fetchProducts();
    state = AsyncData(data);
  } catch (error, stackTrace) {
    state = AsyncValue.error(error, stackTrace);
  }
}
```

更简洁：

```dart
state = await AsyncValue.guard(() {
  return repository.fetchProducts();
});
```

`AsyncValue.guard` 会自动：

```text
成功 → AsyncData
失败 → AsyncError
```

---

## 3. UI 中处理错误

```dart
switch (products) {
  case AsyncLoading():
    return const LoadingView();

  case AsyncError(:final error):
    return ErrorView(
      error: error,
      onRetry: () {
        ref.invalidate(productsProvider);
      },
    );

  case AsyncData(:final value):
    return ProductList(products: value);
}
```

或：

```dart
products.when(
  loading: () => const LoadingView(),
  error: (error, stackTrace) {
    return ErrorView(error: error);
  },
  data: (value) {
    return ProductList(products: value);
  },
);
```

---

## 4. Repository 负责错误转换

不建议 UI 直接处理各种底层异常：

```text
DioException
SocketException
FormatException
TimeoutException
```

Repository 可以转换成业务异常：

```dart
try {
  final response = await dio.get('/products');
  return parseProducts(response.data);
} on DioException catch (error) {
  throw ApiException.fromDio(error);
} on FormatException catch (error) {
  throw const ApiException('数据解析失败');
}
```

UI 只处理：

```text
ApiException
AuthException
PermissionException
NetworkException
```

这类更业务化的错误。

---

## 5. 页面错误 vs Toast 错误

有些错误应该替换页面：

```text
首屏加载失败
详情不存在
无权限访问
```

有些错误更适合 toast/snackbar：

```text
刷新失败但已有旧数据
提交失败
点赞失败
加载更多失败
```

Riverpod 中可以用：

```dart
ref.listen(provider, (previous, next) {
  if (next case AsyncError(:final error)) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('$error')),
    );
  }
});
```

---

## 6. Empty 不是 Error

接口成功但没有数据：

```dart
case AsyncData(:final value) when value.isEmpty:
  return const EmptyState();
```

这不是 `AsyncError`。

常见状态应区分：

```text
Loading：请求中
Error：请求失败
Empty：请求成功但无数据
Data：请求成功且有数据
```

---

一句话理解：

```text
Web API error state 通常是 error 字段；
Riverpod 中对应 AsyncValue.error / AsyncError。
Repository 负责把底层异常转换成业务错误，
UI 根据 AsyncError 渲染错误态或触发重试。
```
