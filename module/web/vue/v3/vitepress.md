---
title: 浅入 vitepress
date: 2024-03-31
tags:
  - vue
  - vitepress
---

# 浅入 vitepress

你好，我是小磊。

今天来聊一聊 `vitepress`。正好这个站点是用 `vitepress` 搭建的，所以记录下在使用 `vitepress` 过程中遇到的问题以及解决方案。

::: tip
这里不会根据 `vitepress` 的文档照本宣科的说一些没有营养的内容。如果对 `vitepress` 不了解，或者了解过 `vitepress` 但是没有实操过。建议先阅读一遍 `vitepress` 的文档并且实操之后再来看下这篇文章。
:::

[[toc]]

## 站点配置&扩展默认主题

`vitepress` 的配置是放在 `.vitepress` 目录下的。站点的信息、导航栏等都是在 `.vitepress/config.mjs` 文件中配置。`vitepress` 提供的默认主题配置是在`.vitepress/theme/index.js`文件中。

### 修改站点配置

`vitepress` 是基于文件的路由，默认相对于项目根目录的 `md` 文件信息来生成对应的 `html` 的路由信息，例如有以下目录信息：

```
.                       # 项目根目录
├─ .vitepress           # 配置目录
├─ getting-started.md
├─ book
│  ├─ var.md
│  ├─ const.md
├─ index.md
└─ ...
```

那么生成的路由信息是

```json
index.md            -->  /index.html (可以通过 / 访问)
getting-started.md  -->  /getting-started.html
book/var.md         -->  /book/var.html
book/const.md       -->  /book/const.html
```

<!-- more -->

如果我们不想把 `md` 文件放在根目录下，就需要修改 `.vitepress/config.mjs` 中 `srcDir` 的配置，例如，`srcDir: 'module'`，对应的结构为：

```
.                       # 项目根目录
├─ .vitepress           # 配置目录
├─ module
│  ├─ getting-started.md
│  ├─ book
│  │  ├─ var.md
│  │  ├─ const.md
│  └─ index.md
└─ ...
```

那么生成的信息是：

```
module/index.md            -->  /index.html (可以通过 / 访问)
module/getting-started.md  -->  /getting-started.html
module/book/var.md         -->  /book/var.html
module/book/const.md       -->  /book/const.html
```

如果我们配置了 `srcDir: 'module'`，在使用 `vitepress` 提供的 `createContentLoader` 函数时，第一个入参的信息的编写请根据 `srcDir: 'module'` 来处理。

### createContentLoader

`vitepress` 提供了 `createContentLoader` 函数，可以用来获取该站点下的所有 `md` 文件数据用于创建索引页面。在我们没有配置 `srcDir` 的时候，例如有以下目录结构：

```
.                       # 项目根目录
├─ .vitepress           # 配置目录
├─ getting-started.md
├─ book
│  ├─ var.md
│  ├─ const.md
├─ index.md
└─ ...
```

如果我们要通过 `createContentLoader` 来获取 `book` 目录下的所有 `md` 文件信息，可以这么处理：

```JavaScript
// posts.data.js
import { createContentLoader } from 'vitepress'

export default createContentLoader('/book/*.md', /* options */)
```

如果配置了 `srcDir: 'module'`，是不是应该这么写呢？

```JavaScript
// posts.data.js
import { createContentLoader } from 'vitepress'

export default createContentLoader('/module/book/*.md', /* options */) // [!code focus]
```

如果这么写了，会发现拿不到 `book` 下的任何 `md` 文件信息。其原因还是因为我们配置了 `srcDir: 'module'`。需要改成这样：

```JavaScript
// posts.data.js
import { createContentLoader } from 'vitepress'

export default createContentLoader('/book/*.md', /* options */) // [!code focus]
```

这是我踩坑的第一个地方，当时有点怀疑人生了，文档都翻烂了才后知后觉不应该写 `module`。

### 扩展默认主题

当我们感觉 `vitepress` 提供的默认主题可以满足使用，但是又有点功能需要添加，这时候可以通过扩展默认主题的方式来解决。比如，在 `header` 区域的右上角添加用户头像，或者让第三方组件库的暗色模式跟着 `vitepress` 的暗色模式走

