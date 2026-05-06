---
title: 前端工程师的flutter应用开发指南
date: 2026-04-28
tags:
  - flutter
  - app
  - web
---

# 前端工程师的flutter应用开发指南

这是一个系列，会将前端的相关概念对Flutter中相关概念映射。

## 0. 开始之前：Web 到 Flutter 的心智模型迁移

- [0.1 浏览器运行时 vs Flutter 渲染引擎](./web到Flutter的心智模型迁移/001-浏览器运行时vsFlutter渲染引擎.md)
- [0.2 DOM/CSSOM vs Widget/Element/RenderObject](./web到Flutter的心智模型迁移/002-DOM&CSSOMvsWidget&Element&RenderObject.md)
- [0.3 Web App 生命周期 vs Flutter App 生命周期](./web到Flutter的心智模型迁移/003-Web%20App%20生命周期%20vs%20Flutter%20App%20生命周期.md)
- [0.4 SPA 应用结构 vs Flutter 应用结构](./web到Flutter的心智模型迁移/004-SPA应用结构vsFlutter应用结构.md)
- [0.5 React/Vue/Svelte 开发体验 vs Flutter 开发体验](./web到Flutter的心智模型迁移/005-React&Vue&Svelte开发体验vsFlutter开发体验.md)

## 1. 项目结构与工程化概念映射

- [1.1 `package.json` vs `pubspec.yaml`](./项目结构与工程化/001-package.json-vs-pubspec.yaml.md)
- [1.2 npm/yarn/pnpm vs pub](./项目结构与工程化/002-npm-vs-pub.md)
- [1.3 Vite/Webpack/Next.js 工程结构 vs Flutter 工程结构](./项目结构与工程化/003-Vite-Webpack-Next.js工程结构-vs-Flutter工程结构.md)
- [1.4 `src/` 目录 vs `lib/` 目录](./项目结构与工程化/004-src目录-vs-lib目录.md)
- [1.5 静态资源管理：public/assets vs Flutter assets](./项目结构与工程化/005-静态资源管理-public-assets-vs-Flutter-assets.md)
- [1.6 环境配置：`.env` vs Flutter 环境配置](./项目结构与工程化/006-env-vs-Flutter-环境配置.md)
- [1.7 Lint/Format：ESLint/Prettier vs Dart Analyzer/dart format](./项目结构与工程化/007-Lint-Format.md)
- [1.8 Codegen：前端代码生成 vs Flutter build_runner](./项目结构与工程化/008-代码生成.md)

## 2. Dart 基础：从 JavaScript/TypeScript 映射到 Dart

- [2.1 JavaScript Runtime vs Dart Runtime](./js和dart/001-运行时.md)
- [2.2 TypeScript 类型系统 vs Dart 类型系统](./js和dart/002-类型系统.md)
- [2.3 `let/const` vs `final/const/var`](./js和dart/003-变量声明.md)
- [2.4 Interface/Type Alias vs Class/Abstract Class/Extension](./js和dart/004-类型声明.md)
- [2.5 Union Type vs sealed class / enum / Freezed](./js和dart/005-联合类型.md)
- [2.6 Optional/Nullable vs Dart Null Safety](./js和dart/006-空类型安全.md)
- [2.7 Promise/async/await vs Future/async/await](./js和dart/007-异步.md)
- [2.8 Array/Object/Map vs List/Map/Record/Class](./js和dart/008-结构化数据.md)
- [2.9 Module Import/Export vs Dart Import/Export](./js和dart/009-模块.md)
- [2.10 泛型：TypeScript Generics vs Dart Generics](./js和dart/010-泛型.md)
- [2.11 函数式写法：JS 高阶函数 vs Dart 函数对象](./js和dart/011-函数式写法.md)
- [2.12 错误处理：try/catch vs Dart Exception/Error](./js和dart/012-错误处理.md)

