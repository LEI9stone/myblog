import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	srcDir: "module",
	title: "小磊",
	description: "小磊的个人博客",
	markdown: {
		lineNumbers: true, // 显示代码行数
	},
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: "首页", link: "/" },
			{ text: "web", link: "/web/js/var" },
			{ text: "http", link: "/http/cache" },
		],

		sidebar: {
			"/web/": [
				{
					text: "web",
					items: [
						{
							text: "JavaScript",
							collapsed: false,
							items: [
								{
									text: "从3个for循环代码来理解javascript变量声明",
									link: "/web/js/var",
								},
								{ text: "IndexedDB踩坑指南", link: "/web/js/indexDB" },
							],
						},
						{
							text: "React",
							collapsed: false,
							items: [
								{
									text: "从createRef方法来理解js的内存操作",
									link: "/web/react/createRef",
								},
								{
									text: "React中一次性能优化之旅",
									link: "/web/react/performance",
								},
								{
									text: "从setState更新机制来理解事件循环",
									link: "/web/react/useState_loop",
								},
							],
						},
						{
							text: "Vue",
							collapsed: false,
							items: [
								{
									text: "组件间通讯总结及应用场景",
									link: "/web/vue/v2/props",
								},
								{
									text: "组件通讯实战——Form表单验证",
									link: "/web/vue/v2/form",
								},
							],
						},
					],
				},
			],
		},

		socialLinks: [
			{ icon: "github", link: "https://github.com/LEI9stone" },
		],
		docFooter: {
			prev: "上一篇",
			next: "下一篇",
		},
		lastUpdated: {
			text: "最后更新时间",
			formatOptions: {
				dateStyle: "full",
				timeStyle: "medium",
			},
		},
		search: {
			provider: "local",
		},
	},
	lastUpdated: true,
	vite: {
		server: {
			host: "0.0.0.0",
		},
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
