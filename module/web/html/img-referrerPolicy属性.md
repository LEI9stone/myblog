---
title: img referrerpolicy 属性
date: 2026-02-26
categories:
tags:
  - html
---

```html
<img src="xxx" referrerpolicy="no-referrer" />
```

`referrerPolicy="no-referrer"` 的作用是：当浏览器请求这张图片时，**不发送 `Referer` 请求头**。

**为什么需要它？**
很多图片服务器（特别是第三方图床、CDN）会配置**防盗链机制**——服务器检查请求中的 `Referer` 头，如果发现请求来源不是它允许的域名，就会拒绝返回图片（通常返回 403 或一张替代图片）。
加上 `referrerPolicy="no-referrer"` 后，浏览器请求图片时不会携带 `Referer` 头，大多数防盗链策略会放行"无 Referer"的请求，这样图片就能正常加载了。

**典型场景**： 你的项目域名是 `admin.example.com`，但图片存储在第三方服务上（如微信、淘宝、阿里云 OSS 等），如果不加这个属性，请求会带上 `Referer: https://admin.example.com`，被对方防盗链策略拦截，图片显示不出来。

<!-- more -->

**加上`referrerpolicy="no-referrer"`会导致防盗链策略失效，为什么还需要用？**

因为它防的不是"有意绕过的人"，而是**最常见的盗链场景**：别人直接把你的图片 URL 贴到他自己的网页里。这种情况下浏览器会自动带上对方网站的 `Referer`，防盗链就能识别并拦截。它挡住的是"大多数无意识的盗用"，是一种**低成本的基础防护**。

**更严格的防盗链方案：**
如果真的要防住所有情况，通常会用以下方式：

- **签名 URL（Token 防盗链）**——图片 URL 里包含一个有时效性的签名参数，如 `?sign=xxx&expire=1700000000`，服务器验证签名和过期时间，无法伪造。这是阿里云 OSS、腾讯云 COS 等主流方案。
- **Cookie 鉴权**——必须登录后才能访问资源，请求必须带有效 Cookie。
- **Referer 白名单 + 禁止空 Referer**——同时拒绝无 Referer 的请求，这样 `no-referrer` 就失效了。但副作用是直接在浏览器地址栏打开图片也会被拦截，体验不太好。

**总结**： `Referer` 防盗链本质上是"君子锁"，防的是大面积的随意盗用，不防有意绕过的人。真正需要严格保护的资源，会用签名 URL 等更强的机制。

**`referrerolicy` 的所有可选值如下：**
| 值 | 含义 |
| --- | --- |
| no-referrer | 完全不发送 `Referer` 头 |
| no-referrer-when-downgrade | HTTPS → HTTP 时不发送，其他情况发送完整 URL。浏览器默认值 |
| origin | 只发送源（协议+域名+端口），不包含路径。如 `https://example.com/page/1` → `https://example.com/` |
| origin-when-cross-origin | 同源请求发送完整 URL；跨域请求只发送源 |
| same-origin | 同源请求发送完整 URL；跨域请求不发送 |
| strict-origin | HTTPS → HTTP 时不发送；其他情况只发送源 |
| strict-origin-when-cross-origin | 同源发送完整 URL；跨域只发送源；HTTPS → HTTP 不发送。现代浏览器的实际默认值 |
| unsafe-url | 始终发送完整 URL（包含路径、查询参数），即使 HTTPS → HTTP 也发送。最不安全 |

**安全性从高到低：**
`no-referrer` > `same-origin` > `strict-origin` > `strict-origin-when-cross-origin` > `no-referrer-when-downgrade` > `origin-when-cross-origin` > `origin` > `unsafe-url`

你这里用的 `no-referrer` 是最严格的策略，完全不暴露来源信息，用来绕过防盗链是最合适的选择。
