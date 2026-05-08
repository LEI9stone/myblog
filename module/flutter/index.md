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

- [1-运行时](./web到Flutter的心智模型迁移/001-运行时.md)
- [2-渲染树](./web到Flutter的心智模型迁移/002-渲染树.md)
- [3-声明周期](./web到Flutter的心智模型迁移/003-声明周期.md)
- [4-应用结构](./web到Flutter的心智模型迁移/004-应用结构.md)
- [5-开发体验](./web到Flutter的心智模型迁移/005-开发体验.md)

## 1. 项目结构与工程化概念映射

- [1-依赖管理](./项目结构与工程化/001-依赖管理.md)
- [2-包管理](./项目结构与工程化/002-包管理.md)
- [3-工程化](./项目结构与工程化/003-工程化.md)
- [4-项目结构](./项目结构与工程化/004-项目结构.md)
- [5-静态资源](./项目结构与工程化/005-静态资源.md)
- [6-环境配置](./项目结构与工程化/006-环境配置.md)
- [7-代码质量](./项目结构与工程化/007-代码质量.md)
- [8-代码生成](./项目结构与工程化/008-代码生成.md)

## 2. Dart 基础：从 JavaScript/TypeScript 映射到 Dart

- [1-运行时](./js和dart/001-运行时.md)
- [2-类型系统](./js和dart/002-类型系统.md)
- [3-变量声明](./js和dart/003-变量声明.md)
- [4-类型声明](./js和dart/004-类型声明.md)
- [5-联合类型](./js和dart/005-联合类型.md)
- [6-空类型安全](./js和dart/006-空类型安全.md)
- [7-异步](./js和dart/007-异步.md)
- [8-结构化数据](./js和dart/008-结构化数据.md)
- [9-模块](./js和dart/009-模块.md)
- [10-泛型](./js和dart/010-泛型.md)
- [11-函数式写法](./js和dart/011-函数式写法.md)
- [12-错误处理](./js和dart/012-错误处理.md)

## 3. UI 基础：HTML/CSS 到 Flutter Widget

- [1-标签](./基础UI/001-标签.md)
- [2-页面树](./基础UI/002-页面树.md)
- [3-盒模型](./基础UI/003-盒模型.md)
- [4-布局](./基础UI/004-布局.md)
- [5-定位](./基础UI/005-定位.md)
- [6-溢出隐藏](./基础UI/006-溢出隐藏.md)
- [7-样式单位](./基础UI/007-样式单位.md)
- [8-媒体查询](./基础UI/008-媒体查询.md)
- [9-多屏适配](./基础UI/009-多屏适配.md)
- [10-可访问性](./基础UI/010-可访问性.md)

## 4. 布局与盒模型概念映射

- [1-通用容器](./布局与盒模型/001-通用容器.md)
- [2-flex容器](./布局与盒模型/002-flex容器.md)
- [3-grid容器](./布局与盒模型/003-grid容器.md)
- [4-盒间距](./布局与盒模型/004-盒间距.md)
- [5-盒宽度](./布局与盒模型/005-盒宽度.md)
- [6-尺寸边界](./布局与盒模型/006-尺寸边界.md)
- [7-盒层级](./布局与盒模型/007-盒层级.md)
- [8-定位](./布局与盒模型/008-定位.md)
- [9-溢出滚动](./布局与盒模型/009-溢出滚动.md)
- [10-viewport](./布局与盒模型/010-viewport.md)

## 5. 视觉样式与主题系统概念映射

- [1-样式命名](./样式系统/001-样式命名.md)
- [2-内联样式](./样式系统/002-内联样式.md)
- [3-样式变量](./样式系统/003-样式变量.md)
- [4-Design Tokens](./样式系统/004-Design-Tokens.md)
- [5-样式层叠](./样式系统/005-样式层叠.md)
- [6-样式选择器](./样式系统/006-样式选择器.md)
- [7-字体样式](./样式系统/007-字体样式.md)
- [8-盒外观](./样式系统/008-盒外观.md)
- [9-字体图标](./样式系统/009-字体图标.md)
- [10-样式主题](./样式系统/010-样式主题.md)

## 6. 动画与交互概念映射

- [1-Transition](./动画/001-Transition.md)
- [2-Animation](./动画/002-Animation.md)
- [3-requestAnimationFrame](./动画/003-requestAnimationFrame.md)
- [4-动画库](./动画/004-动画库.md)
- [5-伪类状态](./动画/005-伪类状态.md)
- [6-交互事件](./动画/006-交互事件.md)
- [7-页面过渡](./动画/007-页面过渡.md)
- [8-骨架屏](./动画/008-骨架屏.md)
- [9-加载态](./动画/009-加载态.md)

## 7. 组件开发概念映射

