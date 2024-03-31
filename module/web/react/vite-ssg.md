---
title: Vite React SSG 实践历程
date: 2023-08-18
tags:
  - React
  - Vite
---

你好，我是小磊。这段期间，用自己的一点业余时间探索了一下 SSG 工程。在实践 SSG 工程的期间遇到了不少问题及挑战，所以记录一下是如何踩坑以及爬坑的。

为什么只说 SSG 工程？因为SSG 工程有公司项目的落地应用。虽然只是一个小的场景，但也确实在生产环境中应用。

既然想说 SSG 工程的实践，那么必不可少的要说到 SSR 工程。如果用父子关系比喻 SSR 工程和 SSG 工程，那么 SSR 工程是父亲，SSG是孩子。也就说，SSG 是在 SSR 之上的。如果跑不通 SSR流程，那么 SSG 必不可能跑通。

文章结构大致为：

+ SSR 和 SSG 的定义
+ SSG 实践
+ 如何处理热更新问题
+ 引入 antd 组件库
+ 原有项目的改造，实现部分 SSG，部分 SPA。

**SSR 和 SSG 的定义只是个人拙见，如果对 SSR和 SSG 的相关概念已有了解，请跳过这部分，就不必浪费时间了。**

<!-- more -->

## SSR 和 SSG的定义

对于 SSR 和 SSG 的概念，想必大家都看了不少文章以及各个框架、组件库对 SSR 的介绍。在这里，还是说说个人的对 SSR 和 SSG 的理解。

通常，我们使用 React 或者 Vue 等框架开发应用的时候，它们所构建的应用是 SPA 应用，也就是加载完 JS文件后动态生成 HTML 片段并呈现出客户界面。这一系列的动作都是在客户端完成的。而现如今各终端设备的性能溢出，是完全可以在极快的速度内渲染出客户界面，所以对于用于的感知来讲，影响并不大。而对于开发效率来讲，对比以前的 JSP 等方式却极大的提高了团队协作效率及工作效率。

既然 SPA 应用有这么多优势，为啥要衍生出 SSR 场景和 SSG 呢？因为 SPA应用对 SEO 并不友好。而搜索引擎（SEO）的流量说不定是某些项目的重要收入来源。虽然现阶段的微信、抖音等头部应用吃掉了极大的流量，而这些头部应用正在构建自己的内容生态，逐步蚕食搜索引擎的市场。但现阶段的模式还未发生根本性的改变。正因为web 的开放包容生态，当人们在微信、抖音等头部应用上找不到他们想要的内容时，那么通过浏览器去查找资料是必不可少的方式。

所以，SSR出现说明了人类面对选择题时，答案是既要又要。既要团队协作的提升，也要项目对 SEO 友好。而 SSR是怎么解决SEO 的问题？答案是，服务端渲染。

### SSR 服务端渲染

服务端渲染，也就是当服务器接收到请求时，在服务器上生成 HTML 片段。这个请求是人类通过页面交互发出的也好，还是搜索引擎爬虫的收录也好，都会生成 HTML 片段。而 HTML 片段中的语义化结构及 `<meta />` 标签中所定义的元信息可以让搜素引擎更好的帮助使用浏览器的人找到他想找的答案，也就是某个项目的某个页面。

通过 SSR工程的方式，企业提供的服务可以有更多曝光的机会，流量的增加也就有可能会让企业的收入更高。

以上，是我对 SRR 工程的理解。

### SSG 预渲染

SSG 预渲染，是将静态部分的内容不通过服务器来来生成 HTML 片段，而是在项目构建的过程中直接生成 HTML 片段。这段话中有几个概念：

+ 静态部分的内容
+ 工程构建时生成 HTML片段

何为静态部分的内容？通俗的解释，小明和小红看到的网页内容是一样的。这部分内容无论是谁来访问，都是一模一样的，不会针对任何用户做动态改变。这种静态内容对应的场景是：新闻、博客、电商的商品详情页、企业的门户网站等。

