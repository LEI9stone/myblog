---
title: Migration
date: 2026-05-09
tags:
  - flutter
  - app
  - web
---

# Migration vs Drift Migration

Web 里的 Migration 通常指数据库结构变更，比如后端数据库 migration，或 IndexedDB schema version upgrade。

Flutter 中如果使用 drift/sqlite，本地数据库结构变化也需要 migration，也就是 Drift Migration。

可以这样映射：

| Web / DB Migration    | Drift Migration             |
| --------------------- | --------------------------- |
| schema version        | `schemaVersion`             |
| migration script      | `MigrationStrategy`         |
| add column            | `m.addColumn(...)`          |
| create table          | `m.createTable(...)`        |
| drop table            | `m.deleteTable(...)`        |
| alter table           | drift migrator / custom SQL |
| IndexedDB upgrade     | `onUpgrade`                 |
| data migration        | custom migration step       |
| destructive migration | delete/recreate table，谨慎 |
| migration test        | migration unit test         |

---

## 1. Web / IndexedDB Migration

IndexedDB 中常见：

```ts
const request = indexedDB.open('app_db', 2);

request.onupgradeneeded = (event) => {
  const db = request.result;

  if (event.oldVersion < 1) {
    db.createObjectStore('products');
  }

  if (event.oldVersion < 2) {
    // add index
  }
};
```

核心是：

```text
数据库版本升级时执行结构变更。
```

---

## 2. Drift schemaVersion

drift 数据库会定义版本：

```dart
@DriftDatabase(tables: [Products])
class AppDatabase extends _$AppDatabase {
  AppDatabase(super.e);

  @override
  int get schemaVersion => 2;
}
```

每次本地表结构发生兼容性变化时，需要递增：

```dart
schemaVersion
```

---

## 3. MigrationStrategy

```dart
@override
MigrationStrategy get migration {
  return MigrationStrategy(
    onCreate: (m) async {
      await m.createAll();
    },
    onUpgrade: (m, from, to) async {
      if (from < 2) {
        await m.addColumn(products, products.subtitle);
      }
    },
  );
}
```

含义：

| 方法         | 作用                      |
| ------------ | ------------------------- |
| `onCreate`   | 首次创建数据库            |
| `onUpgrade`  | 从旧版本升级到新版本      |
| `beforeOpen` | 打开前/后做额外检查或设置 |

---

## 4. 添加字段

假设 `Products` 表新增：

```dart
TextColumn get subtitle => text().nullable()();
```

需要：

```dart
@override
int get schemaVersion => 2;
```

migration：

```dart
onUpgrade: (m, from, to) async {
  if (from < 2) {
    await m.addColumn(products, products.subtitle);
  }
}
```

如果新增的是非 nullable 字段，必须考虑旧数据默认值，否则迁移会失败。

---

## 5. 数据迁移

有时不仅改结构，还要改数据：

```dart
onUpgrade: (m, from, to) async {
  if (from < 3) {
    await m.addColumn(products, products.normalizedTitle);

    await customStatement('''
      UPDATE products
      SET normalized_title = LOWER(title)
    ''');
  }
}
```

对应 Web/后端里的 data migration。

---

## 6. 迁移风险

本地数据库 migration 一旦出错，用户设备上的数据可能无法打开。

要特别注意：

```text
不要随意删表
不要无默认值添加 required 字段
不要假设旧数据一定干净
不要只测全新安装
要测试旧版本升级
```

---

## 7. 测试 migration

需要验证：

```text
v1 数据库能升级到 v2
旧数据还在
新增字段正确
索引/表结构正确
异常数据可处理
```

drift 支持 migration testing，可以用测试数据库构造旧 schema 再升级。

---

## 8. 什么时候需要 migration

需要：

```text
新增/删除表
新增/删除字段
修改字段类型
新增索引
拆表/合表
字段数据格式变化
```

不需要：

```text
只改 Dart 层 helper 方法
只改 Repository 查询逻辑
只改 UI
只改非持久化 model
```

一句话理解：

```text
Migration 是数据库结构从旧版本升级到新版本的过程；
Drift Migration 用 schemaVersion + MigrationStrategy 管理本地 SQLite 结构升级。
每次改 drift 表结构都要考虑旧用户设备如何安全升级。
```
