---
title: Mock API
date: 2026-05-11
tags:
  - flutter
  - app
  - web
---

# Mock API vs Fake Repository

Web 测试里常用 Mock API，比如 MSW、axios mock、mock server，拦截 HTTP 请求返回假数据。

Flutter 里更常见、更推荐的是 Fake Repository：让 UI/Notifier 依赖 Repository 抽象，测试时替换成假的 Repository，而不是走真实网络层。

可以这样映射：

| Web Mock API     | Flutter Fake Repository            |
| ---------------- | ---------------------------------- |
| MSW              | Fake Repository / fake data source |
| axios mock       | Mock Dio / Fake API Service        |
| mock server      | local test server                  |
| mocked response  | fake model data                    |
| test query hook  | Provider override                  |
| API layer mock   | Repository provider override       |
| network boundary | Repository boundary                |
| fixture JSON     | fake DTO/model fixture             |

---

## 1. Web Mock API

Web：

```ts
server.use(
  http.get('/api/products', () => {
    return HttpResponse.json([{ id: '1', title: 'Cup' }]);
  })
);
```

React 组件照常请求 API，但请求被 mock 层拦截。

好处：

```text
组件不需要知道是假数据
接近真实网络调用路径
适合 E2E/集成测试
```

---

## 2. Flutter Fake Repository

Flutter 推荐让 UI 不直接依赖 HTTP，而是依赖 Repository：

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

测试中替换 provider：

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

## 3. 为什么 Fake Repository 更常用

Widget/Notifier 测试通常关心：

```text
loading/error/data 是否渲染正确
点击是否触发状态变化
空状态是否出现
业务错误是否展示
```

这些不需要真的测试 Dio、HTTP header、URL path。

Fake Repository 可以让测试：

```text
更快
更稳定
更少网络细节
更容易构造边界状态
```

---

## 4. 什么时候 Mock API 层

如果你要测试：

```text
API Service 的 URL 是否正确
query/body 是否正确
header 是否正确
DioException 是否正确转换
JSON response 是否正确解析
```

可以 mock Dio 或使用 test HTTP client。

但这属于 API Service/Repository 测试，不是普通 Widget 测试。

---

## 5. Fake vs Mock

| 类型                 | 用途                             |
| -------------------- | -------------------------------- |
| Fake Repository      | 返回预设数据，适合 UI/状态测试   |
| Mock Repository      | 验证方法是否被调用、参数是否正确 |
| Mock Dio/Test Client | 测 HTTP 细节                     |
| Fixture JSON         | 测解析和 mapper                  |
| Local test server    | 更接近集成测试                   |

很多 Flutter 测试里：

```text
Fake 比 Mock 更清晰。
```

---

## 6. 错误状态 Fake

Fake Repository 可以轻松模拟错误：

```dart
class ThrowingProductRepository implements ProductRepository {
  @override
  Future<List<Product>> fetchProducts() async {
    throw const ApiException('加载失败');
  }
}
```

用它测试：

```text
ErrorView 是否出现
重试按钮是否存在
错误提示是否正确
```

---

## 7. 数据状态 Fake

可以为不同状态准备 fixture：

```dart
final fakeProducts = [
  Product(id: '1', title: 'Cup'),
];

final emptyProducts = <Product>[];
```

测试：

```text
有数据
空数据
错误
延迟 loading
```

---

一句话理解：

```text
Web 常通过 Mock API 拦截 HTTP 返回假数据；
Flutter 更推荐在 Repository 边界替换 Fake Repository。
Widget 和 Notifier 测试用 Fake Repository 更快更稳；
只有测试 HTTP 细节时才 mock Dio/API Client。
```
