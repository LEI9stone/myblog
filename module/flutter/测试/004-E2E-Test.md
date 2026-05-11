---
title: E2E Test
date: 2026-05-11
tags:
  - flutter
  - app
  - web
---

# E2E Test vs Integration Test

Web 里的 E2E Test 通常用 Playwright、Cypress，从浏览器视角跑完整用户流程。

Flutter 中对应的是 Integration Test，通常运行在模拟器、真机或桌面环境中，测试完整 App 流程。

可以这样映射：

| Web E2E Test               | Flutter Integration Test                   |
| -------------------------- | ------------------------------------------ |
| Playwright / Cypress       | `integration_test`                         |
| browser automation         | device/app automation                      |
| open URL                   | launch app                                 |
| click/type/assert          | tap/enterText/expect                       |
| page navigation            | route navigation                           |
| real network / mock server | real backend / test backend / fake service |
| visual check               | screenshot / golden-like comparison        |
| CI browser runner          | CI emulator/simulator/device               |
| user journey               | app flow                                   |

---

## 1. Web E2E Test

Web：

```ts
test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name=email]', 'user@example.com');
  await page.click('text=Login');
  await expect(page.getByText('Home')).toBeVisible();
});
```

它测试的是：

```text
真实浏览器
真实页面路由
真实用户交互
接近线上使用方式
```

---

## 2. Flutter Integration Test

Flutter 使用：

```yaml
dev_dependencies:
  integration_test:
    sdk: flutter
```

测试文件通常放在：

```text
integration_test/
  app_test.dart
```

示例：

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

import 'package:app/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('user can open home page', (tester) async {
    app.main();

    await tester.pumpAndSettle();

    expect(find.text('首页'), findsOneWidget);
  });
}
```

---

## 3. 和 Widget Test 的区别

| 测试类型         | 运行环境             | 适合                   |
| ---------------- | -------------------- | ---------------------- |
| Widget Test      | Flutter 测试环境     | 单个组件、页面局部交互 |
| Integration Test | 真机/模拟器/App 环境 | 完整用户流程           |
| Unit Test        | Dart VM              | 纯逻辑、状态、数据转换 |

Widget Test 更快、更稳定。

Integration Test 更接近真实用户，但更慢、更脆弱。

---

## 4. 适合测什么

Integration Test 适合：

```text
登录流程
首页到详情页
下单流程
搜索流程
表单提交
权限流程
深链进入
多页面导航
关键业务闭环
```

不适合把所有细节都放进去测。

大量小逻辑应该用：

```text
Unit Test
Widget Test
Notifier Test
Repository Test
```

---

## 5. Mock 还是 Real Backend

Web E2E 可以连真实后端，也可以用 mock server。

Flutter Integration Test 也类似：

| 方式             | 适合                   |
| ---------------- | ---------------------- |
| 真实测试环境后端 | 验证完整链路           |
| Mock server      | 稳定测试 UI 流程       |
| Fake Repository  | 更接近大号 widget test |
| 本地 fixture     | 固定数据场景           |

核心取舍：

```text
真实后端更接近生产，但不稳定；
mock/fake 更稳定，但覆盖不到真实接口链路。
```

---

## 6. CI 注意点

Flutter Integration Test 在 CI 中要考虑：

```text
启动模拟器耗时
设备尺寸差异
系统权限弹窗
网络不稳定
动画等待
测试账号和数据隔离
截图/日志收集
```

所以 Integration Test 应该少而关键，覆盖主路径，不要变成全量 UI 细节测试。

---

一句话理解：

```text
Web E2E Test 用浏览器自动化测试完整用户流程；
Flutter Integration Test 用真机/模拟器运行 App 并测试完整流程。
它比 Widget Test 更接近真实环境，但成本更高，
适合覆盖登录、导航、下单、搜索等关键业务闭环。
```