::: code-group

```vue [theme/Layout.vue]
<script setup>
	import DefaultTheme from "vitepress/theme"; // vitepress 的默认主题
	import SwitchAppearance from "./SwitchAppearance.vue"; // 第三方组件库暗色模式切换逻辑
	const { Layout } = DefaultTheme;
</script>
<template>
	<Layout>
		<template ##nav-bar-content-after>
			<div class="login">
				<a-avatar :size="30">R</a-avatar>
			</div>
		</template>
	</Layout>
	<ClientOnly>
		<SwitchAppearance />
	</ClientOnly>
</template>
<style lang="scss" scoped>
	.login {
		padding: 0 10px;
		cursor: pointer;
	}
</style>
```

```vue [theme/SwitchAppearance.vue]
<script setup>
	import { useData } from "vitepress";
	import { watch } from "vue";
	const { isDark } = useData();
	watch(
		() => isDark.value,
		(mode) => {
			if (mode) {
				document.body.setAttribute("arco-theme", "dark");
			} else {
				document.body.removeAttribute("arco-theme");
			}
		},
		{ immediate: true }
	);
</script>
```

```JavaScript [theme/index.js]
// vitepress 默认主题的扩展
import DefaultTheme from "vitepress/theme";
import Layout from "./Layout.vue";
import { Avatar } from "@arco-design/web-vue";
import '@arco-design/web-vue/es/avatar/style/index.css';
import '@arco-design/web-vue/es/style/index.css';

export default {
	extends: DefaultTheme,
	Layout,
	enhanceApp({ app }) {
    // 添加第三方组件
		app.component("AAvatar", Avatar);
	},
};

```

:::

## 第三方组件库

当我们基于 `vitepress` 提供的默认主题来定制特色功能的时候，总会引用第三方组件库来提升开发效率。这里我们基于 `@arco-design/web-vue` 组件库来举例。首先，在项目中安装 `@arco-design/web-vue`。之后在主题的入口文件中(`theme/index.js`)引入对应的组件信息。如果需要用到 `@arco-design/web-vue` 中的很多组件，可以选择引入全部组件。

```JavaScript
// theme/index.js
// vitepress 默认主题的扩展
import DefaultTheme from "vitepress/theme";
import ArcoVue from '@arco-design/web-vue'; // [!code focus]
import '@arco-design/web-vue/dist/arco.css'; // [!code focus]

export default {
	extends: DefaultTheme,
	enhanceApp({ app }) { // [!code focus]
		app.use(ArcoVue); // [!code focus]
	}, // [!code focus]
};
```

如果只使用个别组件，我们就需要选择按需引入对应的组件来减少最终打包后文件的体积。例如：

```JavaScript
// theme/index.js
import DefaultTheme from "vitepress/theme";
import { Avatar } from "@arco-design/web-vue";
// 引入全部组件的样式信息
import '@arco-design/web-vue/dist/arco.css';

export default {
	enhanceApp({ app }) {
		app.component("AAvatar", Avatar);
	},
};
```

在上面的代码中，我们虽然按需引入了组件，但是样式文件还是引入的全部组件的样式信息。因为引入的组件并没有对应的样式。这时候就有人问了，为啥不引入对应组件的样式呢？其实也是可以引入的，但是会极其麻烦。

因为在引入单个组件样式的时候，其实是想引入组件对应的 `css in js` 文件的，比如：`import '@arco-design/web-vue/es/avatar/style/css.js';`。这么写之后，在 `vitepress dev` 环境下是没有任何问题的，但是在 `vitepress build` 时候会报错。这个报错信息还没有找到解决方案。所以只能另辟蹊径，引入该组件对应的所有 `css` 文件。

::: code-group

```JavaScript{2-3} [正确的引入方式]
import { Avatar } from "@arco-design/web-vue";
import '@arco-design/web-vue/es/avatar/style/index.css';
import '@arco-design/web-vue/es/style/index.css';

export default {
	enhanceApp({ app }) {
		app.component("AAvatar", Avatar);
	},
};
```

