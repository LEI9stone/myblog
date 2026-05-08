---
title: Tabbar
date: 2026-05-08
tags:
  - flutter
  - app
  - web
---

# Tab Navigation vs `StatefulShellRoute` / `BottomNavigationBar`

Web 里的 Tab Navigation 可能是普通 UI tab，也可能是路由 tab，比如：

```text
/home
/products
/orders
/profile
```

Flutter 里常见对应是：

```dart
BottomNavigationBar
NavigationBar
TabBar
StatefulShellRoute
```

如果 tab 对应 App 主导航，并且每个 tab 需要保留独立页面栈，通常用 `StatefulShellRoute`。

可以这样映射：

| Web Tab Navigation   | Flutter                                         |
| -------------------- | ----------------------------------------------- |
| tab links            | `BottomNavigationBar` / `NavigationBar`         |
| route tabs           | `StatefulShellRoute`                            |
| active tab           | `currentIndex` / `navigationShell.currentIndex` |
| switch tab           | `navigationShell.goBranch(index)`               |
| nested route per tab | `StatefulShellBranch`                           |
| tab content outlet   | branch Navigator                                |
| preserve tab state   | `StatefulShellRoute.indexedStack`               |
| simple local tabs    | `TabBar` / `TabBarView`                         |
| top category tabs    | `TabController`                                 |

---

## 1. Web Tab Navigation

Web：

```tsx
<nav>
  <Link to="/">Home</Link>
  <Link to="/orders">Orders</Link>
  <Link to="/profile">Profile</Link>
</nav>
```

点击 tab：

```text
URL 变化
对应页面切换
当前 tab 高亮
```

---

## 2. Flutter BottomNavigationBar

简单底部导航：

```dart
Scaffold(
  body: pages[currentIndex],
  bottomNavigationBar: BottomNavigationBar(
    currentIndex: currentIndex,
    onTap: (index) {
      setState(() {
        currentIndex = index;
      });
    },
    items: const [
      BottomNavigationBarItem(
        icon: Icon(Icons.home),
        label: '首页',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.receipt),
        label: '订单',
      ),
    ],
  ),
)
```

适合：

```text
不需要每个 tab 独立路由栈
小型 App
简单页面切换
```

---

## 3. StatefulShellRoute

如果每个 Tab 都是路由分支：

```text
首页
分类
订单
我的
```

并且每个分支里还能继续 push 详情页，就更适合：

```dart
StatefulShellRoute.indexedStack
```

示意：

```dart
StatefulShellRoute.indexedStack(
  builder: (context, state, navigationShell) {
    return MainScaffold(
      navigationShell: navigationShell,
    );
  },
  branches: [
    StatefulShellBranch(
      routes: [
        GoRoute(
          path: '/',
          builder: (context, state) => const HomePage(),
        ),
      ],
    ),
    StatefulShellBranch(
      routes: [
        GoRoute(
          path: '/orders',
          builder: (context, state) => const OrdersPage(),
        ),
      ],
    ),
  ],
)
```

`StatefulShellRoute` 的关键是：

```text
每个 branch 有自己的 Navigator；
切换 tab 时保留各自的导航状态。
```

---

## 4. MainScaffold

通常会把底部导航封装到 `MainScaffold`：

```dart
class MainScaffold extends StatelessWidget {
  const MainScaffold({
    super.key,
    required this.navigationShell,
  });

  final StatefulNavigationShell navigationShell;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: navigationShell.currentIndex,
        onTap: (index) {
          navigationShell.goBranch(index);
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: '首页',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.receipt),
            label: '订单',
          ),
        ],
      ),
    );
  }
}
```

---

## 5. BottomNavigationBar vs NavigationBar

Flutter Material 里有：

```text
BottomNavigationBar
NavigationBar
```

大致区别：

| Widget                | 场景                   |
| --------------------- | ---------------------- |
| `BottomNavigationBar` | 传统 Material 底部导航 |
| `NavigationBar`       | Material 3 底部导航    |
| `NavigationRail`      | 平板/桌面侧边导航      |
| `TabBar`              | 页面内部顶部 tab       |

---

## 6. TabBar：页面内部 tab

如果只是一个页面内部的分类 tab，不是 App 主路由：

```dart
DefaultTabController(
  length: 3,
  child: Scaffold(
    appBar: AppBar(
      bottom: const TabBar(
        tabs: [
          Tab(text: '全部'),
          Tab(text: '待付款'),
          Tab(text: '已完成'),
        ],
      ),
    ),
    body: const TabBarView(
      children: [
        AllOrdersView(),
        PendingOrdersView(),
        CompletedOrdersView(),
      ],
    ),
  ),
)
```

这更像 Web 页面内 tab，不一定需要改 route。

---

## 7. 怎么选

| 需求                          | Flutter 推荐                            |
| ----------------------------- | --------------------------------------- |
| App 底部主导航，简单切换      | `BottomNavigationBar` / `NavigationBar` |
| 主导航每个 tab 保留独立路由栈 | `StatefulShellRoute`                    |
| 页面内部分类 tab              | `TabBar` / `TabBarView`                 |
| 平板/桌面侧边导航             | `NavigationRail`                        |
| 路由驱动 tab 高亮             | go_router + shell route                 |
| 不需要 URL/路由               | local state + tab controller            |

一句话理解：

```text
Web Tab Navigation 常通过路由链接切换页面；
Flutter 中简单 tab 用 BottomNavigationBar 或 TabBar，
主导航且需要保留每个 tab 的独立导航栈时，用 StatefulShellRoute。
```
