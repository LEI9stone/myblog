---
title: Children
date: 2026-05-07
tags:
  - flutter
  - app
  - web
---

# Children / Slots vs `child` / `children` / `builder`

React 里常用 `children` 表达插槽内容。

Vue/Svelte 里有更明确的 slot 概念。

Flutter 中常见对应是：

```dart
child
children
builder
```

它们都是 Widget composition 的核心方式。

| Web / React / Vue    | Flutter              |
| -------------------- | -------------------- |
| `children`           | `child` / `children` |
| default slot         | `child`              |
| named slot           | 具名 Widget 参数     |
| scoped slot          | `builder` callback   |
| render props         | `builder` callback   |
| children as function | builder pattern      |
| slot fallback        | 默认参数 / 条件渲染  |
| composition          | Widget composition   |

---

## 1. React children vs Flutter child

React：

```tsx
function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>;
}
```

使用：

```tsx
<Card>
  <ProductInfo />
</Card>
```

Flutter：

```dart
class AppCard extends StatelessWidget {
  const AppCard({
    super.key,
    required this.child,
  });

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      child: child,
    );
  }
}
```

使用：

```dart
AppCard(
  child: ProductInfo(),
)
```

`child` 通常表示：

```text
只接收一个子 Widget。
```

---

## 2. 多个 children

React：

```tsx
<Stack>
  <Title />
  <Description />
</Stack>
```

Flutter：

```dart
Column(
  children: [
    Title(),
    Description(),
  ],
)
```

自定义组件：

```dart
class AppStack extends StatelessWidget {
  const AppStack({
    super.key,
    required this.children,
  });

  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: children,
    );
  }
}
```

`children` 通常表示：

```text
接收多个子 Widget。
```

---

## 3. Named Slots vs 具名 Widget 参数

Vue：

```vue
<Card>
  <template #header>Title</template>
  <template #footer>Actions</template>
</Card>
```

Flutter：

```dart
class AppCard extends StatelessWidget {
  const AppCard({
    super.key,
    required this.header,
    required this.body,
    this.footer,
  });

  final Widget header;
  final Widget body;
  final Widget? footer;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        header,
        body,
        if (footer != null) footer!,
      ],
    );
  }
}
```

使用：

```dart
AppCard(
  header: Text('Title'),
  body: ProductInfo(),
  footer: ProductActions(),
)
```

这就是 Flutter 中常见的 named slot 心智。

---

## 4. Scoped Slot / Render Props vs builder

Vue scoped slot：

```vue
<List v-slot="{ item }">
  <ItemCard :item="item" />
</List>
```

React render props：

```tsx
<List renderItem={(item) => <ItemCard item={item} />} />
```

Flutter：

```dart
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return ItemCard(item: items[index]);
  },
)
```

自定义 builder：

```dart
class AppList<T> extends StatelessWidget {
  const AppList({
    super.key,
    required this.items,
    required this.itemBuilder,
  });

  final List<T> items;
  final Widget Function(BuildContext context, T item) itemBuilder;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (final item in items) itemBuilder(context, item),
      ],
    );
  }
}
```

---

## 5. builder 什么时候用

`builder` 适合：

```text
需要把上下文/状态传给外部
需要延迟构建
需要按 index 构建
需要让调用方自定义局部 UI
需要避免一次性构建全部子项
```

常见 Flutter API：

```dart
ListView.builder
GridView.builder
FutureBuilder
StreamBuilder
LayoutBuilder
Builder
Consumer
```

---

## 6. fallback content

React：

```tsx
function Card({ footer = null }) {
  return <>{footer ?? <DefaultFooter />}</>;
}
```

Flutter：

```dart
final Widget? footer;
```

```dart
footer ?? const DefaultFooter()
```

或：

```dart
if (footer != null) footer!,
```

---

## 7. 选择建议

| 需求                    | Flutter 参数                 |
| ----------------------- | ---------------------------- |
| 一个插槽                | `child`                      |
| 多个同类子项            | `children`                   |
| 多个命名区域            | `header` / `body` / `footer` |
| 调用方按数据生成 UI     | `builder` / `itemBuilder`    |
| 调用方拿到状态再生成 UI | `builder(context, state)`    |
| 可选插槽                | `Widget?`                    |
| 默认插槽内容            | nullable + fallback          |

一句话理解：

```text
React children 和 Vue/Svelte slots 在 Flutter 中主要对应 child、children 和具名 Widget 参数；
scoped slot/render props 对应 builder callback。
Flutter 的组合不是模板插槽语法，而是通过构造参数传入 Widget 或 Widget builder。
```
