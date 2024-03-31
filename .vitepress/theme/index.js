
import DefaultTheme from "vitepress/theme";
import Layout from "./Layout.vue";
import './style/custom.scss'

export default {
	extends: DefaultTheme,
	Layout,
	enhanceApp({ app }) {
	},
};