```JavaScript [错误的引入方式]
import { Avatar } from "@arco-design/web-vue";
import '@arco-design/web-vue/es/avatar/style/css.js'; // [!code error]

export default {
	enhanceApp({ app }) {
		app.component("AAvatar", Avatar);
	},
};
```

:::

我们可以看到，其正确的组件样式按需引入会非常麻烦，因为需要去 `node_modules` 下找到该组件的所有 `css` 文件。这也是为啥没有 `css in js` 文件这么方便的原因了。如有有大佬知道如何解决 `vitepress build` 时，对 `css.js` 文件的报错问题，恳请指教一下。

### 第三方组件库样式跟随内置的暗色模式改变

在引入完第三方组件库的时候，并且愉快的使用了对应的组件。随着夜色降临，会发现站点的样式风格会切成暗色模式，但是我们使用的第三方组件库对应的样式并没有切换。

这是为什么呐？通过查阅组件库的文档后有了修改的思路。

`vitepress` 会提供一个 `hook` 函数 `useData`，该函数会暴露暗色模式的状态。这时候我们就可以根据暗色模式的状态来切换组件库的样式风格了。

:::code-group

```Vue [theme/SwitchAppearance.vue]
<script setup>
import { useData } from "vitepress";
import { watch } from "vue";
const { isDark } = useData();
watch(
  () => isDark.value,
  (mode) => {
    // @arco-design/web-vue 组件库的暗色模式切换
    if (mode) {
      document.body.setAttribute("arco-theme", "dark");
    } else {
      document.body.removeAttribute("arco-theme");
    }
  },
  { immediate: true }
);
</script>
```

```Vue [theme/Layout.vue]
<script setup>
import DefaultTheme from "vitepress/theme";
import SwitchAppearance from "./SwitchAppearance.vue"; // [!code focus]
const { Layout } = DefaultTheme;
</script>
<template>
  <Layout></Layout>
  <ClientOnly> // [!code focus]
    <SwitchAppearance /> // [!code focus]
  </ClientOnly> // [!code focus]
</template>
```

:::

## 自定义页面功能

当我们在自定义页面的时候，得益于 `vitepress` 完善的功能，也是非常简单的。首先我们写一个自定义组件，并注册为全局组件，然后在对应需要用到的 `md` 文件中使用。

::: code-group

```md [module/product/sku.md]
---
layout: doc
aside: false
---

# sku 下单参数查询

<custom-page />
```

```Vue [theme/components/CustomCom.vue]
<script setup>
import { ref, watch } from "vue";
import { useFetch } from "@vueuse/core";
import { isNaN } from "lodash-es";
import { Message } from "@arco-design/web-vue";
const props = defineProps(["fn"]);
const baseUrl = "https://xxx.mock.com/doc/sku/info";
const searchUrl = ref("https://xxx.mock.com/doc/sku/info");
const keyword = ref("");
const { isFetching, data } = useFetch(searchUrl, { refetch: true });
const columns = [
  {
    title: "字段",
    dataIndex: "key",
  },
  {
    title: "说明",
    dataIndex: "name",
  },
  {
    title: "值",
    dataIndex: "example",
  },
  {
    title: "类型",
    dataIndex: "type",
  },
  {
    title: "下单接口传入要求",
    dataIndex: "desc",
  },
];
const dataSource = ref([]);

const onSearch = () => {
  if (!keyword.value.trim()) {
    return;
  }
  if (isNaN(Number(keyword.value))) {
    alert("请输入数字");
    Message.warning("请输入数字");
    return;
  }
  searchUrl.value = `${baseUrl}?resellerSkuId=${keyword.value}`;
  console.log("onsear", keyword.value);
};
watch(data, () => {
  try {
    const result = JSON.parse(data.value);
    dataSource.value = result?.data?.skuParam;
    props.fn(result?.data?.exampleParam || {});
  } catch (err) {
    console.log("err", err);
  }
});
</script>
<template>
  <div class="custom-page">
    <a-card style="margin-bottom: 20px">
      <a-input-search
        placeholder="请输入分销商SKUID"
        search-button
        @press-enter="onSearch"
        @blur="onSearch"
        button-text="查询"
        v-model="keyword"
      />
    </a-card>
    <a-table
      title="商品定制信息"
      :loading="isFetching"
      :pagination="false"
      :columns="columns"
      :data="dataSource"
    />
  </div>
</template>
<style lang="scss" scoped>
.custom-page {
  width: 100%;
  :deep(table) {
    overflow-x: unset;
    display: table;
    td,
    th {
      border: unset;
      padding: unset;
    }
    td {
      border-bottom: 1px solid var(--color-neutral-3);
    }
    tr {
      background-color: unset;
      border-top: unset;
      transition: unset;
    }
    th {
      text-align: unset;
      font-size: unset;
      font-weight: unset;
      color: unset;
      background-color: unset;
    }
  }
}
</style>
```

