---
title: Network
date: 2026-05-11
tags:
  - flutter
  - app
  - web
---

# Network Panel vs Dio Log / Proxy

Web 里 Browser DevTools 的 Network Panel 可以直接查看页面发出的请求、响应、Header、Payload、耗时和状态码。

Flutter 没有浏览器 Network Panel 那种天然内置入口，常用组合是：

```text
Flutter DevTools Network
Dio LogInterceptor
Charles / Proxyman / mitmproxy
后端日志
自定义 request logger
```

可以这样映射：

| Browser Network Panel | Flutter                    |
| --------------------- | -------------------------- |
| XHR/fetch list        | Flutter DevTools Network   |
| request headers       | Dio LogInterceptor / proxy |
| response body         | Dio LogInterceptor / proxy |
| payload               | Dio logs / proxy           |
| timing                | DevTools / proxy           |
| status code           | Dio response / logs        |
| cookie inspection     | CookieJar / proxy          |
| cache info            | repository/cache logs      |
| HAR export            | proxy 工具导出             |

---

## 1. Web Network Panel

Web DevTools 可以看到：

```text
URL
method
status code
request headers
response headers
query params
request body
response body
timing
cookies
cache
```

因为浏览器掌控网络栈。

---

## 2. Flutter DevTools Network

Flutter DevTools 提供 Network view，可以观察部分 HTTP 请求。

但在实际 Flutter App 开发中，经常还需要配合：

```text
Dio 日志
代理抓包
后端日志
```

尤其是要看完整 header、body、HTTPS 请求细节时。

---

## 3. Dio LogInterceptor

Dio 中可以加：

```dart
dio.interceptors.add(
  LogInterceptor(
    request: true,
    requestHeader: true,
    requestBody: true,
    responseHeader: false,
    responseBody: true,
    error: true,
  ),
);
```

通常只在 debug 环境开启：

```dart
if (kDebugMode) {
  dio.interceptors.add(LogInterceptor(...));
}
```

---

## 4. 日志脱敏

不要直接在日志里打印敏感信息：

```text
Authorization
Cookie
refresh token
password
手机号
地址
支付信息
身份证
```

如果需要打请求日志，建议自定义 interceptor 做脱敏：

```text
Authorization: Bearer ***
```

生产环境通常关闭 response body 日志。

---

## 5. Proxy 抓包

常用工具：

```text
Charles
Proxyman
mitmproxy
Fiddler
```

适合检查：

```text
真实设备请求
HTTPS header/body
请求是否真的发出
证书问题
重定向
接口耗时
服务端响应
图片/文件下载
```

移动端抓 HTTPS 通常需要：

```text
设备设置代理
安装并信任 CA 证书
Android 网络安全配置
iOS 证书信任配置
```

---

## 6. Dio 日志 vs Proxy 怎么选

| 场景                     | 推荐                        |
| ------------------------ | --------------------------- |
| 开发期快速看接口数据     | Dio LogInterceptor          |
| 看真实设备完整网络       | Proxy                       |
| 排查 HTTPS/证书/代理问题 | Proxy                       |
| 排查业务解析错误         | Dio log + Repository log    |
| 排查接口慢               | DevTools / Proxy / 后端日志 |
| 生产问题                 | 远程日志 + 后端链路追踪     |

---

## 7. Repository 日志

除了网络层，还可以在 Repository 记录业务语义日志：

```text
fetchProducts start
fetchProducts success count=20
fetchProducts failed ApiException(...)
```

这比单纯 HTTP 日志更贴近业务排查。

---

一句话理解：

```text
Web Network Panel 是浏览器内置网络调试入口；
Flutter 中通常用 Flutter DevTools Network 看概览，
用 Dio LogInterceptor 看开发期请求响应，
用 Charles/Proxyman/mitmproxy 这类代理工具做完整抓包。
注意所有网络日志都要脱敏。
```
