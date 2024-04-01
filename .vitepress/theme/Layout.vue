<script setup>
import DefaultTheme from "vitepress/theme";
import SwitchAppearance from "./SwitchAppearance.vue";
const { Layout } = DefaultTheme;
</script>
<template>
  <Layout></Layout>
  <ClientOnly>
    <SwitchAppearance />
  </ClientOnly>
</template>
