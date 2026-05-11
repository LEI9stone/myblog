---
title: Component Test
date: 2026-05-11
tags:
  - flutter
  - app
  - web
---

# Component Test vs Widget Test

Web 里的 Component Test 用来测试单个组件或一小组组件的渲染和交互。

Flutter 中对应的是 Widget Test，用 `testWidgets`、`WidgetTester`、`find`、`expect` 测 Widget 的 UI 和行为。

可以这样映射：

| Web Component Test    | Flutter Widget Test             |
| --------------------- | ------------------------------- |
| component render      | `pumpWidget`                    |
| query text            | `find.text`                     |
| query role            | `find.byType` / semantics       |
| click                 | `tester.tap`                    |
| type input            | `tester.enterText`              |
| rerender              | 再次 `pumpWidget`               |
| wait animation        | `pump` / `pumpAndSettle`        |
| mock props            | fake model / constructor params |
| mock context/provider | `ProviderScope(overrides: ...)` |
| assert DOM            | assert Widget tree / semantics  |

---

## 1. Web Component Test

React Testing Library：

```tsx
render(<ProductCard product={product} />);

expect(screen.getByText('Cup')).toBeInTheDocument();

await user.click(screen.getByText('Add'));
```

主要验证：

```text
组件显示正确
用户交互正确
状态变化正确
回调触发正确
```

---

## 2. Flutter Widget Test

Flutter：

```dart
testWidgets('shows product title', (tester) async {
  await tester.pumpWidget(
    MaterialApp(
      home: ProductCard(product: fakeProduct),
    ),
  );

  expect(find.text(fakeProduct.title), findsOneWidget);
});
```

交互：

```dart
await tester.tap(find.text('加入购物车'));
await tester.pump();

expect(find.text('已加入'), findsOneWidget);
```

---

## 3. 需要包哪些外层

很多 Widget 依赖上下文：

```text
Theme
MediaQuery
Navigator
ScaffoldMessenger
ProviderScope
Localization
```

测试时可能需要包：

```dart
ProviderScope(
  overrides: [...],
  child: MaterialApp(
    home: Scaffold(
      body: WidgetUnderTest(),
    ),
  ),
)
```

如果缺 `MaterialApp`，一些 Material Widget、Theme、Navigator 相关能力可能不能正常工作。

---

## 4. 测什么

适合 Widget Test：

```text
文本是否出现
按钮是否存在
点击是否触发
输入是否更新
loading/error/empty/data 分支
列表数量
路由按钮是否调用
表单校验
局部动画结束后的状态
```

不适合 Widget Test：

```text
复杂纯计算逻辑
Repository HTTP 细节
真实平台权限
真机硬件能力
完整跨页面 App 流程
```

这些分别用：

```text
Unit Test
API/Repository Test
Integration Test
```

---

## 5. 回调验证

Flutter 可以用变量验证：

```dart
var tapped = false;

await tester.pumpWidget(
  MaterialApp(
    home: AppButton(
      onPressed: () {
        tapped = true;
      },
      child: const Text('Submit'),
    ),
  ),
);

await tester.tap(find.text('Submit'));

expect(tapped, isTrue);
```

或用 mocktail 验证 mock 回调。

---

## 6. 状态分支测试

```dart
testWidgets('shows empty state when products are empty', (tester) async {
  await tester.pumpWidget(
    ProviderScope(
      overrides: [
        productsProvider.overrideWith(
          (_) async => <Product>[],
        ),
      ],
      child: const MaterialApp(
        home: ProductListPage(),
      ),
    ),
  );

  await tester.pumpAndSettle();

  expect(find.byType(EmptyState), findsOneWidget);
});
```

---

## 7. 和 Golden Test 的区别

| 测试             | 关注          |
| ---------------- | ------------- |
| Widget Test      | 行为和结构    |
| Golden Test      | 视觉截图      |
| Unit Test        | 纯逻辑        |
| Integration Test | 完整 App 流程 |

组件测试优先用 Widget Test 验证行为；视觉稳定性才加 Golden Test。

---

一句话理解：

```text
Web Component Test 对应 Flutter Widget Test。
它们都测试组件级 UI 和交互。
Flutter 中用 pumpWidget 构建 Widget，
用 find 查找内容，
用 tester.tap/enterText 模拟用户操作，
用 expect 断言结果。
```
