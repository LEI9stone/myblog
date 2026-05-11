---
title: Testing Library
date: 2026-05-11
tags:
  - flutter
  - app
  - web
---

# React Testing Library vs Widget Test

React Testing Library 用用户视角测试 React 组件。

Flutter 中对应的是 Widget Test，通过 `testWidgets` 和 `WidgetTester` 构建 Widget、查找元素、触发交互、断言 UI。

可以这样映射：

| React Testing Library | Flutter Widget Test                |
| --------------------- | ---------------------------------- |
| `render()`            | `tester.pumpWidget()`              |
| `screen.getByText()`  | `find.text()`                      |
| `screen.getByRole()`  | `find.byType()` / semantics finder |
| `userEvent.click()`   | `tester.tap()`                     |
| `userEvent.type()`    | `tester.enterText()`               |
| `waitFor()`           | `pump()` / `pumpAndSettle()`       |
| `rerender()`          | 再次 `pumpWidget()`                |
| `cleanup()`           | test framework 自动清理            |
| component test        | widget test                        |
| accessibility query   | semantics test                     |

---

## 1. React Testing Library

React：

```tsx
render(<LoginButton />);

await user.click(screen.getByText('登录'));

expect(screen.getByText('欢迎')).toBeInTheDocument();
```

它强调：

```text
不要测试实现细节；
从用户能看到和操作的内容出发。
```

---

## 2. Flutter Widget Test

Flutter：

```dart
testWidgets('shows welcome after login', (tester) async {
  await tester.pumpWidget(
    const MaterialApp(
      home: LoginPage(),
    ),
  );

  await tester.tap(find.text('登录'));
  await tester.pump();

  expect(find.text('欢迎'), findsOneWidget);
});
```

核心工具是：

```dart
WidgetTester
```

它负责：

```text
构建 Widget
触发手势
输入文本
推进帧
等待动画
查找 Widget
断言 UI
```

---

## 3. render vs pumpWidget

React：

```tsx
render(<ProductCard product={product} />);
```

Flutter：

```dart
await tester.pumpWidget(
  MaterialApp(
    home: ProductCard(product: product),
  ),
);
```

如果 Widget 依赖 Theme、Navigator、MediaQuery，通常要包：

```dart
MaterialApp
Scaffold
ProviderScope
```

---

## 4. 查询元素

React Testing Library：

```ts
screen.getByText('Submit');
screen.queryByText('Error');
```

Flutter：

```dart
find.text('Submit')
find.text('Error')
```

断言：

```dart
expect(find.text('Submit'), findsOneWidget);
expect(find.text('Error'), findsNothing);
```

常见 Finder：

```dart
find.byType(ElevatedButton)
find.byIcon(Icons.search)
find.byKey(const ValueKey('submit_button'))
find.byWidgetPredicate(...)
```

---

## 5. 用户交互

点击：

```dart
await tester.tap(find.text('提交'));
await tester.pump();
```

输入：

```dart
await tester.enterText(
  find.byType(TextField),
  'keyword',
);
await tester.pump();
```

滚动：

```dart
await tester.drag(
  find.byType(ListView),
  const Offset(0, -300),
);
await tester.pump();
```

---

## 6. 等待异步和动画

React：

```ts
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

Flutter：

```dart
await tester.pump();
await tester.pumpAndSettle();
```

区别：

| Flutter           | 含义                        |
| ----------------- | --------------------------- |
| `pump()`          | 推进一帧                    |
| `pump(duration)`  | 推进指定时间                |
| `pumpAndSettle()` | 持续 pump 直到动画/任务稳定 |

注意：如果页面有无限动画，`pumpAndSettle()` 可能卡住或超时。

---

## 7. Mock / Provider Override

React：

```tsx
render(
  <QueryClientProvider client={testClient}>
    <ProductList />
  </QueryClientProvider>
);
```

Flutter + Riverpod：

```dart
await tester.pumpWidget(
  ProviderScope(
    overrides: [
      productRepositoryProvider.overrideWithValue(fakeRepository),
    ],
    child: const MaterialApp(
      home: ProductListPage(),
    ),
  ),
);
```

测试 UI 时优先替换 Repository/Provider，而不是请求真实网络。

---

## 8. 用户视角原则

React Testing Library 推荐：

```text
测用户看到什么、能点什么
```

Flutter Widget Test 也应该类似：

```text
优先 find.text / find.byIcon / find.byKey
少测私有 Widget 结构
少依赖过深的实现细节
```

但 Flutter 有时用 `find.byType` 很常见，尤其是测试组件存在数量。

一句话理解：

```text
React Testing Library 用 render/screen/userEvent 测 React 组件；
Flutter Widget Test 用 pumpWidget/find/tester.tap/enterText 测 Widget。
两者都应该优先从用户可见内容和交互行为出发，而不是绑定内部实现细节。
```
