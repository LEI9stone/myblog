import DefaultTheme from "vitepress/theme";
import Layout from "./Layout.vue";
import { Pagination } from "@arco-design/web-vue";
import "@arco-design/web-vue/es/pagination/style/index.css";
import '@arco-design/web-vue/es/style/index.css';
import '@arco-design/web-vue/es/input/style/index.css'
import DiagramPreview from 'vitepress-plugin-mermaid-diagram/DiagramPreview.vue'
import 'vitepress-plugin-mermaid-diagram/diagram-dark.css'
import "./style/custom.scss";

export default {
	extends: DefaultTheme,
	Layout,
	enhanceApp({ app }) {
		app.component("APagination", Pagination);
		app.component('DiagramPreview', DiagramPreview)
	},
};
