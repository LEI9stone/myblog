---
title: Install
date: 2026-05-11
tags:
  - flutter
  - app
  - web
---

# PWA Install vs Native App Install

Web 里的 PWA Install 是把网站“安装”到桌面或手机主屏幕。

Flutter iOS/Android 的 Native App Install 是安装真正的原生应用包。

可以这样映射：

| PWA Install         | Native App Install            |
| ------------------- | ----------------------------- |
| Add to Home Screen  | 安装 App                      |
| Web App Manifest    | AndroidManifest / Info.plist  |
| Service Worker      | App 原生运行环境              |
| 浏览器承载          | iOS / Android 系统承载        |
| URL 入口            | App icon / deep link          |
| 部署到 Web 服务器   | 发布到 App Store / Play Store |
| 浏览器权限模型      | 原生权限模型                  |
| Web Storage         | App 本地存储                  |
| Web Push            | APNs / FCM                    |
| 自动获取新 Web 版本 | 需要应用商店更新或热更新方案  |

---

## 1. PWA Install

PWA 本质仍然是 Web App。

用户安装后，系统会把它放到主屏幕，看起来像 App，但运行时仍然依赖浏览器能力。

PWA 依赖：

```text
manifest.json
Service Worker
HTTPS
浏览器支持
缓存策略
```

安装后通常可以：

```text
从主屏幕打开
隐藏浏览器地址栏
离线访问部分内容
接收部分平台支持的推送
```

---

## 2. Native App Install

Flutter iOS/Android App 是原生应用安装包。

Android：

```text
APK / AAB
```

iOS：

```text
IPA / App Store 安装包
```

安装后运行在系统 App 沙盒中，通过 Flutter Engine 渲染 UI，并通过插件访问原生能力。

---

## 3. 更新方式差异

PWA：

```text
服务端部署新版本
用户下次打开或刷新后逐步更新
Service Worker 控制缓存更新策略
```

Native App：

```text
构建新版本
提交商店审核
用户更新 App
线上会同时存在多个旧版本
```

这意味着 Native App 更要重视：

```text
接口向后兼容
数据库 migration
旧版本兼容
灰度发布
版本号管理
```

---

## 4. 能力差异

PWA 能力受浏览器限制。

Native App 能力更完整，例如：

```text
相机
相册
蓝牙
定位
推送
支付
后台任务
安全存储
深链
传感器
文件系统
```

Flutter 通过 plugin 调用这些平台能力。

---

## 5. 分发差异

PWA 分发：

```text
发一个 URL
用户浏览器打开
可选择添加到主屏幕
```

Native App 分发：

```text
App Store
Google Play
企业分发
TestFlight
内测渠道
```

Native App 分发成本更高，但平台能力、品牌入口和用户留存通常更强。

---

一句话理解：

```text
PWA Install 是把 Web App 以类 App 形式安装到主屏幕；
Native App Install 是安装真正的 iOS/Android 应用。
PWA 更新更快、分发更轻；
Native App 平台能力更强，但构建、签名、审核和版本兼容成本更高。
```
