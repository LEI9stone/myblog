---
title: React 组件
date: 2026-05-07
tags:
  - flutter
  - app
  - web
---

# React Component vs Flutter Widget

React 里用 Component 描述 UI。

Flutter 里用 Widget 描述 UI。

两者都属于声明式 UI 思维：输入 props/state，输出界面结构。

可以这样映射：

| React              | Flutter                               |
| ------------------ | ------------------------------------- |
| Component          | Widget                                |
| Function Component | StatelessWidget / ConsumerWidget      |
| Class Component    | StatefulWidget                        |
| JSX                | Dart Widget Tree                      |
| props              | constructor parameters                |
| state              | State / Provider state                |
| render return      | build return                          |
| re-render          | rebuild                               |
| children           | child / children                      |
| composition        | composition                           |
| key                | key                                   |
| Context            | InheritedWidget / Provider / Riverpod |
| Hooks              | StatefulWidget lifecycle / Riverpod   |

---

## 1. 基本心智

React：

```tsx
function ProductCard({ title }: { title: string }) {
  return <div>{title}</div>;
}
```

Flutter：

```dart
class ProductCard extends StatelessWidget {
  const ProductCard({
    super.key,
    required this.title,
  });

  final String title;

  @override
  Widget build(BuildContext context) {
    return Text(title);
  }
}
```

核心对应：

```text
React Component 接收 props，返回 JSX；
Flutter Widget 接收构造参数，build 返回 Widget。
```

---

## 2. JSX vs Widget Tree

React：

```tsx
return (
  <div className="card">
    <h3>{title}</h3>
    <p>{price}</p>
  </div>
);
```

Flutter：

```dart
return Container(
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(title),
      Text(price),
    ],
  ),
);
```

React 使用 JSX 描述 UI；Flutter 使用 Dart 对象嵌套描述 UI。

---

## 3. props vs constructor parameters

React：

```tsx
<ProductCard title="Cup" price={99} />
```

Flutter：

```dart
const ProductCard(
  title: 'Cup',
  price: 99,
)
```

组件定义：

```dart
class ProductCard extends StatelessWidget {
  const ProductCard({
    super.key,
    required this.title,
    required this.price,
  });

  final String title;
  final double price;
}
```

---

## 4. re-render vs rebuild

React 中状态变化：

```text
component re-render
```

Flutter 中状态变化：

```text
Widget rebuild
```

Flutter Widget 是轻量不可变配置对象，可以频繁重建。

真正保留状态和位置的是：

```text
Element / State
```

所以不要把 rebuild 理解成“整个 UI 都被销毁重建”。

---

## 5. Stateless vs Stateful

React 函数组件可以同时无状态或有状态：

```tsx
function Counter() {
  const [count, setCount] = useState(0);
  return <button>{count}</button>;
}
```

Flutter 分得更明确：

| 场景               | Flutter                                     |
| ------------------ | ------------------------------------------- |
| 只依赖输入参数     | `StatelessWidget`                           |
| 组件内部有可变状态 | `StatefulWidget`                            |
| 状态放到 Riverpod  | `ConsumerWidget` / `ConsumerStatefulWidget` |

---

## 6. children

React：

```tsx
<Card>
  <ProductInfo />
</Card>
```

Flutter：

```dart
Card(
  child: ProductInfo(),
)
```

多个 children：

```dart
Column(
  children: [
    ProductInfo(),
    ProductActions(),
  ],
)
```

Flutter 常见命名：

| Flutter 参数 | 含义                   |
| ------------ | ---------------------- |
| `child`      | 单个子 Widget          |
| `children`   | 多个子 Widget          |
| `builder`    | 延迟构建或带上下文构建 |

---

## 7. key

React：

```tsx
items.map((item) => <Item key={item.id} item={item} />);
```

Flutter：

```dart
items.map((item) {
  return ItemTile(
    key: ValueKey(item.id),
    item: item,
  );
}).toList()
```

两者都用于帮助框架识别节点身份，尤其在列表重排、动画、状态保留时重要。

---

## 8. 最大区别

React 最终更新浏览器 DOM：

```text
React Component → Virtual DOM/Fiber → DOM
```

Flutter 最终更新自己的渲染树：

```text
Widget → Element → RenderObject
```

所以：

```text
React Component 运行在浏览器生态中；
Flutter Widget 运行在 Flutter 渲染体系中。
```

一句话理解：

```text
React Component 和 Flutter Widget 都是声明式 UI 单元；
React 用 props/state 返回 JSX 并更新 DOM，
Flutter 用构造参数/state 返回 Widget Tree 并更新 RenderObject。
```
