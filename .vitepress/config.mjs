import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitepress";
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
						return `<div class="note-block">\n
						<svg style="width: 20px; height: 20px;" t="1665301607231" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4678" width="200" height="200"><path d="M512 469.333333m-426.666667 0a426.666667 426.666667 0 1 0 853.333334 0 426.666667 426.666667 0 1 0-853.333334 0Z" fill="#FFF59D" p-id="4679"></path><path d="M789.333333 469.333333c0-164.266667-140.8-294.4-309.333333-275.2-128 14.933333-230.4 117.333333-243.2 245.333334-10.666667 98.133333 29.866667 185.6 98.133333 241.066666 29.866667 25.6 49.066667 61.866667 49.066667 102.4v6.4h256v-2.133333c0-38.4 17.066667-76.8 46.933333-102.4 61.866667-51.2 102.4-128 102.4-215.466667z" fill="#FBC02D" p-id="4680"></path><path d="M652.8 430.933333l-64-42.666666c-6.4-4.266667-17.066667-4.266667-23.466667 0L512 422.4l-51.2-34.133333c-6.4-4.266667-17.066667-4.266667-23.466667 0l-64 42.666666c-4.266667 4.266667-8.533333 8.533333-8.533333 14.933334s0 12.8 4.266667 17.066666l81.066666 100.266667V789.333333h42.666667V554.666667c0-4.266667-2.133333-8.533333-4.266667-12.8l-70.4-87.466667 32-21.333333 51.2 34.133333c6.4 4.266667 17.066667 4.266667 23.466667 0l51.2-34.133333 32 21.333333-70.4 87.466667c-2.133333 4.266667-4.266667 8.533333-4.266667 12.8v234.666666h42.666667V563.2l81.066667-100.266667c4.266667-4.266667 6.4-10.666667 4.266666-17.066666s-4.266667-12.8-8.533333-14.933334z" fill="#FFF59D" p-id="4681"></path><path d="M512 938.666667m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#5C6BC0" p-id="4682"></path><path d="M554.666667 960h-85.333334c-46.933333 0-85.333333-38.4-85.333333-85.333333v-106.666667h256v106.666667c0 46.933333-38.4 85.333333-85.333333 85.333333z" fill="#9FA8DA" p-id="4683"></path><path d="M640 874.666667l-247.466667 34.133333c6.4 14.933333 19.2 29.866667 34.133334 38.4l200.533333-27.733333c8.533333-12.8 12.8-27.733333 12.8-44.8zM384 825.6v42.666667L640 832v-42.666667z" fill="#5C6BC0" p-id="4684"></path></svg>`;
					} else if (klass === "mark") {
						return `<div class="note-block">\n
						<svg style="width: 20px; height: 20px; fill: var(--vp-c-text-1);"  t="1665486468429" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16415" width="200" height="200"><path d="M944.981319 147.815557l0 413.93759c0 7.367805-3.949962 14.152325-10.345626 17.795295-3.755534 2.13871-93.335758 52.352345-208.80563 52.352345-111.100354 0-181.892677-20.537755-244.355287-38.660508-51.001581-14.797008-95.054913-27.578102-153.035442-27.578102-20.701484 0-40.97318 0.818645-60.262502 2.425236-11.266601 0.941442-21.151739-7.429203-22.093181-18.695804-0.931209-11.266601 7.429203-21.151739 18.695804-22.093181 20.414959-1.698688 41.832757-2.568499 63.659879-2.568499 63.803141 0 112.686479 14.183024 164.445306 29.194926 62.759369 18.21485 127.657448 37.043684 232.945423 37.043684 83.276658 0 152.800082-29.40982 178.219008-41.699728l0-368.963283c-37.83163 16.260335-102.095259 37.647435-178.219008 37.647435-86.663802 0-147.908678-26.125007-207.127408-51.380204-57.827033-24.661679-112.440885-47.962362-190.263321-47.962362-77.218686 0-123.420961 7.592932-148.573827 13.96813-14.612813 3.704368-24.02723 7.429203-29.645181 10.120498l0 750.216473c0 11.2973-9.168824 20.466124-20.466124 20.466124-11.307533 0-20.466124-9.168824-20.466124-20.466124l0-761.657037c0-5.577019 2.27174-10.908444 6.293333-14.766308 6.764054-6.487761 48.770773-38.814004 212.857922-38.814004 86.193081 0 147.263995 26.053376 206.318996 51.247174 57.990762 24.733311 112.768343 48.095391 191.071733 48.095391 94.348831 0 168.477133-36.132942 188.95349-47.205115 6.334265-3.428076 14.019295-3.27458 20.210297 0.419556C941.195086 133.929292 944.981319 140.601248 944.981319 147.815557z" p-id="16416"></path></svg>`;
					} else {
						return `<div class="${klass} custom-block"${attrs}><p class="custom-block-title">${title}</p>\n`;
					}
				} else return `</div>\n`;
			},
		},
	];
}

function containerPlugin(md, options, containerOptions) {
	md.use(
		...createContainer("idea", containerOptions?.tipLabel || "IDEA", md)
	).use(...createContainer("mark", containerOptions?.tipLabel || "MARK", md));
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
	srcDir: "module",
	title: "小磊",
	description: "小磊的个人博客",
	markdown: {
		lineNumbers: true, // 显示代码行数,
		preConfig(md) {
			md.use(containerPlugin);
		},
	},
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: "首页", link: "/" },
			{ text: "web", link: "/web/js/var" },
			{ text: "http", link: "/http/cache" },
			{ text: "阅读", link: "/book/中国近代史" },
		],

		sidebar: {
			"/web/": [
				{
					text: "web",
					items: [
						{
							text: "Next.js",
							collapsed: false,
							items: [
								{
									text: "Redis + Next.js 学习笔记与总结",
									link: "/web/nextjs/redis",
								},
							],
						},
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
								{
									text: "一次 SSG的实践",
									link: "/web/react/vite-ssg",
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
			book: [
				{
					text: "阅读系列",
					items: [
						{ text: "中国近代史", link: "/book/中国近代史" },
						{ text: "陈行甲传记", link: "/book/陈行甲传记" },
						{ text: "法治的细节", link: "/book/法治的细节" },
					],
				},
			],
		},

		socialLinks: [{ icon: "github", link: "https://github.com/LEI9stone" }],
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
			port: "10011"
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