## 3. UI 基础：HTML/CSS 到 Flutter Widget

- [3.1 HTML 标签 vs Flutter Widget](./基础UI/001-标签.md)
- [3.2 DOM Tree vs Widget Tree](./基础UI/002-页面树.md)
- [3.3 CSS Box Model vs Flutter Layout Model](./基础UI/003-盒模型.md)
- [3.4 CSS Display/Flex/Grid vs Flutter Row/Column/Grid](./基础UI/004-布局.md)
- [3.5 CSS Position vs Stack/Positioned/Align](./基础UI/005-定位.md)
- [3.6 CSS Overflow vs Clip/ScrollView](./基础UI/006-溢出隐藏.md)

### 3.7 CSS Units vs Flutter Logical Pixels

### 3.8 Media Query vs Flutter MediaQuery/LayoutBuilder

### 3.9 Responsive Web vs Flutter 多屏适配

### 3.10 Web 可访问性 vs Flutter Semantics

---

## 4. 布局与盒模型概念映射

### 4.1 `div` 容器 vs Container/SizedBox/Padding

### 4.2 Flexbox vs Row/Column/Flex/Expanded

### 4.3 CSS Grid vs GridView/SliverGrid

### 4.4 Margin/Padding vs Padding/Container margin

### 4.5 Width/Height vs Constraints

### 4.6 min/max-width vs BoxConstraints

### 4.7 z-index vs Stack 层级

### 4.8 position absolute/fixed/sticky vs Positioned/Overlay/Sliver

### 4.9 overflow scroll vs SingleChildScrollView/ListView/CustomScrollView

### 4.10 viewport vs MediaQuery/SafeArea

---

## 5. 视觉样式与主题系统概念映射

### 5.1 CSS Class vs Widget 参数

### 5.2 Inline Style vs Flutter Widget 构造参数

### 5.3 CSS Variables vs ThemeExtension/InheritedWidget

### 5.4 Design Tokens vs AppTheme/AppColors/AppTextStyles

### 5.5 CSS Cascade vs Flutter 显式样式传递

### 5.6 CSS Selector vs Widget Composition

### 5.7 Font/Text Style vs TextStyle

### 5.8 Border/Radius/Shadow vs BoxDecoration

### 5.9 SVG/IconFont/Image vs flutter_svg/Icon/Image

### 5.10 Light/Dark Theme vs ThemeData

---

## 6. 动画与交互概念映射

### 6.1 CSS Transition vs AnimatedContainer/AnimatedOpacity

### 6.2 CSS Animation vs AnimationController

### 6.3 requestAnimationFrame vs Ticker

### 6.4 Framer Motion vs Flutter Animation APIs

### 6.5 Hover/Active/Focus vs GestureDetector/InkWell/Focus

### 6.6 Web Gesture Events vs Flutter Gesture System

### 6.7 Page Transition vs Route Transition

### 6.8 Skeleton Loading vs Shimmer

### 6.9 Loading State Animation vs Flutter Loading Widgets

---

## 7. 组件开发概念映射

### 7.1 React Component vs Flutter Widget

### 7.2 Function Component vs StatelessWidget

### 7.3 Stateful Component vs StatefulWidget

### 7.4 Props vs Constructor Parameters

### 7.5 Children/Slots vs child/children/builder

### 7.6 Composition vs Widget Composition

### 7.7 Controlled Component vs State-driven Widget

### 7.8 Render Props vs Builder Pattern

### 7.9 Custom Hook vs Provider/Notifier/Controller

### 7.10 Component Library vs Core Widgets

### 7.11 Storybook vs Widget Preview/Golden Test

---

## 8. 状态管理概念映射

### 8.1 React useState vs StatefulWidget State

### 8.2 React Context vs InheritedWidget/Provider

### 8.3 Redux/Zustand/Jotai vs Riverpod

### 8.4 Server State vs AsyncValue/FutureProvider

