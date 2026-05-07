---
title: grid容器
date: 2026-05-07
tags:
  - flutter
  - app
  - web
---

# CSS Grid vs `GridView` / `SliverGrid`

Web 里 `CSS Grid` 是二维布局系统，可以控制行、列、间距、区域和对齐。

Flutter 里常见网格是：

```dart
GridView
SliverGrid
```

但 Flutter 的 `GridView` 更偏“可滚动网格列表”，不完全等同于 CSS Grid 的通用二维布局能力。

| CSS Grid                          | Flutter                                |
| --------------------------------- | -------------------------------------- |
| `display: grid`                   | `GridView` / `SliverGrid`              |
| `grid-template-columns`           | `SliverGridDelegate`                   |
| `repeat(2, 1fr)`                  | `crossAxisCount: 2`                    |
| `gap`                             | `mainAxisSpacing` / `crossAxisSpacing` |
| `grid-auto-flow`                  | item 顺序 / delegate                   |
| `grid-column` 跨列                | Flutter 原生 GridView 不擅长           |
| `grid-row` 跨行                   | Flutter 原生 GridView 不擅长           |
| masonry grid                      | `flutter_staggered_grid_view`          |
| fixed grid                        | `GridView.count`                       |
| dynamic grid                      | `GridView.builder`                     |
| scrollable grid in complex scroll | `SliverGrid`                           |

---

## 1. CSS Grid 基本映射

Web：

```css
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
```

Flutter：

```dart
GridView.builder(
  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: 2,
    crossAxisSpacing: 12,
    mainAxisSpacing: 12,
  ),
  itemCount: products.length,
  itemBuilder: (context, index) {
    return ProductCard(product: products[index]);
  },
)
```

这里：

```text
crossAxisCount: 2
≈ grid-template-columns: repeat(2, 1fr)
```

---

## 2. GridView 默认可滚动

这是和 Web 很大的差异。

CSS Grid：

```text
只是布局方式，不一定滚动。
```

Flutter `GridView`：

```text
本质是 ScrollView，默认可滚动。
```

所以如果你把 `GridView` 放进另一个滚动容器，需要小心嵌套滚动问题。

常见处理：

```dart
GridView.builder(
  shrinkWrap: true,
  physics: const NeverScrollableScrollPhysics(),
  gridDelegate: ...,
  itemBuilder: ...,
)
```

但复杂页面更推荐用：

```text
CustomScrollView + SliverGrid
```

---

## 3. GridView.count

固定列数时可以用：

```dart
GridView.count(
  crossAxisCount: 2,
  crossAxisSpacing: 12,
  mainAxisSpacing: 12,
  children: [
    ProductCard(product: a),
    ProductCard(product: b),
  ],
)
```

适合：

```text
少量固定网格
静态入口菜单
分类宫格
```

---

## 4. GridView.builder

数据列表通常用：

```dart
GridView.builder(
  itemCount: items.length,
  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: 2,
    childAspectRatio: 0.72,
    crossAxisSpacing: 8,
    mainAxisSpacing: 8,
  ),
  itemBuilder: (context, index) {
    return ProductCard(product: items[index]);
  },
)
```

适合：

```text
商品列表
图片列表
分类列表
可分页网格
```

---

## 5. childAspectRatio

Web 可以用：

```css
aspect-ratio: 3 / 4;
```

Flutter GridView 常用：

```dart
childAspectRatio: 3 / 4
```

注意它表示：

```text
child width / child height
```

例如：

```dart
childAspectRatio: 0.72
```

表示高度大于宽度。

---

## 6. SliverGrid

如果页面有：

```text
顶部 Banner
吸顶 Tab
商品网格
加载更多
```

不要简单嵌套多个 ScrollView，更适合：

```dart
CustomScrollView(
  slivers: [
    SliverToBoxAdapter(child: Banner()),
    SliverPersistentHeader(...),
    SliverGrid(
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 8,
        mainAxisSpacing: 8,
      ),
      delegate: SliverChildBuilderDelegate(
        (context, index) => ProductCard(product: products[index]),
        childCount: products.length,
      ),
    ),
  ],
)
```

可以理解为：

```text
SliverGrid 是复杂滚动页面里的网格段。
```

---

## 7. 跨行跨列与瀑布流

CSS Grid 支持：

```css
grid-column: span 2;
grid-row: span 2;
```

Flutter 原生 `GridView` 不擅长这种不规则布局。

如果需要瀑布流或不规则网格，常用：

```text
flutter_staggered_grid_view
```

例如项目中如果已经引入：

```yaml
flutter_staggered_grid_view
```

就可以用于：

```text
瀑布流
不等高卡片
跨列布局
复杂商品流
```

---

一句话理解：

```text
CSS Grid 是通用二维布局系统；
Flutter GridView 更像可滚动网格列表；
复杂滚动页面用 SliverGrid，
瀑布流或跨行跨列布局通常用 staggered grid 扩展库。
```
