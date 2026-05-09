---
title: Cache
date: 2026-05-09
tags:
  - flutter
  - app
  - web
---

# Cache Layer vs Repository Cache

Web 里 Cache Layer 可能指：

```text
React Query Cache
SWR Cache
Service Worker Cache
memory cache
localStorage/IndexedDB cache
```

Flutter 里更常见的做法是把缓存策略放在 Repository 层，形成 Repository Cache。

可以这样映射：

| Web Cache Layer      | Flutter Repository Cache                   |
| -------------------- | ------------------------------------------ |
| React Query cache    | Provider cache / Repository memory cache   |
| SWR cache            | stale-while-revalidate repository strategy |
| Service Worker cache | 本地数据库 / 文件缓存 / 图片缓存           |
| localStorage cache   | shared_preferences                         |
| IndexedDB cache      | drift/sqlite                               |
| memory cache         | repository 内存字段                        |
| cache invalidation   | repository clear / ref.invalidate          |
| stale data           | cached data + background refresh           |
| offline first        | local data source + remote data source     |

---

## 1. Web Cache Layer

Web 中缓存可能分很多层：

```text
HTTP cache
Service Worker cache
React Query/SWR memory cache
localStorage
IndexedDB
Redux/Zustand store
```

不同层解决不同问题：

```text
减少请求
离线访问
提升首屏速度
跨页面复用数据
避免重复加载
```

---

## 2. Flutter Repository Cache

Flutter 中 Repository 通常是数据入口，它可以决定：

```text
从内存读
从本地数据库读
从网络读
网络成功后写缓存
缓存过期后刷新
离线时返回本地数据
```

示意：

```dart
class ProductRepository {
  ProductRepository({
    required this.remote,
    required this.local,
  });

  final ProductRemoteDataSource remote;
  final ProductLocalDataSource local;

  Future<List<Product>> fetchProducts() async {
    final cached = await local.getProducts();

    if (cached.isNotEmpty) {
      return cached.map((item) => item.toDomain()).toList();
    }

    final remoteProducts = await remote.fetchProducts();
    await local.saveProducts(remoteProducts);

    return remoteProducts.map((item) => item.toDomain()).toList();
  }
}
```

---

## 3. Provider Cache vs Repository Cache

| 类型             | 负责什么                         |
| ---------------- | -------------------------------- |
| Provider Cache   | UI 状态和异步结果缓存            |
| Repository Cache | 数据来源、持久化、过期、离线策略 |
| HTTP Cache       | 协议层缓存                       |
| Image Cache      | 图片资源缓存                     |

例如：

```dart
final productsProvider = FutureProvider((ref) {
  return ref.watch(productRepositoryProvider).fetchProducts();
});
```

`productsProvider` 可以缓存 `AsyncValue`。

`ProductRepository` 可以缓存真实数据来源。

---

## 4. 内存缓存

简单内存缓存：

```dart
class CategoryRepository {
  List<Category>? _cachedCategories;

  Future<List<Category>> fetchCategories() async {
    if (_cachedCategories != null) {
      return _cachedCategories!;
    }

    final categories = await remote.fetchCategories();
    _cachedCategories = categories;
    return categories;
  }

  void clearCache() {
    _cachedCategories = null;
  }
}
```

适合：

```text
分类
配置
短期内不频繁变化的数据
```

---

## 5. 本地持久缓存

如果要 App 重启后仍能使用：

```text
drift/sqlite
shared_preferences
文件缓存
```

例如商品列表离线缓存：

```text
remote API → ProductDto
local database → ProductEntity
domain → Product
```

Repository 负责转换和协调。

---

## 6. Stale-while-revalidate

Web SWR 思路：

```text
先返回缓存
后台刷新
刷新后更新 UI
```

Flutter 中可以用 Repository + Provider/Notifier 实现：

```text
先读本地数据库显示
再请求远程接口
远程成功后写入本地数据库
数据库 stream 更新 UI
```

如果用 drift stream：

```dart
Stream<List<Product>> watchProducts()
```

UI 可以实时收到本地缓存更新。

---

## 7. Cache invalidation

Web：

```ts
queryClient.invalidateQueries(['products']);
```

Flutter：

```dart
ref.invalidate(productsProvider);
```

Repository 层：

```dart
await repository.clearProductsCache();
```

有时两层都需要：

```text
清 Repository 数据缓存
invalidate Provider 状态缓存
重新拉取数据
```

---

## 8. 怎么设计缓存层

| 场景           | 推荐                                    |
| -------------- | --------------------------------------- |
| 临时页面数据   | Provider cache                          |
| 跨页面短期复用 | Repository memory cache                 |
| App 重启后保留 | drift/shared_preferences                |
| 大量结构化数据 | drift/sqlite                            |
| 图片缓存       | cached_network_image                    |
| 登录 token     | flutter_secure_storage                  |
| 离线优先       | local data source + repository strategy |
| 强实时数据     | 少缓存或短 TTL                          |

一句话理解：

```text
Web Cache Layer 可以分布在 Query Cache、Service Worker、Storage 和 HTTP 层；
Flutter 中业务数据缓存通常收敛到 Repository：
Repository 决定从网络、本地库、内存还是缓存读取，
Provider 负责把结果以状态形式暴露给 UI。
```