### 8.5 Derived State vs Computed Provider

### 8.6 Global State vs App-level Provider

### 8.7 Local State vs Widget State

### 8.8 Cache State vs Repository/Provider Cache

### 8.9 State Mutation vs Immutable State

### 8.10 Side Effects vs Notifier/Controller/Effect Layer

---

## 9. 路由与页面导航概念映射

### 9.1 Browser URL vs Flutter Route

### 9.2 React Router vs go_router

### 9.3 Page Component vs Screen/Page Widget

### 9.4 Nested Routes vs ShellRoute/Nested Navigation

### 9.5 Query Params vs Route Query Parameters

### 9.6 Path Params vs Route Path Parameters

### 9.7 Navigation Guard vs Redirect/Auth Guard

### 9.8 Browser History vs Navigator Stack

### 9.9 Tab Navigation vs StatefulShellRoute/BottomNavigationBar

### 9.10 Deep Link vs App Link/Universal Link

---

## 10. 网络请求概念映射

### 10.1 fetch/axios vs dio

### 10.2 Request/Response Interceptor vs Dio Interceptor

### 10.3 REST API Client vs Repository/API Service

### 10.4 JSON.parse/stringify vs json_serializable

### 10.5 TypeScript DTO vs Dart Model

### 10.6 Loading/Error/Success State vs AsyncValue

### 10.7 Token Header vs Auth Interceptor

### 10.8 Request Cancellation vs CancelToken

### 10.9 Retry/Timeout vs Dio Options

### 10.10 API Mock vs Fake Repository/Test Client

---

## 11. 数据模型与序列化概念映射

### 11.1 TypeScript Interface vs Dart Model Class

### 11.2 Zod/Yup Schema vs json_serializable/freezed

### 11.3 Immutable Object vs Freezed Data Class

### 11.4 JSON DTO vs Domain Model

### 11.5 enum/string literal union vs Dart enum

### 11.6 Partial/Pick/Omit vs CopyWith/Model Split

### 11.7 Decimal/Number Precision vs decimal

### 11.8 API Schema vs Generated Model

---

## 12. 数据存储概念映射

### 12.1 localStorage vs shared_preferences

### 12.2 sessionStorage vs Runtime State

### 12.3 IndexedDB vs drift/sqlite

### 12.4 Cookie vs Secure Storage/Headers

### 12.5 Token Storage vs flutter_secure_storage

### 12.6 Cache Layer vs Repository Cache

### 12.7 Offline Data vs Local Database

### 12.8 Migration vs Drift Migration

### 12.9 Web Storage Security vs Mobile Secure Storage

---

## 13. 表单与输入概念映射

### 13.1 HTML Form vs Form Widget

### 13.2 Input/Textarea/Select vs TextField/Dropdown

### 13.3 Controlled Input vs TextEditingController

### 13.4 Form Validation vs Validator

### 13.5 React Hook Form vs Form State Management

### 13.6 Keyboard Events vs TextInputAction/FocusNode

### 13.7 File Upload vs Image Picker/File Picker

### 13.8 Mobile Keyboard UX vs Input Formatter/Focus Flow

---

## 14. 列表、滚动与复杂页面概念映射

### 14.1 map 渲染列表 vs ListView.builder

### 14.2 Virtual List vs Lazy List

### 14.3 Infinite Scroll vs ScrollController/Pagination

### 14.4 Pull to Refresh vs RefreshIndicator

### 14.5 Sticky Header vs SliverPersistentHeader

### 14.6 CSS Scroll Container vs CustomScrollView

### 14.7 Masonry Layout vs Staggered Grid

### 14.8 Empty/Error/Loading List State vs State View Widgets

---

## 15. 图片、视频与媒体资源概念映射

### 15.1 img 标签 vs Image Widget

### 15.2 Background Image vs DecorationImage

### 15.3 Lazy Image vs CachedNetworkImage

### 15.4 SVG vs flutter_svg

