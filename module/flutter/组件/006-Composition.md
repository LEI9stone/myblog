---
title: Composition
date: 2026-05-07
tags:
  - flutter
  - app
  - web
---

# Composition vs Widget Composition\*\*

Web 框架里常说 composition：通过组合小组件构建复杂 UI。

Flutter 里也是同样思路，只是组合对象从 React/Vue Component 变成了 Widget。

| Web Composition       | Flutter Widget Composition        |
| --------------------- | --------------------------------- |
| Component composition | Widget composition                |
| wrapper component     | wrapper Widget                    |
| children / slot       | `child` / `children`              |
| render props          | `builder`                         |
| HOC                   | Widget 包装 / builder / extension |
| compound component    | 多个协作 Widget                   |
| layout component      | Row / Column / Stack / Padding    |
| style wrapper         | Theme / Container / DecoratedBox  |
| behavior wrapper      | GestureDetector / InkWell / Focus |

---

## 1. React Composition

React：

```tsx
<Card>
  <ProductInfo />
  <ProductActions />
</Card>
```

通过组合组件形成 UI：

```text
Card
  ProductInfo
  ProductActions
```

---

## 2. Flutter Widget Composition

Flutter：

```dart
AppCard(
  child: Column(
    children: [
      ProductInfo(),
      ProductActions(),
    ],
  ),
)
```

Flutter UI 基本都是组合出来的：

```dart
Padding(
  padding: const EdgeInsets.all(16),
  child: DecoratedBox(
    decoration: BoxDecoration(
      borderRadius: BorderRadius.circular(8),
    ),
    child: Column(
      children: [
        Text('Product'),
        Text('Price'),
      ],
    ),
  ),
)
```

---

## 3. Wrapper Component vs Wrapper Widget

React：

```tsx
function Centered({ children }) {
  return <div className="center">{children}</div>;
}
```

Flutter：

```dart
class Centered extends StatelessWidget {
  const Centered({
    super.key,
    required this.child,
  });

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: child,
    );
  }
}
```

---

## 4. 行为组合

React：

```tsx
<div onClick={onClick}>
  <ProductCard />
</div>
```

Flutter：

```dart
GestureDetector(
  onTap: onTap,
  child: ProductCard(),
)
```

Material 点击反馈：

```dart
InkWell(
  onTap: onTap,
  child: ProductCard(),
)
```

这里不是继承某个 Button 类，而是通过 Widget 包装添加行为。

---

## 5. 样式组合

Web：

```tsx
<div className="card">
  <ProductInfo />
</div>
```

Flutter：

```dart
Container(
  padding: const EdgeInsets.all(16),
  decoration: BoxDecoration(
    color: Colors.white,
    borderRadius: BorderRadius.circular(8),
  ),
  child: ProductInfo(),
)
```

样式也是通过 Widget 组合叠加的：

```text
Padding 负责间距
DecoratedBox 负责装饰
ClipRRect 负责裁剪
Align 负责对齐
```

---

## 6. Layout Composition

Web 中可能通过 CSS class 控制布局：

```tsx
<div className="row">
  <Avatar />
  <UserInfo />
</div>
```

Flutter：

```dart
Row(
  children: [
    Avatar(),
    SizedBox(width: 12),
    Expanded(
      child: UserInfo(),
    ),
  ],
)
```

Flutter 中布局本身就是 Widget。

---

## 7. Composition 优先于继承

Flutter 和 React 一样，更推荐组合，而不是继承复杂基类。

推荐：

```dart
AppCard(
  child: ProductInfo(),
)
```

而不是设计很深的继承层级：

```dart
class ProductCard extends BaseCard {}
```

Flutter 中继承通常用于：

```text
StatelessWidget
StatefulWidget
State
抽象接口
```

业务 UI 复用主要靠组合。

---

一句话理解：

```text
Web Composition 是用组件组合组件；
Flutter Widget Composition 是用 Widget 包 Widget、传 Widget、构建 Widget。
布局、样式、行为、状态入口都可以通过 Widget 组合叠加出来。
```
