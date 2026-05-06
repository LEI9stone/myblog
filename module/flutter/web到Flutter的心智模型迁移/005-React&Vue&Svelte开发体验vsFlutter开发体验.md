---
title: React/Vue/Svelte 开发体验 vs Flutter 开发体验
date: 2026-04-29
tags:
  - flutter
  - app
  - web
---

# React/Vue/Svelte 开发体验 vs Flutter 开发体验

Flutter 的开发体验更接近 React，而不是传统 HTML/CSS/JS 分离式开发。

它们共同点是：都通过声明式 UI 描述界面，状态变化后重新计算 UI。

| Web 框架         | Flutter                          |
| ---------------- | -------------------------------- |
| React Component  | Flutter Widget                   |
| Vue Component    | Flutter Widget                   |
| Svelte Component | Flutter Widget                   |
| JSX / Template   | Dart Widget Tree                 |
| Props            | Constructor Parameters           |
| State            | State / Provider State           |
| Re-render        | Rebuild                          |
| Hooks / Store    | Riverpod / Notifier / Controller |
| CSS / scoped CSS | Theme / Widget Style             |
| Dev Server HMR   | Hot Reload                       |
| Browser DevTools | Flutter DevTools                 |
| npm ecosystem    | pub.dev ecosystem                |

不同框架的类比：

| Web 经验                  | Flutter 近似体验                           |
| ------------------------- | ------------------------------------------ |
| React 函数组件            | StatelessWidget / ConsumerWidget           |
| React useState            | StatefulWidget / StateProvider             |
| React useEffect           | initState / ref.listen / Provider 生命周期 |
| React Context             | ProviderScope / Riverpod Provider          |
| React Router              | go_router                                  |
| Vue props                 | Widget 构造参数                            |
| Vue slot                  | child / children / builder                 |
| Vue computed              | Provider 派生状态                          |
| Svelte store              | Riverpod Provider / Notifier               |
| Svelte reactive statement | Provider 依赖更新                          |

开发流程也很像：

```text
修改代码 → 保存 → Hot Reload → 查看 UI 更新
```

React/Vue/Svelte 开发者会觉得熟悉的部分：

```text
组件化
声明式 UI
状态驱动视图
路由组织页面
API 层请求数据
根据 loading/error/data 渲染不同 UI
热更新开发体验
```

但 Flutter 有几个明显不同点：

| Web 框架                    | Flutter                   |
| --------------------------- | ------------------------- |
| JSX/Template 混合 HTML 语义 | Dart 代码直接组合 Widget  |
| CSS 负责样式                | Widget 参数负责样式       |
| 浏览器负责布局绘制          | Flutter 自己布局绘制      |
| DOM 节点可被选择器命中      | Widget 没有 CSS 选择器    |
| 页面运行在 Tab 中           | App 运行在原生容器中      |
| Web API 丰富                | 原生能力依赖插件          |
| HMR 保持 JS 状态            | Hot Reload 保持 Dart 状态 |

React 开发者最容易迁移，因为 Flutter 的 Widget 思维和 React Component 很像：

```text
props 输入 → state 变化 → render/build → UI 更新
```

对应关系：

```text
React:
function ProductCard({ product }) {
  return <div>{product.name}</div>
}

Flutter:
class ProductCard extends StatelessWidget {
  final Product product;

  const ProductCard({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    return Text(product.name);
  }
}
```

一句话理解：

```text
Flutter 的开发体验像 React 的声明式组件开发，
但去掉了 DOM、CSS 和浏览器运行时，
换成 Dart、Widget 和 Flutter 渲染引擎。
```