### 15.5 Video 标签 vs video_player

### 15.6 Fullscreen Video vs Overlay/Navigator

### 15.7 Image Placeholder vs Loading Skeleton

### 15.8 Asset Optimization vs Flutter Asset Pipeline

---

## 16. 应用架构概念映射

### 16.1 Web Feature Folder vs Flutter Feature Module

### 16.2 Components/Pages/Services vs Widgets/Pages/Repositories

### 16.3 API Layer vs Data Source

### 16.4 Business Logic vs Notifier/UseCase

### 16.5 Domain Model vs Entity/Model

### 16.6 UI State vs View State

### 16.7 Dependency Injection vs Provider Scope

### 16.8 Clean Architecture vs Flutter 分层架构

### 16.9 Monorepo Thinking vs Flutter App Module

---

## 17. 错误处理与异常状态概念映射

### 17.1 try/catch vs Dart Exception Handling

### 17.2 Error Boundary vs Flutter ErrorWidget/Zone

### 17.3 API Error State vs AsyncValue.error

### 17.4 Empty State vs Empty View

### 17.5 Retry UI vs Reload Callback

### 17.6 Global Error Toast vs ScaffoldMessenger/Dialog

### 17.7 Logging vs Flutter/Dart Logging

---

## 18. 测试概念映射

### 18.1 Jest/Vitest vs flutter_test

### 18.2 Unit Test vs Dart Test

### 18.3 React Testing Library vs Widget Test

### 18.4 E2E Test vs Integration Test

### 18.5 Snapshot Test vs Golden Test

### 18.6 Mock API vs Fake Repository

### 18.7 Component Test vs Widget Test

### 18.8 State Test vs Provider/Notifier Test

---

## 19. 调试与开发工具概念映射

### 19.1 Browser DevTools vs Flutter DevTools

### 19.2 Console Log vs debugPrint/logger

### 19.3 Network Panel vs Dio Log/Proxy

### 19.4 Elements Panel vs Widget Inspector

### 19.5 Performance Tab vs Flutter Performance View

### 19.6 Hot Reload vs Vite HMR

### 19.7 Source Map vs Dart Debug Symbols

---

## 20. 构建、发布与平台能力概念映射

### 20.1 Web Build vs Flutter Build

### 20.2 Browser Target vs iOS/Android Target

### 20.3 PWA Install vs Native App Install

### 20.4 CI/CD for Web vs CI/CD for Flutter

### 20.5 App Signing vs Web Deployment

### 20.6 Environment Build vs Flavor

### 20.7 Browser Permissions vs Native Permissions

### 20.8 Web APIs vs Flutter Plugins

---

## 21. 渐进式实战路线目录

### 21.1 第一个页面：从 HTML 页面到 Flutter 页面

### 21.2 第一个组件：从 React Component 到 StatelessWidget

### 21.3 第一个状态：从 useState 到 StatefulWidget/Riverpod

### 21.4 第一个列表页：从 map 渲染到 ListView.builder

### 21.5 第一个接口请求：从 axios 到 dio

### 21.6 第一个数据模型：从 TypeScript Interface 到 Freezed Model

### 21.7 第一个路由：从 React Router 到 go_router

### 21.8 第一个表单：从 HTML Form 到 Flutter Form

### 21.9 第一个缓存：从 localStorage 到 shared_preferences

### 21.10 第一个完整业务模块：页面、状态、接口、模型、存储闭环

---

## 22. 推荐学习顺序

### 22.1 Dart 语法与类型系统

### 22.2 Widget Tree 与布局模型

### 22.3 组件拆分与样式组织

### 22.4 状态管理与 Riverpod

### 22.5 路由与页面结构

### 22.6 网络请求与数据模型

### 22.7 本地存储与缓存

### 22.8 列表、滚动、图片、视频

### 22.9 测试与调试

### 22.10 工程化、构建与发布
