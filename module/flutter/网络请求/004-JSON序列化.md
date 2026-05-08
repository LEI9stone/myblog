---
title: JSON序列化
date: 2026-05-08
tags:
  - flutter
  - app
  - web
---

# `JSON.parse/stringify` vs `json_serializable`

Web 里 JSON 处理通常靠：

```ts
JSON.parse();
JSON.stringify();
```

TypeScript 只在编译期描述类型，运行时不会自动校验 JSON 结构。

Flutter/Dart 里也可以手写 `jsonDecode/jsonEncode`，但实际项目常用：

```dart
json_serializable
freezed + json_serializable
```

生成 `fromJson` / `toJson` 代码。

可以这样映射：

| Web / TypeScript             | Flutter / Dart                       |
| ---------------------------- | ------------------------------------ |
| `JSON.parse()`               | `jsonDecode()`                       |
| `JSON.stringify()`           | `jsonEncode()`                       |
| plain object                 | `Map<String, dynamic>`               |
| TS interface                 | Dart model class                     |
| manual mapper                | `fromJson` / `toJson`                |
| zod/io-ts runtime validation | 手写校验 / checked json / freezed    |
| generated API types          | `json_serializable` generated models |
| DTO                          | model / DTO class                    |

---

## 1. Web JSON.parse

Web：

```ts
const raw = '{"id":"1","title":"Cup"}';
const data = JSON.parse(raw);
```

TypeScript：

```ts
type Product = {
  id: string;
  title: string;
};

const product = JSON.parse(raw) as Product;
```

注意：

```text
as Product 不会做运行时校验；
只是告诉 TypeScript “相信我是 Product”。
```

---

## 2. Dart jsonDecode

Dart：

```dart
final raw = '{"id":"1","title":"Cup"}';
final data = jsonDecode(raw) as Map<String, dynamic>;
```

然后手动转模型：

```dart
final product = Product.fromJson(data);
```

---

## 3. 手写 fromJson / toJson

```dart
class Product {
  const Product({
    required this.id,
    required this.title,
  });

  final String id;
  final String title;

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] as String,
      title: json['title'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
    };
  }
}
```

小模型可以手写，但模型多了会重复且容易出错。

---

## 4. json_serializable

依赖通常是：

```yaml
dependencies:
  json_annotation: ^x.x.x

dev_dependencies:
  json_serializable: ^x.x.x
  build_runner: ^x.x.x
```

模型：

```dart
import 'package:json_annotation/json_annotation.dart';

part 'product.g.dart';

@JsonSerializable()
class Product {
  const Product({
    required this.id,
    required this.title,
  });

  final String id;
  final String title;

  factory Product.fromJson(Map<String, dynamic> json) =>
      _$ProductFromJson(json);

  Map<String, dynamic> toJson() => _$ProductToJson(this);
}
```

生成：

```bash
dart run build_runner build
```

生成文件：

```text
product.g.dart
```

里面包含：

```dart
_$ProductFromJson
_$ProductToJson
```

---

## 5. Freezed + json_serializable

复杂不可变模型常用：

```dart
@freezed
abstract class Product with _$Product {
  const factory Product({
    required String id,
    required String title,
  }) = _Product;

  factory Product.fromJson(Map<String, dynamic> json) =>
      _$ProductFromJson(json);
}
```

它会生成：

```text
copyWith
==
hashCode
toString
fromJson/toJson
```

对应 Web 中常见的：

```text
类型模型 + immutable update + JSON mapper
```

---

## 6. JSON Encode

Web：

```ts
const body = JSON.stringify(product);
```

Dart：

```dart
final body = jsonEncode(product.toJson());
```

Dio 中通常可以直接传 Map：

```dart
await dio.post(
  '/products',
  data: product.toJson(),
);
```

---

## 7. 字段名映射

后端字段：

```json
{
  "product_id": "1"
}
```

Dart 字段：

```dart
@JsonKey(name: 'product_id')
final String productId;
```

完整：

```dart
@JsonSerializable()
class Product {
  const Product({
    required this.productId,
  });

  @JsonKey(name: 'product_id')
  final String productId;

  factory Product.fromJson(Map<String, dynamic> json) =>
      _$ProductFromJson(json);
}
```

---

## 8. 核心差异

Web：

```text
JSON.parse 得到运行时 object；
TypeScript interface 不会自动验证 JSON；
需要 zod/io-ts 等做运行时校验。
```

Dart：

```text
jsonDecode 得到 Map/List；
json_serializable 生成强类型模型转换代码；
类型转换错误会在运行时暴露。
```

一句话理解：

```text
JSON.parse/stringify 是 Web 的基础 JSON API；
Dart 对应 jsonDecode/jsonEncode。
Flutter 项目里更常用 json_serializable 生成 fromJson/toJson，
把 Map<String, dynamic> 转成强类型 model，减少手写解析代码。
```
