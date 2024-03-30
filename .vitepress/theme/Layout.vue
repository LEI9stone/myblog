<script setup>
import DefaultTheme from "vitepress/theme";
import SwitchAppearance from "./SwitchAppearance.vue";
import { useData } from 'vitepress';
const { Layout } = DefaultTheme;
const { frontmatter } = useData();
</script>
<template>
  <Layout></Layout>
  <ClientOnly>
    <SwitchAppearance />
  </ClientOnly>
</template>