- [1-React组件](./组件/001-React组件.md)
- [2-函数式组件](./组件/002-函数式组件.md)
- [3-状态组件](./组件/003-状态组件.md)
- [4-Props](./组件/004-Props.md)
- [5-Children](./组件/005-Children.md)
- [6-Composition](./组件/006-Composition.md)
- [7-受控组件](./组件/007-受控组件.md)
- [8-渲染函数](./组件/008-渲染函数.md)
- [9-状态管理](./组件/009-状态管理.md)
- [10-组件封装](./组件/010-组件封装.md)
- [11-组件调试](./组件/011-组件调试.md)

## 8. 状态管理概念映射

- [1-内部状态](./状态管理/001-内部状态.md)
- [2-状态传递](./状态管理/002-状态传递.md)
- [3-状态管理方案](./状态管理/003-状态管理方案.md)
- [4-接口状态管理](./状态管理/004-接口状态管理.md)
- [5-计算状态](./状态管理/005-计算状态.md)
- [6-全局状态](./状态管理/006-全局状态.md)
- [7-局部状态](./状态管理/007-局部状态.md)
- [8-缓存数据](./状态管理/008-缓存数据.md)
- [9-单一数据流](./状态管理/009-单一数据流.md)
- [10-状态副作用](./状态管理/010-状态副作用.md)

### 8.10 Side Effects vs Notifier/Controller/Effect Layer

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

## 11. 数据模型与序列化概念映射

### 11.1 TypeScript Interface vs Dart Model Class

### 11.2 Zod/Yup Schema vs json_serializable/freezed

### 11.3 Immutable Object vs Freezed Data Class

### 11.4 JSON DTO vs Domain Model

### 11.5 enum/string literal union vs Dart enum

### 11.6 Partial/Pick/Omit vs CopyWith/Model Split

### 11.7 Decimal/Number Precision vs decimal

### 11.8 API Schema vs Generated Model

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

## 13. 表单与输入概念映射

### 13.1 HTML Form vs Form Widget

### 13.2 Input/Textarea/Select vs TextField/Dropdown

### 13.3 Controlled Input vs TextEditingController

### 13.4 Form Validation vs Validator

### 13.5 React Hook Form vs Form State Management

### 13.6 Keyboard Events vs TextInputAction/FocusNode

### 13.7 File Upload vs Image Picker/File Picker

### 13.8 Mobile Keyboard UX vs Input Formatter/Focus Flow

## 14. 列表、滚动与复杂页面概念映射

### 14.1 map 渲染列表 vs ListView.builder

### 14.2 Virtual List vs Lazy List

### 14.3 Infinite Scroll vs ScrollController/Pagination

### 14.4 Pull to Refresh vs RefreshIndicator

### 14.5 Sticky Header vs SliverPersistentHeader

### 14.6 CSS Scroll Container vs CustomScrollView

### 14.7 Masonry Layout vs Staggered Grid

### 14.8 Empty/Error/Loading List State vs State View Widgets

## 15. 图片、视频与媒体资源概念映射

### 15.1 img 标签 vs Image Widget

### 15.2 Background Image vs DecorationImage

### 15.3 Lazy Image vs CachedNetworkImage

### 15.4 SVG vs flutter_svg

### 15.5 Video 标签 vs video_player

### 15.6 Fullscreen Video vs Overlay/Navigator

### 15.7 Image Placeholder vs Loading Skeleton

### 15.8 Asset Optimization vs Flutter Asset Pipeline

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

## 17. 错误处理与异常状态概念映射

### 17.1 try/catch vs Dart Exception Handling

### 17.2 Error Boundary vs Flutter ErrorWidget/Zone

### 17.3 API Error State vs AsyncValue.error

### 17.4 Empty State vs Empty View

### 17.5 Retry UI vs Reload Callback

### 17.6 Global Error Toast vs ScaffoldMessenger/Dialog

### 17.7 Logging vs Flutter/Dart Logging

## 18. 测试概念映射

### 18.1 Jest/Vitest vs flutter_test

### 18.2 Unit Test vs Dart Test

### 18.3 React Testing Library vs Widget Test

### 18.4 E2E Test vs Integration Test

### 18.5 Snapshot Test vs Golden Test

### 18.6 Mock API vs Fake Repository

### 18.7 Component Test vs Widget Test

### 18.8 State Test vs Provider/Notifier Test

## 19. 调试与开发工具概念映射

### 19.1 Browser DevTools vs Flutter DevTools

### 19.2 Console Log vs debugPrint/logger

### 19.3 Network Panel vs Dio Log/Proxy

### 19.4 Elements Panel vs Widget Inspector

### 19.5 Performance Tab vs Flutter Performance View

### 19.6 Hot Reload vs Vite HMR

### 19.7 Source Map vs Dart Debug Symbols

## 20. 构建、发布与平台能力概念映射

### 20.1 Web Build vs Flutter Build

### 20.2 Browser Target vs iOS/Android Target

### 20.3 PWA Install vs Native App Install

### 20.4 CI/CD for Web vs CI/CD for Flutter

### 20.5 App Signing vs Web Deployment

### 20.6 Environment Build vs Flavor

### 20.7 Browser Permissions vs Native Permissions

### 20.8 Web APIs vs Flutter Plugins
