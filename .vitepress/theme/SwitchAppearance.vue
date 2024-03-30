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
// onMounted(() => {
//   const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");

//   darkThemeMq.addListener((e) => {
//     if (e.matches) {
//       document.body.setAttribute("arco-theme", "dark");
//     } else {
//       document.body.removeAttribute("arco-theme");
//     }
//   });
// });
</script>
