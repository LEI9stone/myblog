---
title: Data Source
date: 2026-05-11
tags:
  - flutter
  - app
  - web
---

# API Layer vs Data Source

Web 项目里 API Layer 通常封装接口请求，例如：

```ts
productApi.fetchProducts();
orderApi.createOrder();
```

Flutter 架构里更常叫 Data Source，尤其是在分层架构中：

```text
RemoteDataSource
LocalDataSource
```

它们负责和具体数据来源打交道，比如 HTTP、本地数据库、缓存、文件系统。

可以这样映射：

| Web API Layer        | Flutter Data Source        |
| -------------------- | -------------------------- |
| `api/product.ts`     | `ProductRemoteDataSource`  |
| axios/fetch wrapper  | Dio/http data source       |
| localStorage service | PreferencesLocalDataSource |
| IndexedDB service    | DriftLocalDataSource       |
| API function         | data source method         |
| response DTO         | DTO model                  |
| service error        | data source exception      |
| mock API             | fake data source           |
| API client           | remote data source         |

---

## 1. Web API Layer

Web：

```ts
export const productApi = {
  fetchProducts: () => api.get('/products'),
  fetchProduct: (id: string) => api.get(`/products/${id}`),
};
```

它通常负责：

```text
URL
method
query/body
headers
response
```

---

## 2. Flutter Remote Data Source

Flutter：

```dart
class ProductRemoteDataSource {
  const ProductRemoteDataSource(this.dio);

  final Dio dio;

  Future<List<ProductDto>> fetchProducts() async {
    final response = await dio.get('/products');
    final data = response.data as List<dynamic>;

    return data
        .map((item) => ProductDto.fromJson(item as Map<String, dynamic>))
        .toList();
  }
}
```

它负责：

```text
调用远程接口
处理 HTTP 参数
把 JSON 转 DTO
抛出数据源层异常
```

---

## 3. Local Data Source

如果有本地数据库：

```dart
class ProductLocalDataSource {
  const ProductLocalDataSource(this.database);

  final AppDatabase database;

  Future<List<ProductEntity>> getProducts() {
    return database.productDao.getProducts();
  }

  Future<void> saveProducts(List<ProductEntity> products) {
    return database.productDao.upsertProducts(products);
  }
}
```

对应 Web：

```text
IndexedDB service
localForage service
localStorage wrapper
```

---

## 4. Data Source vs Repository

Data Source 不应该直接承担太多业务语义。

| 层                | 职责                             |
| ----------------- | -------------------------------- |
| Data Source       | 怎么取数据                       |
| Repository        | 取什么数据、用哪个来源、怎么转换 |
| Notifier/Provider | 数据如何变成 UI 状态             |
| Widget            | 数据如何展示                     |

Repository 示例：

```dart
class ProductRepository {
  const ProductRepository({
    required this.remote,
    required this.local,
  });

  final ProductRemoteDataSource remote;
  final ProductLocalDataSource local;

  Future<List<Product>> fetchProducts() async {
    final dtos = await remote.fetchProducts();
    return dtos.map((dto) => dto.toDomain()).toList();
  }
}
```

---

## 5. 多数据源场景

Repository 可以组合：

```text
RemoteDataSource
LocalDataSource
MemoryCache
SecureStorage
FileCache
```

例如：

```text
先读本地缓存
再请求远程
远程成功后写本地
离线时返回本地数据
```

Data Source 只负责各自能力，不负责全局策略。

---

## 6. 测试替换

可以 fake data source：

```dart
class FakeProductRemoteDataSource
    implements ProductRemoteDataSource {
  @override
  Future<List<ProductDto>> fetchProducts() async {
    return [fakeProductDto];
  }
}
```

但多数 UI/Notifier 测试更常替换 Repository。

Data Source 测试适合验证：

```text
HTTP 路径
JSON 解析
数据库读写
异常转换
```

---

一句话理解：

```text
Web API Layer 通常封装 fetch/axios 请求；
Flutter Data Source 是更明确的数据来源层。
RemoteDataSource 负责 HTTP，
LocalDataSource 负责本地数据库/缓存，
Repository 决定如何组合这些数据源并输出业务模型。
```
