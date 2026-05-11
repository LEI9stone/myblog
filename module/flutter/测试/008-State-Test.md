---
title: State Test
date: 2026-05-11
tags:
  - flutter
  - app
  - web
---

# State Test vs Provider / Notifier Test

Web 里的 State Test 通常测试 Redux reducer、Zustand store、Jotai atom、React hook 或业务状态机。

Flutter + Riverpod 中对应的是 Provider / Notifier Test，用 `ProviderContainer` 直接测试 provider 状态和 notifier 方法，不需要渲染 Widget。

可以这样映射：

| Web State Test     | Flutter / Riverpod                  |
| ------------------ | ----------------------------------- |
| Redux reducer test | Notifier state transition test      |
| Zustand store test | NotifierProvider test               |
| Jotai atom test    | Provider/StateProvider test         |
| React hook test    | Provider/Notifier test              |
| selector test      | computed Provider test              |
| async query test   | FutureProvider / AsyncNotifier test |
| mock service       | provider override                   |
| store container    | `ProviderContainer`                 |
| dispatch action    | notifier method call                |

---

## 1. Web State Test

Redux：

```ts
expect(reducer(initialState, addItem(item))).toEqual(nextState);
```

Zustand：

```ts
useStore.getState().add(item);
expect(useStore.getState().items).toHaveLength(1);
```

目标是测试：

```text
状态输入
操作
状态输出
```

---

## 2. Riverpod ProviderContainer

Riverpod 中可以不跑 UI，直接创建容器：

```dart
final container = ProviderContainer();

addTearDown(container.dispose);
```

读取 provider：

```dart
final value = container.read(countProvider);
```

调用 notifier：

```dart
container.read(cartProvider.notifier).add(product);
```

断言状态：

```dart
expect(container.read(cartProvider).items, hasLength(1));
```

---

## 3. Notifier Test

```dart
test('adds product to cart', () {
  final container = ProviderContainer();
  addTearDown(container.dispose);

  final notifier = container.read(cartProvider.notifier);

  notifier.add(fakeProduct);

  final state = container.read(cartProvider);

  expect(state.items, contains(fakeProduct));
});
```

这类似测试：

```text
Redux action/reducer
Zustand action
Jotai atom update
```

---

## 4. Provider Override

如果 notifier 依赖 repository：

```dart
final container = ProviderContainer(
  overrides: [
    productRepositoryProvider.overrideWithValue(fakeRepository),
  ],
);
```

这样测试不会请求真实接口。

---

## 5. FutureProvider Test

```dart
test('loads products', () async {
  final container = ProviderContainer(
    overrides: [
      productRepositoryProvider.overrideWithValue(fakeRepository),
    ],
  );

  addTearDown(container.dispose);

  final products = await container.read(productsProvider.future);

  expect(products, hasLength(1));
});
```

如果要看 `AsyncValue`：

```dart
final state = container.read(productsProvider);
expect(state, isA<AsyncLoading>());
```

然后等待：

```dart
await container.read(productsProvider.future);
```

---

## 6. AsyncNotifier Test

```dart
test('reload sets product list', () async {
  final container = ProviderContainer(
    overrides: [
      productRepositoryProvider.overrideWithValue(fakeRepository),
    ],
  );

  addTearDown(container.dispose);

  final notifier = container.read(productListProvider.notifier);

  await notifier.reload();

  final state = container.read(productListProvider);

  expect(state.hasValue, isTrue);
  expect(state.value, hasLength(1));
});
```

---

## 7. Computed Provider Test

```dart
test('computes cart total', () {
  final container = ProviderContainer();

  addTearDown(container.dispose);

  container.read(cartProvider.notifier).add(fakeItem);

  final total = container.read(cartTotalProvider);

  expect(total, fakeItem.price);
});
```

这类似测试 selector / derived state。

---

## 8. 什么时候测 Provider/Notifier

适合：

```text
业务状态变化
异步加载逻辑
分页逻辑
筛选/排序派生状态
提交成功/失败状态
Repository 调用后的状态结果
错误转换
缓存状态
```

不适合：

```text
文本是否显示
按钮是否可点
页面布局是否正确
```

这些用 Widget Test。

一句话理解：

```text
Web State Test 测 store/reducer/atom/hook 的状态逻辑；
Flutter/Riverpod 中用 ProviderContainer 测 Provider/Notifier。
它不需要渲染 UI，适合验证状态转换、异步数据、派生状态和业务动作。
```
