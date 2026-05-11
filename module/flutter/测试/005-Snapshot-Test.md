---
title: Snapshot Test
date: 2026-05-11
tags:
  - flutter
  - app
  - web
---

# Snapshot Test vs Golden Test

Web 里的 Snapshot Test 通常记录组件渲染出的结构或序列化结果。

Flutter 里的 Golden Test 通常记录 Widget 渲染出来的图片，并做像素级对比。

可以这样映射：

| Web Snapshot Test           | Flutter Golden Test             |
| --------------------------- | ------------------------------- |
| Jest snapshot               | Golden file                     |
| serialized DOM/tree         | rendered image                  |
| `toMatchSnapshot()`         | `matchesGoldenFile()`           |
| 结构回归                    | 视觉回归                        |
| diff text snapshot          | diff image                      |
| 更新 snapshot               | 更新 golden                     |
| Storybook visual regression | golden test / screenshot diff   |
| Chromatic                   | golden CI / visual diff tooling |

---

## 1. Web Snapshot Test

Jest：

```ts
expect(component).toMatchSnapshot();
```

它通常保存类似：

```text
HTML 结构
React tree
JSON 输出
```

优点：

```text
写起来快
能发现结构变化
```

缺点：

```text
容易变成无意义大快照
开发者容易盲目更新
不一定能发现真实视觉问题
```

---

## 2. Flutter Golden Test

Flutter：

```dart
await expectLater(
  find.byType(ProductCard),
  matchesGoldenFile('goldens/product_card.png'),
);
```

Golden Test 保存的是渲染图片。

之后测试会重新渲染 Widget，并和基准图对比。

它更像：

```text
视觉回归测试
```

而不是结构快照。

---

## 3. Golden Test 示例

```dart
testWidgets('ProductCard matches golden', (tester) async {
  await tester.pumpWidget(
    MaterialApp(
      home: Scaffold(
        body: Center(
          child: ProductCard(product: fakeProduct),
        ),
      ),
    ),
  );

  await expectLater(
    find.byType(ProductCard),
    matchesGoldenFile('goldens/product_card.png'),
  );
});
```

---

## 4. Golden Test 适合什么

适合：

```text
设计系统组件
商品卡片
空状态
错误状态
按钮变体
复杂布局
多主题对比
多屏尺寸对比
```

不适合：

```text
频繁变化的动态内容
网络图片不稳定的 UI
动画中间态
依赖系统字体不固定的场景
非常大的整页截图
```

---

## 5. 稳定性注意

Golden Test 容易受这些影响：

```text
字体
平台渲染差异
屏幕尺寸
像素密度
主题
图片资源
动画状态
时间/随机数
```

通常要固定：

```text
测试窗口尺寸
字体
主题
假数据
图片资源
动画状态
```

否则 golden diff 会很吵。

---

## 6. Snapshot vs Golden 的差异

Snapshot 更关注：

```text
结构有没有变
输出文本有没有变
```

Golden 更关注：

```text
视觉有没有变
间距、颜色、字号、布局有没有变
```

所以 Flutter 中如果你想检查：

```text
Text 是否存在
按钮是否可点
错误态是否出现
```

用 Widget Test。

如果你想检查：

```text
卡片视觉是否和基准一致
```

用 Golden Test。

---

## 7. 不要盲目更新 Golden

更新 golden 前要确认：

```text
视觉变化是预期的
不是字体/环境导致的噪声
不是布局溢出
不是截图尺寸错误
不是资源加载失败
```

这和 Web 中不要盲目更新 snapshot 是一样的原则。

一句话理解：

```text
Web Snapshot Test 多数是结构快照；
Flutter Golden Test 是视觉图片快照。
前者防结构回归，
后者防视觉回归。
Widget 行为用 Widget Test，
视觉稳定性才用 Golden Test。
```
