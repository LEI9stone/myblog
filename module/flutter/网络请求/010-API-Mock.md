---
title: API Mock
date: 2026-05-08
tags:
  - flutter
  - app
  - web
---

# API Mock vs Fake Repository / Test Client

Web 里 API Mock 常见方式有：

```text
MSW
mock server
axios mock adapter
本地 JSON
fake service
```

Flutter 中对应常见是：

```text
Fake Repository
Mock Repository
Test Dio Client
Provider override
本地 fixture JSON
```

可以这样映射：

| Web API Mock             | Flutter                                      |
| ------------------------ | -------------------------------------------- |
| MSW                      | Fake Repository / mock HTTP adapter          |
| axios mock adapter       | Dio mock adapter / fake Dio                  |
| mock service             | Fake API Service                             |
| fixture JSON             | test fixture assets/files                    |
| React Query wrapper mock | Provider override                            |
| Jest mock function       | mocktail / Mockito                           |
| Storybook mock data      | Widget preview fake data                     |
| E2E mock server          | local test server / integration test backend |

---

## 1. Web API Mock

Web：

```ts
server.use(
  http.get('/api/products', () => {
    return HttpResponse.json([{ id: '1', title: 'Cup' }]);
  })
);
```

或者：

```ts
vi.mock('@/services/productApi');
```

目的：

```text
让 UI 或业务逻辑测试不依赖真实后端。
```

---

## 2. Flutter 更推荐 Fake Repository

如果 UI 依赖的是 Repository，而不是直接依赖 Dio，那么测试可以直接替换 Repository。

接口：

```dart
abstract class ProductRepository {
  Future<List<Product>> fetchProducts();
}
```

Fake：

```dart
class FakeProductRepository implements ProductRepository {
  FakeProductRepository(this.products);

  final List<Product> products;

  @override
  Future<List<Product>> fetchProducts() async {
    return products;
  }
}
```

测试时覆盖 provider：

```dart
await tester.pumpWidget(
  ProviderScope(
    overrides: [
      productRepositoryProvider.overrideWithValue(
        FakeProductRepository([fakeProduct]),
      ),
    ],
    child: const MaterialApp(
      home: ProductListPage(),
    ),
  ),
);
```

---

## 3. Provider Override

Riverpod 的测试优势是可以替换依赖：

```dart
ProviderScope(
  overrides: [
    productRepositoryProvider.overrideWithValue(fakeRepository),
  ],
  child: const App(),
)
```

这类似 Web 测试里：

```text
用 mock provider 包住组件
用 mock server 替换接口
用 dependency injection 替换 service
```

---

## 4. Mock vs Fake

| 类型        | 特点                           |
| ----------- | ------------------------------ |
| Fake        | 手写简单实现，返回固定数据     |
| Mock        | 记录调用、验证参数、可配置返回 |
| Stub        | 只返回预设结果                 |
| Test Client | 模拟 HTTP 层                   |

Flutter 中：

```text
Fake Repository 更适合 widget test
Mock Repository 更适合验证调用行为
Test Client 更适合测试 API Service
```

---

## 5. mocktail / Mockito

如果需要 mock：

```dart
class MockProductRepository extends Mock
    implements ProductRepository {}
```

然后：

```dart
when(() => repository.fetchProducts()).thenAnswer(
  (_) async => [fakeProduct],
);
```

适合验证：

```dart
verify(() => repository.fetchProducts()).called(1);
```

不过很多 UI 测试中，Fake 比 Mock 更简单、更稳定。

---

## 6. 测试 API Service

如果要测 API Service 的 HTTP 解析，可以 mock Dio adapter 或使用测试 client。

目标是验证：

```text
请求路径
query/body
header
response parsing
error mapping
```

但多数业务 UI 测试不需要 mock 到 HTTP 层，只替换 Repository 就够了。

---

## 7. Fixture JSON

Web：

```text
fixtures/products.json
```

Flutter 测试也可以放：

```text
test/fixtures/products.json
```

然后读取 JSON 解析成 model，用于 repository/API service 测试。

---

## 8. 分层测试策略

| 测试目标                       | Mock/Fake 层级                      |
| ------------------------------ | ----------------------------------- |
| Widget 渲染 loading/error/data | Fake Repository / override provider |
| Notifier 状态流转              | Fake Repository                     |
| Repository 业务转换            | Fake API Service                    |
| API Service 请求格式           | Mock Dio/Test Client                |
| JSON model 解析                | fixture JSON                        |
| 集成测试                       | mock server / 测试环境后端          |

---

一句话理解：

```text
Web API Mock 常用 MSW、axios mock 或 mock service；
Flutter 中更推荐通过 Repository 抽象隔离网络，
测试时用 Fake Repository 或 Provider override 替换真实数据源。
只有测试 HTTP 细节时，才 mock Dio/Test Client。
```
