---
title: IndexedDB
date: 2026-05-09
tags:
  - flutter
  - app
  - web
---

# IndexedDB vs drift / sqlite

Web 里的 IndexedDB 是浏览器提供的本地结构化数据库。

Flutter 里对应常见方案是：

```text
sqlite
drift
sqflite
```

其中 `drift` 是 Dart/Flutter 生态中比较常用的类型安全 SQLite ORM/DAO 工具。

可以这样映射：

| Web IndexedDB          | Flutter               |
| ---------------------- | --------------------- |
| IndexedDB              | SQLite                |
| Dexie.js               | drift                 |
| object store           | table                 |
| index                  | index                 |
| transaction            | transaction           |
| query                  | SQL / drift query     |
| schema version         | migration             |
| browser local database | app local database    |
| offline cache          | local database cache  |
| structured local data  | drift entities / rows |

---

## 1. IndexedDB

Web：

```text
IndexedDB 是浏览器内置的本地数据库。
```

常用于：

```text
离线缓存
大量结构化数据
草稿数据
本地队列
前端数据库
PWA 离线能力
```

很多 Web 项目不会直接写原生 IndexedDB，而是用：

```text
Dexie
idb
localForage
```

---

## 2. Flutter sqlite

移动端本地结构化存储通常用 SQLite。

它适合：

```text
本地表结构
复杂查询
离线数据
分页缓存
关系型数据
数据迁移
```

Flutter 中可以直接用 `sqflite`，但更现代、更类型安全的方案是：

```text
drift
```

---

## 3. drift 是什么

`drift` 可以理解为：

```text
Dart/Flutter 上的类型安全 SQLite 数据库层。
```

它提供：

```text
表定义
类型安全查询
DAO
migration
stream query
代码生成
```

例如表：

```dart
class Products extends Table {
  TextColumn get id => text()();
  TextColumn get title => text()();
  IntColumn get priceCent => integer()();

  @override
  Set<Column> get primaryKey => {id};
}
```

---

## 4. IndexedDB object store vs drift table

IndexedDB：

```text
products object store
```

drift：

```dart
class Products extends Table {
  TextColumn get id => text()();
  TextColumn get title => text()();
}
```

心智映射：

```text
object store ≈ table
record ≈ row
index ≈ database index
transaction ≈ transaction
schema version ≈ migration version
```

---

## 5. 查询方式差异

IndexedDB 原生 API 偏事件/事务模型，通常不直接写 SQL。

drift 基于 SQLite，可以写类型安全查询：

```dart
Future<List<ProductRow>> getAllProducts() {
  return select(products).get();
}
```

条件查询：

```dart
Future<ProductRow?> getProductById(String id) {
  return (select(products)..where((tbl) => tbl.id.equals(id)))
      .getSingleOrNull();
}
```

---

## 6. 什么时候用 drift/sqlite

适合：

```text
离线商品数据
购物车本地缓存
草稿箱
搜索历史
分页列表缓存
复杂筛选查询
多表关系
需要 migration 的本地数据
```

不适合：

```text
简单开关配置
主题模式
是否看过引导页
少量 key-value
token
```

这些更适合：

```text
shared_preferences
flutter_secure_storage
```

---

## 7. Repository 中使用

推荐数据流：

```text
Widget
→ Provider/Notifier
→ Repository
→ Remote API + Local Database
→ Domain Model
```

Repository 可以决定：

```text
先读本地缓存
再请求远程
请求成功后写入 drift
离线时使用本地数据
```

这样 UI 不需要知道数据来自网络还是本地数据库。

---

一句话理解：

```text
IndexedDB 是 Web 浏览器里的本地结构化数据库；
Flutter 中对应通常是 SQLite。
drift 是 Flutter/Dart 上更类型安全、更工程化的 SQLite 访问层，
适合离线缓存、结构化数据、本地查询和数据库迁移。
```
