---
title: Folder
date: 2026-05-11
tags:
  - flutter
  - app
  - web
---

# Web Feature Folder vs Flutter Feature Module

Web 项目里常按 feature 组织代码：

```text
features/product
features/order
features/search
```

Flutter 中也常按 feature module 组织：

```text
lib/features/product
lib/features/order
lib/features/search
```

区别是 Flutter feature 里通常会进一步按层拆分：

```text
presentation
application
domain
data
```

可以这样映射：

| Web Feature Folder | Flutter Feature Module           |
| ------------------ | -------------------------------- |
| `features/product` | `lib/features/product`           |
| `components`       | `presentation/widgets`           |
| `pages`            | `presentation/pages`             |
| `hooks`            | `application` / provider         |
| `store`            | `application` / notifier         |
| `services`         | `data` / repository              |
| `types`            | `domain` / `data/models`         |
| `api`              | `data/api` / remote data source  |
| `utils`            | feature-local utils / core utils |
| shared components  | `core/widgets`                   |

---

## 1. Web Feature Folder

Web 中常见：

```text
src/features/product/
  pages/
    ProductListPage.tsx
    ProductDetailPage.tsx
  components/
    ProductCard.tsx
  hooks/
    useProducts.ts
  services/
    productApi.ts
  types/
    product.ts
```

这种结构的目标是：

```text
按业务聚合代码；
减少 pages/components/services 到处散落；
提升可维护性。
```

---

## 2. Flutter Feature Module

Flutter 常见：

```text
lib/features/product/
  presentation/
    pages/
      product_list_page.dart
      product_detail_page.dart
    widgets/
      product_card.dart
  application/
    product_list_provider.dart
    product_detail_notifier.dart
  domain/
    models/
      product.dart
    repositories/
      product_repository.dart
  data/
    models/
      product_dto.dart
    repositories/
      remote_product_repository.dart
    datasources/
      product_api_service.dart
```

不同团队会简化或调整，但核心是：

```text
presentation：UI
application：状态和用例编排
domain：业务模型和抽象
data：接口、本地数据、DTO、Repository 实现
```

---

## 3. 分层映射

| 层       | Web 常见          | Flutter 常见           |
| -------- | ----------------- | ---------------------- |
| UI 页面  | `pages`           | `presentation/pages`   |
| UI 组件  | `components`      | `presentation/widgets` |
| 状态逻辑 | `hooks` / `store` | `application`          |
| 业务类型 | `types`           | `domain/models`        |
| API 请求 | `services/api`    | `data/datasources`     |
| 数据封装 | `services`        | `data/repositories`    |
| 依赖抽象 | interface         | `domain/repositories`  |

---

## 4. core vs features

Flutter 项目通常会有：

```text
lib/core/
```

放跨 feature 复用的内容：

```text
router
theme
widgets
network
storage
utils
errors
```

feature module 放业务相关内容：

```text
product
order
cart
user
search
```

判断：

```text
多个 feature 都用 → core
只属于一个业务 → features/xxx
```

---

## 5. 小项目可以简化

不一定每个 feature 都要完整四层。

小功能可以：

```text
features/search/
  search_page.dart
  search_provider.dart
```

中大型功能再拆：

```text
presentation/application/domain/data
```

不要为了架构形式创建大量空目录。

---

## 6. 推荐渐进式结构

初期：

```text
features/product/
  product_page.dart
  product_provider.dart
  product_repository.dart
  product_model.dart
```

复杂后：

```text
features/product/
  presentation/
  application/
  domain/
  data/
```

这样更符合实际演进。

---

一句话理解：

```text
Web Feature Folder 和 Flutter Feature Module 都是按业务聚合代码；
Flutter 中通常进一步按 presentation/application/domain/data 分层。
小功能可以轻量组织，
复杂业务再拆成完整 feature module。
```