```JavaScript [theme/index.js]
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import {
  Table,
  Spin,
  Card,
  Input,
  Button,
  InputSearch,
} from "@arco-design/web-vue";
// 自定义页面
import CustomPage from "./components/CustomCom.vue";
// 引入全部组件的样式信息
import '@arco-design/web-vue/dist/arco.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 组件注册
    app.component("ATable", Table);
    app.component("ASpin", Spin);
    app.component("ACard", Card);
    app.component("AInput", Input);
    app.component("AButton", Button);
    app.component("AInputSearch", InputSearch);
    app.component("CustomPage", CustomPage);
  },
} satisfies Theme;

```

:::

如果该组件根据接口动态的返回 `JSON` 信息并需要渲染到页面中，这时候我们应该如何处理？其实也很简单：

````md
---
layout: doc
aside: false
---

# sku 下单参数查询

<script setup> // [!code ++]
import { ref, watch } from 'vue'; // [!code ++]
const dataSource = ref([]); // [!code ++]
const sourceCallback = (data) => { // [!code ++]
  dataSource.value = data; // [!code ++]
} // [!code ++]
</script> // [!code ++]

<custom-page /> // [!code --]
<custom-page :fn="sourceCallback" /> // [!code ++]

## 动态 JSON 信息 // [!code ++]

```json-vue // [!code ++]
{{dataSource}} // [!code ++]
``` // [!code ++]
````

## 扩展自定义容器样式风格

得益于 `Vitepress` 的强大，其内置了非常多的 `markdown` 的扩展语法，其中就内置了很多 **“自定义容器”**。如果这些内容的 **“自定义容器”** 还不满足使用需求该怎么办？我们可以通过 `vitepress` 站点配置中 `markdown` 的扩展配置来扩展我们自己的自定义容器。

::: code-group

```JavaScript [config.mjs]
import { defineConfig } from "vitepress";
import container from "markdown-it-container";
import containerPlugin from './containerPlugin.mjs'; // [!code focus]

// https://vitepress.dev/reference/site-config
export default defineConfig({
	srcDir: "module",
	title: "小磊",
	description: "小磊的个人博客",
	markdown: { // [!code focus]
		lineNumbers: true, // 显示代码行数,
		preConfig(md) { // [!code focus]
			md.use(containerPlugin); // [!code focus]
		}, // [!code focus]
	},
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [],
		sidebar: [],
	},
});
```

```JavaScript [containerPlugin.mjs]
import createContainer from './createContainer.mjs';

function containerPlugin(md, options, containerOptions) {
	md.use(
		...createContainer("idea", containerOptions?.tipLabel || "IDEA", md)
	).use(...createContainer("mark", containerOptions?.tipLabel || "MARK", md));
}
```

```JavaScript [createContainer.mjs]
// 注意：样式和 html 结构需要自行处理
import container from "markdown-it-container";

function createContainer(klass, defaultTitle, md) {
	return [
		container,
		klass,
		{
			render(tokens, idx, _options, env) {
				const token = tokens[idx];
				const info = token.info.trim().slice(klass.length).trim();
				const attrs = md.renderer.renderAttrs(token);
				if (token.nesting === 1) {
					const title = md.renderInline(info || defaultTitle, {
						references: env.references,
					});
					if (klass === "idea") {
						return `<div class="note-block">\n 填写自己的 html 结构`;
					} else if (klass === "mark") {
						return `<div class="note-block">\n 填写自己的 html 结构`;
					} else {
						return `<div class="${klass} custom-block"${attrs}><p class="custom-block-title">${title}</p>\n`;
					}
				} else return `</div>\n`;
			},
		},
	];
}
```
:::