如果小红和小明都来访问同一个商品详情页，而在服务端去生成商品详情页的 HTML 片段，那么服务端就要生成两次，但是内容却一模一样的。这就是资源的浪费了。

所以，这部分内容应该在什么时候去生成？也就是应用打包的时候去生成对应的 HTML 文件，这就是 SSG 预渲染。SSG 生成的 HTML 文件放在服务器上，如果用户访问了该文件，那么服务端是不需要再生成一遍了，因为已经存在了这个文件。

以上，是我对 SSG 预渲染的理解。

了解完概念之后，我们就开始打怪升级吧。

## SSG 实践

先创建一个 Vite + React 的工程目录并且安装依赖

```base
## 创建一个 react-ssg 的工程目录
pnpm create vite
## 进入到该目录下
cd react-ssg
## 安装依赖
pnpm install
```

工程目录创建完成之后，大概是这个样子的：

```diff
+	react-ssg
+ 	public
+ 	src
+			assets
+			App.css
+			App.tsx
+			index.css
+			main.tsx
+			vite-env.d.ts
+  	.eslintrc.cjs
+  	.gitignore
+  	index.html
+  	package.json
+  	README.md
+		tsconfig.json
+		tsconfig.node.json
+		vite.config.ts
```

我们在 src 目录下在新增一个 pages 目录，并且创建 Home.tsx 和 About.tsx。然后将 src 目录下的 App.css、App.tsx、index.css 这三个文件删除掉。改动完之后的 src 目录如下：

```diff
	src
		assets
+		pages
+			Home.tsx
+			About.tsx
-		App.css
-		App.tsx
-		index.css
		main.tsx
		vite-env.d.ts
```

在 Home.tsx 和 About.tsx 页面中随便写一点内容吧。

```tsx
// Home.tsx 页面
function Home() {
  return <div>Home 页面</div>
}
export default Home;

// About.tsx 页面
function About() {
  return <div>About 页面</div>
}
export default About;
```

将 src 目录下的 main.tsx 文件内容改成以下内容

```tsx
import {Routes, Route, Link} from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About'

export default function App() {
  return <>
    <div>
      <Link to="/"> 首页 </Link>
      <Link to="/about"> 我的页面 </Link>
    </div>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </>
}
```

然后在 src 目录下再新增两个文件，一个是 entry-client.tsx文件，这将会是客户端 SSG 水合的入口文件。一个是 entry-server.tsx，这是用于在服务端将React的内容输出为 HTML 片段的。

```diff
	src
		assets
		pages
			Home.tsx
			About.tsx
		main.tsx
+		entry-client.tsx
+		entry-server.tsx
		vite-env.d.ts
```

在 entry-client.tsx 文件中写入客户端水合的逻辑。

```tsx
import ReactDom from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./main.tsx";

ReactDom.hydrateRoot(
  document.getElementById("app")!,
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

在 entry-server.tsx 文件中写入服务端react-to-html 的逻辑。

```tsx
import ReactDOMServer from 'react-dom/server';
import {StaticRouter} from 'react-router-dom/server';
import App from './App';

export function SSRRender(url: string | Partial<Location>) {
  return ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  )
}
```

找到根目录下的 index.html 文件，做以下修改：

```diff
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
  </head>
  <body>
-		 <div id="root"></div>
+		 <div id="app"><!--app-html--></div>
-    <script type="module" src="/src/main.tsx"></script>
+     <script type="module" src="/src/entry-client.tsx"></script>
  </body>
</html>
```

至此，我们已经快要将 CSR 项目改造成 SSG 项目了。不过还缺少两个至关重要的文件，一个是 SSR 服务的启动文件，另一个是 SSG 的构建文件。

我们在根目录下新增两个文件，如下：

```diff
	react-ssg
	 	public
	 	src
  	.eslintrc.cjs
  	.gitignore
  	index.html
  	package.json
+  	prerender.js
  	README.md
+  	server.js
		tsconfig.json
		tsconfig.node.json
		vite.config.ts
```

然后在`server.js`文件中写入服务端的`SSR`逻辑，别忘记通过 pnpm 安装下 express 和 serve-static 的依赖了。

```javascript
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'url';
import express from 'express';
import serveStatic from 'serve-static';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

