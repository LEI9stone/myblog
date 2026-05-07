---
title: Props
date: 2026-05-07
tags:
  - flutter
  - app
  - web
---

# Props vs Constructor Parameters

React 组件通过 `props` 接收外部输入。

Flutter Widget 通过构造函数参数接收外部输入。

两者心智非常接近：父组件把数据和回调传给子组件，子组件根据这些输入渲染 UI。

| React Props     | Flutter Constructor Parameters          |
| --------------- | --------------------------------------- |
| `props`         | constructor parameters                  |
| required prop   | `required` named parameter              |
| optional prop   | optional named parameter                |
| default prop    | default parameter value                 |
| callback prop   | function parameter                      |
| children prop   | `child` / `children`                    |
| prop type       | field type                              |
| props immutable | Widget fields should be `final`         |
| prop drilling   | constructor passing / Provider/Riverpod |

---

## 1. 基本映射

React：

```tsx
type ProductCardProps = {
  title: string;
  price: number;
};

function ProductCard({ title, price }: ProductCardProps) {
  return (
    <div>
      {title}: {price}
    </div>
  );
}
```

Flutter：

```dart
class ProductCard extends StatelessWidget {
  const ProductCard({
    super.key,
    required this.title,
    required this.price,
  });

  final String title;
  final double price;

  @override
  Widget build(BuildContext context) {
    return Text('$title: $price');
  }
}
```

使用：

```dart
const ProductCard(
  title: 'Cup',
  price: 99,
)
```

---

## 2. required props

React + TypeScript：

```tsx
type Props = {
  title: string;
};
```

Flutter：

```dart
const ProductCard({
  super.key,
  required this.title,
});
```

如果没有传：

```dart
ProductCard()
```

Dart analyzer 会报错。

---

## 3. optional props

React：

```tsx
type Props = {
  subtitle?: string;
};
```

Flutter：

```dart
const ProductCard({
  super.key,
  this.subtitle,
});

final String? subtitle;
```

使用时可以不传：

```dart
const ProductCard()
```

此时：

```dart
subtitle == null
```

---

## 4. default props

React：

```tsx
function Button({ size = 'medium' }) {
  return <button>{size}</button>;
}
```

Flutter：

```dart
const AppButton({
  super.key,
  this.size = AppButtonSize.medium,
});

final AppButtonSize size;
```

默认值必须是编译时常量。

---

## 5. callback props

React：

```tsx
<Button onClick={handleSubmit} />
```

Flutter：

```dart
AppButton(
  onPressed: handleSubmit,
)
```

定义：

```dart
class AppButton extends StatelessWidget {
  const AppButton({
    super.key,
    required this.onPressed,
  });

  final VoidCallback onPressed;
}
```

带参数回调：

```dart
final ValueChanged<String> onChanged;
```

等价于：

```dart
void Function(String value)
```

---

## 6. children vs child/children

React：

```tsx
<Card>
  <ProductInfo />
</Card>
```

Flutter：

```dart
AppCard(
  child: ProductInfo(),
)
```

定义：

```dart
class AppCard extends StatelessWidget {
  const AppCard({
    super.key,
    required this.child,
  });

  final Widget child;
}
```

多个 children：

```dart
class AppSection extends StatelessWidget {
  const AppSection({
    super.key,
    required this.children,
  });

  final List<Widget> children;
}
```

---

## 7. props 不可变 vs final fields

React 中 props 不应该被子组件修改。

Flutter 中 Widget 字段也应该是不可变的：

```dart
final String title;
final double price;
```

不要写成：

```dart
String title;
```

Widget 本身应该是不可变配置对象。

---

## 8. prop drilling

React：

```text
props 一层层往下传
```

Flutter 也会遇到：

```text
constructor parameters 一层层往下传
```

简单数据直接传没问题。

如果是跨多层共享状态，通常用：

```text
InheritedWidget
Provider
Riverpod
```

而不是无限传构造参数。

---

一句话理解：

```text
React props 是组件的外部输入；
Flutter constructor parameters 是 Widget 的外部输入。
required、optional、default、callback、children 等模式在 Flutter 里都通过构造函数参数和 final 字段表达。
```