扩展的自定义容易配置完之后，我们在 `md` 文件中的使用和 `UI` 效果如下：

**输入**

````md
::: idea
我这有一个非常好的主意
> good idea
:::

::: mark
我标记了一段内容
> 非常棒的内容
:::
````

**输出**

::: idea
我这有一个非常好的主意
> good idea
:::

::: mark
我标记了一段内容
> 非常棒的内容
:::

## 重写内部组件

当我们通过 `vitepress` 来搭建一个博客站点的时候，博客的首页基本都是 `md` 文件的索引列表页面。我们可以通过重写内部组件的方式来实现博客首页的文章列表

:::code-group
```JavaScript [config.mjs]
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	srcDir: "module",
	vite: {
		resolve: {
			alias: [
				{
					find: /^.*\/VPHome\.vue$/,
					replacement: fileURLToPath(
						new URL("./theme/Home.vue", import.meta.url)
					),
				},
			],
		},
	},
});
```

```Vue [theme/Home.vue]
<script setup>
import { ref, computed, watch } from 'vue';
import { withBase } from 'vitepress'
import { data as posts } from './post.data'
const page = ref(1);
const per_page = ref(10);
const total = posts.length;

const current_posts = computed(() => {
  return posts.slice((page.value - 1) * per_page.value, page.value * per_page.value);
});

const onPageChange = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
}

</script>

<template>
  <div class="vp-doc custom-home">
    <div class="abstract-item" v-for="(post, index) in current_posts" :key="index">
      <div class="post-title">
        <a :href="withBase(post.url)" class="post-title-link">
          {{ post.title }}
        </a>
      </div>
      <div class="post-meta">
        <span class="post-meta-item">
          <span class="meta-label">发表于</span>
          <span class="meta-value">{{ post.date.string }}</span>
        </span>
        <span class="post-meta-item" v-if="post.author">
          <span class="meta-label">作者：</span>
          <span class="meta-value">{{ post.author }}</span>
        </span>
        <span class="post-meta-item" v-if="post.tags">
          <span class="meta-tag" v-for="tag in post.tags">{{ tag }}</span>
        </span>
      </div>
      <div v-html="post.excerpt"></div>
      <div class="post-button">
        <a class="btn" :href="withBase(post.url)">阅读全文»</a>
      </div>
    </div>
    <a-pagination @change="onPageChange" v-model:current="page" class="pagination" :total="total" show-jumper />
  </div>
</template>
<style>
/** 样式自行处理 */
</style>
```

```JavaScript [post.data.mjs]
import { createContentLoader } from 'vitepress'

export default createContentLoader('/**/*.md', {
  includeSrc: false, // 包含原始 markdown 源?
  render: false,     // 包含渲染的整页 HTML?
  excerpt: '<!-- more -->',    // 包含摘录?
  transform(raw) {
    return raw
			.filter(({url}) => url !== '/')
      .map(({ url, frontmatter, excerpt, html }) => {
        return ({
          title: frontmatter.title,
          url,
          excerpt,
          html,
          author: frontmatter.author || '小磊',
          tags: frontmatter.tags,
          date: formatDate(frontmatter.date)
        })
      })
      .sort((a, b) => b.date.time - a.date.time)
  },
})

function formatDate(raw) {
  const date = new Date(raw)
  date.setUTCHours(12)
  return {
    time: +date,
    string: date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}
```
:::



## Enjoy life

以上内容是基于 `vitepress` 现有的配置之后进行二次修改时所遇到的坑以及爬坑过程，希望对你有所帮助。如果以上内容有误，还请不吝指教，感谢。

+ [vitepress](https://github.com/vuejs/vitepress)
+ [@arco-design/web-vue](https://github.com/arco-design/arco-design-vue)
+ [markdown-it-container](https://github.com/markdown-it/markdown-it-container)