export async function createServer() {
  const resolve = (p) => path.resolve(__dirname, p);
  app.use(await serveStatic(resolve('dist/client'), {
    index: false,
  }));
  app.use('*', async (req, res) => {
    const url = '/';
    const template = fs.readFileSync(resolve('dist/client/index.html'), 'utf-8');
    const render = (await import('./dist/server/entry-server.js')).SSRRender;
    const appHtml = render(url);
    const html = template.replace(`<!--app-html-->`, appHtml);
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
  });
  return { app };
}

createServer().then(({ app }) =>
  app.listen(3033, () => {
    console.log('http://localhost:3033');
  }),
);
```

 在prerender.js 文件中写入 SSG 的构建逻辑

```javascript
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, p);

const template = fs.readFileSync(toAbsolute('dist/client/index.html'), 'utf-8');
const render = (await import('./dist/server/entry-server.js')).SSRRender;

// determine routes to pre-render from src/pages
const routesToPrerender = fs.readdirSync(toAbsolute('src/pages')).map((file) => {
  const name = file.replace(/\.tsx$/, '').toLowerCase();
  return name === 'home' ? `/` : `/${name}`;
});

(async () => {
  // pre-render each route...
  for (const url of routesToPrerender) {
    const appHtml = render(url);

    const html = template.replace(`<!--app-html-->`, appHtml);

    const filePath = `dist/static${url === '/' ? '/index' : url}.html`;
    fs.writeFileSync(toAbsolute(filePath), html);
  }
})();
```

我们改动下 package.json 中的命令

```json
{
  "scripts": {
    "dev": "npm run build && node server",
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build --outDir dist/client",
    "build:server": "vite build --ssr src/entry-server.tsx --outDir dist/server",
    "serve": "node server",
    "generate": "vite build --outDir dist/static && npm run build:server && node prerender"
  }
}
```

 至此，一个 SSG 的 demo 就跑通了。

## 如何处理热更新？

在上面的demo 中，虽然能简单的跑通 ssr 工程和 ssg 工程。但是我们在平时的开发过程中，是不可能频繁的去node server和刷新浏览器页面的。

所以，应该怎么解决开发环境下的 ssr 工程的热更新问题呢？其实 vite 已经提供了 react-ssr 的示例仓库了。我们阅读 vite 开源的 react-srr 项目，不难得知是需要改动 server.js 文件的。 改动 server.js 是为了区分开发环境和生产环境，在开发环境我们使用 vite 提供的中间件来处理热更新问题，在生产环境则还是保持上面 demo 的逻辑。

```javascript
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production",
  hmrPort
) {
  const resolve = (p) => path.resolve(__dirname, p);

  const indexProd = isProd
    ? fs.readFileSync(resolve("dist/client/index.html"), "utf-8")
    : "";

  const app = express();

  /** @type {import('vite').ViteDevServer} */
  let vite;

  if (!isProd) {
    vite = await (
      await import("vite")
    ).createServer({
      root,
      logLevel: 'info',
      server: {
        middlewareMode: true,
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100,
        },
        hmr: {
          port: hmrPort,
        },
      },
      appType: "custom",
    });
    // use vite's connect instance as middleware
    app.use(vite.middlewares);
  } else {
    app.use((await import("compression")).default());
    app.use(
      (await import("serve-static")).default(resolve("dist/client"), {
        index: false,
      })
    );
  }

  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl;
      let template;
      let render;
      if (!isProd) {
        template = fs.readFileSync(resolve("index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
      } else {
        template = indexProd;
        render = (await import("./dist/server/entry-server.js")).render;
      }
      const appHtml = render(url)
      const html = template.replace(`<!--app-html-->`, appHtml);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch(e) {
      !isProd && vite.ssrFixStacktrace(e)
      console.log(e.stack)
      res.status(500).end(e.stack);
    }
  });
  return { app, vite };
}

createServer().then(({app}) => {
  app.listen(5173, () => {
    console.log('http://localhost:5173');
  })
})
```