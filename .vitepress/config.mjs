import { fileURLToPath, URL } from 'node:url';
import { dirname, resolve } from 'node:path';
import { defineConfig } from 'vitepress';
import { withPwa } from '@vite-pwa/vitepress';
import { diagramPlugin } from 'vitepress-plugin-mermaid-diagram';
import { containerPlugin } from './markdown-it-plugin/container.mjs';
import { todoListPlugin } from './markdown-it-plugin/todo-list.mjs';

// 项目根目录（.vitepress 的父目录）
const __dirname = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// https://vitepress.dev/reference/site-config
export default withPwa(
  defineConfig({
    srcDir: 'module',
    title: '小磊',
    description: '小磊的个人博客',
    head: [
      ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ],
    markdown: {
      lineNumbers: true, // 显示代码行数,
      config(md) {
        md.use(diagramPlugin, { preview: true });
        md.use(containerPlugin);
        md.use(todoListPlugin);
      },
    },
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      nav: [
        { text: '首页', link: '/' },
        { text: 'web', link: '/web/js/var' },
        { text: 'flutter', link: '/flutter/index' },
        { text: 'http', link: '/http/cache' },
        { text: '阅读', link: '/book/中国近代史' },
      ],

      sidebar: {
        '/web/': [
          {
            text: 'web',
            items: [
              {
                text: 'Next.js',
                collapsed: false,
                items: [
                  {
                    text: 'Redis + Next.js 学习笔记与总结',
                    link: '/web/nextjs/redis',
                  },
                ],
              },
              {
                text: 'JavaScript',
                collapsed: false,
                items: [
                  {
                    text: '从3个for循环代码来理解javascript变量声明',
                    link: '/web/js/var',
                  },
                  { text: 'IndexedDB踩坑指南', link: '/web/js/indexDB' },
                ],
              },
              {
                text: 'React',
                collapsed: false,
                items: [
                  {
                    text: '从createRef方法来理解js的内存操作',
                    link: '/web/react/createRef',
                  },
                  {
                    text: 'React中一次性能优化之旅',
                    link: '/web/react/performance',
                  },
                  {
                    text: '从setState更新机制来理解事件循环',
                    link: '/web/react/useState_loop',
                  },
                  {
                    text: '一次 SSG的实践',
                    link: '/web/react/vite-ssg',
                  },
                ],
              },
              {
                text: 'CSS',
                collapsed: false,
                items: [
                  {
                    text: '实现多行文本溢出',
                    link: '/web/css/实现多行文本溢出',
                  },
                  {
                    text: '保持图片宽高比并自适应屏幕',
                    link: '/web/css/保持图片宽高比并自适应屏幕',
                  },
                ],
              },
              {
                text: 'Vue',
                collapsed: false,
                items: [
                  {
                    text: '组件间通讯总结及应用场景',
                    link: '/web/vue/v2/props',
                  },
                  {
                    text: '组件通讯实战——Form表单验证',
                    link: '/web/vue/v2/form',
                  },
                ],
              },
              {
                text: 'HTML',
                collapsed: false,
                items: [
                  {
                    text: 'img referrerpolicy 属性',
                    link: '/web/html/img-referrerPolicy属性',
                  },
                ],
              },
            ],
          },
        ],
        '/flutter/': [
          {
            text: 'flutter',
            items: [
              { text: 'flutter应用开发指南', link: '/flutter/index' },
              {
                text: 'web到Flutter的心智模型迁移',
                items: [
                  {
                    text: '浏览器运行时 vs Flutter 渲染引擎',
                    link: '/flutter/web到Flutter的心智模型迁移/001-浏览器运行时vsFlutter渲染引擎',
                  },
                  {
                    text: 'DOM/CSSOM vs Widget/Element/RenderObject',
                    link: '/flutter/web到Flutter的心智模型迁移/002-DOM&CSSOMvsWidget&Element&RenderObject',
                  },
                  {
                    text: 'Web App 生命周期 vs Flutter App 生命周期',
                    link: '/flutter/web到Flutter的心智模型迁移/003-Web%20App%20生命周期%20vs%20Flutter%20App%20生命周期',
                  },
                  {
                    text: 'SPA 应用结构 vs Flutter 应用结构',
                    link: '/flutter/web到Flutter的心智模型迁移/004-SPA应用结构vsFlutter应用结构',
                  },
                  {
                    text: 'React/Vue/Svelte 开发体验 vs Flutter 开发体验',
                    link: '/flutter/web到Flutter的心智模型迁移/005-React&Vue&Svelte开发体验vsFlutter开发体验',
                  },
                ],
              },
              {
                text: '项目结构与工程化',
                items: [
                  {
                    text: 'package.json vs pubspec.yaml',
                    link: '/flutter/项目结构与工程化/001-package.json-vs-pubspec.yaml',
                  },
                  {
                    text: 'npm/yarn/pnpm vs pub',
                    link: '/flutter/项目结构与工程化/002-npm-vs-pub',
                  },
                  {
                    text: 'Vite/Webpack/Next.js 工程结构 vs Flutter 工程结构',
                    link: '/flutter/项目结构与工程化/003-Vite-Webpack-Next.js工程结构-vs-Flutter工程结构',
                  },
                  {
                    text: 'src/ 目录 vs lib/ 目录',
                    link: '/flutter/项目结构与工程化/004-src目录-vs-lib目录',
                  },
                  {
                    text: '静态资源管理：public/assets vs Flutter assets',
                    link: '/flutter/项目结构与工程化/005-静态资源管理-public-assets-vs-Flutter-assets',
                  },
                  {
                    text: '环境配置：`.env` vs Flutter 环境配置',
                    link: '/flutter/项目结构与工程化/006-env-vs-Flutter-环境配置',
                  },
                  {
                    text: 'Lint/Format：ESLint/Prettier vs Dart Analyzer/dart format',
                    link: '/flutter/项目结构与工程化/007-Lint-Format',
                  },
                  {
                    text: 'Codegen：前端代码生成 vs Flutter build_runner',
                    link: '/flutter/项目结构与工程化/008-代码生成',
                  },
                ],
              },
              {
                text: 'JavaScript 和 Dart 的差异',
                items: [
                  {
                    text: 'JavaScript Runtime vs Dart Runtime',
                    link: '/flutter/js和dart/001-运行时',
                  },
                  {
                    text: 'TypeScript 类型系统 vs Dart 类型系统',
                    link: '/flutter/js和dart/002-类型系统',
                  },
                  {
                    text: 'let/const vs final/const/var',
                    link: '/flutter/js和dart/003-变量声明',
                  },
                  {
                    text: 'Interface/Type Alias vs Class/Abstract Class/Extension',
                    link: '/flutter/js和dart/004-类型声明',
                  },
                  {
                    text: 'Union Type vs sealed class / enum / Freezed',
                    link: '/flutter/js和dart/005-联合类型',
                  },
                  {
                    text: 'Optional/Nullable vs Dart Null Safety',
                    link: '/flutter/js和dart/006-空类型安全',
                  },
                  {
                    text: 'Promise/async/await vs Future/async/await',
                    link: '/flutter/js和dart/007-异步',
                  },
                  {
                    text: 'Array/Object/Map vs List/Map/Record/Class',
                    link: '/flutter/js和dart/008-结构化数据',
                  },
                  {
                    text: 'Module Import/Export vs Dart Import/Export',
                    link: '/flutter/js和dart/009-模块',
                  },
                  {
                    text: '泛型：TypeScript Generics vs Dart Generics',
                    link: '/flutter/js和dart/010-泛型',
                  },
                  {
                    text: '函数式写法：JS 高阶函数 vs Dart 函数对象',
                    link: '/flutter/js和dart/011-函数式写法',
                  },
                  {
                    text: '错误处理：try/catch vs Dart Exception/Error',
                    link: '/flutter/js和dart/012-错误处理',
                  },
                ],
              },
              {
                text: 'UI 基础：HTML/CSS 到 Flutter Widget',
                items: [
                  {
                    text: 'HTML 标签 vs Flutter Widget',
                    link: '/flutter/基础UI/001-标签',
                  },
                  {
                    text: 'DOM Tree vs Widget Tree',
                    link: '/flutter/基础UI/002-页面树',
                  },
                ],
              },
            ],
          },
        ],
        book: [
          {
            text: '阅读系列',
            items: [
              { text: '中国近代史', link: '/book/中国近代史' },
              { text: '陈行甲传记', link: '/book/陈行甲传记' },
              { text: '法治的细节', link: '/book/法治的细节' },
              {
                text: '育儿百科',
                link: '/book/育儿百科/',
                collapsed: false,
                items: [
                  { text: '最好的礼物', link: '/book/育儿百科/' },
                  { text: '分娩和分娩后', link: '/book/育儿百科/0001' },
                  { text: '新生儿的最初几日', link: '/book/育儿百科/0002' },
                ],
              },
              {
                text: '非暴力沟通',
                link: '/book/非暴力沟通/',
                collapsed: false,
                items: [
                  { text: '阅后感', link: '/book/非暴力沟通/阅后感' },
                  {
                    text: '模板',
                    collapsed: true,
                    items: [
                      {
                        text: '每日复盘模板',
                        link: '/book/非暴力沟通/templates/everyday-tmp',
                      },
                      {
                        text: '静思己过模板',
                        link: '/book/非暴力沟通/templates/静思己过',
                      },
                      {
                        text: '睡前冥想式复盘模板',
                        link: '/book/非暴力沟通/templates/meditation',
                      },
                      {
                        text: '自我对话（防内耗）模版',
                        link: '/book/非暴力沟通/templates/myself',
                      },
                    ],
                  },
                  {
                    text: '重点事情梳理',
                    link: '/book/非暴力沟通/key-points/',
                    collapsed: true,
                    items: [
                      {
                        text: '2026-04-23',
                        link: '/book/非暴力沟通/key-points/2026-04-23',
                      },
                    ],
                  },
                  {
                    text: '日记',
                    link: '/book/非暴力沟通/diary/',
                    collapsed: true,
                    items: [
                      {
                        text: '2026-04-29',
                        link: '/book/非暴力沟通/diary/26-04/29',
                      },
                      {
                        text: '2026-04-30',
                        link: '/book/非暴力沟通/diary/26-04/30',
                      },
                    ],
                  },
                ],
              },
              {
                text: '家常菜',
                link: '/book/家常菜/',
                collapsed: false,
                items: [
                  { text: '豆芽烧牛肉', link: '/book/家常菜/豆芽烧牛肉' },
                  { text: '西蓝花虾仁', link: '/book/家常菜/西蓝花虾仁' },
                  { text: '猪肉炖粉条', link: '/book/家常菜/猪肉炖粉条' },
                ],
              },
            ],
          },
        ],
      },

      socialLinks: [{ icon: 'github', link: 'https://github.com/LEI9stone' }],
      docFooter: {
        prev: '上一篇',
        next: '下一篇',
      },
      lastUpdated: {
        text: '最后更新时间',
        formatOptions: {
          dateStyle: 'full',
          timeStyle: 'medium',
        },
      },
      search: {
        provider: 'local',
      },
    },
    lastUpdated: true,
    vite: {
      server: {
        host: '0.0.0.0',
        port: '10011',
      },
      css: {
        preprocessorOptions: {
          scss: {
            api: 'modern-compiler',
          },
        },
      },
      resolve: {
        alias: [
          {
            find: /^.*\/VPHome\.vue$/,
            replacement: fileURLToPath(
              new URL('./theme/Home.vue', import.meta.url)
            ),
          },
        ],
      },
    },
    // PWA 配置 - 实现离线访问
    pwa: {
      // 输出目录（与 VitePress 的 outDir 保持一致）
      outDir: resolve(__dirname, '.vitepress/dist'),
      // 注册类型：自动更新
      registerType: 'autoUpdate',
      // 包含的资源类型
      includeAssets: ['favicon.svg', 'robots.txt'],
      // Web App Manifest 配置
      manifest: {
        name: '小磊的博客',
        short_name: '小磊博客',
        description: '小磊的个人博客',
        theme_color: '#667eea',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      // Workbox 配置 - 缓存策略
      workbox: {
        // 缓存所有页面资源
        globPatterns: ['**/*.{css,js,html,svg,png,ico,txt,woff2}'],
        // 运行时缓存配置
        runtimeCaching: [
          {
            // 缓存页面导航请求
            urlPattern: /^https?:\/\/.*\/.*\.html$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 天
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // 缓存图片
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 天
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // 缓存 JS 和 CSS
            urlPattern: /\.(?:js|css)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 天
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      // 开发环境配置
      devOptions: {
        // 开发期关闭 SW，避免拦截 /@fs 模块请求导致 HMR/依赖缓存异常
        enabled: false,
        suppressWarnings: true,
        navigateFallback: '/',
      },
      // 实验性选项 - 防止未缓存页面布局错乱
      experimental: {
        includeAllowlist: true,
      },
    },
  })
);
