---
title: flex容器
date: 2026-05-07
tags:
  - flutter
  - app
  - web
---

# Flexbox vs `Row` / `Column` / `Flex` / `Expanded`

Web 里用 Flexbox 做一维布局：

```css
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
```

Flutter 里用：

```dart
Row
Column
Flex
Expanded
Flexible
Spacer
```

可以这样映射：

| CSS Flexbox              | Flutter                               |
| ------------------------ | ------------------------------------- |
| `display: flex`          | `Row` / `Column` / `Flex`             |
| `flex-direction: row`    | `Row`                                 |
| `flex-direction: column` | `Column`                              |
| `justify-content`        | `mainAxisAlignment`                   |
| `align-items`            | `crossAxisAlignment`                  |
| `flex: 1`                | `Expanded` / `Flexible`               |
| `gap`                    | `spacing` / `SizedBox`                |
| `flex-wrap: wrap`        | `Wrap`                                |
| `align-self`             | `Align` / specific layout handling    |
| `order`                  | 调整 `children` 顺序                  |
| `row-gap` / `column-gap` | `spacing` / `runSpacing` / `SizedBox` |

---

## 1. Row / Column 是最常见的 Flex

Web：

```css
.toolbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
```

Flutter：

```dart
Row(
  mainAxisAlignment: MainAxisAlignment.spaceBetween,
  crossAxisAlignment: CrossAxisAlignment.center,
  children: const [
    Text('Title'),
    Icon(Icons.search),
  ],
)
```

纵向：

```dart
Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  children: const [
    Text('Title'),
    Text('Subtitle'),
  ],
)
```

---

## 2. 主轴和交叉轴

在 Flutter 中：

```text
Row 的主轴是水平
Row 的交叉轴是垂直

Column 的主轴是垂直
Column 的交叉轴是水平
```

映射：

| Flexbox           | Flutter              |
| ----------------- | -------------------- |
| 主轴              | mainAxis             |
| 交叉轴            | crossAxis            |
| `justify-content` | `mainAxisAlignment`  |
| `align-items`     | `crossAxisAlignment` |

例如：

```dart
Row(
  mainAxisAlignment: MainAxisAlignment.center,
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [...],
)
```

---

## 3. `flex: 1` vs `Expanded`

Web：

```css
.content {
  flex: 1;
}
```

Flutter：

```dart
Expanded(
  child: Content(),
)
```

例子：

```dart
Row(
  children: [
    const SizedBox(width: 80, child: Avatar()),
    Expanded(
      child: Text(
        longTitle,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
      ),
    ),
  ],
)
```

`Expanded` 的作用：

```text
占用主轴剩余空间，并强制 child 填满这部分空间。
```

---

## 4. `Flexible` vs `Expanded`

```dart
Flexible(
  child: child,
)
```

和：

```dart
Expanded(
  child: child,
)
```

区别：

| Widget     | 含义                           |
| ---------- | ------------------------------ |
| `Expanded` | 必须填满剩余空间               |
| `Flexible` | 可以使用剩余空间，但不强制填满 |

可以粗略理解为：

```text
Expanded = Flexible(fit: FlexFit.tight)
Flexible = Flexible(fit: FlexFit.loose)
```

---

## 5. flex 比例

Web：

```css
.left {
  flex: 1;
}

.right {
  flex: 2;
}
```

Flutter：

```dart
Row(
  children: [
    Expanded(
      flex: 1,
      child: LeftPanel(),
    ),
    Expanded(
      flex: 2,
      child: RightPanel(),
    ),
  ],
)
```

比例关系一样：

```text
1 : 2
```

---

## 6. gap

Web：

```css
.row {
  display: flex;
  gap: 12px;
}
```

Flutter 新版本可用：

```dart
Row(
  spacing: 12,
  children: const [
    Text('A'),
    Text('B'),
  ],
)
```

更通用的写法：

```dart
Row(
  children: const [
    Text('A'),
    SizedBox(width: 12),
    Text('B'),
  ],
)
```

Column：

```dart
Column(
  children: const [
    Text('A'),
    SizedBox(height: 12),
    Text('B'),
  ],
)
```

---

## 7. flex-wrap vs Wrap

Web：

```css
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
```

Flutter：

```dart
Wrap(
  spacing: 8,
  runSpacing: 8,
  children: const [
    Tag('New'),
    Tag('Hot'),
    Tag('Sale'),
  ],
)
```

`Row` 不会自动换行。需要换行时用 `Wrap`。

---

## 8. 常见溢出问题

Flutter 中 `Row` 里放长文本很容易溢出：

```dart
Row(
  children: [
    Text(longTitle),
    Icon(Icons.chevron_right),
  ],
)
```

修复：

```dart
Row(
  children: [
    Expanded(
      child: Text(
        longTitle,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
      ),
    ),
    const Icon(Icons.chevron_right),
  ],
)
```

原因是：

```text
Row 默认不会主动限制 Text 宽度；
Expanded 给 Text 一个明确的剩余宽度约束。
```

---

一句话理解：

```text
Flexbox 用 display:flex + CSS 属性配置一维布局；
Flutter 用 Row/Column/Flex 表达方向，
用 mainAxisAlignment/crossAxisAlignment 表达对齐，
用 Expanded/Flexible 表达 flex 占比和剩余空间。
```
