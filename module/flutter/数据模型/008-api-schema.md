---
title: API Schema
date: 2026-05-09
tags:
  - flutter
  - app
  - web
---

# API Schema vs Generated Model

API Schema 是后端接口契约，比如 OpenAPI/Swagger、GraphQL Schema、接口文档中的 request/response 定义。

Generated Model 是根据这些接口契约自动生成的前端/客户端模型代码。

可以这样映射：

| Web / TypeScript     | Flutter / Dart                |
| -------------------- | ----------------------------- |
| OpenAPI Schema       | OpenAPI / Swagger schema      |
| generated TS types   | generated Dart models         |
| API client generator | Dart API/model generator      |
| response schema      | response DTO model            |
| request schema       | request DTO model             |
| enum schema          | Dart enum                     |
| nullable schema      | nullable field `T?`           |
| required fields      | `required` constructor fields |
| schema change        | regenerate models             |
| manual DTO           | generated DTO                 |

---

## 1. Web 中的 API Schema

Web 项目里常见：

```text
openapi.json
swagger.yaml
GraphQL schema
后端接口文档
```

然后生成：

```text
TypeScript types
API client
request/response DTO
```

例如：

```ts
type ProductDto = {
  id: string;
  title: string;
  price: string;
};
```

---

## 2. Flutter 中的 Generated Model

Flutter 中也可以根据 API Schema 生成 Dart model：

```dart
class ProductDto {
  const ProductDto({
    required this.id,
    required this.title,
    required this.price,
  });

  final String id;
  final String title;
  final String price;
}
```

通常还会生成：

```text
fromJson
toJson
enum
request model
response model
API client method
```

---

## 3. 常见生成工具

Flutter/Dart 中常见方向：

```text
OpenAPI → Dart client/model
Swagger → Dart client/model
GraphQL → Dart model/query
Drift schema → database model
Freezed/json_serializable → generated model helpers
```

常见生成内容：

| Schema 来源           | 生成内容             |
| --------------------- | -------------------- |
| OpenAPI               | API client + DTO     |
| GraphQL               | Query/Mutation types |
| JSON model annotation | `*.g.dart`           |
| Freezed annotation    | `*.freezed.dart`     |
| Drift table schema    | database access code |

---

## 4. Generated Model 的优点

```text
减少手写 DTO
接口字段变化更容易暴露
类型和接口契约保持一致
降低 fromJson/toJson 错误
提升前后端协作效率
```

尤其当接口很多时，生成模型比手写更稳定。

---

## 5. Generated Model 的风险

生成代码也有代价：

```text
生成文件可能很大
字段命名不一定符合业务语义
接口细节容易渗透到 UI
schema 质量差会生成难用代码
生成器升级可能带来大量 diff
```

所以不要让 UI 直接强依赖复杂 generated DTO。

更稳的分层是：

```text
Generated DTO
→ Repository Mapper
→ Domain Model
→ UI
```

---

## 6. DTO 和 Domain Model 的关系

Generated Model 通常更适合作为 DTO：

```text
贴近接口结构
由接口 schema 决定
可以随接口重新生成
```

Domain Model 更适合手写或单独维护：

```text
贴近 App 业务语义
字段命名更稳定
隐藏接口历史包袱
适合 UI 和业务逻辑使用
```

---

## 7. 推荐使用方式

小项目：

```text
Generated Model 可以直接给 UI 用
```

中大型项目：

```text
API Schema 生成 DTO/API Client
Repository 层把 DTO 转成 Domain Model
UI 只依赖 Domain Model
```

一句话理解：

```text
API Schema 是后端接口契约；
Generated Model 是根据契约生成的客户端类型代码。
生成模型适合减少手写 DTO，
但复杂业务里最好把 generated DTO 限制在 data 层，
再映射成稳定的 Domain Model 给 UI 使用。
```
