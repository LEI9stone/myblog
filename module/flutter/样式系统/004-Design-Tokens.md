---
title: Design Tokens
date: 2026-05-07
tags:
  - flutter
  - app
  - web
---

# Design Tokens vs `AppTheme` / `AppColors` / `AppTextStyles`

Web 里的 Design Tokens 通常是设计系统的基础变量：

```text
color
spacing
radius
font
shadow
z-index
breakpoint
motion
```

Flutter 项目中通常会把这些设计变量落到：

```dart
AppTheme
AppColors
AppTextStyles
AppSpacing
AppRadius
AppShadows
ThemeData
ThemeExtension
```

可以这样映射：

| Web Design Tokens | Flutter                            |
| ----------------- | ---------------------------------- |
| color tokens      | `AppColors` / `ColorScheme`        |
| typography tokens | `AppTextStyles` / `TextTheme`      |
| spacing tokens    | `AppSpacing` / constants           |
| radius tokens     | `AppRadius` / `BorderRadius`       |
| shadow tokens     | `AppShadows` / `BoxShadow`         |
| breakpoint tokens | `AppBreakpoints`                   |
| motion tokens     | `AppDurations` / `Curves`          |
| theme tokens      | `ThemeData` / `ThemeExtension`     |
| CSS variables     | static constants / Theme extension |
| Tailwind config   | App token classes                  |

---

## 1. Web Design Tokens

Web 里常见：

```css
:root {
  --color-primary: #111111;
  --space-md: 16px;
  --radius-card: 8px;
  --font-title: 18px;
}
```

或者在 JS/TS 中：

```ts
export const tokens = {
  colors: {
    primary: '#111111',
  },
  spacing: {
    md: 16,
  },
};
```

核心目的：

```text
统一视觉语言；
减少硬编码；
让设计和开发使用同一套变量。
```

---

## 2. Flutter 静态 Token

Flutter 中最直接的方式是定义常量类。

```dart
class AppColors {
  static const primary = Color(0xFF111111);
  static const danger = Color(0xFFE53935);
  static const surface = Color(0xFFFFFFFF);
}
```

```dart
class AppSpacing {
  static const xs = 4.0;
  static const sm = 8.0;
  static const md = 16.0;
  static const lg = 24.0;
}
```

```dart
class AppRadius {
  static const card = 8.0;
  static const button = 6.0;
}
```

使用：

```dart
Container(
  padding: const EdgeInsets.all(AppSpacing.md),
  decoration: BoxDecoration(
    color: AppColors.surface,
    borderRadius: BorderRadius.circular(AppRadius.card),
  ),
)
```

---

## 3. AppTextStyles

Web：

```css
.title {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
}
```

Flutter：

```dart
class AppTextStyles {
  static const title = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w600,
    height: 1.4,
  );

  static const body = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w400,
    height: 1.5,
  );
}
```

使用：

```dart
Text(
  'Product',
  style: AppTextStyles.title,
)
```

---

## 4. AppTheme

`AppTheme` 通常负责把 token 组装成 Flutter 的 `ThemeData`：

```dart
class AppTheme {
  static ThemeData get light {
    return ThemeData(
      colorScheme: const ColorScheme.light(
        primary: AppColors.primary,
        surface: AppColors.surface,
      ),
      textTheme: const TextTheme(
        titleMedium: AppTextStyles.title,
        bodyMedium: AppTextStyles.body,
      ),
    );
  }
}
```

使用：

```dart
MaterialApp(
  theme: AppTheme.light,
  home: const HomePage(),
)
```

可以理解为：

```text
AppColors/AppTextStyles 是 token；
AppTheme 是把 token 接入 Flutter 主题系统的地方。
```

---

## 5. Static Token vs ThemeData

| 方式                                      | 优点                         | 局限               |
| ----------------------------------------- | ---------------------------- | ------------------ |
| `AppColors.primary`                       | 简单、直接、容易查找         | 不随主题上下文变化 |
| `Theme.of(context).colorScheme.primary`   | 支持主题、暗色模式、局部覆盖 | 写法稍长           |
| `AppTextStyles.title`                     | 简单复用字体                 | 不自动响应主题     |
| `Theme.of(context).textTheme.titleMedium` | 与 Material 主题系统集成     | 需要提前配置       |

实际项目常见组合：

```text
底层 token 用 AppColors/AppTextStyles 定义；
Material 组件和全局样式通过 AppTheme 注入 ThemeData；
业务专属主题变量用 ThemeExtension。
```

---

## 6. 不要到处硬编码

不推荐：

```dart
Text(
  'Title',
  style: TextStyle(
    fontSize: 17,
    color: Color(0xFF222222),
  ),
)
```

更推荐：

```dart
Text(
  'Title',
  style: Theme.of(context).textTheme.titleMedium,
)
```

或：

```dart
Text(
  'Title',
  style: AppTextStyles.title,
)
```

硬编码多了以后会导致：

```text
颜色不统一
字号漂移
间距混乱
暗色模式难做
全局改版成本高
```

---

## 7. 推荐组织方式

```text
lib/core/theme/
  app_theme.dart
  app_colors.dart
  app_text_styles.dart
  app_spacing.dart
  app_radius.dart
  app_shadows.dart
  app_breakpoints.dart
```

或者集中在：

```text
lib/core/theme/app_theme.dart
```

小项目可以集中，大项目适合拆分。

---

一句话理解：

```text
Web Design Tokens 是设计系统变量；
Flutter 中通常用 AppColors、AppTextStyles、AppSpacing 等常量承载 token，
再由 AppTheme 注入 ThemeData，
复杂主题扩展用 ThemeExtension。
```
